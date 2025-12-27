'use client';

import { Box, Button, Typography, CircularProgress } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useLocation } from '@/contexts/LocationContext';

export default function LocationPicker() {
  const { location, detectUserLocation, refreshLocation, hasLocation } = useLocation();

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
      {!hasLocation ? (
        <Button
          variant="contained"
          startIcon={<LocationOnIcon />}
          onClick={detectUserLocation}
          disabled={location.isLoading}
        >
          {location.isLoading ? <CircularProgress size={20} /> : 'Detect My Location'}
        </Button>
      ) : (
        <Box>
          <Typography variant="body2" color="text.secondary">
            Current Location {location.isCached && '(Cached)'}:
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {location.address || `${location.latitude}, ${location.longitude}`}
          </Typography>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={refreshLocation}
            sx={{ mt: 1 }}
          >
            Refresh
          </Button>
        </Box>
      )}

      {location.error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {location.error}
        </Typography>
      )}
    </Box>
  );
}
