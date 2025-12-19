'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CameraIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { MobileSidebar } from '../../components/layout/MobileSidebar';
import { BottomNav } from '../../components/layout/BottomNav';
import { Container } from '../../components/layout/Container';
import { ImageWithLoader } from '../../components/ui/ImageWithLoader';
import toast from 'react-hot-toast';

type TabType = 'info' | 'manage';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: '#4d0d0d' }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const profileData = profile;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      // Convert to base64 or upload to server
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          await updateProfile({ image: base64String });
          toast.success('Profile picture updated successfully');
        } catch (error: any) {
          toast.error(error.message || 'Failed to update profile picture');
        }
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header - hidden on desktop */}
      <div className="md:hidden">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="flex-1 pb-20 md:pb-0">
        {/* Mobile View */}
        <div className="md:hidden">
          {/* Profile Picture and Name */}
          <div className="bg-gray-100 py-8 px-4 flex flex-col items-center">
            <div className="relative">
              {profileData?.image ? (
                <Image
                  src={profileData?.image || '/default-profile.png'}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                  style={{ width: '120px', height: '120px' }}
                />
              ) : (
                <div 
                  className="rounded-full bg-gray-300 flex items-center justify-center"
                  style={{ width: '120px', height: '120px' }}
                >
                  <svg
                    className="w-16 h-16 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <h2 className="text-2xl font-bold text-black mt-4">
              {profileData?.fullName || user?.displayName || 'User'}
            </h2>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-4 text-center ${
                  activeTab === 'info'
                    ? 'text-black border-b-2 border-[#FFB800]'
                    : 'text-gray-500'
                }`}
              >
                My Information
              </button>
              <button
                onClick={() => setActiveTab('manage')}
                className={`flex-1 py-4 text-center ${
                  activeTab === 'manage'
                    ? 'text-black border-b-2 border-[#FFB800]'
                    : 'text-gray-500'
                }`}
              >
                Manage Account
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white">
            {activeTab === 'info' ? (
              <div className="px-4 py-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-500 text-sm mb-2">Name</label>
                    <div className="text-black text-base">
                      {profileData?.fullName || 'Click to enter name'}
                    </div>
                    <div className="h-px bg-gray-200 mt-2" />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm mb-2">Email</label>
                    <div className="text-black text-base">
                      {profileData?.email || 'No email provided'}
                    </div>
                    <div className="h-px bg-gray-200 mt-2" />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-sm mb-2">Phone Number</label>
                    <div className="text-black text-base">
                      {profileData?.mobileNumber || user?.phoneNumber || '+966 0000 000'}
                    </div>
                    <div className="h-px bg-gray-200 mt-2" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-2 py-2">
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="w-full text-left px-4 py-3 rounded-lg relative active:bg-gray-50"
                  style={{ backgroundColor: 'rgba(118, 24, 24, 0.1)' }}
                >
                  <div
                    className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full"
                    style={{ backgroundColor: '#4d0d0d' }}
                  />
                  <span className="text-sm text-black ml-4">Edit Profile</span>
                </button>
                <button
                  onClick={() => router.push('/orders')}
                  className="w-full text-left px-4 py-3 rounded-lg text-black hover:bg-gray-50 active:bg-gray-50"
                >
                  <span className="text-sm">My Orders</span>
                </button>
                <button
                  onClick={() => router.push('/cards')}
                  className="w-full text-left px-4 py-3 rounded-lg text-black hover:bg-gray-50 active:bg-gray-50"
                >
                  <span className="text-sm">Manage Cards</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block bg-white">
          <Container>
            <div className="max-w-4xl mx-auto py-12">
              {/* BUZZER APP Title */}
              <h1 className="text-3xl font-bold text-black mb-12">BUZZER APP</h1>

              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  {profileData?.image ? (
                    <div className="relative w-48 h-48 rounded-full overflow-hidden">
                      <ImageWithLoader
                        src={profileData.image}
                        alt="Profile"
                        fill
                        className="object-cover"
                        sizes="192px"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-32 h-32 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Add Image Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddImageClick}
                  className="bg-gray-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                >
                  Add Image
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Tab Buttons */}
              <div className="flex justify-center gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('info')}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'bg-[#FFB800] text-black'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  My Information
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('manage')}
                  className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === 'manage'
                      ? 'bg-[#FFB800] text-black'
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Manage Account
                </motion.button>
              </div>

              {/* Tab Content */}
              <div className="max-w-2xl mx-auto">
                {activeTab === 'info' ? (
                  <div className="space-y-6 text-center">
                    <div>
                      <p className="text-gray-900 text-lg">
                        <span className="font-medium">Name : </span>
                        <span>{profileData?.fullName || user?.displayName || 'Not set'}</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-900 text-lg">
                        <span className="font-medium">Phone No : </span>
                        <span>{profileData?.mobileNumber || user?.phoneNumber || '+966 0000 000'}</span>
                      </p>
                    </div>
                    {profileData?.email && (
                      <div>
                        <p className="text-gray-900 text-lg">
                          <span className="font-medium">Email : </span>
                          <span>{profileData.email}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/profile/edit')}
                      className="w-full text-left px-6 py-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-900 font-medium">Edit Profile</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/orders')}
                      className="w-full text-left px-6 py-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-900 font-medium">My Orders</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/cards')}
                      className="w-full text-left px-6 py-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-900 font-medium">Manage Cards</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

