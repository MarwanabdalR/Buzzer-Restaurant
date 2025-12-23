'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';
import { WaveBackground } from '../ui/WaveBackground';

const phoneSchema = z.object({
  phone: z
    .string()
    .min(11, 'Phone number must be 11 digits')
    .max(11, 'Phone number must be 11 digits')
    .regex(/^(010|011|012|015)\d{8}$/, 'Phone number must start with 010, 011, 012, or 015 and be 11 digits'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

interface PhoneInputStepProps {
  form: UseFormReturn<PhoneFormData>;
  loading: boolean;
  onSubmit: (data: PhoneFormData) => void;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export const PhoneInputStep: React.FC<PhoneInputStepProps> = ({
  form,
  loading,
  onSubmit,
  title = 'Sign In',
  subtitle = 'Please enter your phone number to continue using our app.',
  buttonText = 'NEXT',
  showBackButton = false,
  onBack,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col min-h-screen"
    >
      <WaveBackground
        topColor="#4d0d0d"
        bottomColor="#ffffff"
        topHeight="65%"
      >
        {/* Header */}
        <div className="mt-12 px-6 relative z-10">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="text-white mb-4"
              type="button"
              disabled={loading}
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
          )}
          <h2 className="text-white text-lg font-medium">{title}</h2>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-6 pb-20 relative z-10">
          <div className="mb-12">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Welcome!</h1>
            <p className="text-white/90 text-sm md:text-lg leading-relaxed">
              {subtitle}
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <input
                {...form.register('phone')}
                type="tel"
                id="phone"
                placeholder="Phone Number"
                className="w-full bg-transparent border-b-2 border-white/30 text-white text-lg pb-2 focus:outline-none focus:border-white placeholder-white/50 transition-colors"
                disabled={loading}
              />
              {form.formState.errors.phone && (
                <p className="mt-2 text-sm text-red-200">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
            <pre className="text-white/50 text-sm">
            🔑 Demo Credentials:
            👤 User Account: 01234567890
            🛡️ Admin Account: 01090378387 (Has full dashboard access)
            🔑 OTP for both: 123456
            </pre>

            {/* Invisible reCAPTCHA container */}
            <div id="recaptcha-container" />

          </form>
        </div>
        {/* Bottom Button Section - positioned in white area after wave */}
        <div className="px-32 rounded-t-[3rem]" style={{ backgroundColor: '#F5F5F5' }}>
          <button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            className="w-full py-4 bg-[#FFB800] hover:bg-[#E5A700] text-black font-bold rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center shadow-lg"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-black border-t-transparent rounded-full"
              />
            ) : (
              buttonText
            )}
          </button>
        </div>
      </WaveBackground>
    </motion.div>
  );
};

