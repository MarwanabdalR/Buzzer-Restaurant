'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

export const DesktopFooter: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Implement subscription API call
      console.log('Subscribe:', email);
      setEmail('');
    }
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z', href: 'https://twitter.com' },
    { name: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z', href: 'https://facebook.com' },
    { name: 'YouTube', icon: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z M9.75 15.02l-5.75-3.27v6.54l5.75-3.27z', href: 'https://youtube.com' },
    { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z', href: 'https://linkedin.com' },
  ];

  return (
    <footer className="hidden md:block bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* Main Footer Content - 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/Buzzer-Image.png"
                alt="Buzzer Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-white text-xl font-bold tracking-wide">Buzzer App</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              These guys have been absolutely outstanding. When I needed them they came through in a big way! I know that if you buy this theme.
            </p>
            
            <div className="space-y-3 mt-6">
              <h4 className="text-white font-semibold uppercase text-sm">Contact Info</h4>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <PhoneIcon className="w-5 h-5 shrink-0" />
                <span>+966 0000 000</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <EnvelopeIcon className="w-5 h-5 shrink-0" />
                <span>contact@help.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Account */}
          <div>
            <h4 className="text-white font-semibold uppercase text-sm mb-4">Account</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-400 hover:text-[#FFB800] transition-colors text-sm"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/about-us')}
                  className="text-gray-400 hover:text-[#FFB800] transition-colors text-sm"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/contact-us')}
                  className="text-gray-400 hover:text-[#FFB800] transition-colors text-sm"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legals */}
          <div>
            <h4 className="text-white font-semibold uppercase text-sm mb-4">Legals</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => router.push('/privacy-policy')}
                  className="text-gray-400 hover:text-[#FFB800] transition-colors text-sm"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push('/terms-conditions')}
                  className="text-gray-400 hover:text-[#FFB800] transition-colors text-sm"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Subscribe */}
          <div>
            <h4 className="text-white font-semibold uppercase text-sm mb-4">Subscribe</h4>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFB800] focus:border-transparent"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-transparent border-2 border-[#FFB800] text-[#FFB800] font-semibold py-3 px-6 rounded-lg hover:bg-[#FFB800] hover:text-black transition-colors"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-[#FFB800] hover:bg-gray-700 transition-colors"
                  aria-label={social.name}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              ©2023 Buzzer App. All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

