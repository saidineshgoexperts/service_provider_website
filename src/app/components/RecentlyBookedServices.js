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
  Chip,
  Skeleton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { URLS } from '../utilis/urls';

export default function RecentlyBookedServices() {
  const scrollContainerRef = useRef(null);
  const [favorites, setFavorites] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_BASE_URL = 'https://api.doorstephub.com';

  // Helper function to strip HTML tags from CKEditor content
  const stripHtmlTags = (html) => {
    if (!html) return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Helper function to generate SVG placeholder
  const generatePlaceholder = (width = 204, height = 140, text = 'No Image') => {
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

  // Fetch latest bookings
  useEffect(() => {
    fetchLatestBookings();
  }, []);

  const fetchLatestBookings = async () => {
    try {
      console.log('🔄 Fetching recent bookings...');

      setLoading(true);
      setError(null);

      const LATEST_BOOKINGS_ENDPOINT = URLS.latestBookings || 
        'https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/latest_bookings_services';
      
      const response = await fetch(LATEST_BOOKINGS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch latest bookings');
      }

      const result = await response.json();

      console.log('📥 Recent Bookings API Response:', result);
      
      if (result.success && result.updatedServices && Array.isArray(result.updatedServices)) {
        const transformedServices = result.updatedServices.map((booking) => {
          const cleanDescription = stripHtmlTags(
            booking.description || booking.serviceDescription || ''
          ) || 'Professional service by experts';

          let imageUrl;
          if (booking.mainImage) {
            imageUrl = `${API_BASE_URL}/${booking.mainImage}`;
          } else if (booking.image) {
            imageUrl = `${API_BASE_URL}/${booking.image}`;
          } else {
            const serviceName = booking.subcategoryName || booking.serviceName || booking.name || 'Service';
            imageUrl = generatePlaceholder(204, 140, serviceName);
          }

          return {
            id: booking._id || booking.id,
            title: booking.subcategoryName || booking.serviceName || booking.name || 'Service',
            description: cleanDescription,
            price: booking.price ? `From ₹${booking.price}` : 'Contact for price',
            badge: booking.serviceDelhiveryType || booking.bookedTime || booking.timeAgo || 'Recently Booked',
            image: imageUrl,
            categoryId: booking.categoryId,
            subcategoryId: booking.subcategoryId,
            status: booking.status,
          };
        });
        
        console.log('✅ Recent Bookings loaded:', transformedServices.length);
        setServices(transformedServices);
      } else {
        console.log('❌ No recent bookings in response');
        setServices([]);
      }
    } catch (err) {
      console.error('❌ Error fetching latest bookings:', err);
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

      const newSlide = Math.round(newScrollPosition / scrollAmount);
      setActiveSlide(Math.max(0, Math.min(services.length - 1, newSlide)));
    }
  };

  const toggleFavorite = (id, event) => {
    event.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBookNow = (serviceId, event) => {
    event.stopPropagation();
    router.push(`/service/${serviceId}`);
  };

  const handleCardClick = (serviceId) => {
    router.push(`/service/${serviceId}`);
  };

  const handleRetry = () => {
    fetchLatestBookings();
  };

  // Skeleton Card Component
  const SkeletonServiceCard = () => (
    <Card
      sx={{
        minWidth: '204px',
        maxWidth: '244px',
        height: '275.05px',
        flexShrink: 0,
        borderRadius: '6.95px',
        border: '0.87px solid #E5E7EB',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Image Skeleton */}
      <Box sx={{ position: 'relative' }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={140}
          animation="wave"
          sx={{ bgcolor: 'grey.200' }}
        />

        {/* Badge Skeleton */}
        <Skeleton
          variant="rectangular"
          width={80}
          height={22}
          animation="wave"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            borderRadius: '16px',
            bgcolor: 'grey.300',
          }}
        />

        {/* Favorite Icon Skeleton */}
        <Skeleton
          variant="circular"
          width={28}
          height={28}
          animation="wave"
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            bgcolor: 'grey.300',
          }}
        />
      </Box>

      {/* Content Skeleton */}
      <CardContent sx={{ p: 1.5, height: '135px', display: 'flex', flexDirection: 'column' }}>
        {/* Title Skeleton */}
        <Skeleton
          variant="text"
          width="85%"
          height={20}
          animation="wave"
          sx={{ mb: 0.5, bgcolor: 'grey.200' }}
        />

        {/* Description Skeleton */}
        <Skeleton
          variant="text"
          width="100%"
          height={14}
          animation="wave"
          sx={{ mb: 0.5, bgcolor: 'grey.200' }}
        />
        <Skeleton
          variant="text"
          width="75%"
          height={14}
          animation="wave"
          sx={{ mb: 1, bgcolor: 'grey.200' }}
        />

        {/* Price and Button Skeleton */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <Skeleton
            variant="text"
            width={70}
            height={18}
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
          <Skeleton
            variant="rectangular"
            width={75}
            height={28}
            animation="wave"
            sx={{ borderRadius: '4px', bgcolor: 'grey.200' }}
          />
        </Box>
      </CardContent>
    </Card>
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
        {/* Decorative Semi-Circles Skeleton */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'none', md: 'block' },
            position: 'absolute',
            width: '400px',
            height: '400px',
            top: '50%',
            left: '-250px',
            transform: 'translateY(-50%)',
            opacity: 0.05,
            border: '2px solid #037166',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <Container 
          maxWidth="xl" 
          sx={{ 
            position: 'relative', 
            zIndex: 1,
            marginLeft: { xs: '16px', md: '150px' },
            marginRight: 'auto',
            paddingLeft: '16px',
            paddingRight: '16px',
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
                width={140}
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
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '10px' }}>
              <Skeleton
                variant="rectangular"
                width={44}
                height={44}
                animation="wave"
                sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
              />
              <Skeleton
                variant="rectangular"
                width={44}
                height={44}
                animation="wave"
                sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
              />
            </Box>
          </Box>

          {/* Services Carousel Skeleton */}
          <Box
            sx={{
              display: 'flex',
              gap: '6.95px',
              overflowX: 'hidden',
              pb: 2,
              mb: 3,
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
                <SkeletonServiceCard />
              </Box>
            ))}
          </Box>

          {/* Pagination Dots Skeleton */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '7px',
              maxWidth: '100%',
              height: '8px',
              mx: 'auto',
            }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width={index === 0 ? 32 : 8}
                height={8}
                animation="wave"
                sx={{
                  borderRadius: '4px',
                  bgcolor: 'grey.200',
                }}
              />
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
          {/* Error Icon */}
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

          {/* Error Title */}
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
            Failed to Load Recent Bookings
          </Typography>

          {/* Error Description */}
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
            We're having trouble loading recently booked services. Please check your
            connection and try again.
          </Typography>

          {/* Action Button */}
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
              color: '#991B1B',
              fontSize: { xs: '0.813rem', md: '0.875rem' },
              fontFamily: 'var(--font-inter)',
            }}
          >
            If the problem persists, please contact support
          </Typography>
        </Box>
      </Box>
    );
  }

  // No Data State
  if (services.length === 0) {
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
            No Recently Booked Services
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: 'var(--font-inter)',
              color: 'text.secondary',
            }}
          >
            No recent bookings available at the moment.
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
      {/* Three Decorative Semi-Circles */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'none', md: 'block' },
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
        }}
      />

      <Box
        sx={{
          display: { xs: 'none', sm: 'none', md: 'block' },
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
        }}
      />

      <Box
        sx={{
          display: { xs: 'none', sm: 'none', md: 'block' },
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
        }}
      />

      <Container 
        maxWidth="xl" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          marginLeft: { xs: '16px', md: '150px' },
          marginRight: 'auto',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        {/* Header Section */}
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
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                mb: 0.5,
                display: 'block',
              }}
            >
              Recently Booked
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.25rem', lg: '2.5rem' },
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              Explore Our Recently Booked Services
            </Typography>
          </Box>

          {/* Navigation Arrows */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: '10px',
            }}
          >
            <IconButton
              onClick={() => scroll('left')}
              sx={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: 'background.paper',
                border: '1px solid #E5E7EB',
                opacity: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#F9FAFB',
                  borderColor: '#D1D5DB',
                },
              }}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: '1rem', color: 'text.primary' }} />
            </IconButton>
            <IconButton
              onClick={() => scroll('right')}
              sx={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: 'primary.main',
                opacity: 1,
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

        {/* Services Carousel */}
        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            gap: '6.95px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            pb: 2,
            mb: 3,
          }}
        >
          {services.map((service) => (
            <Card
              key={service.id}
              onClick={() => handleCardClick(service.id)}
              sx={{
                minWidth: '204px',
                maxWidth: '244px',
                height: '275.05px',
                flexShrink: 0,
                borderRadius: '6.95px',
                border: '0.87px solid #E5E7EB',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                backgroundColor: '#FFFFFF',
                opacity: 1,
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {/* Card Image with Badge and Favorite */}
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={service.image}
                  alt={service.title}
                  sx={{
                    height: '140px',
                    objectFit: 'cover',
                    backgroundColor: '#E5E7EB',
                  }}
                />

                {/* Badge */}
                <Chip
                  label={service.badge}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    height: 22,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />

                {/* Favorite Icon */}
                <IconButton
                  onClick={(e) => toggleFavorite(service.id, e)}
                  sx={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    backgroundColor: 'white',
                    width: 28,
                    height: 28,
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                  }}
                >
                  {favorites[service.id] ? (
                    <FavoriteIcon sx={{ fontSize: '1rem', color: '#EF4444' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                  )}
                </IconButton>
              </Box>

              {/* Card Content */}
              <CardContent sx={{ p: 1.5, height: '135px', display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    wordBreak: 'break-word',
                    width: '100%',
                  }}
                >
                  {service.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '28px',
                    lineHeight: 1.4,
                  }}
                >
                  {service.description}
                </Typography>

                {/* Price and Button */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: '0.8rem',
                    }}
                  >
                    {service.price}
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    onClick={(e) => handleBookNow(service.id, e)}
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      px: 1.5,
                      py: 0.5,
                      minWidth: 'auto',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    }}
                  >
                    Book Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Pagination Dots */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '7px',
            width: '1310px',
            maxWidth: '100%',
            height: '8px',
            mx: 'auto',
          }}
        >
          {services.map((_, index) => (
            <Box
              key={index}
              sx={{
                width: index === activeSlide ? '32px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: index === activeSlide ? 'primary.main' : '#E5E7EB',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    left: index * 220,
                    behavior: 'smooth',
                  });
                  setActiveSlide(index);
                }
              }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
