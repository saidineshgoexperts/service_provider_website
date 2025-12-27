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
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FeaturedServices() {
  const scrollContainerRef = useRef(null);
  const [favorites, setFavorites] = useState({});
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const fetchFeaturedServices = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/featured_services',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch featured services');
      }

      const result = await response.json();
      console.log('📥 Featured services response:', result);

      if (result.success && result.updatedServices) {
        const transformedServices = result.updatedServices.map((service) => {
          const imageUrl = service.mainImage
            ? `https://api.doorstephub.com/${service.mainImage}`
            : '/placeholder-service.jpg';

          const cleanDescription = service.description
            ? service.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
            : 'Professional repair and maintenance service.';

          return {
            id: service._id,
            title: service.serviceName,
            description: cleanDescription,
            price: `From ₹${service.serviceCharge}`,
            badge: service.serviceDelhiveryType || 'Fast Service',
            image: imageUrl,
          };
        });

        setServices(transformedServices);
        console.log('✅ Featured services loaded:', transformedServices.length);
      }
    } catch (err) {
      console.error('❌ Error fetching featured services:', err);
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

  // Skeleton Card Component
  const SkeletonServiceCard = () => (
    <Card
      sx={{
        minWidth: '204px',
        maxWidth: '204px',
        height: '275px',
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
          width={70}
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
          width="90%"
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
          width="80%"
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
            width={60}
            height={18}
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
          <Skeleton
            variant="rectangular"
            width={70}
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
          width: '100%',
          minHeight: '487px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #D9EAE8 100%)',
          pt: '44px',
          pb: '44px',
          pl: { xs: 2, md: '134px' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth={false} disableGutters>
          {/* Header Skeleton */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
              pr: { xs: 2, md: 4 },
            }}
          >
            <Box>
              <Skeleton
                variant="text"
                width={100}
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
              gap: 1.5,
              overflowX: 'hidden',
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
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '487px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #D9EAE8 100%)',
        pt: '44px',
        pb: '44px',
        pl: { xs: 2, md: '134px' },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth={false} disableGutters>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            pr: { xs: 2, md: 4 },
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
              Featured
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
              Explore Our Featured Services
            </Typography>
          </Box>

          {/* Navigation Arrows - Exact Figma Specs */}
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
              <ArrowBackIosNewIcon
                sx={{
                  fontSize: '1rem',
                  color: 'text.primary',
                }}
              />
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
              <ArrowForwardIosIcon
                sx={{
                  fontSize: '1rem',
                  color: 'white',
                }}
              />
            </IconButton>
          </Box>
        </Box>

        {/* Services Carousel with Left and Right Illustrations */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative' }}>
          {/* Left Side Illustration */}
          <Box
            sx={{
              width: '80px',
              height: '140px',
              position: 'absolute',
              left: '-50px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: { xs: 'none', lg: 'block' },
              zIndex: 1,
            }}
          >
            {/* Left Illustration Placeholder - Replace with actual image */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(3, 113, 102, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage:
                  'linear-gradient(45deg, rgba(3, 113, 102, 0.05) 25%, transparent 25%, transparent 75%, rgba(3, 113, 102, 0.05) 75%)',
                backgroundSize: '20px 20px',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'primary.main',
                  fontSize: '0.6rem',
                  writingMode: 'vertical-rl',
                }}
              >
                Left Illustration
              </Typography>
            </Box>
          </Box>

          {/* Services Cards */}
          <Box
            ref={scrollContainerRef}
            sx={{
              display: 'flex',
              gap: 1.5,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              flex: 1,
            }}
          >
            {services.map((service) => (
              <Card
                key={service.id}
                onClick={() => handleCardClick(service.id)}
                sx={{
                  minWidth: '204px',
                  maxWidth: '204px',
                  height: '275px',
                  flexShrink: 0,
                  borderRadius: '6.95px',
                  border: '0.87px solid #E5E7EB',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  backgroundColor: '#FFFFFF',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    transform: 'translateY(-4px)',
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
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.backgroundImage =
                        'linear-gradient(45deg, #F3F4F6 25%, transparent 25%, transparent 75%, #F3F4F6 75%), linear-gradient(45deg, #F3F4F6 25%, transparent 25%, transparent 75%, #F3F4F6 75%)';
                      e.target.parentElement.style.backgroundSize = '20px 20px';
                      e.target.parentElement.style.backgroundPosition = '0 0, 10px 10px';
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

          {/* Right Side Illustration */}
          <Box
            sx={{
              width: '62.5px',
              height: '122.64px',
              position: 'absolute',
              right: '6.68px',
              bottom: 0,
              display: { xs: 'none', lg: 'block' },
              transform: 'rotate(-180deg)',
              zIndex: 1,
            }}
          >
            {/* Right Illustration Placeholder - Replace with actual image */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(3, 113, 102, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage:
                  'linear-gradient(45deg, rgba(3, 113, 102, 0.05) 25%, transparent 25%, transparent 75%, rgba(3, 113, 102, 0.05) 75%)',
                backgroundSize: '20px 20px',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'primary.main',
                  fontSize: '0.6rem',
                  transform: 'rotate(180deg)',
                }}
              >
                Right
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
