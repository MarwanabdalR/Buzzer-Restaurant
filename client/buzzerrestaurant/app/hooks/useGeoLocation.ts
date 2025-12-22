'use client';

import { useState, useCallback, useRef } from 'react';

interface Location {
  lat: number;
  lng: number;
}

interface UseGeoLocationReturn {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<Location>;
  stopLocationSearch: () => void;
  clearLocation: () => void;
}

export const useGeoLocation = (): UseGeoLocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const resolveRef = useRef<((location: Location) => void) | null>(null);

  const getCurrentLocation = useCallback((): Promise<Location> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      // Default fallback location (Cairo, Egypt)
      const defaultLocation: Location = {
        lat: 30.0444,
        lng: 31.2357,
      };

      if (!navigator.geolocation) {
        console.warn('Geolocation is not supported by your browser. Using default location (Cairo).');
        setLocation(defaultLocation);
        setError(null);
        resolve(defaultLocation);
        resolveRef.current = null;
        return;
      }

      setIsLoading(true);
      setError(null);

      // Optimized options for speed and reliability
      const options: PositionOptions = {
        enableHighAccuracy: false, // Prioritize speed over precision to avoid timeouts
        timeout: 15000, // 15 seconds timeout
        maximumAge: 10000, // Accept cached positions from the last 10 seconds
      };

      // Use watchPosition and store watchId in ref so we can cancel it
      const id = navigator.geolocation.watchPosition(
        (position) => {
          // Clear the watch after getting the first position
          if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
          }
          
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(loc);
          setIsLoading(false);
          if (resolveRef.current) {
            resolveRef.current(loc);
            resolveRef.current = null;
          }
        },
        (err) => {
          // Clear the watch on error
          if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
          }
          
          let errorMessage = 'Unable to retrieve your location';
          
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Using default location (Cairo).';
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Using default location (Cairo).';
              break;
            case err.TIMEOUT:
              errorMessage = 'Location request timed out. Using default location (Cairo).';
              break;
            default:
              errorMessage = 'An unknown error occurred while retrieving location. Using default location (Cairo).';
              break;
          }

          // Fallback to default location instead of rejecting
          console.warn(`Geolocation error (${err.code}): ${errorMessage}`);
          setLocation(defaultLocation);
          setError(null); // Don't set error state to avoid breaking UI
          setIsLoading(false);
          if (resolveRef.current) {
            resolveRef.current(defaultLocation);
            resolveRef.current = null;
          }
        },
        options
      );
      
      watchIdRef.current = id;
    });
  }, []);

  const stopLocationSearch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    // Use default location when user stops the search
    const defaultLocation: Location = {
      lat: 30.0444,
      lng: 31.2357,
    };
    
    setIsLoading(false);
    setError(null);
    setLocation(defaultLocation);
    
    // Resolve the pending promise with default location
    if (resolveRef.current) {
      resolveRef.current(defaultLocation);
      resolveRef.current = null;
    }
  }, []);

  const clearLocation = useCallback(() => {
    stopLocationSearch();
    setLocation(null);
    setError(null);
  }, [stopLocationSearch]);

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    stopLocationSearch,
    clearLocation,
  };
};

