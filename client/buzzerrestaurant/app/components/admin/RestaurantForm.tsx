'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ImageUpload } from '../ui/ImageUpload';

const restaurantSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must not exceed 200 characters'),
  type: z.string().min(1, 'Type is required').max(100, 'Type must not exceed 100 characters'),
  location: z.string().min(1, 'Location is required').max(500, 'Location must not exceed 500 characters'),
  rating: z.number().min(0, 'Rating must be at least 0').max(5, 'Rating must not exceed 5'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type RestaurantFormData = z.infer<typeof restaurantSchema>;

interface RestaurantFormProps {
  onSubmit: (data: RestaurantFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: {
    name?: string;
    type?: string;
    location?: string;
    rating?: number;
    imageUrl?: string | null;
  };
  loading?: boolean;
}

export const RestaurantForm: React.FC<RestaurantFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RestaurantFormData>({
    resolver: zodResolver(restaurantSchema),
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || '',
      location: initialData?.location || '',
      rating: initialData?.rating || 0,
      imageUrl: initialData?.imageUrl || '',
    },
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name || '');
      setValue('type', initialData.type || '');
      setValue('location', initialData.location || '');
      setValue('rating', initialData.rating || 0);
      setValue('imageUrl', initialData.imageUrl || '');
    }
  }, [initialData, setValue]);

  const handleImageUpload = (url: string) => {
    setValue('imageUrl', url, { shouldValidate: true });
  };

  const handleImageError = (error: string) => {
    console.error('Image upload error:', error);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
          Restaurant Image
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
          placeholder="Enter restaurant name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Type <span className="text-red-500">*</span>
        </label>
        <select
          id="type"
          {...register('type')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent transition-all"
        >
          <option value="">Select type</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Cafe">Cafe</option>
          <option value="Fast Food">Fast Food</option>
          <option value="Bakery">Bakery</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="location"
          {...register('location')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent transition-all"
          placeholder="Enter location"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
          Rating (0-5)
        </label>
        <input
          type="number"
          id="rating"
          step="0.1"
          min="0"
          max="5"
          {...register('rating', { valueAsNumber: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent transition-all"
          placeholder="0.0"
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
        )}
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

