'use client';

import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { locationCache } from '../utilis/locationCache';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocation] = useState(() => {
    // Initialize from cache on mount (only runs client-side)
    if (typeof window !== 'undefined') {
      const cached = locationCache.load();
      if (cached) {
        return {
          latitude: cached.latitude,
          longitude: cached.longitude,
          address: cached.address || '',
          isLoading: false,
          error: null,
          isCached: true,
        };
      }
    }

    return {
      latitude: null,
      longitude: null,
      address: '',
      isLoading: false,
      error: null,
      isCached: false,
    };
  });

  // REMOVED: Auto-detection on every mount
  // Now location is only detected when:
  // 1. User explicitly calls detectUserLocation()
  // 2. Cache is stale and permission was previously granted

  // Optional: Check if cache is stale on mount
  useEffect(() => {
    // Only auto-refresh if permission was already granted AND cache is empty
    if (navigator.permissions && !location.latitude) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          const cached = locationCache.load();
          if (!cached) {
            // Permission granted but no cache - silently refresh
            detectUserLocation();
          }
        }
      });
    }
  }, []); // Run only once on mount

  // Reverse geocode (debounced - only when explicitly needed)
  const reverseGeocode = useCallback((latitude, longitude) => {
    if (!window.google || !window.google.maps) {
      return Promise.reject('Google Maps not loaded');
    }

    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: latitude, lng: longitude };

    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject('Unable to get address');
        }
      });
    });
  }, []);

  // Detect user's current location
  const detectUserLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
      }));
      return;
    }

    setLocation(prev => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Check if location changed significantly
        const cached = locationCache.load();
        if (cached && !locationCache.shouldRefresh(latitude, longitude)) {
          // Use cached address if location hasn't moved much
          setLocation({
            latitude,
            longitude,
            address: cached.address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            isLoading: false,
            error: null,
            isCached: true,
          });
          
          // Update cache timestamp
          locationCache.save({
            latitude,
            longitude,
            address: cached.address,
          });
          return;
        }

        // Location moved significantly or no cache - set coordinates first
        const newLocation = {
          latitude,
          longitude,
          address: '', // Empty initially - will be fetched async
          isLoading: false,
          error: null,
          isCached: false,
        };

        setLocation(newLocation);
        locationCache.save(newLocation);

        // Fetch address in background (non-blocking)
        try {
          const address = await reverseGeocode(latitude, longitude);
          const updatedLocation = { ...newLocation, address };
          setLocation(updatedLocation);
          locationCache.save(updatedLocation);
        } catch (error) {
          // Silently fail address fetch - coordinates are more important
          console.warn('Address fetch failed:', error);
        }
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';

        if (error.code === 1) {
          errorMessage = 'Location access denied. Please enable location in settings.';
        } else if (error.code === 2) {
          errorMessage = 'Location information is unavailable.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out.';
        }

        setLocation(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Don't use browser's internal cache
      }
    );
  }, [reverseGeocode]);

  // Update location manually (from search or map selection)
  const updateLocation = useCallback((latitude, longitude, address) => {
    const newLocation = {
      latitude,
      longitude,
      address,
      isLoading: false,
      error: null,
      isCached: false,
    };
    
    setLocation(newLocation);
    locationCache.save(newLocation);
  }, []);

  // Clear location and cache
  const clearLocation = useCallback(() => {
    setLocation({
      latitude: null,
      longitude: null,
      address: '',
      isLoading: false,
      error: null,
      isCached: false,
    });
    locationCache.clear();
  }, []);

  // Refresh location (force re-detection)
  const refreshLocation = useCallback(() => {
    locationCache.clear();
    detectUserLocation();
  }, [detectUserLocation]);

  const contextValue = useMemo(
    () => ({
      location,
      detectUserLocation,
      updateLocation,
      clearLocation,
      refreshLocation,
      hasLocation: Boolean(location.latitude && location.longitude),
    }),
    [location, detectUserLocation, updateLocation, clearLocation, refreshLocation]
  );

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}

// Custom hook
export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}
