'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImageUpload } from '../ui/ImageUpload';
import { useCategories } from '../../hooks/useCategories';
import { useRestaurants } from '../../hooks/useRestaurant';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must not exceed 200 characters'),
  description: z.string().optional().or(z.literal('')),
  price: z.string().min(1, 'Price is required').refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Price must be a positive number',
  }),
  originalPrice: z.string().optional().or(z.literal('')).refine((val) => {
    if (!val || val === '') return true;
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, {
    message: 'Original price must be a positive number',
  }),
  imageUrl: z.string().optional().or(z.literal('')),
  rate: z.number().min(0).max(5).optional().or(z.null()),
  isFeatured: z.boolean().optional().default(false),
  categoryId: z.string().min(1, 'Category is required'),
  restaurantId: z.string().optional().or(z.literal('')),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    name?: string;
    description?: string | null;
    price?: string;
    originalPrice?: string | null;
    discountPercent?: number | null;
    image?: string | null;
    rate?: number | null;
    isFeatured?: boolean;
    categoryId?: number;
    restaurantId?: string | null;
  };
  loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false,
}) => {
  const { data: categories = [] } = useCategories();
  const { data: restaurants = [] } = useRestaurants();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || '',
      originalPrice: initialData?.originalPrice || '',
      imageUrl: initialData?.image || '',
      rate: initialData?.rate || null,
      isFeatured: initialData?.isFeatured || false,
      categoryId: initialData?.categoryId?.toString() || '',
      restaurantId: initialData?.restaurantId || '',
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name || '');
      setValue('description', initialData.description || '');
      setValue('price', initialData.price || '');
      setValue('originalPrice', initialData.originalPrice || '');
      setValue('imageUrl', initialData.image || '');
      setValue('rate', initialData.rate || null);
      setValue('isFeatured', initialData.isFeatured || false);
      setValue('categoryId', initialData.categoryId?.toString() || '');
      setValue('restaurantId', initialData.restaurantId || '');
    }
  }, [initialData, setValue]);

  const handleImageUpload = (url: string) => {
    setValue('imageUrl', url, { shouldValidate: true });
  };

  const handleImageError = (error: string) => {
    console.error('Image upload error:', error);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit({
      ...data,
      rate: data.rate ?? null,
      categoryId: data.categoryId,
      restaurantId: data.restaurantId || null,
      originalPrice: data.originalPrice || null,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
          Product Image
        </label>
        <div className="flex justify-center mb-4">
          <ImageUpload
            currentImage={imageUrl || null}
            onUploadComplete={handleImageUpload}
            onError={handleImageError}
            size={120}
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent transition-all"
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="categoryId"
            {...register('categoryId')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent transition-all"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant
          </label>
          <select
            id="restaurantId"
            {...register('restaurantId')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent transition-all"
          >
            <option value="">Select restaurant (optional)</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
          {errors.restaurantId && (
            <p className="mt-1 text-sm text-red-600">{errors.restaurantId.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent transition-all"
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Price after discount <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="price"
            {...register('price')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent transition-all"
            placeholder="0.00"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Original Price
          </label>
          <input
            type="text"
            id="originalPrice"
            {...register('originalPrice')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent transition-all"
            placeholder="0.00"
          />
          {errors.originalPrice && (
            <p className="mt-1 text-sm text-red-600">{errors.originalPrice.message}</p>
          )}
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rate" className="block text-sm font-medium text-gray-700 mb-2">
            Rating (0-5)
          </label>
          <input
            type="number"
            id="rate"
            step="0.1"
            min="0"
            max="5"
            {...register('rate', { valueAsNumber: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent transition-all"
            placeholder="0.0"
          />
          {errors.rate && (
            <p className="mt-1 text-sm text-red-600">{errors.rate.message}</p>
          )}
        </div>

        <div className="flex items-center pt-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('isFeatured')}
              className="w-5 h-5 text-[#4d0d0d] border-gray-300 rounded focus:ring-2 focus:ring-[#4d0d0d]"
            />
            <span className="text-sm font-medium text-gray-700">Featured Product</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-[#4d0d0d] text-white px-6 py-3 rounded-lg hover:bg-[#5a1515] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

