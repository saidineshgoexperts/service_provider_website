'use client';

import { Box, IconButton } from '@mui/material';
import { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function ServiceImageCarousel({ service }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState({}); // Track errors per image index

  const getImages = () => {
    const images = [];

    if (service?.storeData?.bannerImage) {
      images.push(`https://api.doorstephub.com/${service.storeData.bannerImage}`);
    }

    if (service?.storeData?.logo) {
      images.push(`https://api.doorstephub.com/${service.storeData.logo}`);
    }

    if (service?.serviceImages && service.serviceImages.length > 0) {
      service.serviceImages.forEach((img) => {
        if (img) images.push(`https://api.doorstephub.com/${img}`);
      });
    }

    // ✅ Use online placeholder that always works
    return images.length > 0
      ? images
      : ['https://via.placeholder.com/673x448/037166/FFFFFF?text=No+Image+Available'];
  };

  const images = getImages();

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  // ✅ Fixed: Prevent infinite loop
  const handleImageError = (e) => {
    // Only handle error once per image
    if (!imageError[currentImageIndex]) {
      console.warn('Image failed to load:', images[currentImageIndex]);
      setImageError((prev) => ({ ...prev, [currentImageIndex]: true }));
      // Set to a valid online placeholder
      e.target.src =
        'https://via.placeholder.com/673x448/037166/FFFFFF?text=Image+Not+Available';
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: { xs: '100%', md: '673px' },
        aspectRatio: { xs: '16/10', md: '673/448' },
        height: { xs: 'auto', md: '448px' },
        borderRadius: { xs: '8px', md: '12px' },
        overflow: 'hidden',
        backgroundColor: '#E5E7EB',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Main Image */}
      <Box
        component="img"
        src={images[currentImageIndex]}
        alt={service?.storeData?.name || 'Service'}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={handleImageError}
      />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrevious}
            sx={{
              position: 'absolute',
              left: { xs: 8, md: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#037166',
              width: { xs: 36, md: 40 },
              height: { xs: 36, md: 40 },
              '&:hover': {
                backgroundColor: 'white',
                transform: 'translateY(-50%) scale(1.1)',
              },
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
              minWidth: { xs: 36, md: 40 },
              minHeight: { xs: 36, md: 40 },
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: { xs: 8, md: 16 },
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#037166',
              width: { xs: 36, md: 40 },
              height: { xs: 36, md: 40 },
              '&:hover': {
                backgroundColor: 'white',
                transform: 'translateY(-50%) scale(1.1)',
              },
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.2s ease',
              minWidth: { xs: 36, md: 40 },
              minHeight: { xs: 36, md: 40 },
            }}
          >
            <ChevronRightIcon sx={{ fontSize: { xs: 20, md: 24 } }} />
          </IconButton>
        </>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 12, md: 16 },
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: { xs: 0.75, md: 1 },
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: { xs: '6px 12px', md: '8px 16px' },
            borderRadius: '20px',
            backdropFilter: 'blur(4px)',
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => handleDotClick(index)}
              sx={{
                width: currentImageIndex === index ? { xs: 20, md: 24 } : { xs: 6, md: 8 },
                height: { xs: 6, md: 8 },
                borderRadius: '4px',
                backgroundColor:
                  currentImageIndex === index
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
            />
          ))}
        </Box>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 12, md: 16 },
            right: { xs: 12, md: 16 },
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#FFFFFF',
            padding: { xs: '4px 10px', md: '6px 12px' },
            borderRadius: '12px',
            fontSize: { xs: '12px', md: '14px' },
            fontWeight: 600,
            backdropFilter: 'blur(4px)',
            fontFamily: 'var(--font-inter)',
          }}
        >
          {currentImageIndex + 1} / {images.length}
        </Box>
      )}
    </Box>
  );
}
