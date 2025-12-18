'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { MobileSidebar } from '../../components/layout/MobileSidebar';
import { BottomNav } from '../../components/layout/BottomNav';

type TabType = 'info' | 'manage';

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('info');

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 pb-20">
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
      </main>

      <BottomNav />
    </div>
  );
}

