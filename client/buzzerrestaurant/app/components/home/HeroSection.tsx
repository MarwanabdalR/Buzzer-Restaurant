'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations('Home');
  const tCommon = useTranslations('Common');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="hidden md:block min-h-[600px] bg-gradient-to-br from-[#1a1a1a] via-[#2d1b1b] to-[#1a1a1a] relative overflow-hidden">
      {/* Blue top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 z-10" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Text and Search */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-7xl font-black text-white leading-none"
              >
                FOOD
              </motion.h1>
              
              {/* Arrow with CAN CHANGE */}
              <div className="relative">
                <div className="flex items-center gap-4">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl text-white font-semibold"
                  >
                    CAN
                  </motion.span>
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="w-24 h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 100 60"
                  >
                    <path
                      d="M 10 30 Q 50 10, 90 30"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-2xl text-white font-semibold"
                  >
                    CHANGE
                  </motion.span>
                </div>
              </div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-7xl font-black text-white leading-none"
              >
                MOOD
              </motion.h1>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-gray-300 text-lg leading-relaxed max-w-xl"
            >
              Welcome to our exquisite restaurant, where culinary expertise meets passion. Step into a world of flavors and indulgence, where we are dedicated to enhancing your dining experience and leaving you feeling satisfied.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onSubmit={handleSearch}
              className="flex items-center gap-3"
            >
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={tCommon('search')}
                  className="w-full bg-gray-800 text-white placeholder-gray-400 px-6 py-4 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent text-lg"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-[#FFB800] rounded-full flex items-center justify-center hover:bg-[#E5A700] transition-colors"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-6 h-6 text-black" />
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Right Section - Burger Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-red-800/20 to-black/50 rounded-3xl blur-3xl" />
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Burger Image - Replace with actual image path when available */}
                <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/20 via-orange-900/20 to-yellow-900/20 rounded-3xl">
                  <div className="text-center text-white/80">
                    <svg
                      className="w-64 h-64 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p className="text-lg font-medium">Food Image</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

