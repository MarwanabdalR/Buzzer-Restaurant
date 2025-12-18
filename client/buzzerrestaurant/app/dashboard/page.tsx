'use client';

import React from 'react';
import { useAdminStats } from '../hooks/useAdminStats';
import { StatsCard } from '../components/admin/StatsCard';
import { QuickActionCard } from '../components/admin/QuickActionCard';
import {
  UserGroupIcon,
  BuildingStorefrontIcon,
  RectangleStackIcon,
  TagIcon,
  CubeIcon,
  CurrencyDollarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useAdminStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-[#4d0d0d] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 font-semibold mb-2">Failed to load dashboard statistics</p>
        <p className="text-red-600 text-sm">{error instanceof Error ? error.message : 'Please try again.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin dashboard</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.users.total}
          icon={<UserGroupIcon className="w-6 h-6" />}
          color="blue"
          delay={0}
        />
        <StatsCard
          title="Restaurants"
          value={stats.restaurants.total}
          icon={<BuildingStorefrontIcon className="w-6 h-6" />}
          color="green"
          delay={0.1}
        />
        <StatsCard
          title="Total Orders"
          value={stats.orders.total}
          icon={<RectangleStackIcon className="w-6 h-6" />}
          color="purple"
          delay={0.2}
        />
        <StatsCard
          title="Pending Orders"
          value={stats.orders.pending}
          icon={<RectangleStackIcon className="w-6 h-6" />}
          color="yellow"
          delay={0.3}
        />
        <StatsCard
          title="Completed Orders"
          value={stats.orders.completed}
          icon={<RectangleStackIcon className="w-6 h-6" />}
          color="green"
          delay={0.4}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats.revenue.total)}
          icon={<CurrencyDollarIcon className="w-6 h-6" />}
          color="green"
          delay={0.5}
        />
        <StatsCard
          title="Categories"
          value={stats.categories.total}
          icon={<TagIcon className="w-6 h-6" />}
          color="orange"
          delay={0.6}
        />
        <StatsCard
          title="Products"
          value={stats.products.total}
          icon={<CubeIcon className="w-6 h-6" />}
          color="purple"
          delay={0.7}
        />
        <StatsCard
          title="Cancelled Orders"
          value={stats.orders.cancelled}
          icon={<RectangleStackIcon className="w-6 h-6" />}
          color="red"
          delay={0.8}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <QuickActionCard
            title="Restaurants"
            description="Manage restaurants"
            icon={<BuildingStorefrontIcon className="w-6 h-6" />}
            href="/dashboard/restaurants"
            color="green"
            delay={0}
          />
          <QuickActionCard
            title="Categories"
            description="Manage categories"
            icon={<TagIcon className="w-6 h-6" />}
            href="/dashboard/categories"
            color="orange"
            delay={0.1}
          />
          <QuickActionCard
            title="Products"
            description="Manage products"
            icon={<CubeIcon className="w-6 h-6" />}
            href="/dashboard/products"
            color="purple"
            delay={0.2}
          />
          <QuickActionCard
            title="Orders"
            description="View & manage orders"
            icon={<RectangleStackIcon className="w-6 h-6" />}
            href="/dashboard/orders"
            color="yellow"
            delay={0.3}
          />
          <QuickActionCard
            title="Users"
            description="View all users"
            icon={<UserGroupIcon className="w-6 h-6" />}
            href="/dashboard/users"
            color="blue"
            delay={0.4}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"
      >
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Completed</span>
              <span className="font-semibold text-green-600 text-sm sm:text-base">{stats.orders.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Pending</span>
              <span className="font-semibold text-yellow-600 text-sm sm:text-base">{stats.orders.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Cancelled</span>
              <span className="font-semibold text-red-600 text-sm sm:text-base">{stats.orders.cancelled}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Total Users</span>
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{stats.users.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Total Restaurants</span>
              <span className="font-semibold text-gray-900 text-sm sm:text-base">{stats.restaurants.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm sm:text-base">Total Revenue</span>
              <span className="font-semibold text-green-600 text-sm sm:text-base">{formatCurrency(stats.revenue.total)}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

