'use client';

import { Box, Container, Skeleton } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ServiceImageCarousel from '../../components/ServiceImageCarousel';
import ServiceBookingCard from '../../components/ServiceBookingCard';
import ServiceTabs from '../../components/ServiceTabs';
import { useBooking } from '../../contexts/BookingContext';

export default function ServiceDetailsPage() {
  const params = useParams();
  const { updateBooking } = useBooking();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const BOOKING_KEY = 'bookingContext';

  useEffect(() => {
    if (!params.id) return;

    fetchServiceDetails();

    // IMPORTANT: Verify we're in SERVICE FLOW (no providerId should exist)
    if (typeof window !== 'undefined') {
      try {
        const existingBooking = JSON.parse(localStorage.getItem(BOOKING_KEY)) || {};
        
        // If providerId exists, remove it (we're in service flow now)
        if (existingBooking.providerId) {
          console.warn('⚠️ Found providerId in service flow, removing it');
          delete existingBooking.providerId;
        }

        // Update localStorage with service flow data
        const updatedBooking = {
          ...existingBooking,
          serviceId: params.id,
          sourceOfLead: 'Website',
          // Explicitly set providerId to null for service flow
          providerId: null,
        };

        localStorage.setItem(BOOKING_KEY, JSON.stringify(updatedBooking));
        console.log('✅ SERVICE FLOW - serviceId stored:', params.id);
        console.log('📦 Current booking data:', updatedBooking);

        // Also update your existing currentBooking key if needed for backward compatibility
        localStorage.setItem('currentBooking', JSON.stringify(updatedBooking));

        // Update context
        updateBooking({ serviceId: params.id });
      } catch (error) {
        console.error('Error updating booking data:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      console.log('📤 Fetching service details for ID:', params.id);

      const apiUrl = `https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/dhub_service_details/${params.id}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch service details');
      }

      const result = await response.json();
      console.log('📥 Service details response:', result);

      if (result.success) {
        setServiceData(result);
      }
    } catch (err) {
      console.error('❌ Error fetching service details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Skeleton Image Carousel Component
  const SkeletonImageCarousel = () => (
    <Box
      sx={{
        width: '673px',
        height: '448px',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Main Image Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={360}
        animation="wave"
        sx={{ bgcolor: 'grey.200' }}
      />

      {/* Thumbnail Row Skeleton */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          p: 2,
          backgroundColor: 'white',
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={80}
            height={60}
            animation="wave"
            sx={{
              borderRadius: '8px',
              bgcolor: 'grey.200',
            }}
          />
        ))}
      </Box>
    </Box>
  );

  // Skeleton Booking Card Component
  const SkeletonBookingCard = () => (
    <Box
      sx={{
        width: '463px',
        height: '309px',
        borderRadius: '16px',
        backgroundColor: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        p: 3,
      }}
    >
      {/* Service Name Skeleton */}
      <Skeleton
        variant="text"
        width="90%"
        height={32}
        animation="wave"
        sx={{ mb: 1, bgcolor: 'grey.200' }}
      />
      <Skeleton
        variant="text"
        width="70%"
        height={32}
        animation="wave"
        sx={{ mb: 2, bgcolor: 'grey.200' }}
      />

      {/* Rating & Orders Skeleton */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Skeleton
          variant="rectangular"
          width={80}
          height={24}
          animation="wave"
          sx={{ borderRadius: '4px', bgcolor: 'grey.200' }}
        />
        <Skeleton
          variant="text"
          width={100}
          height={24}
          animation="wave"
          sx={{ bgcolor: 'grey.200' }}
        />
      </Box>

      {/* Price Skeleton */}
      <Box sx={{ mb: 3 }}>
        <Skeleton
          variant="text"
          width={60}
          height={20}
          animation="wave"
          sx={{ mb: 1, bgcolor: 'grey.200' }}
        />
        <Skeleton
          variant="text"
          width={120}
          height={40}
          animation="wave"
          sx={{ bgcolor: 'grey.200' }}
        />
      </Box>

      {/* Button Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={48}
        animation="wave"
        sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
      />
    </Box>
  );

  // Skeleton Tabs Component
  const SkeletonTabs = () => (
    <Box sx={{ width: '100%' }}>
      {/* Tab Headers Skeleton */}
      <Box
        sx={{
          display: 'flex',
          gap: 3,
          borderBottom: '2px solid #E5E7EB',
          mb: 4,
        }}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={120}
            height={40}
            animation="wave"
            sx={{
              borderRadius: '8px 8px 0 0',
              bgcolor: 'grey.200',
            }}
          />
        ))}
      </Box>

      {/* Tab Content Skeleton */}
      <Box>
        {/* Description Lines */}
        <Skeleton
          variant="text"
          width="100%"
          height={20}
          animation="wave"
          sx={{ mb: 1, bgcolor: 'grey.200' }}
        />
        <Skeleton
          variant="text"
          width="95%"
          height={20}
          animation="wave"
          sx={{ mb: 1, bgcolor: 'grey.200' }}
        />
        <Skeleton
          variant="text"
          width="98%"
          height={20}
          animation="wave"
          sx={{ mb: 1, bgcolor: 'grey.200' }}
        />
        <Skeleton
          variant="text"
          width="90%"
          height={20}
          animation="wave"
          sx={{ mb: 3, bgcolor: 'grey.200' }}
        />

        {/* Features/List Skeleton */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton
                variant="circular"
                width={24}
                height={24}
                animation="wave"
                sx={{ bgcolor: 'grey.200' }}
              />
              <Skeleton
                variant="text"
                width="80%"
                height={20}
                animation="wave"
                sx={{ bgcolor: 'grey.200' }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );

  // Loading State with Shimmer
  if (loading) {
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
          {/* Top Section - Image Carousel and Booking Card Skeleton */}
          <Box
            sx={{
              position: 'relative',
              height: '466px',
              mb: 4,
            }}
          >
            {/* Image Carousel Skeleton - Left */}
            <Box
              sx={{
                position: 'absolute',
                top: '35px',
                left: { xs: 2, md: '134px' },
                width: { xs: 'calc(100% - 16px)', md: '673px' },
                height: '448px',
              }}
            >
              <SkeletonImageCarousel />
            </Box>

            {/* Booking Card Skeleton - Right */}
            <Box
              sx={{
                position: 'absolute',
                top: { xs: '500px', md: '35px' },
                left: { xs: 2, md: '836px' },
                width: { xs: 'calc(100% - 16px)', md: '463px' },
                height: '309px',
              }}
            >
              <SkeletonBookingCard />
            </Box>
          </Box>

          {/* Tabs Section Skeleton */}
          <Box
            sx={{
              px: { xs: 2, md: '135px' },
              mt: { xs: '560px', md: '154px' },
              pb: 6,
            }}
          >
            <SkeletonTabs />
          </Box>
        </Container>
      </Box>
    );
  }

  // Service Not Found State
  if (!serviceData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #FDCB6A 0%, #FFFFFF 100%)',
          px: 2,
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '500px',
            px: { xs: 3, md: 4 },
            py: { xs: 3, md: 4 },
            borderRadius: 3,
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            sx={{
              width: { xs: 56, md: 64 },
              height: { xs: 56, md: 64 },
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Box
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: '#DC2626',
              }}
            >
              ⚠️
            </Box>
          </Box>

          <Box
            component="h1"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: '#1F2937',
              mb: 2,
              lineHeight: 1.3,
            }}
          >
            Service Not Found
          </Box>

          <Box
            component="p"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontSize: { xs: '0.938rem', md: '1rem' },
              color: '#6B7280',
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            We couldn't find the service you're looking for. It may have been removed or is no longer available.
          </Box>

          <Box
            component="a"
            href="/"
            sx={{
              display: 'inline-block',
              backgroundColor: '#037166',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: { xs: '0.938rem', md: '1rem' },
              fontWeight: 600,
              fontFamily: 'var(--font-inter)',
              textDecoration: 'none',
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#025951',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(3, 113, 102, 0.3)',
              },
            }}
          >
            Back to Home
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #FDCB6A 0%, #FFFFFF 100%)',
        pt: '38px',
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
            height: { xs: 'auto', md: '466px' },
            mb: 4,
          }}
        >
          {/* Image Carousel - Left */}
          <Box
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              top: { xs: 0, md: '35px' },
              left: { xs: 2, md: '134px' },
              width: { xs: 'calc(100% - 16px)', md: '673px' },
              height: { xs: 'auto', md: '448px' },
              mb: { xs: 3, md: 0 },
            }}
          >
            <ServiceImageCarousel service={serviceData} />
          </Box>

          {/* Booking Card - Right */}
          <Box
            sx={{
              position: { xs: 'relative', md: 'absolute' },
              top: { xs: 0, md: '35px' },
              left: { xs: 2, md: '836px' },
              width: { xs: 'calc(100% - 16px)', md: '463px' },
              height: { xs: 'auto', md: '309px' },
            }}
          >
            <ServiceBookingCard service={serviceData} />
          </Box>
        </Box>

        {/* Tabs Section */}
        <Box
          sx={{
            px: { xs: 2, md: '135px' },
            mt: { xs: 4, md: '62px' },
            pb: 6,
          }}
        >
          <ServiceTabs service={serviceData} />
        </Box>
      </Container>
    </Box>
  );
}
