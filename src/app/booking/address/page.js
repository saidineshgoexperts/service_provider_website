'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MyLocationIcon from '@mui/icons-material/MyLocation';

// Separate component that uses useSearchParams
function AddressForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const [addressType, setAddressType] = useState('Home');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    flat: '',
    area: '',
    addressLineOne: '',
    addressLineTwo: '',
    postalCode: '',
    cityName: '',
    stateName: '',
    latitude: '',
    longitude: '',
    defaultAddress: false,
  });

  useEffect(() => {
    initializeMap();
    if (editId) {
      fetchAddressForEdit(editId);
    }
  }, [editId]);

  const initializeMap = () => {
    if (window.google && mapRef.current) {
      const defaultLocation = { lat: 17.385044, lng: 78.486671 };

      const map = new window.google.maps.Map(mapRef.current, {
        center: defaultLocation,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
      });

      markerRef.current = new window.google.maps.Marker({
        position: defaultLocation,
        map: map,
        draggable: true,
      });

      markerRef.current.addListener('dragend', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setFormData(prev => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
        }));
        reverseGeocode(lat, lng);
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map.setCenter(pos);
            markerRef.current.setPosition(pos);
            setFormData(prev => ({
              ...prev,
              latitude: pos.lat.toString(),
              longitude: pos.lng.toString(),
            }));
            reverseGeocode(pos.lat, pos.lng);
          },
          () => {
            console.log('Location access denied');
          }
        );
      }
    }
  };

  const reverseGeocode = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const addressComponents = results[0].address_components;
        let city = '';
        let state = '';
        let postalCode = '';
        let area = '';

        addressComponents.forEach(component => {
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
          if (component.types.includes('postal_code')) {
            postalCode = component.long_name;
          }
          if (component.types.includes('sublocality')) {
            area = component.long_name;
          }
        });

        setFormData(prev => ({
          ...prev,
          cityName: city,
          stateName: state,
          postalCode: postalCode,
          area: area,
        }));
      }
    });
  };

  const fetchAddressForEdit = async (addressId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/getuseraddress',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        const address = data.data.find(addr => addr._id === addressId);
        if (address) {
          setFormData({
            name: address.name,
            phone: address.phone,
            flat: address.flat,
            area: address.area,
            addressLineOne: address.addressLineOne,
            addressLineTwo: address.addressLineTwo,
            postalCode: address.postalCode,
            cityName: address.cityName,
            stateName: address.stateName,
            latitude: address.latitude,
            longitude: address.longitude,
            defaultAddress: address.defaultAddress,
          });
          setAddressType(address.type || 'Home');

          if (markerRef.current && address.latitude && address.longitude) {
            const pos = {
              lat: parseFloat(address.latitude),
              lng: parseFloat(address.longitude),
            };
            markerRef.current.setPosition(pos);
            markerRef.current.getMap().setCenter(pos);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.phone || !formData.flat || !formData.area || !formData.postalCode) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const url = editId
        ? `https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/edituseraddress/${editId}`
        : 'https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/addaddress';

      const method = editId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type: addressType,
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push('/booking/confirmation');
      } else {
        alert(data.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Error saving address');
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if (markerRef.current) {
            markerRef.current.setPosition(pos);
            markerRef.current.getMap().setCenter(pos);
          }
          setFormData(prev => ({
            ...prev,
            latitude: pos.lat.toString(),
            longitude: pos.lng.toString(),
          }));
          reverseGeocode(pos.lat, pos.lng);
        },
        () => {
          alert('Location access denied');
        }
      );
    }
  };

  return (
    <Box sx={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => router.back()}
            sx={{
              mr: 2,
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'var(--font-poppins)',
              fontWeight: 700,
              color: '#1F2937',
            }}
          >
            {editId ? 'Edit Address' : 'Add New Address'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          <Box sx={{ flex: 1, position: 'relative' }}>
            <Paper
              elevation={0}
              sx={{
                height: { xs: '400px', lg: '600px' },
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
              
              <IconButton
                onClick={handleUseCurrentLocation}
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  backgroundColor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    backgroundColor: '#F3F4F6',
                  },
                }}
              >
                <MyLocationIcon sx={{ color: '#037166' }} />
              </IconButton>
            </Paper>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-poppins)',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#1F2937',
                  mb: 2,
                }}
              >
                Save Address As
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                  variant={addressType === 'Home' ? 'contained' : 'outlined'}
                  startIcon={<HomeIcon />}
                  onClick={() => setAddressType('Home')}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: '10px',
                    fontFamily: 'var(--font-poppins)',
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: addressType === 'Home' ? '#037166' : 'transparent',
                    borderColor: addressType === 'Home' ? '#037166' : '#E5E7EB',
                    color: addressType === 'Home' ? 'white' : '#6B7280',
                    '&:hover': {
                      backgroundColor: addressType === 'Home' ? '#025951' : '#F9FAFB',
                      borderColor: '#037166',
                    },
                  }}
                >
                  Home
                </Button>

                <Button
                  variant={addressType === 'Work' ? 'contained' : 'outlined'}
                  startIcon={<WorkIcon />}
                  onClick={() => setAddressType('Work')}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: '10px',
                    fontFamily: 'var(--font-poppins)',
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: addressType === 'Work' ? '#037166' : 'transparent',
                    borderColor: addressType === 'Work' ? '#037166' : '#E5E7EB',
                    color: addressType === 'Work' ? 'white' : '#6B7280',
                    '&:hover': {
                      backgroundColor: addressType === 'Work' ? '#025951' : '#F9FAFB',
                      borderColor: '#037166',
                    },
                  }}
                >
                  Work
                </Button>

                <Button
                  variant={addressType === 'Other' ? 'contained' : 'outlined'}
                  startIcon={<LocationOnIcon />}
                  onClick={() => setAddressType('Other')}
                  sx={{
                    flex: 1,
                    py: 1.5,
                    borderRadius: '10px',
                    fontFamily: 'var(--font-poppins)',
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: addressType === 'Other' ? '#037166' : 'transparent',
                    borderColor: addressType === 'Other' ? '#037166' : '#E5E7EB',
                    color: addressType === 'Other' ? 'white' : '#6B7280',
                    '&:hover': {
                      backgroundColor: addressType === 'Other' ? '#025951' : '#F9FAFB',
                      borderColor: '#037166',
                    },
                  }}
                >
                  Other
                </Button>
              </Box>

              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: '#374151', mb: 1, fontSize: '14px' }}>
                    Name *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-poppins)' } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: '#374151', mb: 1, fontSize: '14px' }}>
                    Phone *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-poppins)' } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: '#374151', mb: 1, fontSize: '14px' }}>
                    Flat / House No. *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Plot 123, Flat No 401"
                    value={formData.flat}
                    onChange={(e) => handleInputChange('flat', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-poppins)' } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: '#374151', mb: 1, fontSize: '14px' }}>
                    Area *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Madhapur"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-poppins)' } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: '#374151', mb: 1, fontSize: '14px' }}>
                    Address Line 1 *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Near Metro Station"
                    value={formData.addressLineOne}
                    onChange={(e) => handleInputChange('addressLineOne', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-poppins)' } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: '#374151', mb: 1, fontSize: '14px' }}>
                    Address Line 2
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Beside XYZ Mall"
                    value={formData.addressLineTwo}
                    onChange={(e) => handleInputChange('addressLineTwo', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-poppins)' } }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: '#374151', mb: 1, fontSize: '14px' }}>
                    City *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Hyderabad"
                    value={formData.cityName}
                    onChange={(e) => handleInputChange('cityName', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-poppins)' } }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: '#374151', mb: 1, fontSize: '14px' }}>
                    State *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Telangana"
                    value={formData.stateName}
                    onChange={(e) => handleInputChange('stateName', e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-poppins)' } }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Typography sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 600, color: '#374151', mb: 1, fontSize: '14px' }}>
                    Pincode *
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="500081"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', fontFamily: 'var(--font-poppins)' } }}
                  />
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  mt: 4,
                  py: 1.8,
                  borderRadius: '10px',
                  backgroundColor: '#037166',
                  color: 'white',
                  fontFamily: 'var(--font-poppins)',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '16px',
                  boxShadow: '0 4px 12px rgba(3, 113, 102, 0.3)',
                  '&:hover': {
                    backgroundColor: '#025951',
                    boxShadow: '0 6px 16px rgba(3, 113, 102, 0.4)',
                  },
                }}
              >
                {editId ? 'Update Address' : 'Save Address'}
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// Main page component with Suspense wrapper
export default function AddressPage() {
  return (
    <Suspense fallback={
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#F9FAFB'
      }}>
        <Typography sx={{ fontFamily: 'var(--font-poppins)', color: '#6B7280' }}>
          Loading address form...
        </Typography>
      </Box>
    }>
      <AddressForm />
    </Suspense>
  );
}
