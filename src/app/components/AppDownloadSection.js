'use client';

import { Box, Container, Typography, Button, Stack, Skeleton } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import { useState, useEffect } from 'react';

export default function AppDownloadSection() {
  const [loading, setLoading] = useState(true);

  // Simulate loading (remove this in production if section is static)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Loading State with Shimmer
  if (loading) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          backgroundColor: 'background.default',
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
              width: { xs: '100%', lg: '1178px' },
              height: { xs: 'auto', lg: '374px' },
              backgroundColor: '#E5E7EB',
              borderRadius: '22px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              pt: '10px',
              pr: { xs: 3, md: '133px' },
              pb: { xs: 4, md: '10px' },
              pl: { xs: 3, md: '133px' },
              position: 'relative',
              mx: 'auto',
            }}
          >
            {/* Left Content Skeleton */}
            <Box 
              sx={{ 
                maxWidth: 550, 
                width: '100%',
                py: { xs: 3, md: 0 },
              }}
            >
              {/* Overline Skeleton */}
              <Skeleton
                variant="text"
                width={160}
                height={20}
                animation="wave"
                sx={{
                  bgcolor: 'grey.300',
                  mb: 1.5,
                }}
              />

              {/* Title Skeleton */}
              <Skeleton
                variant="text"
                width="90%"
                height={{ xs: 40, md: 56 }}
                animation="wave"
                sx={{
                  bgcolor: 'grey.300',
                  mb: 1,
                }}
              />
              <Skeleton
                variant="text"
                width="70%"
                height={{ xs: 40, md: 56 }}
                animation="wave"
                sx={{
                  bgcolor: 'grey.300',
                  mb: 2.5,
                }}
              />

              {/* Description Skeleton */}
              <Skeleton
                variant="text"
                width="95%"
                height={24}
                animation="wave"
                sx={{
                  bgcolor: 'grey.300',
                  mb: 0.5,
                }}
              />
              <Skeleton
                variant="text"
                width="80%"
                height={24}
                animation="wave"
                sx={{
                  bgcolor: 'grey.300',
                  mb: 4,
                }}
              />

              {/* App Store Buttons Skeleton */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mb: 3 }}
              >
                <Skeleton
                  variant="rectangular"
                  width={{ xs: '100%', sm: 220 }}
                  height={48}
                  animation="wave"
                  sx={{
                    borderRadius: '8px',
                    bgcolor: 'grey.300',
                  }}
                />
                <Skeleton
                  variant="rectangular"
                  width={{ xs: '100%', sm: 220 }}
                  height={48}
                  animation="wave"
                  sx={{
                    borderRadius: '8px',
                    bgcolor: 'grey.300',
                  }}
                />
              </Stack>

              {/* Join Now Link Skeleton */}
              <Skeleton
                variant="text"
                width={120}
                height={24}
                animation="wave"
                sx={{
                  bgcolor: 'grey.300',
                }}
              />
            </Box>

            {/* Right Illustration Skeleton */}
            <Box
              sx={{
                width: { xs: '100%', md: 320 },
                height: { xs: 220, md: 300 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mt: { xs: 4, md: 0 },
                position: 'relative',
              }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{
                  borderRadius: '20px',
                  bgcolor: 'grey.300',
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: 'background.default',
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
            width: { xs: '100%', lg: '1178px' },
            height: { xs: 'auto', lg: '374px' },
            background: 'linear-gradient(90deg, #024F46 0%, #4CB89F 100%)',
            borderRadius: '22px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: '10px',
            pr: { xs: 3, md: '133px' },
            pb: { xs: 4, md: '10px' },
            pl: { xs: 3, md: '133px' },
            position: 'relative',
            opacity: 1,
            mx: 'auto',
          }}
        >
          {/* Left Content */}
          <Box 
            sx={{ 
              maxWidth: 550, 
              zIndex: 2,
              py: { xs: 3, md: 0 },
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                mb: 1.5,
                display: 'block',
              }}
            >
              DOWNLOAD CENTER
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                color: 'white',
                mb: 2.5,
                lineHeight: 1.2,
              }}
            >
              Download the App & Grow Your Service Business
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.92)',
                fontFamily: 'var(--font-inter)',
                mb: 4,
                fontSize: '1.063rem',
                lineHeight: 1.6,
              }}
            >
              Start your journey toward earning more and serving better.
            </Typography>

            {/* App Store Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ mb: 3 }}
            >
              <Button
                variant="contained"
                startIcon={<AndroidIcon sx={{ fontSize: '24px' }} />}
                sx={{
                  backgroundColor: '#000000',
                  color: 'white',
                  fontFamily: 'var(--font-inter)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                  px: 3,
                  py: 1.5,
                  borderRadius: '8px',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#1F2937',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                  },
                }}
              >
                Get it on Google Play
              </Button>
              <Button
                variant="contained"
                startIcon={<AppleIcon sx={{ fontSize: '24px' }} />}
                sx={{
                  backgroundColor: '#000000',
                  color: 'white',
                  fontFamily: 'var(--font-inter)',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                  px: 3,
                  py: 1.5,
                  borderRadius: '8px',
                  boxShadow: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#1F2937',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                  },
                }}
              >
                Download on App Store
              </Button>
            </Stack>

            <Button
              variant="text"
              sx={{
                color: 'white',
                fontFamily: 'var(--font-inter)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '15px',
                textDecoration: 'underline',
                px: 0,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'transparent',
                  textDecoration: 'underline',
                  color: 'rgba(255,255,255,0.85)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              Join Now →
            </Button>
          </Box>

          {/* Right Illustration/Image */}
          <Box
            sx={{
              width: { xs: '100%', md: 320 },
              height: { xs: 220, md: 300 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: { xs: 4, md: 0 },
              position: 'relative',
            }}
          >
            {/* Replace this with your actual app mockup image */}
            <Box
              component="img"
              src="/app-mockup.png"
              alt="Mobile App Preview"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
              }}
              onError={(e) => {
                // Fallback if image doesn't exist
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback placeholder */}
            <Box
              sx={{
                display: 'none',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.12)',
                borderRadius: '20px',
                border: '2px dashed rgba(255,255,255,0.3)',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 500,
                }}
              >
                App Illustration
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255,255,255,0.5)',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                (Replace with actual mockup)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
