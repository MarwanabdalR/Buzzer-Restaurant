'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { AdminTable, Column } from '../../components/admin/AdminTable';
import { useCategory } from '../../context/CategoryContext';
import { useAdminModal } from '../../context/AdminModalContext';
import { Category } from '../../types/category';

export default function CategoriesPage() {
  const { categories, isLoading, deleteCategory } = useCategory();
  const { openCategoryModal } = useAdminModal();

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;
    try {
      await deleteCategory(category.id);
      toast.success('Category deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    }
  };

  const handleEdit = (category: Category) => {
    openCategoryModal('edit', category);
  };

  const handleAddNew = () => {
    openCategoryModal('create');
  };

  const columns: Column<Category>[] = [
    {
      key: 'image',
      header: 'Image',
      render: (category) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
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
      render: (category) => (
        <span className="font-semibold text-gray-900">{category.name}</span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage product categories</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4d0d0d] text-white px-4 py-3 rounded-lg hover:bg-[#5a1515] transition-colors font-semibold text-sm sm:text-base"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Category</span>
        </motion.button>
      </div>

      <AdminTable
        data={categories}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
        emptyMessage="No categories found. Click 'Add Category' to create one."
      />
    </div>
  );
}

