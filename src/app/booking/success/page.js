'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled } from '@mui/material/styles';

// Styled Components
const GradientBackground = styled(Box)({
  width: '100%',
  height: '288px',
  background: 'linear-gradient(180deg, #10B981 0%, #D1FAE5 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  position: 'relative',
  opacity: 1,
});

const ContentSection = styled(Paper)({
  maxWidth: '1440px',
  margin: '0 auto',
  marginTop: '66px',
  borderRadius: '22px',
  padding: '60px 133px',
  backgroundColor: 'white',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  opacity: 1,
});

const StyledButton = styled(Button)({
  backgroundColor: '#037166',
  color: 'white',
  fontFamily: 'var(--font-inter)',
  fontWeight: 700,
  fontSize: '16px',
  textTransform: 'none',
  padding: '14px 40px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#025951',
  },
});

const AppStoreButton = styled('img')({
  height: '48px',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const PhoneMockup = styled('img')({
  height: '350px',
  objectFit: 'contain',
});

export default function BookingSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    // Get booking ID from localStorage
    const storedBookingId = localStorage.getItem('currentBookingId');
    if (storedBookingId) {
      setBookingId(storedBookingId);
    }

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Redirect to home after countdown
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleDownloadApp = () => {
    // Add your app store link
    window.open('https://play.google.com/store', '_blank');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
        overflowX: 'hidden',
      }}
    >
      {/* Success Header Section - 288px height */}
      <GradientBackground>
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            animation: 'scaleIn 0.5s ease-out',
            '@keyframes scaleIn': {
              from: { transform: 'scale(0)', opacity: 0 },
              to: { transform: 'scale(1)', opacity: 1 },
            },
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 60, color: '#10B981' }} />
        </Box>

        <Typography
          sx={{
            fontFamily: 'var(--font-inter)',
            fontWeight: 700,
            fontSize: { xs: '24px', md: '32px' },
            color: 'white',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Your Booking is Successful
        </Typography>

        {bookingId && (
          <Typography
            sx={{
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              color: 'white',
              mt: 1,
              opacity: 0.9,
            }}
          >
            Booking ID: {bookingId}
          </Typography>
        )}
      </GradientBackground>

      {/* Download Center Section - 374px height, 22px border-radius */}
      <Container maxWidth={false} disableGutters>
        <ContentSection elevation={0}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Left Side - Text Content */}
            <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '50%' } }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 1,
                }}
              >
                Download Center
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  fontSize: { xs: '28px', md: '36px' },
                  color: '#1F2937',
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                Stay Updated on Your Order !
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '16px',
                  color: '#6B7280',
                  lineHeight: 1.6,
                  mb: 4,
                }}
              >
                Install the app and log in to track your Booking in real time
              </Typography>

              {/* App Store Buttons */}
              <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                <AppStoreButton
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  onClick={handleDownloadApp}
                />
                <AppStoreButton
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="Download on App Store"
                  onClick={handleDownloadApp}
                />
              </Stack>

              {/* Join Now Button */}
              <StyledButton fullWidth onClick={handleDownloadApp}>
                Join now
              </StyledButton>

              {/* Countdown Timer */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor: '#FEF3C7',
                  borderRadius: '8px',
                  border: '1px solid #FCD34D',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '14px',
                    color: '#92400E',
                    textAlign: 'center',
                    fontWeight: 600,
                  }}
                >
                  Redirecting to home in {countdown} seconds...
                </Typography>
              </Box>

              {/* Go Home Button */}
              <Button
                fullWidth
                variant="outlined"
                onClick={handleGoHome}
                sx={{
                  mt: 2,
                  borderColor: '#037166',
                  color: '#037166',
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 600,
                  textTransform: 'none',
                  padding: '12px',
                  '&:hover': {
                    borderColor: '#025951',
                    backgroundColor: '#F0FDFA',
                  },
                }}
              >
                Go to Home Now
              </Button>
            </Box>

            {/* Right Side - Phone Mockup */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: { xs: '100%', md: '50%' },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '280px',
                  height: '350px',
                  backgroundColor: '#E0F2F1',
                  borderRadius: '30px',
                  padding: '20px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                }}
              >
                {/* Status Bar */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 15,
                    left: 20,
                    right: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1F2937',
                    }}
                  >
                    9:41
                  </Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Box
                      sx={{
                        width: 15,
                        height: 10,
                        border: '1px solid #1F2937',
                        borderRadius: '2px',
                      }}
                    />
                  </Stack>
                </Box>

                {/* Skip Button */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 50,
                    right: 20,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '14px',
                      color: '#6B7280',
                      cursor: 'pointer',
                    }}
                  >
                    Skip
                  </Typography>
                </Box>

                {/* Illustration */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 180,
                      height: 180,
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '80px',
                        filter: 'grayscale(1)',
                      }}
                    >
                      📱
                    </Typography>
                  </Box>
                </Box>

                {/* Pagination Dots */}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Box
                    sx={{
                      width: 30,
                      height: 4,
                      backgroundColor: '#037166',
                      borderRadius: '2px',
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 4,
                      backgroundColor: '#D1D5DB',
                      borderRadius: '2px',
                    }}
                  />
                </Stack>
              </Box>
            </Box>
          </Stack>
        </ContentSection>
      </Container>

      {/* Spacer */}
      <Box sx={{ height: '60px' }} />
    </Box>
  );
}
