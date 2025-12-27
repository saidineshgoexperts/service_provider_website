'use client';

import { Box, Container, Typography, Button, Stack, Card, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeIcon from '@mui/icons-material/Home';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';

export default function BookingSuccessPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Get booking data from localStorage
    const booking = JSON.parse(localStorage.getItem('currentBooking')) || {};
    const bookingId = localStorage.getItem('currentBookingId') || 'DHB' + Date.now();
    
    setBookingData({
      bookingId: bookingId,
      serviceName: booking.serviceName || 'Service',
      date: booking.bookedDate || new Date().toLocaleDateString(),
      time: booking.bookedTime || 'TBD',
      amount: booking.serviceCharges || booking.total || '125',
    });
  }, []);

  // App Store URLs - Replace with your actual app links
  const IOS_APP_URL = 'https://apps.apple.com/app/your-app-id'; // Replace with actual iOS app URL
  const ANDROID_APP_URL = 'https://play.google.com/store/apps/details?id=com.doorstephub.app'; // Replace with actual Android app URL

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }}
        >
          {/* Thank You Image at Top */}
          <Box
            component="img"
            src="/ThankyouD-Hub.png"
            alt="Thank You"
            sx={{
              width: '100%',
              height: 'auto',
              display: 'block',
              maxHeight: '400px',
              objectFit: 'cover',
            }}
          />

          {/* Booking Information Below */}
          <Box sx={{ p: { xs: 3, md: 5 } }}>
            {/* Success Message */}
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 700,
                color: '#037166',
                mb: 1,
                textAlign: 'center',
              }}
            >
              Your booking has been confirmed successfully!
            </Typography>

            {/* What's Next Section */}
            <Box
              sx={{
                bgcolor: '#E0F7F4',
                p: 3,
                borderRadius: 3,
                mb: 4,
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#037166" mb={2}>
                What's Next?
              </Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ 
                    color: '#FFFFFF', 
                    bgcolor: '#037166',
                    fontWeight: 700,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}>
                    1
                  </Box>
                  <Box>Our technician will contact you to confirm the appointment</Box>
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ 
                    color: '#FFFFFF', 
                    bgcolor: '#037166',
                    fontWeight: 700,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}>
                    2
                  </Box>
                  <Box>You will receive a confirmation SMS/Email with booking details</Box>
                </Typography>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Box sx={{ 
                    color: '#FFFFFF', 
                    bgcolor: '#037166',
                    fontWeight: 700,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    flexShrink: 0,
                  }}>
                    3
                  </Box>
                  <Box>Track your service status On Mobile App</Box>
                </Typography>
              </Stack>
            </Box>

            {/* Go to Home Button */}
            <Stack spacing={2} justifyContent="center" sx={{ mb: 4 }}>
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={() => router.push('/')}
                fullWidth
                sx={{
                  bgcolor: '#037166',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  '&:hover': {
                    bgcolor: '#025951',
                  },
                }}
              >
                Go to Home
              </Button>
            </Stack>

            {/* Download App Section */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: '#1F2937',
                  mb: 2,
                  fontFamily: 'var(--font-poppins)',
                }}
              >
                Download Our Mobile App
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6B7280',
                  mb: 3,
                }}
              >
                Track your bookings, manage services, and get instant updates
              </Typography>

              {/* App Store Buttons */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
                alignItems="center"
              >
                {/* iOS App Store Button */}
                <Button
                  variant="outlined"
                  startIcon={<AppleIcon sx={{ fontSize: 28 }} />}
                  onClick={() => window.open(IOS_APP_URL, '_blank')}
                  sx={{
                    borderColor: '#000000',
                    color: '#000000',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    minWidth: 200,
                    '&:hover': {
                      borderColor: '#000000',
                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '0.7rem', lineHeight: 1 }}>
                      Download on the
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
                      App Store
                    </Typography>
                  </Box>
                </Button>

                {/* Google Play Store Button */}
                <Button
                  variant="outlined"
                  startIcon={<AndroidIcon sx={{ fontSize: 28 }} />}
                  onClick={() => window.open(ANDROID_APP_URL, '_blank')}
                  sx={{
                    borderColor: '#037166',
                    color: '#037166',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    minWidth: 200,
                    '&:hover': {
                      borderColor: '#025951',
                      bgcolor: 'rgba(3, 113, 102, 0.05)',
                    },
                  }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography sx={{ fontSize: '0.7rem', lineHeight: 1 }}>
                      GET IT ON
                    </Typography>
                    <Typography sx={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.2 }}>
                      Google Play
                    </Typography>
                  </Box>
                </Button>
              </Stack>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3 }} />

            {/* Footer Text */}
            <Typography 
              variant="body2" 
              sx={{ 
                textAlign: 'center',
                color: '#6B7280',
                fontSize: '0.875rem',
              }}
            >
              Thank you for choosing D-Hub | Doorstep Hub 💚
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
