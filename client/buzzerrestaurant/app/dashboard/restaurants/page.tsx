'use client';

import React from 'react';
import { useRestaurants } from '../../context/RestaurantContext';
import { useAdminModal } from '../../context/AdminModalContext';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { AdminTable, Column } from '../../components/admin/AdminTable';
import { Restaurant } from '../../types';

export default function RestaurantsPage() {
  const { restaurants, loading, deleteRestaurant } = useRestaurants();
  const { openRestaurantModal } = useAdminModal();

  const handleDelete = async (restaurant: Restaurant) => {
    if (!confirm(`Are you sure you want to delete "${restaurant.name}"?`)) return;
    try {
      await deleteRestaurant(restaurant.id);
      toast.success('Restaurant deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete restaurant');
    }
  };

  const handleEdit = (restaurant: Restaurant) => {
    openRestaurantModal('edit', restaurant);
  };

  const handleAddNew = () => {
    openRestaurantModal('create');
  };

  const columns: Column<Restaurant>[] = [
    {
      key: 'imageUrl',
      header: 'Image',
      render: (restaurant) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          {restaurant.imageUrl ? (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No image</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Name',
      render: (restaurant) => (
        <span className="font-semibold text-gray-900">{restaurant.name}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (restaurant) => (
        <span className="px-2 py-1 bg-[#4d0d0d]/10 text-[#4d0d0d] rounded-md text-sm font-medium">
          {restaurant.type}
        </span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (restaurant) => (
        <span className="text-gray-600">{restaurant.location}</span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (restaurant) => (
        <span className="font-semibold text-gray-900">{restaurant.rating.toFixed(1)} ⭐</span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage all restaurants</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4d0d0d] text-white px-4 py-3 rounded-lg hover:bg-[#5a1515] transition-colors font-semibold text-sm sm:text-base"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Restaurant</span>
        </motion.button>
      </div>

      <AdminTable
        data={restaurants}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
        emptyMessage="No restaurants found. Click 'Add Restaurant' to create one."
      />
    </div>
  );
}

