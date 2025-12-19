'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { AdminTable, Column } from '../../components/admin/AdminTable';
import { useProduct } from '../../context/ProductContext';
import { useAdminModal } from '../../context/AdminModalContext';
import { Product } from '../../types/product';

export default function ProductsPage() {
  const { products, isLoading, deleteProduct } = useProduct();
  const { openProductModal } = useAdminModal();

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product.id);
      toast.success('Product deleted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    openProductModal('edit', product);
  };

  const handleAddNew = () => {
    openProductModal('create');
  };

  const columns: Column<Product>[] = [
    {
      key: 'image',
      header: 'Image',
      render: (product) => (
        <div className="w-16 h-16 rounded-lg overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
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
      render: (product) => (
        <span className="font-semibold text-gray-900">{product.name}</span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (product) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
          {product.category?.name || 'N/A'}
        </span>
      ),
    },
    {
      key: 'restaurant',
      header: 'Restaurant',
      render: (product) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
          {product.restaurant?.name || 'N/A'}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (product) => {
        const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">EGP {parseFloat(product.price).toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                EGP {parseFloat(product.originalPrice!).toFixed(2)}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'rate',
      header: 'Rating',
      render: (product) => (
        <span className="font-semibold text-gray-900">
          {product.rate ? product.rate.toFixed(1) : 'N/A'} ⭐
        </span>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (product) => (
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
          product.isFeatured 
            ? 'bg-[#FFB800] text-[#4d0d0d]' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {product.isFeatured ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage all products</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#4d0d0d] text-white px-4 py-3 rounded-lg hover:bg-[#5a1515] transition-colors font-semibold text-sm sm:text-base"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Product</span>
        </motion.button>
      </div>

      <AdminTable
        data={products}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={isLoading}
        emptyMessage="No products found. Click 'Add Product' to create one."
      />
    </div>
  );
}

