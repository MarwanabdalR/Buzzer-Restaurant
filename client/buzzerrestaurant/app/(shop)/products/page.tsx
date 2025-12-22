'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/solid';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { BottomNav } from '../../components/layout/BottomNav';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import { useRestaurants } from '../../hooks/useRestaurant';
import { Product } from '../../types/product';
import { ProductCard } from '../../components/shop/ProductCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export default function AllProductsPage() {
  const router = useRouter();
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: restaurants = [] } = useRestaurants();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<string>('10');
  const [maxPrice, setMaxPrice] = useState<string>('250');
  const [specialRequirements, setSpecialRequirements] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Get unique locations from products' restaurants
  const locations = useMemo(() => {
    const locs = new Set<string>();
    products.forEach((product) => {
      if (product.restaurant?.location) {
        locs.add(product.restaurant.location);
      }
    });
    return Array.from(locs).sort();
  }, [products]);

  // Get unique restaurant names from products
  const restaurantNames = useMemo(() => {
    const names = new Set<string>();
    products.forEach((product) => {
      if (product.restaurant?.name) {
        names.add(product.restaurant.name);
      }
    });
    return Array.from(names).sort();
  }, [products]);

  // Handle rating toggle
  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  // Handle category toggle
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
  };

  // Handle location toggle
  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
  };

  // Handle restaurant toggle
  const toggleRestaurant = (restaurantName: string) => {
    setSelectedRestaurants((prev) =>
      prev.includes(restaurantName)
        ? prev.filter((r) => r !== restaurantName)
        : [...prev, restaurantName]
    );
  };

  // Handle special requirement toggle
  const toggleRequirement = (requirement: string) => {
    setSpecialRequirements((prev) =>
      prev.includes(requirement)
        ? prev.filter((r) => r !== requirement)
        : [...prev, requirement]
    );
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.name.toLowerCase().includes(query) ||
          product.restaurant?.name.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Rating filter
      if (selectedRatings.length > 0 && product.rate !== null) {
        const productRating = Math.floor(product.rate);
        if (!selectedRatings.includes(productRating)) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(product.categoryId)) return false;
      }

      // Price range filter
      const productPrice = parseFloat(product.price);
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || 1000;
      if (productPrice < min || productPrice > max) return false;

      // Featured filter
      if (showFeaturedOnly && !product.isFeatured) return false;

      // Location filter
      if (selectedLocations.length > 0) {
        if (!product.restaurant?.location || !selectedLocations.includes(product.restaurant.location)) {
          return false;
        }
      }

      // Restaurant filter
      if (selectedRestaurants.length > 0) {
        if (!product.restaurant?.name || !selectedRestaurants.includes(product.restaurant.name)) {
          return false;
        }
      }

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedRatings,
    selectedCategories,
    minPrice,
    maxPrice,
    showFeaturedOnly,
    selectedLocations,
    selectedRestaurants,
    specialRequirements,
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled in real-time via filteredProducts
  };

  const handleClearFilters = () => {
    setSelectedRatings([]);
    setSelectedCategories([]);
    setMinPrice('10');
    setMaxPrice('250');
    setSpecialRequirements([]);
    setSelectedLocations([]);
    setSelectedRestaurants([]);
    setShowFeaturedOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden">
        <MobileHeader title="Products" showBackButton onMenuClick={() => {}} />
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
            Products
          </motion.h1>
          <p className="text-gray-300 text-sm md:text-base">Home / Products</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Left Sidebar - Filters */}
            <aside className="w-full lg:w-64 shrink-0">
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
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="w-4 h-4 text-[#4d0d0d] border-gray-300 rounded focus:ring-[#4d0d0d]"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {locations.map((location) => (
                      <label
                        key={location}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(location)}
                          onChange={() => toggleLocation(location)}
                          className="w-4 h-4 text-[#4d0d0d] border-gray-300 rounded focus:ring-[#4d0d0d]"
                        />
                        <span className="text-sm text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Restaurant Filter */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Restaurant</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {restaurantNames.map((restaurantName) => (
                      <label
                        key={restaurantName}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRestaurants.includes(restaurantName)}
                          onChange={() => toggleRestaurant(restaurantName)}
                          className="w-4 h-4 text-[#4d0d0d] border-gray-300 rounded focus:ring-[#4d0d0d]"
                        />
                        <span className="text-sm text-gray-700">{restaurantName}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Featured Products Filter */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Products</h3>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                    <input
                      type="checkbox"
                      checked={showFeaturedOnly}
                      onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                      className="w-4 h-4 text-[#4d0d0d] border-gray-300 rounded focus:ring-[#4d0d0d]"
                    />
                    <span className="text-sm text-gray-700">Show featured only</span>
                  </label>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 mb-1">Min</label>
                        <input
                          type="number"
                          min="0"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4d0d0d] text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-600 mb-1">Max</label>
                        <input
                          type="number"
                          min="0"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4d0d0d] text-sm"
                        />
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
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-gray-500">No products found</p>
                  <p className="text-sm text-gray-400 mt-2">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} restaurant={product.restaurant || undefined} index={index} />
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

