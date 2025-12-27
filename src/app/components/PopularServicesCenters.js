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
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { urls } from '../utils/urls';

const ASSET_BASE_URL = urls.baseurl;

export default function PopularServicesCenters() {
  const scrollContainerRef = useRef(null);
  const [favorites, setFavorites] = useState({});
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  const router = useRouter();

  // Helper function to generate SVG placeholder
  const generatePlaceholder = (width = 204, height = 116, text = 'No Image') => {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#E5E7EB"/>
        <text 
          x="50%" 
          y="50%" 
          dominant-baseline="middle" 
          text-anchor="middle" 
          font-family="Arial, sans-serif" 
          font-size="14" 
          fill="#9CA3AF"
        >${text}</text>
      </svg>
    `.trim().replace(/[\t\n\r]/gim, '');
    
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  // Build absolute image URL from relative "uploads/..." path
  const buildImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${ASSET_BASE_URL}/${cleanPath}`;
  };

  // Get user's geolocation
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          setUserLocation(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser');
      setUserLocation(null);
    }
  }, []);

  // Fetch featured centers
  useEffect(() => {
    if (userLocation === undefined) return;
    fetchCenters();
  }, [userLocation]);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      setError(null);

      const requestBody = {};
      if (userLocation) {
        requestBody.latitude = userLocation.latitude;
        requestBody.longitude = userLocation.longitude;
      }

      const res = await fetch(urls.GetPopularService, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to fetch centers');
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'API returned unsuccessful response');
      }

      const apiCenters = data.featuredServiceCenters || [];

      const mapped = apiCenters.map((c) => ({
        id: c._id,
        name: c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim(),
        location:
          c.address ||
          [c.cityName, c.stateName].filter(Boolean).join(', ') ||
          data.detectedCity ||
          'N/A',
        hours: c.storeHours || '9:00 AM - 6:00 PM',
        rating: c.rating || '4.5',
        image: buildImageUrl(c.image || c.logo || ''),
        serviceCharge: c.serviceCharge || '',
        bio: c.bio || '',
      }));

      setCenters(mapped);
    } catch (err) {
      console.error('Error fetching featured service centers:', err);
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

  const handleViewCenter = (centerId) => {
    router.push(`/service-center/${centerId}`);
  };

  const handleRetry = () => {
    fetchCenters();
  };

  // Skeleton Center Card Component
  const SkeletonCenterCard = () => (
    <Card
      elevation={0}
      sx={{
        width: '204px',
        minWidth: '204px',
        height: '283.14px',
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
          height={115.91}
          animation="wave"
          sx={{ bgcolor: 'grey.200' }}
        />

        {/* Rating Badge Skeleton */}
        <Skeleton
          variant="rectangular"
          width={55}
          height={24}
          animation="wave"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            borderRadius: '4px',
            bgcolor: 'grey.300',
          }}
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
          height: '167.23px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Name Skeleton */}
        <Skeleton
          variant="text"
          width="90%"
          height={18}
          animation="wave"
          sx={{ mb: 0.5, bgcolor: 'grey.200' }}
        />
        <Skeleton
          variant="text"
          width="70%"
          height={18}
          animation="wave"
          sx={{ mb: 1, bgcolor: 'grey.200' }}
        />

        {/* Location Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
          <Skeleton
            variant="circular"
            width={14}
            height={14}
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
          <Skeleton
            variant="text"
            width="75%"
            height={14}
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
        </Box>

        {/* Hours Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          <Skeleton
            variant="circular"
            width={14}
            height={14}
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
          <Skeleton
            variant="text"
            width="65%"
            height={14}
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
            borderRadius: '8px',
            bgcolor: 'grey.200',
            mt: 'auto',
          }}
        />
      </CardContent>
    </Card>
  );

  // Decorative Circles Component
  const DecorativeCircles = () => (
    <>
      {/* Left Circles */}
      <Box
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          top: '50%',
          left: '-250px',
          transform: 'translateY(-50%)',
          opacity: 0.1,
          border: '2px solid #037166',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          display: { xs: 'none', md: 'block' },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          top: '50%',
          left: '-200px',
          transform: 'translateY(-50%)',
          opacity: 0.15,
          border: '2px solid #037166',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          display: { xs: 'none', md: 'block' },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          top: '50%',
          left: '-150px',
          transform: 'translateY(-50%)',
          opacity: 0.2,
          border: '2px solid #037166',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          display: { xs: 'none', md: 'block' },
        }}
      />
      {/* Right Circles */}
      <Box
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          top: '50%',
          right: '-250px',
          transform: 'translateY(-50%)',
          opacity: 0.1,
          border: '2px solid #037166',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          display: { xs: 'none', md: 'block' },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          top: '50%',
          right: '-200px',
          transform: 'translateY(-50%)',
          opacity: 0.15,
          border: '2px solid #037166',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          display: { xs: 'none', md: 'block' },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          top: '50%',
          right: '-150px',
          transform: 'translateY(-50%)',
          opacity: 0.2,
          border: '2px solid #037166',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          display: { xs: 'none', md: 'block' },
        }}
      />
    </>
  );

  // Loading State with Shimmer
  if (loading) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          backgroundColor: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <DecorativeCircles />

        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 1,
            ml: { xs: 2, md: 20 },
          }}
        >
          {/* Header Skeleton */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
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
                width={{ xs: 300, md: 420 }}
                height={{ xs: 32, md: 40 }}
                animation="wave"
                sx={{ bgcolor: 'grey.200' }}
              />
            </Box>

            {/* Navigation Arrows Skeleton */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 2,
                mr: 25,
              }}
            >
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
              pr: { xs: 2, md: '145px' },
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
                <SkeletonCenterCard />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          backgroundColor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
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
            backgroundColor: '#FEF2F2',
            border: '2px solid #DC2626',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
          }}
        >
          <Box
            sx={{
              width: { xs: 56, md: 64 },
              height: { xs: 56, md: 64 },
              borderRadius: '50%',
              backgroundColor: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: 'white',
              }}
            />
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: '#991B1B',
              mb: 2,
              lineHeight: 1.3,
            }}
          >
            Failed to Load Service Centers
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontSize: { xs: '0.938rem', md: '1rem' },
              color: '#7F1D1D',
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            We're having trouble loading popular service centers. Please try again.
          </Typography>

          <Button
            variant="contained"
            onClick={handleRetry}
            startIcon={<RefreshIcon />}
            sx={{
              backgroundColor: '#DC2626',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: { xs: '0.938rem', md: '1rem' },
              fontWeight: 600,
              fontFamily: 'var(--font-inter)',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#B91C1C',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(220, 38, 38, 0.4)',
              },
            }}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  }

  // No Data State
  if (centers.length === 0) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          backgroundColor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
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
            No Service Centers Available
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'var(--font-inter)',
              color: 'text.secondary',
            }}
          >
            No popular service centers available at the moment.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <DecorativeCircles />

      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          ml: { xs: 2, md: 20 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
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
              Recent
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem', lg: '2.5rem' },
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              Explore Popular Services Centers
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 2,
              mr: { xs: 0, md: 25 },
            }}
          >
            <IconButton
              onClick={() => scroll('left')}
              sx={{
                backgroundColor: 'background.paper',
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
              <ArrowBackIosNewIcon sx={{ fontSize: '1rem', color: 'text.primary', ml: 0.5 }} />
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
              <ArrowForwardIosIcon sx={{ fontSize: '1rem', color: 'white' }} />
            </IconButton>
          </Box>
        </Box>

        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            pb: 2,
            pr: { xs: 2, md: '145px' },
          }}
        >
          {centers.map((center) => (
            <Card
              key={center.id}
              elevation={0}
              sx={{
                width: '204px',
                minWidth: '204px',
                height: '283.14px',
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
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={
                    center.image && center.image.trim() !== ''
                      ? center.image
                      : generatePlaceholder(204, 116, center.name || 'No Image')
                  }
                  alt={center.name}
                  sx={{
                    width: '204px',
                    height: '115.91px',
                    objectFit: 'cover',
                    opacity: 1,
                    backgroundColor: '#E5E7EB',
                  }}
                  onError={(e) => {
                    e.target.src = generatePlaceholder(204, 116, center.name || 'No Image');
                  }}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    px: '16px',
                    py: '4px',
                    height: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  <StarIcon sx={{ fontSize: '14px', color: '#F59E0B' }} />
                  <Typography
                    sx={{
                      fontSize: '12px',
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 600,
                      color: 'text.primary',
                      lineHeight: 1,
                    }}
                  >
                    {center.rating}
                  </Typography>
                </Box>

                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(center.id);
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
                  {favorites[center.id] ? (
                    <FavoriteIcon sx={{ fontSize: '1rem', color: '#EF4444' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                  )}
                </IconButton>
              </Box>

              <CardContent
                sx={{
                  p: 2,
                  pb: '16px !important',
                  height: '167.23px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '14px',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 1,
                    lineHeight: 1.3,
                    height: '36px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {center.name}
                </Typography>

                <Stack spacing={0.75} sx={{ mb: 1.5, flexShrink: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                    <LocationOnIcon
                      sx={{
                        fontSize: '14px',
                        color: 'text.secondary',
                        mt: 0.1,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '11px',
                        fontFamily: 'var(--font-inter)',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {center.location}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                    <AccessTimeIcon
                      sx={{
                        fontSize: '14px',
                        color: 'text.secondary',
                        mt: 0.1,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '11px',
                        fontFamily: 'var(--font-inter)',
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {center.hours}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleViewCenter(center.id)}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontFamily: 'var(--font-inter)',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '13px',
                    height: '36px',
                    borderRadius: '8px',
                    boxShadow: 'none',
                    px: '32px',
                    py: '6px',
                    mt: 'auto',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      boxShadow: '0 4px 12px rgba(3, 113, 102, 0.25)',
                    },
                  }}
                >
                  View Center
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
