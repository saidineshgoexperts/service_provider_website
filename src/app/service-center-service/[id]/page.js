'use client';

import { Box, Container, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ServiceImageCarousel from '../../components/ServiceImageCarousel';
import ServiceBookingCard from '../../components/ServiceBookingCard';
import ServiceTabs from '../../components/ServiceTabs';
import { useBooking } from '../../contexts/BookingContext';

export default function ServiceCenterServicePage() {
  const params = useParams();
  const { updateBooking } = useBooking();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BOOKING_KEY = 'bookingContext';

  useEffect(() => {
    if (!params.id) return;

    fetchServiceDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // 🔥 Get providerId from bookingContext
      if (typeof window === 'undefined') return;

      const existingBooking = JSON.parse(localStorage.getItem(BOOKING_KEY)) || {};
      const providerId = existingBooking.providerId;

      console.log('📦 Current booking context:', existingBooking);
      console.log('📍 Provider ID:', providerId);
      console.log('📍 Service ID:', params.id);

      // 🔥 Validate we're in SERVICE CENTER FLOW
      if (!providerId) {
        throw new Error('Provider ID not found. Please select a service center first.');
      }

      console.log('📤 Fetching service center service details...');

      // API endpoint
      const apiUrl = 'https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/single_provider_screen';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: providerId,
          serviceId: params.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch service details');
      }

      const result = await response.json();
      console.log('📥 Service center service response:', result);

      if (result.success) {
        setServiceData(result);

        // 🔥 Update bookingContext with BOTH providerId and serviceId
        const updatedBooking = {
          ...existingBooking,
          serviceId: params.id,
          providerId: providerId, // 🔥 Keep providerId for SERVICE CENTER FLOW
          sourceOfLead: 'Website',
        };

        // Update bookingContext
        localStorage.setItem(BOOKING_KEY, JSON.stringify(updatedBooking));
        
        // Also update currentBooking for backward compatibility
        localStorage.setItem('currentBooking', JSON.stringify(updatedBooking));

        // Update context
        updateBooking({
          serviceId: params.id,
          providerId: providerId,
        });

        console.log('✅ SERVICE CENTER FLOW - Booking data updated:', updatedBooking);
        console.log('✅ Provider ID preserved:', providerId);
      } else {
        throw new Error(result.message || 'Failed to load service data');
      }
    } catch (err) {
      console.error('❌ Error fetching service details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          background: 'linear-gradient(180deg, #FDCB6A 0%, #FFFFFF 100%)',
        }}
      >
        <CircularProgress sx={{ color: '#037166' }} />
        <Box sx={{ fontSize: '14px', color: '#6B7280' }}>
          Loading service details...
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #FDCB6A 0%, #FFFFFF 100%)',
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!serviceData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #FDCB6A 0%, #FFFFFF 100%)',
        }}
      >
        Service not found
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FDCB6A 0%, #FFFFFF 100%)',
        pt: '90px',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1440px',
          px: 0,
        }}
      >
        {/* Top Section - Image Carousel and Booking Card */}
        <Box
          sx={{
            position: 'relative',
            height: '466px',
            mb: 4,
          }}
        >
          {/* Image Carousel - Left */}
          <Box
            sx={{
              position: 'absolute',
              top: '35px',
              left: '134px',
              width: '673px',
              height: '448px',
            }}
          >
            <ServiceImageCarousel service={serviceData} />
          </Box>

          {/* Booking Card - Right */}
          <Box
            sx={{
              position: 'absolute',
              top: '35px',
              left: '836px',
              width: '463px',
              height: '309px',
            }}
          >
            <ServiceBookingCard service={serviceData} />
          </Box>
        </Box>

        {/* Tabs Section */}
        <Box
          sx={{
            px: '135px',
            mt: '154px',
          }}
        >
          <ServiceTabs service={serviceData} />
        </Box>
      </Container>
    </Box>
  );
}
