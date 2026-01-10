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
  Tooltip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PublicIcon from '@mui/icons-material/Public';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useRouter } from 'next/navigation';

export default function PaymentGatewayClient() {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState('online');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartData, setCartData] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);

  const GUEST_CART_KEY = 'guestCart';
  const BOOKING_DETAILS_KEY = 'bookingDetails';

  // ✅ Fetch cart and booking details from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedCart = localStorage.getItem(GUEST_CART_KEY);
      const savedBookingDetails = localStorage.getItem(BOOKING_DETAILS_KEY);
      const token = localStorage.getItem('authToken');

      console.log('📦 Loading payment page data...');

      if (!savedCart) {
        setError('No cart data found');
        setLoading(false);
        return;
      }

      if (!token) {
        setError('Please login to continue');
        setLoading(false);
        return;
      }

      const parsedCart = JSON.parse(savedCart);
      const parsedBooking = savedBookingDetails ? JSON.parse(savedBookingDetails) : null;

      console.log('📦 Cart:', parsedCart);
      console.log('📦 Booking:', parsedBooking);
      console.log('💰 Booking Charge:', parsedCart.serviceBookingCost);
      console.log('🔍 Inspection Cost:', parsedCart.inspectionCost);

      // Validate
      if (!parsedCart.items || parsedCart.items.length === 0) {
        setError('Your cart is empty');
        setLoading(false);
        return;
      }

      if (!parsedBooking || !parsedBooking.serviceAddressId) {
        setError('Missing booking details. Please select address.');
        setLoading(false);
        return;
      }

      setCartData(parsedCart);
      setBookingDetails(parsedBooking);

      console.log('✅ Payment page loaded successfully');
    } catch (error) {
      console.error('❌ Error loading payment page:', error);
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  // 🔥 Calculate services total
  const calculateServicesTotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // 🔥 Calculate addons total
  const calculateAddonsTotal = () => {
    if (!cartData?.addons) return 0;
    return cartData.addons.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
  };

  // 🔥 Calculate grand total (all charges)
  const calculateGrandTotal = () => {
    const servicesTotal = calculateServicesTotal();
    const addonsTotal = calculateAddonsTotal();
    const basePrice = cartData?.basePrice || 0;
    const inspectionCost = cartData?.inspectionCost || 0;
    
    return servicesTotal + addonsTotal + basePrice + inspectionCost;
  };

  // 🔥 Calculate only booking charge for payment
  const calculateBookingCharge = () => {
    return cartData?.serviceBookingCost || 0;
  };

  // 🔥 Clear cart after successful payment
  const clearCart = async () => {
    try {
      const token = localStorage.getItem('authToken');

      console.log('🧹 Clearing cart...');

      // Call clear cart API
      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/service-cart/clear',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('📥 Clear cart response:', data);

      // Clear localStorage items
      const itemsToClear = [
        GUEST_CART_KEY,
        BOOKING_DETAILS_KEY,
        'bookingContext',
        'currentBooking',
        'txnid',
        'paymentBreakdown'
      ];

      itemsToClear.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed ${key} from localStorage`);
      });

      console.log('✅ Cart cleared successfully');
    } catch (err) {
      console.error('❌ Error clearing cart:', err);
    }
  };

  // 🔥 API call for WALLET Payment (Checkout)
  const processWalletPayment = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const payload = {
        serviceAddressId: bookingDetails.serviceAddressId,
        bookedDate: bookingDetails.bookedDate,
        bookedTime: bookingDetails.bookedTime,
        paymentMethod: 'WALLET',
        sourceOfLead: cartData.sourceOfLead || 'Website',
      };

      console.log('💳 Processing WALLET payment:', payload);

      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/service-cart/checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();
      console.log('📥 Raw Response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        throw new Error(`Server returned invalid JSON`);
      }

      console.log('📥 Wallet payment response:', data);

      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      if (data.success || data.status === 'success') {
        if (data.data?.bookingId || data.bookingId) {
          localStorage.setItem('currentBookingId', data.data?.bookingId || data.bookingId);
        }

        await clearCart();
        console.log('✅ Wallet payment successful, redirecting...');
        router.push('/booking/success');
      } else {
        throw new Error(data.message || 'Payment failed');
      }
    } catch (err) {
      console.error('❌ Wallet payment error:', err);
      setError(err.message || 'Network error. Please try again.');
      setProcessing(false);
    }
  };

  // 🔥 API call for ONLINE Payment (Initiate Payment Gateway)
  const initiateOnlinePayment = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const payload = {
        serviceAddressId: bookingDetails.serviceAddressId,
        bookedDate: bookingDetails.bookedDate,
        bookedTime: bookingDetails.bookedTime,
        paymentMethod: 'ONLINE',
        sourceOfLead: cartData.sourceOfLead || 'Website',
      };

      console.log('💳 Initiating ONLINE payment:', payload);

      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/service-cart/initiate-payment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();
      console.log('📥 Raw Response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        throw new Error(`Server returned invalid JSON`);
      }

      console.log('📥 Payment initiation response:', data);

      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      if (data.success && data.access_key) {
        localStorage.setItem('txnid', data.txnid || '');
        localStorage.setItem('paymentBreakdown', JSON.stringify(data.breakdown || {}));

        console.log('🚀 Redirecting to payment gateway...');
        console.log('🔑 Access Key:', data.access_key);
        console.log('💰 Amount:', data.amount);
        
        window.location.href = `https://testpay.easebuzz.in/pay/${data.access_key}`;
      } else {
        throw new Error(data.message || 'Failed to get payment access key');
      }
    } catch (err) {
      console.error('❌ Online payment error:', err);
      setError(err.message || 'Network error. Please try again.');
      setProcessing(false);
    }
  };

  // 🔥 API call for COD Payment (Checkout)
  const processCODPayment = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const payload = {
        serviceAddressId: bookingDetails.serviceAddressId,
        bookedDate: bookingDetails.bookedDate,
        bookedTime: bookingDetails.bookedTime,
        paymentMethod: 'COD',
        sourceOfLead: cartData.sourceOfLead || 'Website',
      };

      console.log('📋 Processing COD payment:', payload);

      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/service-cart/checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const responseText = await response.text();
      console.log('📥 Raw Response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        throw new Error(`Server returned invalid JSON`);
      }

      console.log('📥 COD payment response:', data);

      if (!response.ok) {
        const errorMessage = data.message || data.error || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      if (data.success || data.status === 'success') {
        if (data.data?.bookingId || data.bookingId) {
          localStorage.setItem('currentBookingId', data.data?.bookingId || data.bookingId);
        }

        await clearCart();
        console.log('✅ COD payment successful, redirecting...');
        router.push('/booking/success');
      } else {
        throw new Error(data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('❌ COD payment error:', err);
      setError(err.message || 'Network error. Please try again.');
      setProcessing(false);
    }
  };

  // 🔥 Handle payment confirmation
  const handleConfirmBooking = async () => {
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!bookingDetails) {
      setError('Booking details not found');
      return;
    }

    setProcessing(true);
    setError('');

    console.log('💳 Processing payment with method:', paymentMethod);

    try {
      if (paymentMethod === 'wallet') {
        await processWalletPayment();
      } else if (paymentMethod === 'online') {
        await initiateOnlinePayment();
      } else if (paymentMethod === 'doorstep') {
        await processCODPayment();
      }
    } catch (error) {
      console.error('❌ Payment processing error:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
      setProcessing(false);
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

  // Show error if no data
  if (!cartData || !bookingDetails) {
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

  const servicesTotal = calculateServicesTotal();
  const addonsTotal = calculateAddonsTotal();
  const grandTotal = calculateGrandTotal();
  const bookingCharge = calculateBookingCharge();

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
        {/* <Card
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
                {bookingDetails.bookedDate} at {bookingDetails.bookedTime}
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
                Services in Cart
              </Typography>
              {cartData.items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                    p: 1.5,
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '14px',
                        color: '#374151',
                        fontWeight: 600,
                        lineHeight: 1.5,
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '12px',
                        color: '#6B7280',
                      }}
                    >
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#037166',
                    }}
                  >
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Stack>
        </Card> */}

        {/* 🔥 PRICE BREAKDOWN CARD */}

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
                    Pay ₹{bookingCharge} via wallet
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
                    UPI / Card / NetBanking - ₹{bookingCharge}
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

            {/* Pay at Doorstep (COD) */}
            <Card
              elevation={0}
              onClick={() => setPaymentMethod('doorstep')}
              sx={{
                p: { xs: 2, md: 3 },
                mb: 3,
                borderRadius: '12px',
                cursor: 'pointer',
                bgcolor: 'white',
                border:
                  paymentMethod === 'doorstep'
                    ? '2px solid #037166'
                    : '1px solid #E5E7EB',
                boxShadow:
                  paymentMethod === 'doorstep'
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
                    bgcolor: paymentMethod === 'doorstep' ? '#E0F7F6' : '#F3F4F6',
                    p: 1.5,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <LocalAtmIcon
                    sx={{
                      color: paymentMethod === 'doorstep' ? '#037166' : '#6B7280',
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
                    Pay at Doorstep
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: '#6B7280',
                      fontSize: { xs: '12px', md: '13px' },
                    }}
                  >
                    Cash after service - ₹{bookingCharge} booking charge
                  </Typography>
                </Box>

                <Radio
                  checked={paymentMethod === 'doorstep'}
                  value="doorstep"
                  sx={{
                    color: '#E0E0E0',
                    '&.Mui-checked': { color: '#037166' },
                  }}
                />
              </Stack>
            </Card>
          </RadioGroup>
        </Box>

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
                    Inspection fee (₹{cartData?.inspectionCost || 0}) will be collected at your doorstep
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
                    Service charges paid after completion
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
                    Spare parts will be charged separately if needed
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
            `Pay ₹${bookingCharge} & Confirm Booking`
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
