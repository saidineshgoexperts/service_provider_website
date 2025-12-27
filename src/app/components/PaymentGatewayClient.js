'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Paper,
  Stack,
  IconButton,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PublicIcon from '@mui/icons-material/Public';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { useRouter } from 'next/navigation';

export default function PaymentGatewayClient({ bookingData }) {
  const router = useRouter();
  
  // ✅ Fixed: Proper fallback values with null checks
  const data = {
    serviceCharges: bookingData?.serviceCharges || bookingData?.total || 125.0,
    grandTotal: bookingData?.grandTotal || bookingData?.total || 125.0,
  };

  const [paymentMethod, setPaymentMethod] = useState('doorstep');
  const [processing, setProcessing] = useState(false);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleConfirmBooking = async () => {
    setProcessing(true);
    console.log('💳 Processing payment with method:', paymentMethod);
    
    // Simulate payment processing
    setTimeout(() => {
      console.log('✅ Payment successful, redirecting...');
      router.push('/booking/success');
    }, 2000);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box sx={{ bgcolor: '#F5F5F5', minHeight: '100vh', pb: 4 }}>
      {/* Header - Black */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: '#000',
          color: '#fff',
          borderRadius: 0,
          px: 2,
          py: 2.5,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={handleBack} sx={{ color: '#fff', p: 0 }}>
            <ArrowBackIcon sx={{ fontSize: 28 }} />
          </IconButton>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-poppins)',
              fontWeight: 700,
              fontSize: '20px',
            }}
          >
            Final Checkout
          </Typography>
        </Stack>
      </Paper>

      <Container maxWidth="sm" sx={{ mt: 3, px: 2 }}>
        {/* Payment Method Heading */}
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'var(--font-poppins)',
            fontWeight: 700,
            color: '#000',
            mb: 2.5,
            fontSize: '22px',
          }}
        >
          Payment Method
        </Typography>

        <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange}>
          {/* D-Hub Wallet */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              borderRadius: 3,
              cursor: 'pointer',
              bgcolor: '#fff',
              border: paymentMethod === 'wallet' ? '2px solid #037166' : 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              },
            }}
            onClick={() => setPaymentMethod('wallet')}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  bgcolor: '#F5F5F5',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AccountBalanceWalletIcon sx={{ color: '#616161', fontSize: 32 }} />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'var(--font-poppins)',
                    fontWeight: 700,
                    color: '#000',
                    fontSize: '16px',
                    mb: 0.3,
                  }}
                >
                  D-Hub Wallet
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'var(--font-poppins)',
                    color: '#757575',
                    fontSize: '13px',
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
          </Paper>

          {/* Pay Online */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              borderRadius: 3,
              cursor: 'pointer',
              bgcolor: '#fff',
              border: paymentMethod === 'online' ? '2px solid #037166' : 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              },
            }}
            onClick={() => setPaymentMethod('online')}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  bgcolor: '#F5F5F5',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PublicIcon sx={{ color: '#616161', fontSize: 32 }} />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'var(--font-poppins)',
                    fontWeight: 700,
                    color: '#000',
                    fontSize: '16px',
                    mb: 0.3,
                  }}
                >
                  Pay Online
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'var(--font-poppins)',
                    color: '#757575',
                    fontSize: '13px',
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
          </Paper>

          {/* Pay at Doorstep */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              cursor: 'pointer',
              bgcolor: '#fff',
              border: paymentMethod === 'doorstep' ? '2px solid #037166' : 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'all 0.2s',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              },
            }}
            onClick={() => setPaymentMethod('doorstep')}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  bgcolor: '#F5F5F5',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <LocalAtmIcon sx={{ color: '#616161', fontSize: 32 }} />
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'var(--font-poppins)',
                    fontWeight: 700,
                    color: '#000',
                    fontSize: '16px',
                    mb: 0.3,
                  }}
                >
                  Pay at Doorstep
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'var(--font-poppins)',
                    color: '#757575',
                    fontSize: '13px',
                  }}
                >
                  Cash after service completion
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
          </Paper>
        </RadioGroup>

        {/* Price Summary */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: '#fff',
            mb: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <Stack spacing={2.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'var(--font-poppins)',
                  color: '#000',
                  fontSize: '15px',
                }}
              >
                Service Charges
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'var(--font-poppins)',
                  fontWeight: 500,
                  color: '#000',
                  fontSize: '15px',
                }}
              >
                ₹{Number(data.serviceCharges).toFixed(1)}
              </Typography>
            </Stack>

            <Divider />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-poppins)',
                  fontWeight: 700,
                  color: '#000',
                  fontSize: '18px',
                }}
              >
                Grand Total
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-poppins)',
                  fontWeight: 700,
                  color: '#037166',
                  fontSize: '20px',
                }}
              >
                ₹{Number(data.grandTotal).toFixed(1)}
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Confirm Booking Button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleConfirmBooking}
          disabled={processing}
          sx={{
            py: 2,
            bgcolor: '#037166',
            fontSize: '17px',
            fontWeight: 700,
            fontFamily: 'var(--font-poppins)',
            textTransform: 'none',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(3, 113, 102, 0.3)',
            '&:hover': {
              bgcolor: '#025951',
              boxShadow: '0 6px 16px rgba(3, 113, 102, 0.4)',
            },
            '&:disabled': {
              backgroundColor: '#BDBDBD',
            },
          }}
        >
          {processing ? 'Processing...' : 'Confirm Booking'}
        </Button>
      </Container>
    </Box>
  );
}
