'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MobileHeader } from '../../components/layout/MobileHeader';
import { Container } from '../../components/layout/Container';

const privacyPolicyText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?`;

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="Privacy Policy" showBackButton onMenuClick={() => {}} />
      
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="py-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
            <div className="text-gray-600 leading-relaxed whitespace-pre-line">
              {privacyPolicyText}
            </div>
          </motion.div>
        </Container>
      </main>
    </div>
  );
}

