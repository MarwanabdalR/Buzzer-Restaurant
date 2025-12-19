'use client';

import { useState, useCallback } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface UseGeoLocationReturn {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<Location>;
  clearLocation: () => void;
}

export const useGeoLocation = (): UseGeoLocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback((): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMsg = 'Geolocation is not supported by your browser';
        setError(errorMsg);
        reject(new Error(errorMsg));
        return;
      }

      setIsLoading(true);
      setError(null);

      // Use more lenient options for better compatibility
      const options: PositionOptions = {
        enableHighAccuracy: false, // Set to false for faster results and better compatibility
        timeout: 20000, // Increased to 20 seconds
        maximumAge: 60000, // Accept cached location data up to 1 minute old
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(loc);
          setIsLoading(false);
          resolve(loc);
        },
        (err) => {
          let errorMessage = 'Unable to retrieve your location';
          
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location permissions in your browser settings and try again.';
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please check your device settings or try again later.';
              break;
            case err.TIMEOUT:
              errorMessage = 'Location request timed out. This might take longer on slower devices. Please check your internet connection and try again.';
              break;
            default:
              errorMessage = 'An unknown error occurred while retrieving location. Please try again.';
              break;
          }

          setError(errorMessage);
          setIsLoading(false);
          reject(new Error(errorMessage));
        },
        options
      );
    });
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    clearLocation,
  };
};

