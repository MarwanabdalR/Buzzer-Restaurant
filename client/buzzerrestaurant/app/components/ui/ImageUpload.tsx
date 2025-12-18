'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';
import { PencilIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage?: string | null;
  onUploadComplete: (url: string) => void;
  onError?: (error: string) => void;
  size?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onUploadComplete,
  onError,
  size = 120,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, progress, error } = useCloudinaryUpload();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const displayImage = uploadedImageUrl || currentImage;

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onError) onError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (onError) onError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    const url = await upload(file);
    if (url) {
      setUploadedImageUrl(url);
      onUploadComplete(url);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="relative">
      <div
        className="relative rounded-full overflow-hidden cursor-pointer"
        style={{ width: `${size}px`, height: `${size}px` }}
        onClick={handleClick}
      >
        {displayImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displayImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}

        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="white"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
                  {progress}%
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className="absolute bottom-0 right-0 bg-[#4d0d0d] text-white rounded-full p-2 shadow-lg hover:bg-[#5a1515] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ transform: 'translate(25%, 25%)' }}
      >
        <PencilIcon className="w-4 h-4" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};

