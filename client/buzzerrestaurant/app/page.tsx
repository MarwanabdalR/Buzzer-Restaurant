'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from './components/ui/SplashScreen';
import { Container } from './components/layout/Container';
import { MobileHeader } from './components/layout/MobileHeader';
import { MobileSidebar } from './components/layout/MobileSidebar';
import { useAuth } from './context/AuthContext';
import { BottomNav } from './components/layout/BottomNav';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
        if (!user) {
          router.push('/login');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [loading, user, router]);

  // Prevent body scroll when sidebar is open
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

  if (showSplash || loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#4d0d0d' }}>
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1">
        <Container>
          <div className="flex min-h-[calc(100vh-80px)] w-full flex-col items-center justify-center py-16 sm:py-32">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">Welcome to Buzzer Restaurant</h1>
            <p className="text-white/90 text-lg text-center">Your dashboard will be here</p>
          </div>
        </Container>
        <BottomNav />
      </main>
    </div>
  );
}

