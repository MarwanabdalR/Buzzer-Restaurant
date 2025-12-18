'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';
import { WaveBackground } from '../ui/WaveBackground';

const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name must not exceed 100 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterNameStepProps {
  form: UseFormReturn<RegisterFormData>;
  loading: boolean;
  onBack: () => void;
  onSubmit: (data: RegisterFormData) => void;
}

export const RegisterNameStep: React.FC<RegisterNameStepProps> = ({
  form,
  loading,
  onBack,
  onSubmit,
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
        <div className="px-6 pt-12 relative z-10">
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="mr-4 text-white"
              disabled={loading}
              type="button"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-white text-lg font-medium">Register</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center px-6 pb-20 relative z-10">
          <div className="mb-12">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Almost There!</h1>
            <p className="text-white/90 text-sm md:text-lg leading-relaxed">
              Please enter your full name to complete registration.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <input
                {...form.register('fullName')}
                type="text"
                id="fullName"
                placeholder="Full Name"
                className="w-full bg-transparent border-b-2 border-white/30 text-white text-lg pb-2 focus:outline-none focus:border-white placeholder-white/50 transition-colors"
                disabled={loading}
              />
              {form.formState.errors.fullName && (
                <p className="mt-2 text-sm text-red-200">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>
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
              'REGISTER'
            )}
          </button>
        </div>
      </WaveBackground>
    </motion.div>
  );
};

