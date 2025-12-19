'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { Container } from '../../components/layout/Container';
import { PhoneIcon, MapPinIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="About Us" showBackButton onMenuClick={() => {}} />
      
      <main className="flex-1 pb-20 overflow-y-auto">
        {/* Top Section with Logo */}
        <div className="relative bg-gradient-to-b from-[#4d0d0d] to-[#3d0a0a] pb-12">
          <div className="absolute bottom-0 right-0 left-0 h-12 bg-white rounded-t-[3rem]" />
          <Container>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Image
                src="/Buzzer-Image.png"
                alt="Buzzer Logo"
                width={120}
                height={120}
                className="object-contain mb-4"
              />
              <h1 className="text-white text-2xl font-bold uppercase tracking-wider">
                BUZZER APP
              </h1>
            </motion.div>
          </Container>
        </div>

        {/* Content Section */}
        <Container>
          <div className="py-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
              <p className="text-gray-600 leading-relaxed">
                Buzzer App is a revolutionary food delivery and restaurant ordering platform designed to 
                connect customers with their favorite local restaurants and suppliers. We strive to provide 
                a seamless ordering experience with real-time order tracking and instant notifications.
              </p>
              <p className="text-gray-600 leading-relaxed mt-4">
                Our mission is to make food ordering easy, fast, and enjoyable for everyone. Whether you&apos;re 
                looking for your favorite meal or discovering new restaurants, Buzzer App has you covered.
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-5 h-5 text-[#4d0d0d] shrink-0" />
                  <span className="text-gray-700">+966 0000 000</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPinIcon className="w-5 h-5 text-[#4d0d0d] shrink-0" />
                  <span className="text-gray-700">Main Market, Al-Ain, KSA</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-5 h-5 text-[#4d0d0d] shrink-0" />
                  <span className="text-gray-700">contact@help.com</span>
                </div>
              </div>
            </motion.div>

            {/* Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold text-gray-900">Follow Us</h3>
              
              <div className="flex gap-4">
                <motion.a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center"
                >
                  <span className="text-white font-bold text-lg">f</span>
                </motion.a>
                
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </motion.a>
                
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </Container>
      </main>
    </div>
  );
}

