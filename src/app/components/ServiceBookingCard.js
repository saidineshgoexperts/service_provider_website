'use client';

import { Box, Typography, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DateTimePicker from './DateTimePicker';
import dayjs from 'dayjs';
import { useBooking } from '../contexts/BookingContext';
import { Snackbar, Alert } from '@mui/material';

export default function ServiceBookingCard({ service }) {
  const router = useRouter();
  const { updateBooking } = useBooking();
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('error');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const storeData = service?.storeData;

  // ✅ Get location from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Get location from localStorage using the correct key
      const storedLocationData = localStorage.getItem('DoorstepHub_user_location');

      if (storedLocationData) {
        const parsedLocation = JSON.parse(storedLocationData);
        console.log('📍 Location from localStorage:', parsedLocation);

        // Extract location details from the stored object
        const locationDetails = {
          latitude: parsedLocation.latitude,
          longitude: parsedLocation.longitude,
          address: parsedLocation.address,
          timestamp: parsedLocation.timestamp,
        };

        setUserLocation(locationDetails);
        console.log('✅ Location extracted and set:', locationDetails);
      } else {
        console.warn('⚠️ No location found in localStorage');
        showToast('Location not available. Please enable location access.', 'warning');
      }
    } catch (error) {
      console.error('❌ Error reading location from localStorage:', error);
      showToast('Error loading location data', 'error');
    } finally {
      setLocationLoading(false);
    }
  }, []);

  const showToast = (message, severity = 'error') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleDateTimeConfirm = (dateTime) => {
    setSelectedDateTime(dateTime);

    const year = dateTime.month.getFullYear();
    const month = dateTime.month.getMonth() + 1;
    const day = dateTime.date;

    const combined = `${year}-${month}-${day} ${dateTime.time}`;
    const dateObj = dayjs(combined, 'YYYY-M-D h:mm A');

    const bookedDate = dateObj.format('YYYY-MM-DD');
    const bookedTime = dateObj.format('hh:mm A');

    // 1️⃣ Update CONTEXT
    updateBooking({
      bookedDate,
      bookedTime,
    });

    // 2️⃣ Persist in LOCAL STORAGE
    const existingBooking = JSON.parse(localStorage.getItem('currentBooking')) || {};

    localStorage.setItem(
      'currentBooking',
      JSON.stringify({
        ...existingBooking,
        bookedDate,
        bookedTime,
      })
    );

    console.log('✅ Stored in context & localStorage:', {
      bookedDate,
      bookedTime,
    });

    // Show success toast
    showToast('Date & time selected successfully!', 'success');
  };

  const handleSendBookingRequest = () => {
    if (!selectedDateTime) {
      // 1️⃣ Show toaster first
      showToast('Please select date and time', 'error');

      // 2️⃣ Then open modal after a short delay
      setTimeout(() => {
        setOpenDatePicker(true);
      }, 500);
      return;
    }

    // Check if location exists
    if (!userLocation) {
      // 1️⃣ Show toaster first
      showToast('Location not found. Please enable location access.', 'warning');

      // 2️⃣ Don't proceed
      return;
    }

    const serviceBookingCost = storeData?.serviceBookingCost || 0;

    // 1️⃣ Update CONTEXT
    updateBooking({
      serviceBookingCost,
      userLocation: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        address: userLocation.address,
      },
    });

    // 2️⃣ Persist in LOCAL STORAGE
    const existingBooking = JSON.parse(localStorage.getItem('currentBooking')) || {};

    const updatedBooking = {
      ...existingBooking,
      serviceBookingCost,
      userLocation: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        address: userLocation.address,
      },
    };

    localStorage.setItem('currentBooking', JSON.stringify(updatedBooking));

    console.log('✅ Booking data with location stored:', updatedBooking);
    console.log('📍 Location details:', {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      address: userLocation.address,
    });

    // 3️⃣ Show success toaster first
    showToast('Redirecting to payment...', 'success');

    // 4️⃣ Navigate after delay
    setTimeout(() => {
      router.push('/booking/confirmation');
    }, 1500);
  };

  return (
    <>
      <Box
        sx={{
          width: { xs: '100%', md: '463px' },
          minHeight: { xs: 'auto', md: '309px' },
          backgroundColor: 'white',
          borderRadius: { xs: '8px', md: '12px' },
          p: { xs: '16px', md: '24px' },
          border: '1px solid #E5E7EB',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: '16px', md: '20px' },
        }}
      >
        {/* Service Title */}
        <Typography
          variant="h5"
          sx={{
            fontFamily: 'var(--font-inter)',
            fontWeight: 700,
            color: '#1F2937',
            fontSize: { xs: '14px', sm: '16px', md: '20px' },
            lineHeight: 1.3,
          }}
        >
          {storeData?.name || 'Service Name'} | Hyderabad
        </Typography>

        {/* Stats Row - Responsive Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: { xs: 1, md: 2 },
          }}
        >
          {/* Rating */}
          <Box
            sx={{
              textAlign: 'center',
              flex: 1,
              backgroundColor: '#F9FAFB',
              borderRadius: { xs: '6px', md: '8px' },
              py: { xs: 1, md: 1.5 },
              px: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 0.3, md: 0.5 } }}>
              <StarIcon sx={{ fontSize: { xs: '16px', md: '20px' }, color: '#037166' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                color: '#037166',
                fontSize: { xs: '14px', md: '18px' },
              }}
            >
              {storeData?.avgRating || '4.5'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'var(--font-inter)',
                color: '#6B7280',
                fontSize: { xs: '10px', md: '12px' },
                display: 'block',
                mt: 0.3,
              }}
            >
              {storeData?.totalRatings || '22'}+ ratings
            </Typography>
          </Box>

          {/* Jobs Done */}
          <Box
            sx={{
              textAlign: 'center',
              flex: 1,
              backgroundColor: '#F9FAFB',
              borderRadius: { xs: '6px', md: '8px' },
              py: { xs: 1, md: 1.5 },
              px: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 0.3, md: 0.5 } }}>
              <CheckCircleIcon sx={{ fontSize: { xs: '16px', md: '20px' }, color: '#037166' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                color: '#037166',
                fontSize: { xs: '14px', md: '18px' },
              }}
            >
              {storeData?.totalOrders || '53'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'var(--font-inter)',
                color: '#6B7280',
                fontSize: { xs: '10px', md: '12px' },
                display: 'block',
                mt: 0.3,
              }}
            >
              Jobs Done
            </Typography>
          </Box>

          {/* Starting Price */}
          <Box
            sx={{
              textAlign: 'center',
              flex: 1,
              backgroundColor: '#F9FAFB',
              borderRadius: { xs: '6px', md: '8px' },
              py: { xs: 1, md: 1.5 },
              px: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: { xs: 0.3, md: 0.5 } }}>
              <CurrencyRupeeIcon sx={{ fontSize: { xs: '16px', md: '20px' }, color: '#037166' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                color: '#037166',
                fontSize: { xs: '14px', md: '18px' },
              }}
            >
              ₹{storeData?.serviceBookingCost || '0'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontFamily: 'var(--font-inter)',
                color: '#6B7280',
                fontSize: { xs: '10px', md: '12px' },
                display: 'block',
                mt: 0.3,
              }}
            >
              Starting
            </Typography>
          </Box>
        </Box>




        {/* Location Loading State */}
        {locationLoading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, md: 1.5 },
              backgroundColor: '#F3F4F6',
              p: { xs: 1.5, md: 2 },
              borderRadius: { xs: '6px', md: '8px' },
              border: '1px solid #D1D5DB',
            }}
          >
            <Box sx={{ fontSize: '16px' }}>⏳</Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                fontSize: { xs: '12px', md: '13px' },
                color: '#6B7280',
                fontWeight: 500,
              }}
            >
              Loading location...
            </Typography>
          </Box>
        )}

        {/* Date Selection & Booking Button */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, md: 2 },
            flexDirection: { xs: 'column', sm: 'row' },
          }}
        >
          <Box
            onClick={() => setOpenDatePicker(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-start' },
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <CalendarTodayIcon sx={{ color: '#037166', fontSize: { xs: '18px', md: '20px' } }} />
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                fontSize: { xs: '13px', md: '14px' },
                color: '#6B7280',
                fontWeight: 500,
              }}
            >
              Select Date
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleSendBookingRequest}
            disabled={locationLoading}
            sx={{
              height: { xs: '44px', md: '48px' },
              width: { xs: '100%', sm: '65%' },
              borderRadius: { xs: '6px', md: '8px' },
              backgroundColor: '#037166',
              color: 'white',
              fontFamily: 'var(--font-inter)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '14px', md: '16px' },
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#025951',
                boxShadow: '0 4px 12px rgba(3, 113, 102, 0.3)',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
              '&:disabled': {
                backgroundColor: '#BDBDBD',
                cursor: 'not-allowed',
              },
            }}
          >
            Send Request
          </Button>
        </Box>

        {/* Selected Date & Time Display */}
        <Typography
          onClick={() => setOpenDatePicker(true)}
          sx={{
            fontFamily: 'var(--font-inter)',
            fontSize: { xs: '14px', md: '16px' },
            fontWeight: 600,
            color: '#037166',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            textAlign: { xs: 'center', md: 'left' },
            '&:hover': {
              textDecoration: 'underline',
              opacity: 0.8,
            },
          }}
        >
          {selectedDateTime
            ? ` ${selectedDateTime.date} ${new Date(selectedDateTime.month).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  year: 'numeric',
                }
              )} at ${selectedDateTime.time}`
            : 'Select Date & Time'}
        </Typography>

        {/* Offer Banner */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.75, md: 1 },
            backgroundColor: '#E0F2FE',
            p: { xs: '12px', md: '1rem' },
            borderRadius: { xs: '6px', md: '8px' },
            border: '1px solid #B3E5FC',
          }}
        >
          <LocalOfferIcon sx={{ color: '#0284C7', fontSize: { xs: '18px', md: '18px' }, flexShrink: 0 }} />
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'var(--font-inter)',
              color: '#0284C7',
              fontWeight: 500,
              fontSize: { xs: '12px', md: '14px' },
            }}
          >
            Get 2% off up to ₹15
          </Typography>
        </Box>
      </Box>

      {/* Date & Time Picker Modal */}
      <DateTimePicker
        open={openDatePicker}
        onClose={() => setOpenDatePicker(false)}
        onConfirm={handleDateTimeConfirm}
      />

      {/* Toaster/Snackbar - Top Right Corner */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiSnackbar-root': {
            marginTop: { xs: 1, md: 2 },
            marginRight: { xs: 1, md: 2 },
          },
          '& .MuiSnackbarContent-root': {
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: { xs: '280px', sm: '350px' },
          },
        }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{
            fontFamily: 'var(--font-inter)',
            fontWeight: 500,
            fontSize: { xs: '12px', md: '14px' },
            borderRadius: '8px',
            width: '100%',
          }}
          icon={
            toastSeverity === 'success' ? (
              <CheckCircleIcon sx={{ fontSize: { xs: 18, md: 20 } }} />
            ) : toastSeverity === 'warning' ? (
              <Box sx={{ fontSize: { xs: 18, md: 20 } }}>⚠️</Box>
            ) : (
              undefined
            )
          }
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
