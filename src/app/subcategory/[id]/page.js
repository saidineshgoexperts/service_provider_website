'use client';

import {
  Box,
  Container,
  Typography,
  Button,
  Skeleton,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ServiceCard from '../../components/ServiceCard';
import { useLocation } from '../../contexts/LocationContext';
import { urls } from '../../utils/urls';

export default function SubcategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { location } = useLocation();

  const [services, setServices] = useState([]);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [subcategoryInfo, setSubcategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [detectedCity, setDetectedCity] = useState(null);

  const currentBooking = 'currentBooking';

  // Safe localStorage functions with SSR check
  function clearProviderForServiceFlow() {
    if (typeof window === 'undefined') return;

    try {
      const existing = JSON.parse(localStorage.getItem(currentBooking)) || {};

      if (existing.providerId) {
        delete existing.providerId;
        localStorage.setItem(currentBooking, JSON.stringify(existing));
        console.log('🧹 Cleared providerId from localStorage');
      }
    } catch (error) {
      console.error('Error clearing provider:', error);
    }
  }

  // SERVICE FLOW → remove providerId
  function setServiceFlow() {
    if (typeof window === 'undefined') return;

    try {
      const existing = JSON.parse(localStorage.getItem(currentBooking)) || {};

      if (existing.providerId) {
        delete existing.providerId;
      }

      localStorage.setItem(currentBooking, JSON.stringify(existing));
      console.log('🚀 SERVICE FLOW - providerId removed');
    } catch (error) {
      console.error('Error setting service flow:', error);
    }
  }

  // PROVIDER FLOW → set providerId
  function setProviderFlow(providerId) {
    if (typeof window === 'undefined') return;

    try {
      const existing = JSON.parse(localStorage.getItem(currentBooking)) || {};

      const updated = {
        ...existing,
        providerId: providerId,
      };

      localStorage.setItem(currentBooking, JSON.stringify(updated));
      console.log('🚀 PROVIDER FLOW - providerId set:', providerId);
    } catch (error) {
      console.error('Error setting provider flow:', error);
    }
  }

  // Clear provider on mount
  useEffect(() => {
    clearProviderForServiceFlow();
  }, []);

  useEffect(() => {
    if (params.id) {
      fetchSubcategoryServices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id, location.latitude, location.longitude]);

  const fetchSubcategoryServices = async () => {
    try {
      setLoading(true);

      const requestBody = {
        subcategoryId: params.id,
      };

      if (location.latitude && location.longitude) {
        requestBody.lattitude = parseFloat(location.latitude);
        requestBody.longitude = parseFloat(location.longitude);
    
      }

      const response = await fetch(urls.getServicesBySubcategory, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const result = await response.json();


      if (result.success) {
        if (result.detectedCity) {
          setDetectedCity(result.detectedCity);
        }

        setSubcategoryInfo({
          name: result.dhubServices?.[0]?.subcategoryName || 'Services',
          description:
            'Get fast, reliable, and expert repair services for all your electronic devices. Choose from our wide range of repair solutions or find verified service centers near your location.',
        });

        // Transform dhubServices -> services
        if (result.dhubServices && result.dhubServices.length > 0) {
          const transformedServices = result.dhubServices.map((service) => {
            const cleanDescription = service.description
              ? service.description.replace(/<[^>]*>/g, '').substring(0, 120) +
                '...'
              : 'Professional repair and maintenance service by certified technicians.';

            const imageUrl = service.mainImage
              ? `https://api.doorstephub.com/${service.mainImage}`
              : '/placeholder-service.jpg';

            return {
              id: service._id,
              title: service.name,
              description: cleanDescription,
              rating: service.rating || '4.5',
              totalOrders: service.totalOrders || 0,
              image: imageUrl,
              type: 'service',
            };
          });

          setServices(transformedServices);

        } else {
          setServices([]);
        }

        // Transform nearByServiceCenters -> serviceCenters
        if (
          result.nearByServiceCenters &&
          result.nearByServiceCenters.length > 0
        ) {
          const transformedCenters = result.nearByServiceCenters.map(
            (center) => {
              const imageUrl = center.mainImage
                ? `https://api.doorstephub.com/${center.mainImage}`
                : center.logo
                ? `https://api.doorstephub.com/${center.logo}`
                : center.image
                ? `https://api.doorstephub.com/${center.image}`
                : '/placeholder-service.jpg';

              return {
                id: center._id,
                title:
                  center.name || `${center.firstName} ${center.lastName}`,
                description: `Verified Service Center at ${center.address}`,
                rating: center.rating || '4.5',
                totalOrders: center.totalOrders || 0,
                image: imageUrl,
                type: 'center',
              };
            }
          );
          setServiceCenters(transformedCenters);

        } else {
          setServiceCenters([]);
        }
      } else {
        setServices([]);
        setServiceCenters([]);
      }
    } catch (err) {
      console.error('❌ Error fetching services:', err);
      setServices([]);
      setServiceCenters([]);
    } finally {
      setLoading(false);
    }
  };

  const displayData = activeTab === 'all' ? services : serviceCenters;

  const handleCardClick = (item) => {
    // SERVICE FLOW
    if (item.type === 'service') {
      setServiceFlow();
      router.push(`/service/${item.id}`);
      return;
    }

    // PROVIDER FLOW
    if (item.type === 'center') {
      setProviderFlow(item.id);
      router.push(`/service-center/${item.id}`);
    }
  };

  // Skeleton Service Card Component
  const SkeletonServiceCard = () => (
    <Box
      sx={{
        width: '100%',
        maxWidth: '300px',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {/* Image Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        animation="wave"
        sx={{ bgcolor: 'grey.200' }}
      />

      {/* Content Skeleton */}
      <Box sx={{ p: 2.5 }}>
        {/* Title Skeleton */}
        <Skeleton
          variant="text"
          width="90%"
          height={24}
          animation="wave"
          sx={{ mb: 1, bgcolor: 'grey.200' }}
        />

        {/* Description Skeleton */}
        <Skeleton
          variant="text"
          width="100%"
          height={16}
          animation="wave"
          sx={{ mb: 0.5, bgcolor: 'grey.200' }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={16}
          animation="wave"
          sx={{ mb: 2, bgcolor: 'grey.200' }}
        />

        {/* Rating & Orders Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Skeleton
            variant="rectangular"
            width={60}
            height={20}
            animation="wave"
            sx={{ borderRadius: '4px', bgcolor: 'grey.200' }}
          />
          <Skeleton
            variant="text"
            width={80}
            height={16}
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
        </Box>

        {/* Button Skeleton */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={40}
          animation="wave"
          sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
        />
      </Box>
    </Box>
  );

  // Loading State with Shimmer
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Hero Section Skeleton */}
        <Box
          sx={{
            backgroundColor: '#037166',
            py: { xs: 6, md: 8 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                textAlign: 'center',
                maxWidth: '800px',
                mx: 'auto',
              }}
            >
              {/* Title Skeleton */}
              <Skeleton
                variant="text"
                width="60%"
                height={{ xs: 48, md: 60 }}
                animation="wave"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  mx: 'auto',
                  mb: 2,
                }}
              />

              {/* Description Skeleton */}
              <Skeleton
                variant="text"
                width="90%"
                height={20}
                animation="wave"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  mx: 'auto',
                  mb: 0.5,
                }}
              />
              <Skeleton
                variant="text"
                width="80%"
                height={20}
                animation="wave"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  mx: 'auto',
                  mb: 2,
                }}
              />

              {/* City Skeleton */}
              <Skeleton
                variant="text"
                width={200}
                height={20}
                animation="wave"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  mx: 'auto',
                }}
              />
            </Box>
          </Container>
        </Box>

        {/* Filter Buttons Skeleton */}
        <Box
          sx={{
            backgroundColor: '#F9FAFB',
            py: 3,
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                pl: { xs: 2, md: '127px' },
              }}
            >
              <Skeleton
                variant="rectangular"
                width={180}
                height={44}
                animation="wave"
                sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
              />
              <Skeleton
                variant="rectangular"
                width={180}
                height={44}
                animation="wave"
                sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
              />
            </Box>
          </Container>
        </Box>

        {/* Services Grid Skeleton */}
        <Box
          sx={{
            py: { xs: 4, md: 6 },
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                pl: { xs: 2, md: '127px' },
                pr: { xs: 2, md: 4 },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {/* Show 8 skeleton cards */}
                {Array.from({ length: 8 }).map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <SkeletonServiceCard />
                  </Box>
                ))}
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#037166',
          py: { xs: 6, md: 8 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              textAlign: 'center',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.2,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                '&::before, &::after': {
                  content: '""',
                  width: '2px',
                  height: '40px',
                  backgroundColor: 'white',
                  display: { xs: 'none', md: 'block' },
                },
              }}
            >
              {subcategoryInfo?.name || 'Services'}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '14px', md: '16px' },
                fontFamily: 'var(--font-inter)',
                fontWeight: 400,
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6,
              }}
            >
              {subcategoryInfo?.description}
            </Typography>
            {detectedCity && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: '14px',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 500,
                  color: 'rgba(255, 255, 255, 0.8)',
                  mt: 2,
                }}
              >
                📍 Services available in {detectedCity}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>

      {/* Filter Buttons Section */}
      <Box
        sx={{
          backgroundColor: '#F9FAFB',
          py: 3,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              pl: { xs: 2, md: '127px' },
            }}
          >
            <Button
              variant={activeTab === 'all' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('all')}
              sx={{
                minWidth: '150px',
                height: '44px',
                borderRadius: '8px',
                fontFamily: 'var(--font-inter)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                backgroundColor:
                  activeTab === 'all' ? '#037166' : 'transparent',
                color: activeTab === 'all' ? 'white' : '#037166',
                border: '1px solid #037166',
                '&:hover': {
                  backgroundColor:
                    activeTab === 'all'
                      ? '#025951'
                      : 'rgba(3, 113, 102, 0.05)',
                },
              }}
            >
              All Services ({services.length})
            </Button>
            <Button
              variant={activeTab === 'nearby' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('nearby')}
              sx={{
                minWidth: '150px',
                height: '44px',
                borderRadius: '8px',
                fontFamily: 'var(--font-inter)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                backgroundColor:
                  activeTab === 'nearby' ? '#037166' : 'transparent',
                color: activeTab === 'nearby' ? 'white' : '#037166',
                border: '1px solid #037166',
                '&:hover': {
                  backgroundColor:
                    activeTab === 'nearby'
                      ? '#025951'
                      : 'rgba(3, 113, 102, 0.05)',
                },
              }}
            >
              Nearby Centers ({serviceCenters.length})
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Services Grid Section */}
      <Box
        sx={{
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              pl: { xs: 2, md: '127px' },
              pr: { xs: 2, md: 4 },
            }}
          >
            {displayData.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)',
                    lg: 'repeat(4, 1fr)',
                  },
                  gap: 3,
                }}
              >
                {displayData.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <ServiceCard
                      service={item}
                      onClick={() => handleCardClick(item)}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 8,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    color: '#1F2937',
                    mb: 1,
                  }}
                >
                  No {activeTab === 'all' ? 'Services' : 'Service Centers'}{' '}
                  Available
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    color: '#6B7280',
                  }}
                >
                  {location.latitude && location.longitude
                    ? `No ${
                        activeTab === 'all' ? 'services' : 'service centers'
                      } found for ${location.address || 'your location'}.`
                    : `We're currently updating our ${
                        activeTab === 'all' ? 'services' : 'service centers'
                      }. Please check back later.`}
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
