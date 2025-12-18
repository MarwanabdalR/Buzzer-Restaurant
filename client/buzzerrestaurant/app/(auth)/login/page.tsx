'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { sendOTP, verifyOTP, createRecaptchaVerifier } from '../../lib/firebase';
import type { RecaptchaVerifier } from 'firebase/auth';
import api from '../../lib/axios';
import { PhoneInputStep } from '../../components/auth/PhoneInputStep';
import { OtpInputStep } from '../../components/auth/OtpInputStep';

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
      toast.success('OTP sent successfully!');
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

  const handleBack = () => {
    setStep('phone');
    setOtpValues(['', '', '', '', '', '']);
    otpForm.reset();
  };

  useEffect(() => {
    if (step === 'otp') {
      otpInputRefs.current[0]?.focus();
    }
  }, [step]);

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {step === 'phone' ? (
          <PhoneInputStep
            key="phone"
            form={phoneForm}
            loading={loading}
            onSubmit={handlePhoneSubmit}
          />
        ) : (
          <OtpInputStep
            key="otp"
            form={otpForm}
            loading={loading}
            phoneNumber={phoneNumber}
            otpValues={otpValues}
            otpInputRefs={otpInputRefs}
            onBack={handleBack}
            onSubmit={handleOtpSubmit}
            onOtpChange={handleOtpChange}
            onOtpKeyDown={handleOtpKeyDown}
            onOtpPaste={handleOtpPaste}
            onResend={handleResendOTP}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
