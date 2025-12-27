'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Radio,
  RadioGroup,
  Button,
  Paper,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Card,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PublicIcon from '@mui/icons-material/Public';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';

export default function PaymentGatewayClient() {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('online');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState(null);

  const BOOKING_KEY = 'bookingContext';

  // ✅ 🔥 CRITICAL: Fetch and CLEAN data from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Try new key first
      let savedBooking = localStorage.getItem(BOOKING_KEY);

      // Fallback to old key
      if (!savedBooking) {
        savedBooking = localStorage.getItem('currentBooking');
      }

      const token = localStorage.getItem('authToken');

      if (!savedBooking) {
        setError('No booking data found');
        setLoading(false);
        return;
      }

      if (!token) {
        setError('Please login to continue');
        setLoading(false);
        return;
      }

      const parsedBooking = JSON.parse(savedBooking);
      console.log('📦 Retrieved booking from localStorage (RAW):', parsedBooking);

      // 🔥 CRITICAL: Clean the booking data based on flow
      let cleanedBooking;

      if (
        parsedBooking.providerId &&
        parsedBooking.providerId !== null &&
        parsedBooking.providerId !== 'null'
      ) {
        // SERVICE CENTER FLOW - Keep providerId
        cleanedBooking = {
          serviceId: parsedBooking.serviceId,
          providerId: parsedBooking.providerId,
          serviceAddressId: parsedBooking.serviceAddressId,
          bookedDate: parsedBooking.bookedDate,
          bookedTime: parsedBooking.bookedTime,
          sourceOfLead: parsedBooking.sourceOfLead || 'Website',
          addMoreInfo: parsedBooking.addMoreInfo || '',
          serviceBookingCost: parsedBooking.serviceBookingCost,
          serviceName: parsedBooking.serviceName,
        };
        console.log('✅ SERVICE CENTER FLOW - Provider ID:', parsedBooking.providerId);
      } else {
        // DIRECT SERVICE FLOW - Remove providerId completely
        cleanedBooking = {
          serviceId: parsedBooking.serviceId,
          serviceAddressId: parsedBooking.serviceAddressId,
          bookedDate: parsedBooking.bookedDate,
          bookedTime: parsedBooking.bookedTime,
          sourceOfLead: parsedBooking.sourceOfLead || 'Website',
          addMoreInfo: parsedBooking.addMoreInfo || '',
          serviceBookingCost: parsedBooking.serviceBookingCost,
          serviceName: parsedBooking.serviceName,
        };
        // Explicitly DO NOT include providerId
        console.log('✅ DIRECT SERVICE FLOW - Provider ID REMOVED');
      }

      console.log('📦 Cleaned booking data:', cleanedBooking);
      console.log('📦 Keys in cleaned booking:', Object.keys(cleanedBooking));

      // Update localStorage with cleaned data
      localStorage.setItem(BOOKING_KEY, JSON.stringify(cleanedBooking));
      localStorage.setItem('currentBooking', JSON.stringify(cleanedBooking));

      setBookingData(cleanedBooking);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      setError('Failed to load booking data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // 🔥 API call for Pay Online (Initiate Payment)
  const initiateOnlinePayment = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // 🔥 Build payload WITHOUT providerId if it doesn't exist
      const payload = {
        serviceId: bookingData.serviceId,
        serviceAddressId: bookingData.serviceAddressId,
        sourceOfLead: bookingData.sourceOfLead || 'Website',
        addMoreInfo: bookingData.addMoreInfo || '',
        bookedDate: bookingData.bookedDate,
        bookedTime: bookingData.bookedTime,
        totalAmount:
          bookingData.serviceBookingCost ||
          bookingData.serviceCharges ||
          bookingData.total ||
          '125',
      };

      // 🔥 Only add providerId if it exists (Service Center Flow)
      if (bookingData.providerId) {
        payload.providerId = bookingData.providerId;
      }

      console.log('💳 Initiating online payment with payload:', payload);
      console.log('💳 Payload keys:', Object.keys(payload));

      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/initiate-service-booking-payment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log('📥 Payment initiation response:', data);

      if (data.success && data.access_key) {
        localStorage.setItem('txnid', data.txnid);
        localStorage.setItem('paymentBreakdown', JSON.stringify(data.breakdown));

        console.log('🚀 Redirecting to payment gateway...');
        window.location.href = `https://testpay.easebuzz.in/pay/${data.access_key}`;
      } else {
        setError(data.message || 'Failed to initiate payment');
        setProcessing(false);
      }
    } catch (err) {
      console.error('❌ Payment initiation error:', err);
      setError('Network error. Please try again.');
      setProcessing(false);
    }
  };

  // 🔥 API call for Pay at Doorstep (Direct Booking)
  const bookServiceDirectly = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // 🔥 Build payload WITHOUT providerId if it doesn't exist
      const payload = {
        serviceId: bookingData.serviceId,
        serviceAddressId: bookingData.serviceAddressId,
        sourceOfLead: bookingData.sourceOfLead || 'Website',
        addMoreInfo: bookingData.addMoreInfo || '',
        bookedDate: bookingData.bookedDate,
        bookedTime: bookingData.bookedTime,
      };

      // 🔥 Only add providerId if it exists (Service Center Flow)
      if (bookingData.providerId) {
        payload.providerId = bookingData.providerId;
      }

      console.log('📋 Booking service (Pay at Doorstep):', payload);
      console.log('📋 Payload keys:', Object.keys(payload));

      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/book_service',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log('📥 Booking response:', data);

      if (data.success || data.status === 'success') {
        if (data.data?.bookingId || data.bookingId) {
          localStorage.setItem('currentBookingId', data.data?.bookingId || data.bookingId);
        }

        console.log('✅ Booking successful, redirecting to success page...');
        router.push('/booking/success');
      } else {
        setError(data.message || 'Booking failed. Please try again.');
        setProcessing(false);
      }
    } catch (err) {
      console.error('❌ Booking error:', err);
      setError('Network error. Please try again.');
      setProcessing(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!bookingData) {
      setError('Booking data not found');
      return;
    }

    setProcessing(true);
    setError('');

    console.log('💳 Processing payment with method:', paymentMethod);
    console.log('💳 Flow type:', bookingData.providerId ? 'Service Center (Flow 2)' : 'Direct Service (Flow 1)');

    // Route to appropriate API based on payment method
    if (paymentMethod === 'online' || paymentMethod === 'wallet') {
      await initiateOnlinePayment();
    } else if (paymentMethod === 'doorstep') {
      await bookServiceDirectly();
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Show loading spinner
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #FDCB6A 0%, #FFFFFF 100%)',
        }}
      >
        <CircularProgress sx={{ color: '#037166' }} />
      </Box>
    );
  }

  // Show error if no booking data
  if (!bookingData) {
    return (
      <Box
        sx={{
          background: 'linear-gradient(180deg, #FDCB6A 0%, #FFFFFF 100%)',
          minHeight: '100vh',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'No booking data found'}
        </Alert>
        <Button
          onClick={() => router.push('/')}
          sx={{
            backgroundColor: '#037166',
            color: 'white',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#025951' },
          }}
        >
          Go to Home
        </Button>
      </Box>
    );
  }

  const serviceCharges = Number(
    bookingData?.serviceBookingCost || bookingData?.serviceCharges || bookingData?.total || 125
  );

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #FDCB6A 0%, #FFFFFF 100%)',
        minHeight: '100vh',
        pb: { xs: 4, md: 6 },
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#037166',
          color: '#fff',
          borderRadius: 0,
          px: { xs: 2, md: 4 },
          py: 2.5,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 2px 12px rgba(3, 113, 102, 0.2)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={handleBack}
            sx={{
              color: '#fff',
              p: 0,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              fontSize: { xs: '18px', md: '22px' },
            }}
          >
            Final Checkout
          </Typography>
        </Stack>
      </Paper>

      <Container maxWidth="sm" sx={{ mt: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => setError('')}
            sx={{
              mb: 3,
              borderRadius: 2,
              fontFamily: 'var(--font-inter)',
              fontWeight: 500,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Booking Details Card */}
        <Card
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 4,
            borderRadius: '12px',
            bgcolor: 'white',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '12px',
                  color: '#6B7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 0.5,
                }}
              >
                Booking Date & Time
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: { xs: '16px', md: '18px' },
                  fontWeight: 700,
                  color: '#1F2937',
                }}
              >
                {bookingData.bookedDate} at {bookingData.bookedTime}
              </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box>
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '12px',
                  color: '#6B7280',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  mb: 0.5,
                }}
              >
                Service
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontSize: '14px',
                  color: '#374151',
                  fontWeight: 500,
                  lineHeight: 1.5,
                }}
              >
                {bookingData.serviceName || 'Service'}
              </Typography>
            </Box>
          </Stack>
        </Card>

        {/* Payment Method Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              color: '#1F2937',
              mb: 3,
              fontSize: { xs: '18px', md: '20px' },
            }}
          >
            Select Payment Method
          </Typography>

          <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
            {/* D-Hub Wallet */}
            <Card
              elevation={0}
              onClick={() => setPaymentMethod('wallet')}
              sx={{
                p: { xs: 2, md: 3 },
                mb: 2.5,
                borderRadius: '12px',
                cursor: 'pointer',
                bgcolor: 'white',
                border:
                  paymentMethod === 'wallet'
                    ? '2px solid #037166'
                    : '1px solid #E5E7EB',
                boxShadow:
                  paymentMethod === 'wallet'
                    ? '0 4px 12px rgba(3, 113, 102, 0.15)'
                    : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(3, 113, 102, 0.2)',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2.5}>
                <Box
                  sx={{
                    bgcolor: paymentMethod === 'wallet' ? '#E0F7F6' : '#F3F4F6',
                    p: 1.5,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <AccountBalanceWalletIcon
                    sx={{
                      color: paymentMethod === 'wallet' ? '#037166' : '#6B7280',
                      fontSize: { xs: 28, md: 32 },
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 700,
                      color: '#1F2937',
                      fontSize: { xs: '15px', md: '16px' },
                      mb: 0.5,
                    }}
                  >
                    D-Hub Wallet
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: '#6B7280',
                      fontSize: { xs: '12px', md: '13px' },
                    }}
                  >
                    Fastest payment via wallet
                  </Typography>
                </Box>

                <Radio
                  checked={paymentMethod === 'wallet'}
                  value="wallet"
                  sx={{
                    color: '#E0E0E0',
                    '&.Mui-checked': { color: '#037166' },
                  }}
                />
              </Stack>
            </Card>

            {/* Pay Online */}
            <Card
              elevation={0}
              onClick={() => setPaymentMethod('online')}
              sx={{
                p: { xs: 2, md: 3 },
                mb: 2.5,
                borderRadius: '12px',
                cursor: 'pointer',
                bgcolor: 'white',
                border:
                  paymentMethod === 'online'
                    ? '2px solid #037166'
                    : '1px solid #E5E7EB',
                boxShadow:
                  paymentMethod === 'online'
                    ? '0 4px 12px rgba(3, 113, 102, 0.15)'
                    : '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(3, 113, 102, 0.2)',
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2.5}>
                <Box
                  sx={{
                    bgcolor: paymentMethod === 'online' ? '#E0F7F6' : '#F3F4F6',
                    p: 1.5,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <PublicIcon
                    sx={{
                      color: paymentMethod === 'online' ? '#037166' : '#6B7280',
                      fontSize: { xs: 28, md: 32 },
                    }}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 700,
                      color: '#1F2937',
                      fontSize: { xs: '15px', md: '16px' },
                      mb: 0.5,
                    }}
                  >
                    Pay Online
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: '#6B7280',
                      fontSize: { xs: '12px', md: '13px' },
                    }}
                  >
                    UPI / Card / NetBanking
                  </Typography>
                </Box>

                <Radio
                  checked={paymentMethod === 'online'}
                  value="online"
                  sx={{
                    color: '#E0E0E0',
                    '&.Mui-checked': { color: '#037166' },
                  }}
                />
              </Stack>
            </Card>

            {/* Pay at Doorstep - DISABLED */}
            <Card
              elevation={0}
              onClick={() => {}}
              sx={{
                p: { xs: 2, md: 3 },
                mb: 3,
                borderRadius: '12px',
                cursor: 'not-allowed',
                bgcolor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                opacity: 0.6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                position: 'relative',
              }}
            >
              {/* Disabled Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  bgcolor: '#FEE2E2',
                  color: '#DC2626',
                  px: 2,
                  py: 0.75,
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-inter)',
                }}
              >
                Coming Soon
              </Box>

              <Stack direction="row" alignItems="center" spacing={2.5}>
                <Box
                  sx={{
                    bgcolor: '#F3F4F6',
                    p: 1.5,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocalAtmIcon sx={{ color: '#9CA3AF', fontSize: { xs: 28, md: 32 } }} />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 700,
                      color: '#9CA3AF',
                      fontSize: { xs: '15px', md: '16px' },
                      mb: 0.5,
                      textDecoration: 'line-through',
                    }}
                  >
                    Pay at Doorstep
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: '#9CA3AF',
                      fontSize: { xs: '12px', md: '13px' },
                    }}
                  >
                    Cash after service completion
                  </Typography>
                </Box>

                <Radio
                  disabled
                  checked={false}
                  value="doorstep"
                  sx={{
                    color: '#E0E0E0',
                  }}
                />
              </Stack>
            </Card>
          </RadioGroup>
        </Box>

        {/* Price Summary Card */}
        <Card
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: '12px',
            bgcolor: 'white',
            mb: 3,
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Stack spacing={2.5}>
            {/* Service Charge */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  color: '#6B7280',
                  fontSize: { xs: '13px', md: '14px' },
                  fontWeight: 500,
                }}
              >
                Service Booking Fee
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 600,
                  color: '#1F2937',
                  fontSize: { xs: '13px', md: '14px' },
                }}
              >
                ₹{serviceCharges.toFixed(2)}
              </Typography>
            </Stack>

            <Divider />

            {/* Total */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  color: '#1F2937',
                  fontSize: { xs: '15px', md: '16px' },
                }}
              >
                Total Payable
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  color: '#037166',
                  fontSize: { xs: '17px', md: '18px' },
                }}
              >
                ₹{serviceCharges.toFixed(2)}
              </Typography>
            </Stack>
          </Stack>
        </Card>

        {/* Info Note */}
        <Card
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: '12px',
            bgcolor: '#F0F9F7',
            border: '1px solid #D4EAE8',
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={2}>
            <InfoOutlinedIcon
              sx={{
                color: '#037166',
                fontSize: { xs: 22, md: 24 },
                flexShrink: 0,
                mt: 0.5,
              }}
            />
            <Stack spacing={1.5}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  color: '#037166',
                  fontSize: { xs: '13px', md: '14px' },
                }}
              >
                Important Information
              </Typography>

              <Stack spacing={1}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <CheckCircleIcon
                    sx={{
                      color: '#037166',
                      fontSize: { xs: 16, md: 18 },
                      mt: 0.3,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: '#374151',
                      fontSize: { xs: '12px', md: '13px' },
                      lineHeight: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    Remaining amount will be collected at inspection
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <CheckCircleIcon
                    sx={{
                      color: '#037166',
                      fontSize: { xs: 16, md: 18 },
                      mt: 0.3,
                      flexShrink: 0,
                    }}
                  />
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: '#374151',
                      fontSize: { xs: '12px', md: '13px' },
                      lineHeight: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    Spare parts will be charged separately
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Card>

        {/* Confirm Booking Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleConfirmBooking}
          disabled={processing}
          sx={{
            py: { xs: 1.5, md: 2 },
            bgcolor: '#037166',
            fontSize: { xs: '15px', md: '17px' },
            fontWeight: 700,
            fontFamily: 'var(--font-inter)',
            textTransform: 'none',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(3, 113, 102, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: '#025951',
              boxShadow: '0 6px 16px rgba(3, 113, 102, 0.4)',
            },
            '&:disabled': {
              backgroundColor: '#BDBDBD',
              boxShadow: 'none',
            },
          }}
        >
          {processing ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            'Confirm & Proceed to Payment'
          )}
        </Button>

        {/* Security Badge */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 3,
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-inter)',
              fontSize: { xs: '11px', md: '12px' },
              color: '#6B7280',
              textAlign: 'center',
            }}
          >
            🔒 Secure payment powered by Easebuzz
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
