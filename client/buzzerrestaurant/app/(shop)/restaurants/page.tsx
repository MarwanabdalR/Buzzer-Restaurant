'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/solid';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { BottomNav } from '../../components/layout/BottomNav';
import { useRestaurants } from '../../context/RestaurantContext';
import { Restaurant } from '../../types';
import { ImageWithLoader } from '../../components/ui/ImageWithLoader';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function AllRestaurantsPage() {
  const router = useRouter();
  const { restaurants, loading } = useRestaurants();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 80]);
  const [specialRequirements, setSpecialRequirements] = useState<string[]>([]);

  // Get unique categories from restaurants
  const categories = useMemo(() => {
    const cats = new Set(restaurants.map((r) => r.type));
    return Array.from(cats).sort();
  }, [restaurants]);

  // Handle rating toggle
  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };



  // Filter restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.type.toLowerCase().includes(query) ||
          restaurant.location.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Rating filter
      if (selectedRatings.length > 0) {
        const restaurantRating = Math.floor(restaurant.rating);
        if (!selectedRatings.includes(restaurantRating)) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(restaurant.type)) return false;
      }

      // Price range filter (since we don't have price in restaurant, we'll skip this or use rating as proxy)
      // For now, we'll skip price filtering for restaurants

      // Special requirements (placeholder - would need product data)
      // For now, we'll skip this

      return true;
    });
  }, [restaurants, searchQuery, selectedRatings, selectedCategories]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={i} className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />);
    }
    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="w-4 h-4 text-[#FFB800] fill-[#FFB800] opacity-50" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300 fill-gray-300" />);
    }
    return stars;
  };

  const handleCardClick = (restaurantId: string) => {
    router.push(`/supplier/${restaurantId}/products`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in real-time via filteredRestaurants
  };

  const handleClearFilters = () => {
    setSelectedRatings([]);
    setSelectedCategories([]);
    setPriceRange([0, 80]);
    setSpecialRequirements([]);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader title="Restaurants" showBackButton onMenuClick={() => {}} />
      </div>

      {/* Hero Header */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[url('/city-night.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-2 text-center"
          >
            Restaurants
          </motion.h1>
          <p className="text-gray-300 text-sm md:text-base">Home / Restaurants</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Left Sidebar - Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6 space-y-6">
                {/* Rating Filter */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating</h3>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRatings.includes(rating)}
                          onChange={() => toggleRating(rating)}
                          className="w-4 h-4 text-[#4d0d0d] border-gray-300 rounded focus:ring-[#4d0d0d]"
                        />
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating
                                  ? 'text-[#FFB800] fill-[#FFB800]'
                                  : 'text-gray-300 fill-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 text-[#4d0d0d] border-gray-300 rounded focus:ring-[#4d0d0d]"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="80"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#4d0d0d]"
                      />
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClearFilters}
                      className="w-full bg-[#4d0d0d] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#5a1515] transition-colors text-sm"
                    >
                      FILTER
                    </motion.button>
                  </div>
                </div>


              </div>
            </aside>

            {/* Right Section - Search and Results */}
            <div className="flex-1">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search"
                      className="w-full bg-white text-gray-900 placeholder-gray-400 pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#FFB800] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#E5A700] transition-colors"
                  >
                    Search
                  </motion.button>
                </div>
              </form>

              {/* Results */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : filteredRestaurants.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No restaurants found</p>
                  <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant, index) => (
                    <motion.div
                      key={restaurant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => handleCardClick(restaurant.id)}
                      className="bg-white rounded-lg overflow-hidden shadow-md cursor-pointer transition-all hover:shadow-xl"
                    >
                      {/* Image */}
                      <div className="relative h-48 w-full">
                        {restaurant.imageUrl ? (
                          <ImageWithLoader
                            src={restaurant.imageUrl}
                            alt={restaurant.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <svg
                              className="w-16 h-16 text-gray-400"
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

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          {renderStars(restaurant.rating)}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                        <p className="text-sm text-[#4d0d0d] font-medium mb-2">{restaurant.type}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPinIcon className="w-4 h-4 text-[#4d0d0d]" />
                          <span>{restaurant.location || 'Main Market Riyadh, KSA'}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

