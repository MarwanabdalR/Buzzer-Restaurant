'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !profileLoading) {
      if (!user) {
        router.push('/login');
        return;
      }

      if (profile) {
        if (profile.type !== 'admin') {
          router.push('/');
          return;
        }
      } else if (!profile && user) {
        // Profile not loaded yet but user is authenticated, wait a bit
        setTimeout(() => {
          if (profile && profile.type !== 'admin') {
            router.push('/');
          }
        }, 1000);
      }
    }
  }, [user, profile, authLoading, profileLoading, router]);

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

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#4d0d0d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (profile && profile.type !== 'admin')) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-[#4d0d0d]">{profile?.fullName || 'Admin'}</span>
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

