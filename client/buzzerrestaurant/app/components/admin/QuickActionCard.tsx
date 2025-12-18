'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'orange';
  delay?: number;
}

const colorClasses = {
  blue: 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100',
  green: 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100',
  yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600 hover:bg-yellow-100',
  red: 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100',
  purple: 'bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100',
  orange: 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100',
};

const iconColorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
};

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  href,
  color,
  delay = 0,
}) => {
  const router = useRouter();

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push(href)}
      className={`w-full ${colorClasses[color]} border-2 rounded-xl p-4 text-left transition-all duration-200`}
    >
      <div className="flex items-start gap-4">
        <div className={`${iconColorClasses[color]} rounded-lg p-3 text-white shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm opacity-75">{description}</p>
        </div>
      </div>
    </motion.button>
  );
};

