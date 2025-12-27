'use client';

import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Button,
  Stack,
  Skeleton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '../contexts/LocationContext';

export default function NearbyStores() {
  const scrollContainerRef = useRef(null);
  const [favorites, setFavorites] = useState({});
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detectedCity, setDetectedCity] = useState('');
  
  const router = useRouter();
  const { location } = useLocation();
  const API_BASE_URL = 'https://api.doorstephub.com';

  // Fetch nearby stores
  useEffect(() => {
    fetchNearbyStores();
  }, [location.latitude, location.longitude]);

  const fetchNearbyStores = async () => {
    try {
      console.log('🔄 Fetching nearby stores...');
      setLoading(true);
      setError(null);

      const requestBody = {};
      if (location.latitude && location.longitude) {
        requestBody.lattitude = location.latitude;
        requestBody.longitude = location.longitude;
        console.log('📍 Using coordinates:', requestBody);
      } else {
        console.log('⚠️ No coordinates - fetching default stores');
      }

      const response = await fetch(
        `${API_BASE_URL}/v1/dhubApi/app/applience-repairs-website/nearest_service_centers`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nearby stores');
      }

      const result = await response.json();
      console.log('📥 Nearby Stores API Response:', result);

      if (result.detectedCity) {
        setDetectedCity(result.detectedCity);
        console.log('📍 Detected City:', result.detectedCity);
      }

      if (result.success && result.nearestServiceCenters && Array.isArray(result.nearestServiceCenters)) {
        const transformedStores = result.nearestServiceCenters.map((center) => {
          let imageUrl = '/images/service.jpg';
          
          if (center.logo) {
            imageUrl = `${API_BASE_URL}/${center.logo}`;
          } else if (center.image) {
            imageUrl = `${API_BASE_URL}/${center.image}`;
          }

          return {
            id: center._id,
            name: center.name || `${center.firstName} ${center.lastName}`,
            location: center.address || `${center.cityName}, ${center.stateName}`,
            hours: center.storeHours || '9:00 AM – 6:00 PM',
            image: imageUrl,
            phone: center.phone,
            email: center.email,
            rating: center.rating,
            serviceCharge: center.serviceCharge,
            cityName: center.cityName,
            stateName: center.stateName,
            bio: center.bio || null,
          };
        });

        console.log('✅ Nearby Stores loaded:', transformedStores.length);
        setStores(transformedStores);
      } else {
        console.log('❌ No service centers in response');
        setStores([]);
      }
    } catch (err) {
      console.error('❌ Error fetching nearby stores:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 220;
      const newScrollPosition =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleViewStore = (storeId) => {
    router.push(`/service-center/${storeId}`);
  };

  const handleRetry = () => {
    fetchNearbyStores();
  };

  // Skeleton Store Card Component
  const SkeletonStoreCard = () => (
    <Card
      elevation={0}
      sx={{
        width: '204px',
        minWidth: '204px',
        height: '293.14px',
        flexShrink: 0,
        borderRadius: '6.95px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        border: '0.87px solid #E5E7EB',
      }}
    >
      {/* Image Skeleton */}
      <Box sx={{ position: 'relative' }}>
        <Skeleton
          variant="rectangular"
          width={204}
          height={116}
          animation="wave"
          sx={{ bgcolor: 'grey.200' }}
        />

        {/* Favorite Icon Skeleton */}
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          animation="wave"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'grey.300',
          }}
        />
      </Box>

      {/* Content Skeleton */}
      <CardContent
        sx={{
          p: 2,
          pb: '16px !important',
          height: '177.14px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Store Name Skeleton */}
        <Skeleton
          variant="text"
          width="90%"
          height={20}
          animation="wave"
          sx={{ mb: 0.5, bgcolor: 'grey.200' }}
        />
        <Skeleton
          variant="text"
          width="70%"
          height={20}
          animation="wave"
          sx={{ mb: 1.5, bgcolor: 'grey.200' }}
        />

        {/* Location Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 1 }}>
          <Skeleton
            variant="circular"
            width={14}
            height={14}
            animation="wave"
            sx={{ mt: 0.2, bgcolor: 'grey.200' }}
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton
              variant="text"
              width="100%"
              height={16}
              animation="wave"
              sx={{ mb: 0.3, bgcolor: 'grey.200' }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={16}
              animation="wave"
              sx={{ bgcolor: 'grey.200' }}
            />
          </Box>
        </Box>

        {/* Hours Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <Skeleton
            variant="circular"
            width={14}
            height={14}
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
          <Skeleton
            variant="text"
            width="70%"
            height={16}
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
        </Box>

        {/* Button Skeleton */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={36}
          animation="wave"
          sx={{
            borderRadius: '6px',
            bgcolor: 'grey.200',
            mt: 'auto',
          }}
        />
      </CardContent>
    </Card>
  );

  // Loading State with Shimmer
  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: { xs: 'auto', lg: '495.14px' },
          background: 'linear-gradient(180deg, #FFFFFF 0%, #D9EAE8 100%)',
          pt: '44px',
          pb: '44px',
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: '1444px',
            pl: { xs: 2, md: '134px' },
            pr: { xs: 2, md: 2 },
          }}
        >
          {/* Header Skeleton */}
          <Box
            sx={{
              width: { xs: '100%', lg: '1170px' },
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: '12px',
            }}
          >
            <Box>
              <Skeleton
                variant="text"
                width={80}
                height={20}
                animation="wave"
                sx={{ mb: 0.5, bgcolor: 'grey.200' }}
              />
              <Skeleton
                variant="text"
                width={{ xs: 280, md: 380 }}
                height={{ xs: 32, md: 40 }}
                animation="wave"
                sx={{ bgcolor: 'grey.200' }}
              />
            </Box>

            {/* Navigation Arrows Skeleton */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Skeleton
                variant="rectangular"
                width={48}
                height={48}
                animation="wave"
                sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
              />
              <Skeleton
                variant="rectangular"
                width={48}
                height={48}
                animation="wave"
                sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
              />
            </Box>
          </Box>

          {/* Cards Container Skeleton */}
          <Box
            sx={{
              display: 'flex',
              gap: '12px',
              overflowX: 'hidden',
              pb: 2,
            }}
          >
            {/* Show 1 card on mobile, 5 on desktop */}
            {Array.from({ length: 5 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: {
                    xs: index === 0 ? 'block' : 'none',
                    sm: index < 2 ? 'block' : 'none',
                    md: index < 3 ? 'block' : 'none',
                    lg: 'block',
                  },
                }}
              >
                <SkeletonStoreCard />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  // Error State with Professional Design
  if (error) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: { xs: 'auto', lg: '495.14px' },
          background: 'linear-gradient(180deg, #FFFFFF 0%, #D9EAE8 100%)',
          pt: '44px',
          pb: '44px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '500px',
            mx: 2,
            px: { xs: 3, md: 4 },
            py: { xs: 3, md: 4 },
            borderRadius: 3,
            backgroundColor: '#FFF7ED',
            border: '2px solid #F59E0B',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)',
          }}
        >
          {/* Warning Icon */}
          <Box
            sx={{
              width: { xs: 56, md: 64 },
              height: { xs: 56, md: 64 },
              borderRadius: '50%',
              backgroundColor: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            }}
          >
            <LocationOffIcon
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: 'white',
              }}
            />
          </Box>

          {/* Error Title */}
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: '#92400E',
              mb: 2,
              lineHeight: 1.3,
            }}
          >
            Enable Location Access
          </Typography>

          {/* Error Description */}
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontSize: { xs: '0.938rem', md: '1rem' },
              color: '#78350F',
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            Please enable location access to see nearby service centers in your area.
          </Typography>

          {/* Action Button */}
          <Button
            variant="contained"
            onClick={handleRetry}
            startIcon={<RefreshIcon />}
            sx={{
              backgroundColor: '#F59E0B',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: { xs: '0.938rem', md: '1rem' },
              fontWeight: 600,
              fontFamily: 'var(--font-inter)',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#D97706',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(245, 158, 11, 0.4)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Try Again
          </Button>

          {/* Help Text */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 2.5,
              color: '#92400E',
              fontSize: { xs: '0.813rem', md: '0.875rem' },
              fontFamily: 'var(--font-inter)',
            }}
          >
            Check your browser settings to enable location
          </Typography>
        </Box>
      </Box>
    );
  }

  // No Data State
  if (stores.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: { xs: 'auto', lg: '495.14px' },
          background: 'linear-gradient(180deg, #FFFFFF 0%, #D9EAE8 100%)',
          pt: '44px',
          pb: '44px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ textAlign: 'center', maxWidth: '500px', px: 2 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: 'var(--font-inter)',
              fontWeight: 600, 
              mb: 2, 
              color: 'text.primary',
            }}
          >
            No Nearby Stores
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: 'var(--font-inter)',
              color: 'text.secondary',
            }}
          >
            No service centers found in your area.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: 'auto', lg: '495.14px' },
        background: 'linear-gradient(180deg, #FFFFFF 0%, #D9EAE8 100%)',
        pt: '44px',
        pb: '44px',
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: '1444px',
          pl: { xs: 2, md: '134px' },
          pr: { xs: 2, md: 2 },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            width: { xs: '100%', lg: '1170px' },
            height: { xs: 'auto', lg: '72px' },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: '12px',
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '0.1em',
                mb: 0.5,
                display: 'block',
              }}
            >
              Stores
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2rem', lg: '2.25rem' },
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              Explore Nearby Stores{' '}
              {detectedCity && (
                <Typography
                  component="span"
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2rem', lg: '2.25rem' },
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 700,
                    color: 'primary.main',
                    lineHeight: 1.2,
                  }}
                >
                  in {detectedCity}
                </Typography>
              )}
            </Typography>
          </Box>

          {/* Navigation Arrows */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <IconButton
              onClick={() => scroll('left')}
              sx={{
                backgroundColor: 'white',
                width: 48,
                height: 48,
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                  borderColor: '#D1D5DB',
                },
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: '1.1rem', color: 'text.primary', ml: 0.5 }} />
            </IconButton>
            <IconButton
              onClick={() => scroll('right')}
              sx={{
                backgroundColor: 'primary.main',
                width: 48,
                height: 48,
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: '1.1rem', color: 'white' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Cards Container */}
        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            pb: 2,
          }}
        >
          {stores.map((store) => (
            <Card
              key={store.id}
              elevation={0}
              sx={{
                width: '204px',
                minWidth: '204px',
                height: '293.14px',
                flexShrink: 0,
                borderRadius: '6.95px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                backgroundColor: '#FFFFFF',
                border: '0.87px solid',
                borderColor: 'rgba(0, 0, 0, 0.08)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                  borderColor: 'rgba(3, 113, 102, 0.2)',
                },
              }}
            >
              {/* Image Section */}
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={store.image}
                  alt={store.name}
                  sx={{
                    width: '204px',
                    height: '116px',
                    objectFit: 'cover',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = '#E5E7EB';
                    e.target.parentElement.style.backgroundImage =
                      'linear-gradient(45deg, #F3F4F6 25%, transparent 25%, transparent 75%, #F3F4F6 75%), linear-gradient(45deg, #F3F4F6 25%, transparent 25%, transparent 75%, #F3F4F6 75%)';
                    e.target.parentElement.style.backgroundSize = '20px 20px';
                    e.target.parentElement.style.backgroundPosition = '0 0, 10px 10px';
                  }}
                />

                {/* Favorite Icon */}
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(store.id);
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'white',
                    width: 32,
                    height: 32,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'white',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  {favorites[store.id] ? (
                    <FavoriteIcon sx={{ fontSize: '1.1rem', color: '#EF4444' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: '1.1rem', color: 'text.secondary' }} />
                  )}
                </IconButton>
              </Box>

              {/* Content Section */}
              <CardContent
                sx={{
                  p: 2,
                  pb: '16px !important',
                  height: '177.14px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Store Name */}
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '15px',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 1.5,
                    lineHeight: 1.3,
                    height: '39px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {store.name}
                </Typography>

                {/* Location and Hours */}
                <Stack spacing={1} sx={{ mb: 2, flexShrink: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, height: '34px' }}>
                    <LocationOnIcon
                      sx={{
                        fontSize: '14px',
                        color: 'text.secondary',
                        mt: 0.2,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '12px',
                        fontFamily: 'var(--font-inter)',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {store.location}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, height: '20px' }}>
                    <AccessTimeIcon
                      sx={{
                        fontSize: '14px',
                        color: 'text.secondary',
                        mt: 0.2,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '12px',
                        fontFamily: 'var(--font-inter)',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {store.hours}
                    </Typography>
                  </Box>
                </Stack>

                {/* View Store Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleViewStore(store.id)}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontFamily: 'var(--font-inter)',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    py: 1,
                    borderRadius: '6px',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    mt: 'auto',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      boxShadow: '0 4px 12px rgba(3, 113, 102, 0.25)',
                    },
                  }}
                >
                  View Store
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
