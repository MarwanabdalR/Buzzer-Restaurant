'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { sendOTP, verifyOTP, getIdToken, createRecaptchaVerifier } from '../../lib/firebase';
import type { RecaptchaVerifier } from 'firebase/auth';
import api from '../../lib/axios';

// Validation schemas
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

const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name must not exceed 100 characters'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OtpFormData = z.infer<typeof otpSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'phone' | 'otp' | 'register'>('phone');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [idToken, setIdToken] = useState<string | null>(null);
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

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
    },
  });

  useEffect(() => {
    // Check if redirected from login with phone number
    const phone = searchParams.get('phone');
    if (phone) {
      setPhoneNumber(phone);
      setStep('phone');
      phoneForm.setValue('phone', phone);
    }
  }, [searchParams]);

  useEffect(() => {
    // Initialize reCAPTCHA verifier
    if (typeof window !== 'undefined') {
      try {
        recaptchaVerifierRef.current = createRecaptchaVerifier('recaptcha-container');
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
      }
    }

    return () => {
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

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

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
    
    const lastFilledIndex = newOtpValues.findIndex(val => !val);
    const focusIndex = lastFilledIndex === -1 ? 5 : lastFilledIndex;
    otpInputRefs.current[focusIndex]?.focus();
  };

  const handleOtpSubmit = async (data: OtpFormData) => {
    if (!confirmationResult) return;

    setLoading(true);
    try {
      const userCredential = await verifyOTP(confirmationResult, data.otp);
      const token = await userCredential.user.getIdToken();
      setIdToken(token);
      setStep('register');
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

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    if (!idToken) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        fullName: data.fullName,
        mobileNumber: `+2${phoneNumber}`,
        idToken,
      });

      if (response.status === 201) {
        toast.success('Registration successful!');
        router.push('/');
      }
    } catch (error: any) {
      console.error('Error registering:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      registerForm.setError('fullName', {
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

  const maskedPhone = phoneNumber ? `******${phoneNumber.slice(-3)}` : '';
  const displayPhone = phoneNumber ? `+2 ${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}` : '';

  return (
    <div className="min-h-screen flex flex-col">
      {step === 'phone' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1 flex flex-col bg-gradient-to-b from-[#8B2E2E] via-[#A03A3A] to-[#6B1F1F]"
        >
          <div className="pt-12 pb-6 px-6">
            <button
              onClick={() => router.back()}
              className="text-white mb-4"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-white text-xl font-medium">Register</h2>
          </div>

          <div className="flex-1 flex flex-col justify-center px-6 pb-8">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome!</h1>
              <p className="text-white/90 text-base md:text-lg leading-relaxed">
                Please enter your phone number to create your account.
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

              <div id="recaptcha-container" />

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
      )}

      {step === 'otp' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1 flex flex-col"
        >
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#8B2E2E] via-[#A03A3A] to-[#6B1F1F] px-6 pt-12 pb-8">
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
              <h2 className="text-white text-xl font-medium">Verification Code</h2>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Verify Your Phone</h1>
              <p className="text-white/90 text-base mb-8">
                Enter the authentication code we sent at {maskedPhone}
              </p>

              <div className="mb-6">
                <div className="text-gray-300 text-base mb-1">{displayPhone}</div>
                <div className="h-px bg-white/30"></div>
              </div>

              <div className="mb-8">
                <label className="block text-gray-300 text-base mb-3">Verification Code</label>
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
                'VERIFY'
              )}
            </button>
          </div>
        </motion.div>
      )}

      {step === 'register' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1 flex flex-col bg-gradient-to-b from-[#8B2E2E] via-[#A03A3A] to-[#6B1F1F]"
        >
          <div className="pt-12 pb-6 px-6">
            <button
              onClick={() => setStep('otp')}
              className="text-white mb-4"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-white text-xl font-medium">Complete Registration</h2>
          </div>

          <div className="flex-1 flex flex-col justify-center px-6 pb-8">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Almost There!</h1>
              <p className="text-white/90 text-base md:text-lg leading-relaxed">
                Please enter your full name to complete registration.
              </p>
            </div>

            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-8">
              <div>
                <label htmlFor="fullName" className="block text-white text-sm font-medium mb-3">
                  Full Name
                </label>
                <input
                  {...registerForm.register('fullName')}
                  type="text"
                  id="fullName"
                  placeholder="Enter your full name"
                  className="w-full bg-transparent border-b-2 border-white/30 text-white text-lg pb-2 focus:outline-none focus:border-white placeholder-white/50 transition-colors"
                  disabled={loading}
                />
                {registerForm.formState.errors.fullName && (
                  <p className="mt-2 text-sm text-red-200">
                    {registerForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="bg-[#F5F5F5] px-6 py-8 rounded-t-[3rem]">
            <button
              type="submit"
              onClick={registerForm.handleSubmit(handleRegisterSubmit)}
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
                'REGISTER'
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

