// Utility for location caching with expiration and distance-based invalidation
const LOCATION_CACHE_KEY = 'DoorstepHub_user_location';
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes
const SIGNIFICANT_DISTANCE_METERS = 500; // 500m threshold

export const locationCache = {
  // Save location to localStorage
  save(locationData) {
    const cacheEntry = {
      ...locationData,
      timestamp: Date.now(),
    };
    
    try {
      localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(cacheEntry));
    } catch (error) {
      console.warn('Failed to cache location:', error);
    }
  },

  // Load location from localStorage
  load() {
    try {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      if (!cached) return null;

      const data = JSON.parse(cached);
      
      // Check if cache is expired
      if (Date.now() - data.timestamp > CACHE_DURATION_MS) {
        this.clear();
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to load cached location:', error);
      return null;
    }
  },

  // Clear cached location
  clear() {
    try {
      localStorage.removeItem(LOCATION_CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear location cache:', error);
    }
  },

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  },

  // Check if location has moved significantly
  shouldRefresh(newLat, newLon) {
    const cached = this.load();
    if (!cached || !cached.latitude || !cached.longitude) return true;

    const distance = this.calculateDistance(
      cached.latitude,
      cached.longitude,
      newLat,
      newLon
    );

    return distance > SIGNIFICANT_DISTANCE_METERS;
  },
};
