'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from './components/ui/SplashScreen';
import { useAuth } from './context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

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

  if (showSplash || loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#8B2E2E] via-[#A03A3A] to-[#6B1F1F]">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Welcome to Buzzer Restaurant</h1>
        <p className="text-white/90 text-lg">Your dashboard will be here</p>
      </main>
    </div>
  );
}

