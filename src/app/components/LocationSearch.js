'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from '../contexts/LocationContext';

export default function LocationSearch() {
  const { location, updateLocation, detectUserLocation } = useLocation();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const autocompleteService = useRef(null);
  const geocoderService = useRef(null);

  // Initialize Google Places Autocomplete Service
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      geocoderService.current = new window.google.maps.Geocoder();
    }
  }, []);

  // Sync input value with detected location address
  useEffect(() => {
    if (location.address && location.address !== 'Fetching address...') {
      setInputValue(location.address);
    }
  }, [location.address]);

  // Fetch place predictions from Google Places API
  useEffect(() => {
    if (!inputValue || inputValue.length < 3) {
      setOptions([]);
      return;
    }

    // Don't search if it matches current location
    if (inputValue === location.address) {
      setOptions([]);
      return;
    }

    if (!autocompleteService.current) {
      console.error('Google Places API not loaded');
      return;
    }

    setLoading(true);

    const request = {
      input: inputValue,
      types: ['geocode', 'establishment'],
    };

    autocompleteService.current.getPlacePredictions(request, (predictions, status) => {
      setLoading(false);

      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setOptions(predictions);
      } else {
        setOptions([]);
      }
    });
  }, [inputValue, location.address]);

  // Geocode selected place to get lat/lng coordinates
  const handlePlaceSelect = (event, value) => {
    if (!value || !geocoderService.current) return;

    geocoderService.current.geocode({ placeId: value.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const lat = results[0].geometry.location.lat();
        const lng = results[0].geometry.location.lng();
        const address = results[0].formatted_address;

        updateLocation(lat, lng, address);
        setInputValue(address);
      } else {
        console.error('Geocoding failed:', status);
      }
    });
  };

  const handleDetectLocation = () => {
    setInputValue('');
    setOptions([]);
    detectUserLocation();
  };

  const handleClearLocation = () => {
    setInputValue('');
    setOptions([]);
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(event, newValue) => {
        if (event && event.type === 'change') {
          setInputValue(newValue);
        }
      }}
      onChange={handlePlaceSelect}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.description)}
      filterOptions={(x) => x}
      PaperComponent={(props) => (
        <Paper
          {...props}
          elevation={3}
          sx={{
            borderRadius: 2,
            mt: 1,
            '& .MuiAutocomplete-listbox': {
              maxHeight: '280px',
              '& .MuiAutocomplete-option': {
                py: 1.5,
                px: 2,
              },
            },
          }}
        />
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={
            location.isLoading 
              ? 'Detecting your location...' 
              : location.address || 'Search location...'
          }
          variant="outlined"
          sx={{
            minWidth: { xs: '200px', md: '320px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'white',
              fontSize: '15px',
              fontFamily: 'var(--font-poppins)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(3, 113, 102, 0.12)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 12px rgba(3, 113, 102, 0.2)',
              },
            },
            '& .MuiInputBase-input': {
              color: location.address && !inputValue ? 'text.secondary' : 'text.primary',
            },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon 
                  sx={{ 
                    color: location.latitude ? 'primary.main' : 'text.secondary',
                    transition: 'color 0.3s ease',
                  }} 
                />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {location.isLoading && (
                  <CircularProgress size={20} sx={{ mr: 1, color: 'primary.main' }} />
                )}
                {!location.isLoading && loading && (
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                )}
                {inputValue && !location.isLoading && (
                  <IconButton 
                    size="small" 
                    onClick={handleClearLocation} 
                    sx={{ mr: 0.5 }}
                    aria-label="Clear location"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton
                  size="small"
                  onClick={handleDetectLocation}
                  disabled={location.isLoading}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(3, 113, 102, 0.08)',
                    },
                    '&.Mui-disabled': {
                      color: 'text.disabled',
                    },
                  }}
                  title="Detect my location"
                  aria-label="Detect my location"
                >
                  <MyLocationIcon fontSize="small" />
                </IconButton>
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        
        return (
          <Box
            key={key}
            component="li"
            {...otherProps}
            sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}
          >
            <LocationOnIcon sx={{ color: 'text.secondary', mt: 0.5, fontSize: 20 }} />
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'var(--font-poppins)',
                  fontWeight: 500,
                  color: 'text.primary',
                }}
              >
                {option.structured_formatting.main_text}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'var(--font-poppins)',
                  color: 'text.secondary',
                }}
              >
                {option.structured_formatting.secondary_text}
              </Typography>
            </Box>
          </Box>
        );
      }}
    />
  );
}
