'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MagnifyingGlassIcon, MapPinIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { ImageWithLoader } from '../ui/ImageWithLoader';
import { Restaurant } from '../../types';
import { useGeoLocation } from '../../hooks/useGeoLocation';
import { useNearbyRestaurants } from '../../hooks/useNearbyRestaurants';
import toast from 'react-hot-toast';

interface NearestRestaurantsSectionProps {
  restaurants: Restaurant[];
  loading: boolean;
}

export const NearestRestaurantsSection: React.FC<NearestRestaurantsSectionProps> = ({
  restaurants,
  loading,
}) => {
  const router = useRouter();
  const { location, isLoading: isGeoLoading, error: geoError, getCurrentLocation, stopLocationSearch } = useGeoLocation();
  const nearbyRestaurantsMutation = useNearbyRestaurants();
  const [nearestRestaurants, setNearestRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const [hasFetchedNearby, setHasFetchedNearby] = useState(false);
  const t = useTranslations('Home');
  const tCommon = useTranslations('Common');
  const tErrors = useTranslations('Errors');

  // Initialize restaurants when they load (only if no location requested yet)
  useEffect(() => {
    if (restaurants.length > 0 && !hasRequestedLocation && nearestRestaurants.length === 0) {
      const timer = setTimeout(() => {
        setNearestRestaurants(restaurants.slice(0, 4));
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [restaurants, hasRequestedLocation, nearestRestaurants.length]);

  // Fetch nearby restaurants when location is available (only once per location request)
  useEffect(() => {
    if (location && hasRequestedLocation && !hasFetchedNearby && !nearbyRestaurantsMutation.isPending) {
      setHasFetchedNearby(true);
      nearbyRestaurantsMutation.mutate(
        {
          userLat: location.lat,
          userLng: location.lng,
          radiusKM: 10,
        },
        {
          onSuccess: (data) => {
            setNearestRestaurants(data.slice(0, 4));
            toast.success(`Found ${data.length} nearby restaurant${data.length !== 1 ? 's' : ''}!`);
          },
          onError: (error: Error) => {
            toast.error(error.message || 'Failed to fetch nearby restaurants');
            // Fallback to showing all restaurants
            setNearestRestaurants(restaurants.slice(0, 4));
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location?.lat, location?.lng, hasRequestedLocation, hasFetchedNearby]);

  // Handle find near me button click
  const handleFindNearMe = async () => {
    try {
      setHasFetchedNearby(false); // Reset flag to allow new fetch
      setHasRequestedLocation(true);
      await getCurrentLocation();
      // Location is now always resolved (either real GPS or default fallback)
      // No need to show error toast as fallback is handled gracefully
    } catch (error: any) {
      // This catch should rarely fire now since we resolve with default location
      console.warn('Unexpected error getting location:', error);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="w-5 h-5 text-[#FFB800] fill-[#FFB800]" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-5 h-5 text-gray-300 fill-gray-300" />
        );
      }
    }
    return stars;
  };

  const handleCardClick = (restaurantId: string) => {
    router.push(`/supplier/${restaurantId}/products`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in real-time via filteredRestaurants useMemo
  };

  // Filter restaurants by name, type, and location based on search query
  const filteredRestaurants = useMemo(() => {
    if (!searchQuery.trim()) {
      return nearestRestaurants;
    }

    const query = searchQuery.toLowerCase().trim();
    return nearestRestaurants.filter((restaurant) => {
      // Search in name, type, and location fields (case-insensitive)
      const name = (restaurant.name || '').toLowerCase();
      const type = (restaurant.type || '').toLowerCase();
      const location = (restaurant.location || '').toLowerCase();
      
      return (
        name.includes(query) ||
        type.includes(query) ||
        location.includes(query)
      );
    });
  }, [nearestRestaurants, searchQuery]);

  return (
    <section className="hidden md:block bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-black text-gray-900 mb-2">{t('nearestRestaurants')}</h2>
          <div className="flex justify-center mb-6">
            <svg
              className="w-32 h-8 text-gray-800"
              fill="currentColor"
              viewBox="0 0 200 40"
            >
              <path d="M20 20 Q 100 5, 180 20" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSearch}
          className="max-w-2xl mx-auto mb-8 flex gap-3"
        >
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tCommon('search')}
              className="w-full bg-white text-gray-900 placeholder-gray-400 px-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#FFB800] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#E5A700] transition-colors"
          >
            {tCommon('search')}
          </motion.button>
        </motion.form>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[400px] relative">
            {/* Map placeholder - In production, integrate Google Maps or Mapbox */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
              {/* Location marker */}
              {location && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute z-10"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="w-6 h-6 bg-black rounded-full border-4 border-white shadow-lg" />
                  <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-20" />
                </motion.div>
              )}
              
              {/* Location button / Stop button */}
              {isGeoLoading ? (
                <button
                  onClick={stopLocationSearch}
                  className="absolute bottom-4 right-4 z-10 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  aria-label="Stop location search"
                >
                  <XMarkIcon className="w-6 h-6 text-white" />
                </button>
              ) : (
                <button
                  onClick={handleFindNearMe}
                  disabled={nearbyRestaurantsMutation.isPending}
                  className="absolute bottom-4 right-4 z-10 w-12 h-12 bg-[#FFB800] rounded-full flex items-center justify-center shadow-lg hover:bg-[#E5A700] transition-colors disabled:opacity-50"
                  aria-label="Find nearby restaurants"
                >
                  <MapPinIcon className="w-6 h-6 text-black" />
                </button>
              )}

              {/* Map placeholder text */}
              {!location && !isGeoLoading && !nearbyRestaurantsMutation.isPending && (
                <div className="text-center text-gray-500 px-4">
                  <MapPinIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">{t('clickLocationIcon')}</p>
                  {geoError && (
                    <div className="mt-2">
                      <p className="text-sm text-red-500 font-medium">{geoError}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Tip: Make sure location services are enabled in your browser settings
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Success message when location is loaded */}
              {location && !isGeoLoading && !nearbyRestaurantsMutation.isPending && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 right-4 z-10 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg"
                >
                  <p className="text-sm font-medium">
                    ✓ {t('locationFound')}
                  </p>
                </motion.div>
              )}

              {/* Loading overlay */}
              {(isGeoLoading || nearbyRestaurantsMutation.isPending) && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Nearest Restaurants Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-4 border-[#4d0d0d] border-t-transparent rounded-full"
            />
          </div>
        ) : nearestRestaurants.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No restaurants available</p>
          </div>
        ) : (
          <>
            {location && !searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 text-center"
              >
                <p className="text-sm text-gray-600">
                  Showing {nearestRestaurants.length} nearest restaurant{nearestRestaurants.length !== 1 ? 's' : ''} within 10 km
                </p>
              </motion.div>
            )}
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 text-center"
              >
                <p className="text-sm text-gray-600">
                  {filteredRestaurants.length === 0
                    ? tCommon('noResults')
                    : `Found ${filteredRestaurants.length} restaurant${filteredRestaurants.length !== 1 ? 's' : ''} matching "${searchQuery}"`}
                </p>
              </motion.div>
            )}
            {filteredRestaurants.length === 0 && searchQuery ? (
              <div className="text-center py-12 text-gray-500">
                <MapPinIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">{tCommon('noResults')}</p>
                <p className="text-sm">Try searching for a different location</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleCardClick(restaurant.id)}
                  className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl"
                >
                  {/* Circular Image */}
                  <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                    {restaurant.imageUrl ? (
                      <ImageWithLoader
                        src={restaurant.imageUrl}
                        alt={restaurant.name}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {renderStars(restaurant.rating)}
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                    {restaurant.name}
                  </h3>

                  {/* Type */}
                  <p className="text-sm text-[#4d0d0d] font-medium text-center mb-3">
                    {restaurant.type}
                  </p>

                  {/* Location */}
                  <div className="flex flex-col items-center gap-1 text-sm text-gray-600">
                    <div className="flex items-center justify-center gap-1">
                      <MapPinIcon className="w-4 h-4 text-[#4d0d0d]" />
                      <span className="text-center">{restaurant.location || 'Main Market Riyadh, KSA'}</span>
                    </div>
                    {restaurant.distance !== undefined && restaurant.distance !== null && (
                      <span className="text-xs font-semibold text-[#FFB800]">
                        {restaurant.distance.toFixed(1)} {t('km')} {t('away')}
                      </span>
                    )}
                  </div>
                </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
