'use client';

import { Box, Typography, TextField, Button, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModal({ open, onClose }) {
  const { login } = useAuth();
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'success'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);

  const handlePhoneContinue = () => {
    if (phoneNumber.length === 10) {
      setStep('otp');
      startTimer();
    }
  };

  const startTimer = () => {
    let countdown = 30;
    const interval = setInterval(() => {
      countdown--;
      setTimer(countdown);
      if (countdown === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerifyOtp = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 4) {
      // Simulate OTP verification
      setStep('success');
      setTimeout(() => {
        login({
          phone: phoneNumber,
          name: 'User',
        });
        onClose();
      }, 2000);
    }
  };

  const handleResend = () => {
    setTimer(30);
    startTimer();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          height: '100vh',
          maxHeight: '100vh',
          m: 0,
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Left Side - Green Background */}
        <Box
          sx={{
            width: '50%',
            backgroundColor: '#004D40',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
            position: 'relative',
            backgroundImage: 'url(/city-pattern.svg)',
            backgroundPosition: 'bottom',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 4 }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                fontSize: '48px',
                fontWeight: 700,
                color: '#4DB6AC',
              }}
            >
              D-hub
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                fontSize: '14px',
                color: '#4DB6AC',
                textAlign: 'center',
              }}
            >
              DOORSTEP HUB
            </Typography>
          </Box>

          {/* Welcome Text */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              color: 'white',
              mb: 2,
            }}
          >
            Welcome to D-hub
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-inter)',
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              maxWidth: '350px',
            }}
          >
            Clarity gives you the blocks and components you need to create a truly professional website.
          </Typography>

          {/* Bottom Illustration */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100px',
            }}
          >
            {/* Add city illustration here */}
          </Box>
        </Box>

        {/* Right Side - Form */}
        <Box
          sx={{
            width: '50%',
            backgroundColor: 'white',
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Sign In Toggle */}
          <Box sx={{ textAlign: 'right', mb: 4 }}>
            <Typography
              component="span"
              sx={{
                fontFamily: 'var(--font-inter)',
                color: '#6B7280',
                fontSize: '14px',
                mr: 1,
              }}
            >
              Don't have an account?
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#037166',
                color: 'white',
                fontFamily: 'var(--font-inter)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                px: 3,
                '&:hover': {
                  backgroundColor: '#025951',
                },
              }}
            >
              Sign in
            </Button>
          </Box>

          {/* Phone Number Step */}
          {step === 'phone' && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  color: '#1F2937',
                  mb: 2,
                }}
              >
                Welcome back!
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  color: '#6B7280',
                  mb: 4,
                }}
              >
                Clarity gives you the blocks and components you need to create a truly professional website.
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 600,
                  color: '#1F2937',
                  mb: 1,
                }}
              >
                Mobile Number
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    px: 2,
                    py: 1.5,
                  }}
                >
                  🇮🇳
                  <Typography sx={{ fontFamily: 'var(--font-inter)' }}>+91</Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Enter mobile number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      fontFamily: 'var(--font-inter)',
                    },
                  }}
                />
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handlePhoneContinue}
                disabled={phoneNumber.length !== 10}
                sx={{
                  height: '56px',
                  borderRadius: '8px',
                  backgroundColor: '#037166',
                  color: 'white',
                  fontFamily: 'var(--font-inter)',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '16px',
                  '&:hover': {
                    backgroundColor: '#025951',
                  },
                  '&:disabled': {
                    backgroundColor: '#D1D5DB',
                  },
                }}
              >
                Continue
              </Button>
            </Box>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  color: '#1F2937',
                  mb: 2,
                }}
              >
                Verify Your Mobile Number
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  color: '#6B7280',
                  mb: 4,
                }}
              >
                Enter the 4-digit OTP sent to your mobile number +91 {phoneNumber}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                {otp.map((digit, index) => (
                  <TextField
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: 'center', fontSize: '24px', fontWeight: 700 },
                    }}
                    sx={{
                      width: '70px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        height: '70px',
                      },
                    }}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '14px',
                    color: '#6B7280',
                  }}
                >
                  Didn't Receive Code? 00:{timer.toString().padStart(2, '0')}sec
                </Typography>
                <Button
                  onClick={handleResend}
                  disabled={timer > 0}
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    textTransform: 'none',
                    fontWeight: 600,
                    color: '#037166',
                    '&:disabled': {
                      color: '#D1D5DB',
                    },
                  }}
                >
                  RESEND
                </Button>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handleVerifyOtp}
                disabled={otp.join('').length !== 4}
                sx={{
                  height: '56px',
                  borderRadius: '8px',
                  backgroundColor: '#037166',
                  color: 'white',
                  fontFamily: 'var(--font-inter)',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '16px',
                  '&:hover': {
                    backgroundColor: '#025951',
                  },
                  '&:disabled': {
                    backgroundColor: '#D1D5DB',
                  },
                }}
              >
                Continue
              </Button>
            </Box>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <Typography sx={{ fontSize: '60px', color: 'white' }}>✓</Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  color: '#10B981',
                  mb: 1,
                }}
              >
                Phone Verified Successfully
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  color: '#6B7280',
                }}
              >
                You are all set to start Requesting the Bookings
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
