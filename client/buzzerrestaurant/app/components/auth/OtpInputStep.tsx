'use client';

import React, { RefObject } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface OtpInputStepProps {
  form: UseFormReturn<OtpFormData>;
  loading: boolean;
  phoneNumber: string;
  otpValues: string[];
  otpInputRefs: RefObject<(HTMLInputElement | null)[]>;
  onBack: () => void;
  onSubmit: (data: OtpFormData) => void;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onOtpPaste: (e: React.ClipboardEvent) => void;
  onResend: () => void;
}

export const OtpInputStep: React.FC<OtpInputStepProps> = ({
  form,
  loading,
  phoneNumber,
  otpValues,
  otpInputRefs,
  onBack,
  onSubmit,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
  onResend,
}) => {
  // Format phone number for display (masked)
  const maskedPhone = phoneNumber ? `******${phoneNumber.slice(-3)}` : '';
  const displayPhone = phoneNumber ? `+2 ${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}` : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col"
    >
      {/* Dark Red Top Section */}
      <div className="flex-1 flex flex-col bg-gradient-to-b from-[#8B2E2E] via-[#A03A3A] to-[#6B1F1F] px-4 sm:px-6 pt-12 pb-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="mr-4 text-white"
            disabled={loading}
            type="button"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h2 className="text-white text-xl font-medium">Login Code</h2>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">Login by OTP</h1>
          <p className="text-white/90 text-sm sm:text-base mb-8">
            Enter the authentication code we sent at {maskedPhone}
          </p>

          {/* Phone Number Display */}
          <div className="mb-6">
            <div className="text-gray-300 text-sm sm:text-base mb-1">{displayPhone}</div>
            <div className="h-px bg-white/30"></div>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <label className="block text-gray-300 text-sm sm:text-base mb-3">Login Code</label>
            <div className="flex gap-1.5 sm:gap-2 justify-center">
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    if (otpInputRefs.current) {
                      otpInputRefs.current[index] = el;
                    }
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value}
                  onChange={(e) => onOtpChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => onOtpKeyDown(index, e)}
                  onPaste={onOtpPaste}
                  className="w-10 h-12 sm:w-12 sm:h-14 bg-transparent border-b-2 border-white/30 text-white text-lg sm:text-xl text-center pb-2 focus:outline-none focus:border-white transition-colors"
                  disabled={loading}
                />
              ))}
            </div>
            {form.formState.errors.otp && (
              <p className="mt-2 text-sm text-red-200 text-center">
                {form.formState.errors.otp.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Light Gray Bottom Section */}
      <div className="bg-[#F5F5F5] px-4 sm:px-6 py-8 rounded-t-[3rem] flex flex-col items-center">
        <button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading || otpValues.join('').length !== 6}
          className="w-full max-w-md py-4 bg-[#FFB800] hover:bg-[#E5A700] text-black font-bold rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center shadow-lg mb-6"
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

        <p className="text-gray-600 text-xs sm:text-sm">
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={onResend}
            disabled={loading}
            className="text-[#8B2E2E] font-medium underline disabled:opacity-50"
          >
            Resend
          </button>
        </p>
      </div>
    </motion.div>
  );
};

