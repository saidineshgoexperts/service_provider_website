'use client';

import { Box, Typography, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState('details'); // 'details', 'otp', 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    agreeTerms: false,
  });
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (formData.name && formData.email && formData.phoneNumber.length === 10 && formData.agreeTerms) {
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

      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerifyOtp = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 4) {
      setStep('success');
      setTimeout(() => {
        // Save user data to localStorage
        localStorage.setItem('user', JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phoneNumber,
        }));
        router.push('/');
      }, 2000);
    }
  };

  const handleResend = () => {
    setTimer(30);
    startTimer();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side - Green Background */}
      <Box
        sx={{
          width: '50%',
          backgroundColor: '#004D40',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          position: 'relative',
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-poppins)',
              fontSize: '48px',
              fontWeight: 700,
              color: '#4DB6AC',
            }}
          >
            D-hub
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-poppins)',
              fontSize: '14px',
              color: '#4DB6AC',
              letterSpacing: '2px',
            }}
          >
            DOORSTEP HUB
          </Typography>
        </Box>

        {/* Welcome Text */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'var(--font-poppins)',
            fontWeight: 700,
            color: 'white',
            mb: 2,
            textAlign: 'center',
          }}
        >
          Join D-hub Today
        </Typography>
        <Typography
          sx={{
            fontFamily: 'var(--font-poppins)',
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            maxWidth: '350px',
            lineHeight: 1.6,
          }}
        >
          Create your account and get access to all services at your doorstep.
        </Typography>
      </Box>

      {/* Right Side - Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          backgroundColor: 'white',
          p: { xs: 3, md: 6 },
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
              fontFamily: 'var(--font-poppins)',
              color: '#6B7280',
              fontSize: '14px',
              mr: 1,
            }}
          >
            Already have an account?
          </Typography>
          <Button
            component={Link}
            href="/signin"
            variant="contained"
            sx={{
              backgroundColor: '#037166',
              color: 'white',
              fontFamily: 'var(--font-poppins)',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              px: 3,
              '&:hover': {
                backgroundColor: '#025951',
              },
            }}
          >
            Sign In
          </Button>
        </Box>

        {/* Registration Details Step */}
        {step === 'details' && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 700,
                color: '#1F2937',
                mb: 2,
              }}
            >
              Create Account
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-poppins)',
                color: '#6B7280',
                mb: 4,
              }}
            >
              Fill in your details to get started with D-hub
            </Typography>

            {/* Name Field */}
            <Typography
              sx={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 600,
                color: '#1F2937',
                mb: 1,
              }}
            >
              Full Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'var(--font-poppins)',
                },
              }}
            />

            {/* Email Field */}
            <Typography
              sx={{
                fontFamily: 'var(--font-poppins)',
                fontWeight: 600,
                color: '#1F2937',
                mb: 1,
              }}
            >
              Email Address
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'var(--font-poppins)',
                },
              }}
            />

            {/* Phone Number Field */}
            <Typography
              sx={{
                fontFamily: 'var(--font-poppins)',
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
                  minWidth: '100px',
                }}
              >
                <Typography sx={{ fontSize: '20px' }}>🇮🇳</Typography>
                <Typography sx={{ fontFamily: 'var(--font-poppins)', fontWeight: 500 }}>+91</Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="Enter mobile number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontFamily: 'var(--font-poppins)',
                  },
                }}
              />
            </Box>

            {/* Terms Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agreeTerms}
                  onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                  sx={{
                    color: '#037166',
                    '&.Mui-checked': {
                      color: '#037166',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ fontFamily: 'var(--font-poppins)', fontSize: '14px', color: '#6B7280' }}>
                  I agree to the Terms & Conditions and Privacy Policy
                </Typography>
              }
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleContinue}
              disabled={!formData.name || !formData.email || formData.phoneNumber.length !== 10 || !formData.agreeTerms}
              sx={{
                height: '56px',
                borderRadius: '8px',
                backgroundColor: '#037166',
                color: 'white',
                fontFamily: 'var(--font-poppins)',
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
                fontFamily: 'var(--font-poppins)',
                fontWeight: 700,
                color: '#1F2937',
                mb: 2,
              }}
            >
              Verify Your Mobile Number
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-poppins)',
                color: '#6B7280',
                mb: 4,
              }}
            >
              Enter the 4-digit OTP sent to your mobile number +91 {formData.phoneNumber}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  inputProps={{
                    maxLength: 1,
                    style: {
                      textAlign: 'center',
                      fontSize: '24px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-poppins)',
                    },
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
                  fontFamily: 'var(--font-poppins)',
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
                  fontFamily: 'var(--font-poppins)',
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
                fontFamily: 'var(--font-poppins)',
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
              Verify & Create Account
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
                fontFamily: 'var(--font-poppins)',
                fontWeight: 700,
                color: '#10B981',
                mb: 1,
                textAlign: 'center',
              }}
            >
              Account Created Successfully!
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-poppins)',
                color: '#6B7280',
                textAlign: 'center',
              }}
            >
              Welcome to D-hub, {formData.name}!
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
