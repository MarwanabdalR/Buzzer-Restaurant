'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SplashScreen } from './components/ui/SplashScreen';
import { Container } from './components/layout/Container';
import { MobileHeader } from './components/layout/MobileHeader';
import { MobileSidebar } from './components/layout/MobileSidebar';
import { useAuth } from './context/AuthContext';
import { BottomNav } from './components/layout/BottomNav';
import { useRestaurants } from './context/RestaurantContext';
import { RestaurantSearchBar } from './components/shop/RestaurantSearchBar';
import { RestaurantList } from './components/shop/RestaurantList';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { restaurants, loading: restaurantsLoading, error } = useRestaurants();

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

  const handleSearch = () => {
    // Filter restaurants based on search query
    // This will be implemented when search functionality is needed
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      restaurant.name.toLowerCase().includes(query) ||
      restaurant.type.toLowerCase().includes(query) ||
      restaurant.location.toLowerCase().includes(query)
    );
  });

  if (showSplash || loading) {
    return <SplashScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader 
        onMenuClick={() => setSidebarOpen(true)} 
        title="Restaurants"
        showBackButton={false}
      />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 pb-20 overflow-y-auto">
        <RestaurantSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
        />

        <Container>
          <div className="py-4">
            <RestaurantList
              restaurants={filteredRestaurants}
              loading={restaurantsLoading}
              error={error}
            />
          </div>
        </Container>
      </main>

      <BottomNav />
    </div>
  );
}

