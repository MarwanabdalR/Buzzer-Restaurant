'use client';

import React, { useState } from 'react';
import { useRestaurants } from '../../../context/RestaurantContext';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function RestaurantsPage() {
  const { restaurants, loading, createRestaurant, updateRestaurant, deleteRestaurant } = useRestaurants();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    rating: 0,
    imageUrl: '',
  });

  const handleCreate = async () => {
    try {
      await createRestaurant(formData);
      toast.success('Restaurant created successfully!');
      setShowCreateModal(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create restaurant');
    }
  };

  const handleUpdate = async () => {
    if (!editingRestaurant) return;
    try {
      await updateRestaurant(editingRestaurant.id, formData);
      toast.success('Restaurant updated successfully!');
      setEditingRestaurant(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update restaurant');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this restaurant?')) return;
    try {
      await deleteRestaurant(id);
      toast.success('Restaurant deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete restaurant');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', type: '', location: '', rating: 0, imageUrl: '' });
  };

  const openEditModal = (restaurant: any) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      type: restaurant.type,
      location: restaurant.location,
      rating: restaurant.rating,
      imageUrl: restaurant.imageUrl || '',
    });
  };

  if (loading) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-600 mt-2">Manage all restaurants</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            resetForm();
            setEditingRestaurant(null);
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 bg-[#4d0d0d] text-white px-4 py-2 rounded-lg hover:bg-[#5a1515] transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Add Restaurant
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          >
            {restaurant.imageUrl && (
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
              <p className="text-sm text-[#4d0d0d] font-medium mb-2">{restaurant.type}</p>
              <p className="text-sm text-gray-600 mb-2">{restaurant.location}</p>
              <p className="text-sm font-semibold text-gray-900 mb-4">Rating: {restaurant.rating.toFixed(1)}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(restaurant)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#FFB800] text-black px-3 py-2 rounded-lg hover:bg-[#E5A700] transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(restaurant.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {(showCreateModal || editingRestaurant) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingRestaurant ? 'Edit Restaurant' : 'Create Restaurant'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingRestaurant ? handleUpdate : handleCreate}
                  className="flex-1 bg-[#4d0d0d] text-white px-4 py-2 rounded-lg hover:bg-[#5a1515] transition-colors"
                >
                  {editingRestaurant ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingRestaurant(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

