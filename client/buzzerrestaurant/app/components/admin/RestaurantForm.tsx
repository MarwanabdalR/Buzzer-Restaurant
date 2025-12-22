'use client';

import React, { useEffect, useState } from 'react';
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
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
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
    latitude?: number | null;
    longitude?: number | null;
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
      latitude: initialData?.latitude ?? null,
      longitude: initialData?.longitude ?? null,
    },
  });

  const imageUrl = watch('imageUrl');
  const [mapInput, setMapInput] = useState('');
  const [mapInputError, setMapInputError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name || '');
      setValue('type', initialData.type || '');
      setValue('location', initialData.location || '');
      setValue('rating', initialData.rating || 0);
      setValue('imageUrl', initialData.imageUrl || '');
      setValue('latitude', initialData.latitude ?? null);
      setValue('longitude', initialData.longitude ?? null);
      
      // Set map input if coordinates exist
      if (initialData.latitude !== null && initialData.latitude !== undefined && 
          initialData.longitude !== null && initialData.longitude !== undefined) {
        setMapInput(`${initialData.latitude}, ${initialData.longitude}`);
      }
    }
  }, [initialData, setValue]);

  const extractCoordinates = (input: string): { lat: number; lng: number } | null => {
    if (!input || input.trim() === '') {
      return null;
    }

    // Pattern 1: Raw coordinates "30.0444, 31.2357" or "30.0444,31.2357"
    const rawCoordsPattern = /(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/;
    const rawMatch = input.trim().match(rawCoordsPattern);
    if (rawMatch) {
      const lat = parseFloat(rawMatch[1]);
      const lng = parseFloat(rawMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    // Pattern 2: Google Maps URL with @lat,lng (e.g., https://www.google.com/maps/@30.0444,31.2357,15z)
    const googleMapsPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const googleMatch = input.match(googleMapsPattern);
    if (googleMatch) {
      const lat = parseFloat(googleMatch[1]);
      const lng = parseFloat(googleMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    // Pattern 3: Search URL with query parameter (e.g., .../search/?api=1&query=30.0444,31.2357)
    const searchPattern = /[?&]query=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const searchMatch = input.match(searchPattern);
    if (searchMatch) {
      const lat = parseFloat(searchMatch[1]);
      const lng = parseFloat(searchMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }

    return null;
  };

  const handleMapInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMapInput(value);
    setMapInputError(null);

    if (value.trim() === '') {
      setValue('latitude', null);
      setValue('longitude', null);
      return;
    }

    const coords = extractCoordinates(value);
    if (coords) {
      // Validate ranges
      if (coords.lat >= -90 && coords.lat <= 90 && coords.lng >= -180 && coords.lng <= 180) {
        setValue('latitude', coords.lat);
        setValue('longitude', coords.lng);
        setMapInputError(null);
      } else {
        setMapInputError('Invalid coordinate ranges. Latitude must be between -90 and 90, longitude between -180 and 180.');
        setValue('latitude', null);
        setValue('longitude', null);
      }
    } else {
      setMapInputError('Invalid format. Please paste coordinates (e.g., 30.12, 31.45) or a valid map link.');
      setValue('latitude', null);
      setValue('longitude', null);
    }
  };

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
        <label htmlFor="mapInput" className="block text-sm font-medium text-gray-700 mb-2">
          Google Maps Link or Coordinates
        </label>
        <input
          type="text"
          id="mapInput"
          value={mapInput}
          onChange={handleMapInputChange}
          onBlur={handleMapInputChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#4d0d0d] focus:border-transparent transition-all ${
            mapInputError ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Paste coordinates (e.g., 30.04, 31.23) or Google Maps link"
        />
        <p className="mt-1 text-xs text-gray-500 font-thin">
          Tip: Go to Google Maps, Right-Click on the location to copy the coordinates (e.g., 30.04, 31.23) and paste them here. Alternatively, paste a full browser link that contains &apos;@lat,lng&apos;.
        </p>
        {mapInputError && (
          <p className="mt-1 text-sm text-red-600">{mapInputError}</p>
        )}
        {(errors.latitude || errors.longitude) && (
          <p className="mt-1 text-sm text-red-600">
            {errors.latitude?.message || errors.longitude?.message}
          </p>
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

