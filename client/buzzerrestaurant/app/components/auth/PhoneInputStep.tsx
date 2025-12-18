'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { z } from 'zod';

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
}

export const PhoneInputStep: React.FC<PhoneInputStepProps> = ({
  form,
  loading,
  onSubmit,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col bg-gradient-to-b from-[#4d0d0d] via-[#741818] to-[#610808]"
    >
      {/* Header */}
      <div className="mt-12 px-6 ">
        <h2 className="text-white text-lg font-medium">Sign In</h2>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        <div className="mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Welcome!</h1>
          <p className="text-white/90 text-sm md:text-lg leading-relaxed">
            Please enter your phone number to continue using our app.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label htmlFor="phone" className="block text-white text-sm font-medium mb-3">
              Phone Number
            </label>
            <input
              {...form.register('phone')}
              type="tel"
              id="phone"
              placeholder="01012345678"
              className="w-full bg-transparent border-b-2 border-white/30 text-white text-lg pb-2 focus:outline-none focus:border-white placeholder-white/50 transition-colors"
              disabled={loading}
            />
            {form.formState.errors.phone && (
              <p className="mt-2 text-sm text-red-200">
                {form.formState.errors.phone.message}
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
          onClick={form.handleSubmit(onSubmit)}
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
  );
};

