'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useBooking } from '../../contexts/BookingContext';

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { bookingData, updateBooking } = useBooking();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');

  const BOOKING_KEY = 'bookingContext';

  useEffect(() => {
    fetchAddresses();

    // 🔥 Hydrate booking context from bookingContext (unified key)
    if (typeof window !== 'undefined') {
      try {
        const savedBooking = localStorage.getItem(BOOKING_KEY);
        if (savedBooking) {
          const parsedBooking = JSON.parse(savedBooking);
          updateBooking(parsedBooking);

          console.log('♻️ Booking hydrated from localStorage:', parsedBooking);
          console.log('📍 Provider ID:', parsedBooking.providerId || 'None (Direct Service Flow)');
          console.log('📍 Service ID:', parsedBooking.serviceId);
        }

        // Also check currentBooking for backward compatibility
        const legacyBooking = localStorage.getItem('currentBooking');
        if (legacyBooking && !savedBooking) {
          const parsedLegacy = JSON.parse(legacyBooking);
          updateBooking(parsedLegacy);
          // Migrate to new key
          localStorage.setItem(BOOKING_KEY, legacyBooking);
          console.log('♻️ Migrated from currentBooking to bookingContext');
        }
      } catch (error) {
        console.error('Error hydrating booking data:', error);
      }
    }
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
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
        const addressList = data.data || [];
        setAddresses(addressList);
        
        // 🔥 Auto-select first address (or default if exists)
        if (addressList.length > 0) {
          const defaultAddr = addressList.find((addr) => addr.defaultAddress);
          const firstAddr = addressList[0];
          const addressToSelect = defaultAddr ? defaultAddr._id : firstAddr._id;
          
          setSelectedAddress(addressToSelect);
          updateBooking({ serviceAddressId: addressToSelect });
          
          console.log('✅ Default address auto-selected:', addressToSelect);
          console.log('📍 Address Details:', defaultAddr || firstAddr);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (id) => {
    setSelectedAddress(id);
    updateBooking({ serviceAddressId: id });
    console.log('✅ Address selected:', id);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/deleteuseraddress/${addressId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        console.log('✅ Address deleted successfully');
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Failed to delete address');
    }
  };

  const handleEditAddress = (addressId) => {
    router.push(`/booking/address?edit=${addressId}`);
  };

  const handleAddNewAddress = () => {
    router.push('/booking/address');
  };

  // 🔥 Updated handlePayAndContinue - Clears providerId from localStorage for Direct Service Flow
  const handlePayAndContinue = async () => {
    // Validate required booking data
    if (!bookingData.serviceId || !bookingData.bookedDate || !bookingData.bookedTime) {
      setError('Missing booking details. Please restart your booking.');
      console.error('❌ Missing booking data:', bookingData);
      return;
    }

    if (!selectedAddress) {
      setError('Please select an address');
      return;
    }

    if (typeof window === 'undefined') return;

    setBookingLoading(true);

    try {
      // Get current booking data from localStorage
      const existingBooking = JSON.parse(localStorage.getItem(BOOKING_KEY)) || {};

      // 🔥 Build updated booking with address
      const updatedBooking = {
        serviceId: bookingData.serviceId || existingBooking.serviceId,
        serviceAddressId: selectedAddress,
        bookedDate: bookingData.bookedDate || existingBooking.bookedDate,
        bookedTime: bookingData.bookedTime || existingBooking.bookedTime,
        sourceOfLead: 'Website',
        serviceBookingCost: bookingData.serviceBookingCost || existingBooking.serviceBookingCost,
        serviceName: bookingData.serviceName || existingBooking.serviceName,
        addMoreInfo: bookingData.addMoreInfo || existingBooking.addMoreInfo || '',
      };

      // 🔥 Handle providerId based on flow - ONLY include if it exists and is not null
      if (
        existingBooking.providerId &&
        existingBooking.providerId !== null &&
        existingBooking.providerId !== 'null'
      ) {
        // Service Center Flow - Keep providerId
        updatedBooking.providerId = existingBooking.providerId;
        console.log('✅ SERVICE CENTER FLOW - Provider ID preserved:', existingBooking.providerId);
      } else {
        // Direct Service Flow - Explicitly DO NOT include providerId
        console.log('✅ DIRECT SERVICE FLOW - Provider ID excluded from payload');
        // Do not set providerId at all - not even to null
      }

      // Update context
      updateBooking(updatedBooking);

      // 🔥 Save to localStorage - Store clean object without providerId for Direct Service
      const storageData = { ...updatedBooking };

      // Only store providerId if it exists in the updated booking
      if (!updatedBooking.providerId) {
        delete storageData.providerId; // Remove completely from storage
      }

      localStorage.setItem(BOOKING_KEY, JSON.stringify(storageData));
      localStorage.setItem('currentBooking', JSON.stringify(storageData));

      console.log('✅ Booking data updated with address:', storageData);
      console.log('📦 Flow Type:', updatedBooking.providerId ? 'Service Center (Flow 2)' : 'Direct Service (Flow 1)');
      console.log('📍 Service ID:', updatedBooking.serviceId);
      console.log('📍 Provider ID:', updatedBooking.providerId || 'NOT INCLUDED ❌');
      console.log('📍 Address ID:', updatedBooking.serviceAddressId);
      console.log('📅 Date/Time:', updatedBooking.bookedDate, updatedBooking.bookedTime);
      console.log('📦 Final Payload Keys:', Object.keys(storageData));
      console.log('📦 Final localStorage:', storageData);

      // Redirect to payment gateway
      router.push('/payment-gateway');
    } catch (error) {
      console.error('Error saving booking data:', error);
      setError('Failed to save booking details. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    console.log('📦 Current Booking Context Data:', bookingData);
  }, [bookingData]);

  const getAddressIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'home':
        return <HomeIcon sx={{ fontSize: { xs: 18, md: 20 }, color: '#037166' }} />;
      case 'work':
        return <WorkIcon sx={{ fontSize: { xs: 18, md: 20 }, color: '#037166' }} />;
      default:
        return <LocationOnIcon sx={{ fontSize: { xs: 18, md: 20 }, color: '#037166' }} />;
    }
  };

  return (
    <Box sx={{ background: 'linear-gradient(180deg, #FDCB6A 0%, #FFFFFF 100%)', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError('')}
            sx={{
              mb: 3,
              fontFamily: 'var(--font-inter)',
              borderRadius: '8px',
              fontWeight: 500,
            }}
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'flex',
            gap: { xs: 2, md: 3 },
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Left Side - Address Selection */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: { xs: '8px', md: '12px' },
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: { xs: 2, sm: 0 },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 700,
                    color: '#1F2937',
                    fontSize: { xs: '16px', md: '18px' },
                  }}
                >
                  Select Address
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddNewAddress}
                  sx={{
                    backgroundColor: '#037166',
                    color: 'white',
                    fontFamily: 'var(--font-inter)',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: { xs: 2, md: 3 },
                    py: { xs: 1, md: 1.2 },
                    borderRadius: '8px',
                    fontSize: { xs: '13px', md: '14px' },
                    width: { xs: '100%', sm: 'auto' },
                    '&:hover': {
                      backgroundColor: '#025951',
                    },
                  }}
                >
                  Add New
                </Button>
              </Box>

              {/* Address List */}
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: '#037166' }} />
                </Box>
              ) : addresses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: '#6B7280',
                      mb: 2,
                      fontSize: { xs: '13px', md: '14px' },
                    }}
                  >
                    No addresses added yet
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddNewAddress}
                    sx={{
                      borderColor: '#037166',
                      color: '#037166',
                      fontFamily: 'var(--font-inter)',
                      textTransform: 'none',
                      fontSize: { xs: '13px', md: '14px' },
                    }}
                  >
                    Add Your First Address
                  </Button>
                </Box>
              ) : (
                <RadioGroup value={selectedAddress} onChange={(e) => handleAddressSelect(e.target.value)}>
                  {addresses.map((address, index) => (
                    <Box key={address._id}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: { xs: 1.5, md: 2 },
                          p: { xs: 1.5, md: 2 },
                          borderRadius: '10px',
                          border:
                            selectedAddress === address._id
                              ? '2px solid #037166'
                              : '1px solid #E5E7EB',
                          backgroundColor:
                            selectedAddress === address._id ? '#F0FDFA' : 'transparent',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: '#037166',
                            backgroundColor: '#F9FAFB',
                          },
                        }}
                        onClick={() => handleAddressSelect(address._id)}
                      >
                        <FormControlLabel
                          value={address._id}
                          control={
                            <Radio
                              sx={{
                                color: '#037166',
                                '&.Mui-checked': {
                                  color: '#037166',
                                },
                                p: { xs: 0.5, md: 1 },
                              }}
                            />
                          }
                          label=""
                          sx={{ m: 0, minWidth: 0 }}
                        />

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          {/* Address Type with Icon */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                            {getAddressIcon(address.type)}
                            <Typography
                              sx={{
                                fontFamily: 'var(--font-inter)',
                                fontWeight: 700,
                                fontSize: { xs: '13px', md: '16px' },
                                color: '#1F2937',
                              }}
                            >
                              {address.name}
                            </Typography>
                            {address.type && (
                              <Box
                                sx={{
                                  backgroundColor: '#E0F2F1',
                                  color: '#037166',
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: '4px',
                                  fontSize: { xs: '10px', md: '12px' },
                                  fontWeight: 600,
                                  fontFamily: 'var(--font-inter)',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {address.type.toUpperCase()}
                              </Box>
                            )}
                          </Box>

                          {/* Full Address */}
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: { xs: '12px', md: '14px' },
                              color: '#6B7280',
                              mb: 0.3,
                              wordBreak: 'break-word',
                            }}
                          >
                            {address.flat}, {address.area}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: { xs: '12px', md: '14px' },
                              color: '#6B7280',
                              mb: 0.3,
                              wordBreak: 'break-word',
                            }}
                          >
                            {address.addressLineOne}
                            {address.addressLineTwo && `, ${address.addressLineTwo}`}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: { xs: '12px', md: '14px' },
                              color: '#6B7280',
                              mb: 0.5,
                              wordBreak: 'break-word',
                            }}
                          >
                            {address.cityName}, {address.stateName} - {address.postalCode}
                          </Typography>

                          {/* Contact */}
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: { xs: '12px', md: '14px' },
                              color: '#1F2937',
                              fontWeight: 600,
                              mt: 0.5,
                            }}
                          >
                             {address.phone}
                          </Typography>
                        </Box>

                        {/* Edit & Remove Buttons */}
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 0.5,
                            flexDirection: { xs: 'column', sm: 'row' },
                            flexShrink: 0,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="small"
                            onClick={() => handleEditAddress(address._id)}
                            sx={{
                              color: '#037166',
                              fontFamily: 'var(--font-inter)',
                              textTransform: 'none',
                              fontSize: { xs: '12px', md: '14px' },
                              fontWeight: 600,
                              minWidth: 'auto',
                              px: { xs: 0.5, md: 1 },
                              '&:hover': {
                                backgroundColor: 'rgba(3, 113, 102, 0.08)',
                              },
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleDeleteAddress(address._id)}
                            sx={{
                              color: '#EF4444',
                              fontFamily: 'var(--font-inter)',
                              textTransform: 'none',
                              fontSize: { xs: '12px', md: '14px' },
                              fontWeight: 600,
                              minWidth: 'auto',
                              px: { xs: 0.5, md: 1 },
                              '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                              },
                            }}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Box>
                      {index < addresses.length - 1 && <Box sx={{ my: 1.5 }} />}
                    </Box>
                  ))}
                </RadioGroup>
              )}
            </Paper>
          </Box>

          {/* Right Side - Booking Summary */}
          <Box sx={{ width: { xs: '100%', md: '350px' } }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: { xs: '8px', md: '12px' },
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                position: { xs: 'static', md: 'sticky' },
                top: { xs: 'auto', md: 20 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  color: '#1F2937',
                  mb: 2.5,
                  fontSize: { xs: '16px', md: '18px' },
                }}
              >
                Booking Details
              </Typography>

              {/* Price */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: { xs: '12px', md: '14px' },
                    color: '#6B7280',
                    mb: 0.5,
                    fontWeight: 500,
                  }}
                >
                  Total Price
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: { xs: '20px', md: '24px' },
                    fontWeight: 700,
                    color: '#037166',
                  }}
                >
                  ₹{bookingData.serviceBookingCost || '0'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Selected Date & Time */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: { xs: '12px', md: '14px' },
                    fontWeight: 600,
                    color: '#1F2937',
                    mb: 1,
                  }}
                >
                  Date & Time
                </Typography>

                <Typography
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: { xs: '12px', md: '14px' },
                    color: '#6B7280',
                    lineHeight: 1.4,
                  }}
                >
                  {bookingData.bookedDate || 'Not selected'} <br />
                  {bookingData.bookedTime || 'Not selected'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Selected Address */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: { xs: '12px', md: '14px' },
                    fontWeight: 600,
                    color: '#1F2937',
                    mb: 1,
                  }}
                >
         
                </Typography>
                {selectedAddress && addresses.find((a) => a._id === selectedAddress) && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      p: 1.5,
                      backgroundColor: '#F9FAFB',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: '#037166',
                        color: 'white',
                        px: 1,
                        py: 0.25,
                        borderRadius: '4px',
                        fontSize: { xs: '10px', md: '12px' },
                        fontWeight: 600,
                        fontFamily: 'var(--font-inter)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      {addresses.find((a) => a._id === selectedAddress)?.type?.toUpperCase()}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: { xs: '12px', md: '13px' },
                          color: '#1F2937',
                          fontWeight: 600,
                          wordBreak: 'break-word',
                        }}
                      >
                        {addresses.find((a) => a._id === selectedAddress)?.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: { xs: '11px', md: '12px' },
                          color: '#6B7280',
                          wordBreak: 'break-word',
                          mt: 0.3,
                        }}
                      >
                        {addresses.find((a) => a._id === selectedAddress)?.flat},{' '}
                        {addresses.find((a) => a._id === selectedAddress)?.area}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Pay & Continue Button */}
              <Button
                fullWidth
                variant="contained"
                onClick={handlePayAndContinue}
                disabled={!selectedAddress || bookingLoading}
                sx={{
                  py: { xs: 1.5, md: 1.8 },
                  borderRadius: '10px',
                  backgroundColor: '#037166',
                  color: 'white',
                  fontFamily: 'var(--font-inter)',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: { xs: '14px', md: '16px' },
                  boxShadow: '0 4px 12px rgba(3, 113, 102, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#025951',
                    boxShadow: '0 6px 16px rgba(3, 113, 102, 0.4)',
                  },
                  '&:disabled': {
                    backgroundColor: '#D1D5DB',
                    cursor: 'not-allowed',
                  },
                }}
              >
                {bookingLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Confirm Booking'
                )}
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
