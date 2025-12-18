'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProfile } from '../../../context/ProfileContext';
import { MobileHeader } from '../../../components/layout/MobileHeader';
import { MobileSidebar } from '../../../components/layout/MobileSidebar';
import { BottomNav } from '../../../components/layout/BottomNav';
import { ImageUpload } from '../../../components/ui/ImageUpload';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const editProfileSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, updateProfile, loading: profileLoading, refreshProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cloudinaryImageUrl, setCloudinaryImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  });

  const fullName = watch('fullName');
  const email = watch('email');

  useEffect(() => {
    if (profile) {
      setValue('fullName', profile.fullName || '');
      setValue('email', profile.email || '');
      setCloudinaryImageUrl(profile.image);
    }
  }, [profile, setValue]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const handleImageUploadComplete = (url: string) => {
    setCloudinaryImageUrl(url);
    toast.success('Image uploaded successfully!');
  };

  const handleImageUploadError = (error: string) => {
    toast.error(error || 'Failed to upload image');
  };

  const onSubmit = async (data: EditProfileFormData) => {
    setLoading(true);
    try {
      const updateData: {
        fullName: string;
        email?: string | null;
        image?: string | null;
      } = {
        fullName: data.fullName,
      };

      if (data.email && data.email.trim() !== '') {
        updateData.email = data.email.trim();
      } else {
        updateData.email = null;
      }

      if (cloudinaryImageUrl) {
        updateData.image = cloudinaryImageUrl;
      }

      await updateProfile(updateData);
      await refreshProfile();
      toast.success('Profile updated successfully!');
      router.push('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#4d0d0d' }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 pb-20">
        <div className="bg-gray-50 py-8 px-4 flex flex-col items-center">
          <ImageUpload
            currentImage={cloudinaryImageUrl}
            onUploadComplete={handleImageUploadComplete}
            onError={handleImageUploadError}
            size={120}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-4 py-6 space-y-6">
          <div>
            <input
              {...register('fullName')}
              type="text"
              placeholder="Full Name"
              className="w-full bg-transparent border-b-2 border-gray-200 text-black text-lg pb-2 focus:outline-none focus:border-[#4d0d0d] placeholder-gray-400 transition-colors"
              defaultValue={fullName}
            />
            {errors.fullName && (
              <p className="mt-2 text-sm text-red-500">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-b-2 border-gray-200 text-black text-lg pb-2 focus:outline-none focus:border-[#4d0d0d] placeholder-gray-400 transition-colors"
              defaultValue={email}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FFB800] hover:bg-[#E5A700] text-black font-bold rounded-2xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center shadow-lg"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-black border-t-transparent rounded-full"
                />
              ) : (
                'UPDATE'
              )}
            </button>
          </div>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}
