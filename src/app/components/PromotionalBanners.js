'use client';

import { Box, Container, Card, Typography, Chip, Skeleton } from '@mui/material';
import { useRef, useState, useEffect } from 'react';

export default function PromotionalBanners() {
  const scrollContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const banners = [
    {
      id: 1,
      brand: 'IPHONE',
      discount: 'UP to 80% OFF',
      image: '/images/iphone-banner.jpg',
      backgroundColor: '#1F2937',
    },
    {
      id: 2,
      brand: 'REALME',
      discount: 'UP to 80% OFF',
      image: '/images/realme-banner.jpg',
      backgroundColor: '#FDE68A',
    },
    {
      id: 3,
      brand: 'XIAOMI',
      discount: 'UP to 80% OFF',
      image: '/images/xiaomi-banner.jpg',
      backgroundColor: '#FCA5A5',
    },
  ];

  // Simulate loading (remove this in production if data comes from API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Skeleton Banner Component
  const SkeletonBanner = () => (
    <Card
      elevation={0}
      sx={{
        width: { xs: '320px', md: '389px' },
        minWidth: { xs: '320px', md: '389px' },
        height: { xs: '180px', md: '207px' },
        flexShrink: 0,
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
        border: '1px solid #E5E7EB',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2.5, md: 3.5 },
      }}
    >
      {/* Left Content Skeleton */}
      <Box sx={{ zIndex: 2 }}>
        {/* Brand Chip Skeleton */}
        <Skeleton
          variant="rectangular"
          width={80}
          height={26}
          animation="wave"
          sx={{
            borderRadius: '13px',
            bgcolor: 'grey.200',
            mb: 2,
          }}
        />
        {/* Discount Text Skeleton */}
        <Skeleton
          variant="text"
          width={140}
          height={32}
          animation="wave"
          sx={{
            bgcolor: 'grey.200',
            mb: 1,
          }}
        />
        <Skeleton
          variant="text"
          width={100}
          height={32}
          animation="wave"
          sx={{
            bgcolor: 'grey.200',
          }}
        />
      </Box>

      {/* Product Image Skeleton */}
      <Box
        sx={{
          width: { xs: 120, md: 150 },
          height: { xs: 120, md: 150 },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            borderRadius: '12px',
            bgcolor: 'grey.200',
          }}
        />
      </Box>
    </Card>
  );

  // Loading State with Shimmer
  if (loading) {
    return (
      <Box
        sx={{
          py: { xs: 4, md: 6 },
          backgroundColor: 'background.paper',
        }}
      >
        <Container 
          maxWidth={false}
          sx={{
            maxWidth: '1444px',
            px: { xs: 2, md: '133px' },
          }}
        >
          <Box
            sx={{
              width: { xs: '100%', lg: '1199px' },
              height: { xs: 'auto', lg: '237px' },
              display: 'flex',
              gap: '22px',
              overflowX: { xs: 'auto', lg: 'visible' },
              overflowY: 'visible',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              pb: { xs: 2, lg: 0 },
              mx: 'auto',
            }}
          >
            {/* Show 1 skeleton on mobile, 3 on desktop */}
            {Array.from({ length: 3 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: {
                    xs: index === 0 ? 'block' : 'none',
                    sm: index < 2 ? 'block' : 'none',
                    lg: 'block',
                  },
                }}
              >
                <SkeletonBanner />
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
        py: { xs: 4, md: 6 },
        backgroundColor: 'background.paper',
      }}
    >
      <Container 
        maxWidth={false}
        sx={{
          maxWidth: '1444px',
          px: { xs: 2, md: '133px' },
        }}
      >
        <Box
          ref={scrollContainerRef}
          sx={{
            width: { xs: '100%', lg: '1199px' },
            height: { xs: 'auto', lg: '237px' },
            display: 'flex',
            gap: '22px',
            overflowX: { xs: 'auto', lg: 'visible' },
            overflowY: 'visible',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            pb: { xs: 2, lg: 0 },
            opacity: 1,
            mx: 'auto',
          }}
        >
          {banners.map((banner) => (
            <Card
              key={banner.id}
              elevation={0}
              sx={{
                width: { xs: '320px', md: '389px' },
                minWidth: { xs: '320px', md: '389px' },
                height: { xs: '180px', md: '207px' },
                flexShrink: 0,
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                backgroundColor: banner.backgroundColor,
                border: '1px solid',
                borderColor: banner.id === 1 
                  ? 'rgba(255,255,255,0.1)' 
                  : 'rgba(0,0,0,0.08)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: { xs: 2.5, md: 3.5 },
                opacity: 1,
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
                },
              }}
            >
              {/* Left Content */}
              <Box sx={{ zIndex: 2 }}>
                <Chip
                  label={banner.brand}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.22)',
                    backdropFilter: 'blur(4px)',
                    color: banner.id === 1 ? 'white' : '#1F2937',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    letterSpacing: '0.5px',
                    height: '26px',
                    mb: 2,
                    border: 'none',
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 700,
                    color: banner.id === 1 ? 'white' : '#1F2937',
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.3,
                    maxWidth: '160px',
                  }}
                >
                  {banner.discount}
                </Typography>
              </Box>

              {/* Product Image/Illustration */}
              <Box
                sx={{
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Replace with actual product image */}
                <Box
                  component="img"
                  src={banner.image}
                  alt={`${banner.brand} promotional banner`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
                  }}
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.target.style.display = 'none';
                    const fallback = e.target.nextSibling;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Fallback placeholder */}
                <Box
                  sx={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    border: '2px dashed',
                    borderColor: banner.id === 1 
                      ? 'rgba(255,255,255,0.3)' 
                      : 'rgba(0,0,0,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: banner.id === 1 
                        ? 'rgba(255,255,255,0.6)' 
                        : 'rgba(0,0,0,0.4)',
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 500,
                    }}
                  >
                    Product Image
                  </Typography>
                </Box>
              </Box>

              {/* Decorative background gradient overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '60%',
                  height: '100%',
                  background: banner.id === 1
                    ? 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.1) 100%)'
                    : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 100%)',
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
