'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { sendOTP, verifyOTP, createRecaptchaVerifier } from '../../lib/firebase';
import type { RecaptchaVerifier } from 'firebase/auth';
import { PhoneInputStep } from '../../components/auth/PhoneInputStep';
import { OtpInputStep } from '../../components/auth/OtpInputStep';
import { RegisterNameStep } from '../../components/auth/RegisterNameStep';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';

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
  const { register } = useAuth();
  const { refreshProfile } = useProfile();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      await register({
        fullName: data.fullName,
        mobileNumber: `+2${phoneNumber}`,
        idToken,
      });
      
      await refreshProfile();
      toast.success('Registration successful!');
      router.push('/profile');
    } catch (error: any) {
      console.error('Error registering:', error);
      
      // If user already exists, redirect to login
      if (error.message === 'USER_EXISTS') {
        toast.error('User already exists. Redirecting to login...');
        router.push(`/login?phone=${phoneNumber}`);
        return;
      }
      
      toast.error(error.message || 'Registration failed. Please try again.');
      registerForm.setError('fullName', {
        type: 'manual',
        message: error.message || 'Registration failed. Please try again.',
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

  const handleRegisterBack = () => {
    setStep('otp');
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
            title="Register"
            subtitle="Please enter your phone number to create your account."
            buttonText="NEXT"
            showBackButton={true}
            onBack={handleBack}
          />
        ) : step === 'otp' ? (
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
          />
        ) : (
          <RegisterNameStep
            key="register"
            form={registerForm}
            loading={loading}
            onBack={handleRegisterBack}
            onSubmit={handleRegisterSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
