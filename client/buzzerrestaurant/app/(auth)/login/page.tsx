'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { sendOTP, verifyOTP, createRecaptchaVerifier } from '../../lib/firebase';
import type { RecaptchaVerifier } from 'firebase/auth';
import api from '../../lib/axios';

// Phone validation schema for Egyptian numbers
const phoneSchema = z.object({
  phone: z
    .string()
    .min(11, 'Phone number must be 11 digits')
    .max(11, 'Phone number must be 11 digits')
    .regex(/^(010|011|012|015)\d{8}$/, 'Phone number must start with 010, 011, 012, or 015 and be 11 digits'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: '',
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  useEffect(() => {
    // Initialize reCAPTCHA verifier when component mounts
    if (typeof window !== 'undefined') {
      try {
        recaptchaVerifierRef.current = createRecaptchaVerifier('recaptcha-container');
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
      }
    }

    return () => {
      // Cleanup reCAPTCHA verifier
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
      }
    };
  }, []);

  const handlePhoneSubmit = async (data: PhoneFormData) => {
    setLoading(true);
    try {
      if (!recaptchaVerifierRef.current) {
        throw new Error('reCAPTCHA verifier not initialized');
      }

      const formattedPhone = `+2${data.phone}`;
      const result = await sendOTP(formattedPhone, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setPhoneNumber(data.phone);
      setStep('otp');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      const errorMessage = error.message || 'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
      phoneForm.setError('phone', {
        type: 'manual',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Update form value
    otpForm.setValue('otp', newOtpValues.join(''));
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtpValues = pastedData.split('').slice(0, 6);
    
    while (newOtpValues.length < 6) {
      newOtpValues.push('');
    }
    
    setOtpValues(newOtpValues);
    otpForm.setValue('otp', newOtpValues.join(''));
    
    // Focus last input if all filled, otherwise focus next empty
    const lastFilledIndex = newOtpValues.findIndex(val => !val);
    const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex;
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      if (!recaptchaVerifierRef.current) {
        throw new Error('reCAPTCHA verifier not initialized');
      }
      const formattedPhone = `+2${phoneNumber}`;
      const result = await sendOTP(formattedPhone, recaptchaVerifierRef.current);
      setConfirmationResult(result);
      setOtpValues(['', '', '', '', '', '']);
      otpForm.reset();
    } catch (error: any) {
      console.error('Error resending OTP:', error);
      toast.error(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (data: OtpFormData) => {
    if (!confirmationResult) return;

    setLoading(true);
    try {
      // Verify OTP with Firebase
      const userCredential = await verifyOTP(confirmationResult, data.otp);
      const idToken = await userCredential.user.getIdToken();

      // Call backend API
      try {
        const response = await api.post('/auth/login', {
          idToken,
        });

        if (response.status === 200) {
          toast.success('Login successful!');
          router.push('/');
        }
      } catch (apiError: any) {
        // If 404, redirect to register with phone number
        if (apiError.response?.status === 404) {
          toast.error('User not found. Redirecting to registration...');
          router.push(`/register?phone=${phoneNumber}`);
        } else {
          const errorMessage = apiError.response?.data?.message || 'Login failed. Please try again.';
          toast.error(errorMessage);
          throw apiError;
        }
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      const errorMessage = error.message || 'Invalid OTP. Please try again.';
      toast.error(errorMessage);
      otpForm.setError('otp', {
        type: 'manual',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 'otp') {
      otpInputRefs.current[0]?.focus();
    }
  }, [step]);

  // Format phone number for display (masked)
  const maskedPhone = phoneNumber ? `******${phoneNumber.slice(-3)}` : '';
  const displayPhone = phoneNumber ? `+2 ${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}` : '';

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {step === 'phone' ? (
          <motion.div
            key="phone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col bg-gradient-to-b from-[#8B2E2E] via-[#A03A3A] to-[#6B1F1F]"
          >
            {/* Header */}
            <div className="pt-12 pb-6 px-6">
              <h2 className="text-white text-xl font-medium">Sign In</h2>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center px-6 pb-8">
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome!</h1>
                <p className="text-white/90 text-base md:text-lg leading-relaxed">
                  Please enter your phone number to continue using our app.
                </p>
              </div>

              <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-8">
                <div>
                  <label htmlFor="phone" className="block text-white text-sm font-medium mb-3">
                    Phone Number
                  </label>
                  <input
                    {...phoneForm.register('phone')}
                    type="tel"
                    id="phone"
                    placeholder="01012345678"
                    className="w-full bg-transparent border-b-2 border-white/30 text-white text-lg pb-2 focus:outline-none focus:border-white placeholder-white/50 transition-colors"
                    disabled={loading}
                  />
                  {phoneForm.formState.errors.phone && (
                    <p className="mt-2 text-sm text-red-200">
                      {phoneForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Invisible reCAPTCHA container */}
                <div id="recaptcha-container" />

                {/* Footer with T&C */}
                <div className="mt-16 pt-8 border-t border-white/20">
                  <p className="text-white/70 text-xs text-center leading-relaxed">
                    By tapping next you agree to{' '}
                    <a href="#" className="text-[#FFB800] underline">T&C</a>
                    {' '}and{' '}
                    <a href="#" className="text-[#FFB800] underline">Privacy Policy</a>.
                  </p>
                </div>
              </form>
            </div>

            {/* Bottom Button Section */}
            <div className="bg-[#F5F5F5] px-6 py-8 rounded-t-[3rem]">
              <button
                type="submit"
                onClick={phoneForm.handleSubmit(handlePhoneSubmit)}
                disabled={loading}
                className="w-full py-4 bg-[#FFB800] hover:bg-[#E5A700] text-black font-bold rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center shadow-lg"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-black border-t-transparent rounded-full"
                  />
                ) : (
                  'NEXT'
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Dark Red Top Section */}
            <div className="flex-1 flex flex-col bg-gradient-to-b from-[#8B2E2E] via-[#A03A3A] to-[#6B1F1F] px-6 pt-12 pb-8">
              {/* Header */}
              <div className="flex items-center mb-8">
                <button
                  onClick={() => {
                    setStep('phone');
                    setOtpValues(['', '', '', '', '', '']);
                    otpForm.reset();
                  }}
                  className="mr-4 text-white"
                  disabled={loading}
                >
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-white text-xl font-medium">Login Code</h2>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Login by OTP</h1>
                <p className="text-white/90 text-base mb-8">
                  Enter the authentication code we sent at {maskedPhone}
                </p>

                {/* Phone Number Display */}
                <div className="mb-6">
                  <div className="text-gray-300 text-base mb-1">{displayPhone}</div>
                  <div className="h-px bg-white/30"></div>
                </div>

                {/* OTP Input */}
                <div className="mb-8">
                  <label className="block text-gray-300 text-base mb-3">Login Code</label>
                  <div className="flex gap-2">
                    {otpValues.map((value, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpInputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={handleOtpPaste}
                        className="flex-1 bg-transparent border-b-2 border-white/30 text-white text-xl text-center pb-2 focus:outline-none focus:border-white transition-colors"
                        disabled={loading}
                      />
                    ))}
                  </div>
                  {otpForm.formState.errors.otp && (
                    <p className="mt-2 text-sm text-red-200">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Light Gray Bottom Section */}
            <div className="bg-[#F5F5F5] px-6 py-8 rounded-t-[3rem] flex flex-col items-center">
              <button
                type="submit"
                onClick={otpForm.handleSubmit(handleOtpSubmit)}
                disabled={loading || otpValues.join('').length !== 6}
                className="w-full py-4 bg-[#FFB800] hover:bg-[#E5A700] text-black font-bold rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center shadow-lg mb-6"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-2 border-black border-t-transparent rounded-full"
                  />
                ) : (
                  'SUBMIT'
                )}
              </button>

              <p className="text-gray-600 text-sm">
                Didn&apos;t receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-[#8B2E2E] font-medium underline disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
