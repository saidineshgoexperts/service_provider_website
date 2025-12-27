'use client';

import { Box, Container, Typography, Button, Stack } from '@mui/material';
import Image from 'next/image';
import FloatingIcons from '../FloatingIcons';

export default function HeroSection() {
  const serviceImages = [
    { id: 1, src: '/images/service.jpg', alt: 'Cleaning Service', height: 312, top: 0 },
    { id: 2, src: '/images/service.jpg', alt: 'Repair Service', height: 294, top: 19 },
    { id: 3, src: '/images/service.jpg', alt: 'AC Service', height: 270, top: 31 },
    { id: 4, src: '/images/service.jpg', alt: 'Cleaning Service', height: 248, top: 42 },
    { id: 5, src: '/images/service.jpg', alt: 'Appliance Repair', height: 248, top: 42 },
    { id: 6, src: '/images/service.jpg', alt: 'Cleaning Service', height: 270, top: 31 },
    { id: 7, src: '/images/service.jpg', alt: 'Repair Service', height: 294, top: 19 },
    { id: 8, src: '/images/service.jpg', alt: 'Home Service', height: 392, top: 22 },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        height: '595px',
        background: 'linear-gradient(180deg, #037166 99.71%, #FFFFFF 93.51%)',
        position: 'relative',
        overflow: 'visible',
        mb: { xs: 25, md: 30 },
      }}
    >
      {/* Floating Icons Container */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}
      >
        <FloatingIcons />
      </Box>

      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
          pt: { xs: 6, md: 8 },
          pb: { xs: 8, md: 10 },
        }}
      >
        {/* Main Headline */}
        <Typography
          component="h1"
          sx={{
            fontFamily: 'Inter, Poppins, sans-serif',
            fontWeight: 700,
            fontSize: { xs: '32px', md: '42px' },
            lineHeight: '100%',
            textAlign: 'center',
            color: 'white',
            width: { xs: '90%', md: '750px' },
            opacity: 1,
            mb: 3,
            position: 'relative',
            zIndex: 3,
          }}
        >
          Broken Appliance? We'll Fix It Today.
        </Typography>

        {/* Subheadline */}
        <Typography
          variant="body1"
          sx={{
            color: 'white',
            mb: 5,
            maxWidth: '700px',
            fontSize: { xs: '1rem', md: '1.125rem' },
            lineHeight: 1.7,
            position: 'relative',
            zIndex: 3,
          }}
        >
          Don't let malfunctioning appliances disrupt your life. Our certified
          technicians provide fast, affordable repairs with guaranteed results.
        </Typography>

        {/* CTA Buttons */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{
            position: 'relative',
            zIndex: 3,
          }}
        >
          <Button
            variant="outlined"
            size="large"
            sx={{
              color: 'white',
              borderColor: 'white',
              borderWidth: 2,
              px: 4,
              py: 1.5,
              fontSize: '1.05rem',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'white',
                borderWidth: 2,
                backgroundColor: 'rgba(255,255,255,0.15)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            View Services
          </Button>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.05rem',
              fontWeight: 600,
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#F5F5F5',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              },
            }}
          >
            Book a Service Now
          </Button>
        </Stack>
      </Container>

      {/* Static Image Row with Staggered Heights */}
      <Box
        sx={{
          position: 'absolute',
          top: '480px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1450px',
          maxWidth: '100vw',
          height: '332px',
          overflow: 'hidden',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2.5,
            height: '100%',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          {serviceImages.map((image, index) => (
            <Box
              key={image.id}
              sx={{
                width: '170px',
                height: `${image.height}px`,
                minWidth: '170px',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#E5E7EB',
                flexShrink: 0,
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                opacity: 1,
                marginTop: `${image.top}px`,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="170px"
                style={{
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
                quality={90}
                priority={index < 4}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
