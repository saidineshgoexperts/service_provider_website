'use client';

import { Box, Typography, TextField, Button, CircularProgress, Alert, Divider } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithGoogle } from '../config/firebase';
import GoogleIcon from '@mui/icons-material/Google';

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'success'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔥 Google Sign-In Handler - Shows Account Picker
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      // Step 1: Firebase popup shows logged-in Google accounts
      const { user, idToken } = await signInWithGoogle();

      console.log('📤 Sending Google ID Token to backend...');
      console.log('User Email:', user.email);
      console.log('User Name:', user.displayName);

      // Step 2: Send ID Token to your backend
      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/auth/loginWithGoogle',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: idToken,
            fcmtoken: '1234', // Replace with actual FCM token if available
          }),
        }
      );

      const data = await response.json();
      console.log('📥 Backend Response:', data);

      if (data.status === 'success' || data.success === true) {
        const userData = {
          phone: data.data?.mobile || user.phoneNumber || '',
          name: data.data?.name || user.displayName || 'User',
          email: data.data?.email || user.email || '',
          userId: data.data?.userId || user.uid || '',
        };

        // Store auth token
        if (data.data?.token || data.token) {
          localStorage.setItem('authToken', data.data?.token || data.token);
        }

        setStep('success');
        setTimeout(() => {
          login(userData);
          router.push('/');
        }, 2000);
      } else {
        setError(data.details || data.message || 'Google sign-in failed');
      }
    } catch (err) {
      console.error('❌ Google Sign-In Error:', err);
      
      // Handle specific errors
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup blocked. Please allow popups for this site.');
      } else {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneContinue = async () => {
    if (phoneNumber.length === 10) {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          'https://api.doorstephub.com/v1/dhubApi/app/auth/sendWhatsAppOtp',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mobile: phoneNumber,
              fcmtoken: '1234',
            }),
          }
        );

        const data = await response.json();
        console.log('OTP Response:', data);

        if (data.status === 'success') {
          setStep('otp');
          startTimer();
        } else {
          setError(data.details || data.message || 'Failed to send OTP');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Error sending OTP:', err);
      } finally {
        setLoading(false);
      }
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
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          'https://api.doorstephub.com/v1/dhubApi/app/auth/verifywhatsappOTP',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              mobile: phoneNumber,
              fcmtoken: '1234',
              otp: otpValue,
            }),
          }
        );

        const data = await response.json();
        console.log('Verify Response:', data);

        if (data.status === 'success' || data.success === true) {
          const userData = {
            phone: phoneNumber,
            name: data.data?.name || data.userName || 'User',
            email: data.data?.email || data.userEmail || '',
            userId: data.data?.userId || data.userId || '',
          };

          if (data.data?.token || data.token) {
            localStorage.setItem('authToken', data.data?.token || data.token);
          }

          setStep('success');
          setTimeout(() => {
            login(userData);
            router.push('/');
          }, 2000);
        } else {
          setError(data.details || data.message || 'Invalid OTP');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        console.error('Error verifying OTP:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResend = async () => {
    setError('');
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    
    try {
      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/auth/sendWhatsAppOtp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mobile: phoneNumber,
            fcmtoken: '1234',
          }),
        }
      );

      const data = await response.json();

      if (data.status === 'success') {
        setTimer(30);
        startTimer();
      } else {
        setError(data.details || data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error resending OTP:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Side - Green Background */}
      <Box
        sx={{
          width: { xs: '0%', md: '50%' },
          backgroundColor: '#004D40',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          position: 'relative',
        }}
      >
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
          Welcome to D-hub
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
          Get all your home services at your doorstep with just a few clicks.
        </Typography>
      </Box>

      {/* Right Side - Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          backgroundColor: 'white',
          p: { xs: 3, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Sign Up Toggle */}
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
            Don't have an account?
          </Typography>
          <Button
            component={Link}
            href="/signup"
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
            Sign up
          </Button>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{ mb: 3, fontFamily: 'var(--font-poppins)' }}
          >
            {error}
          </Alert>
        )}

        {/* Phone Number Step */}
        {step === 'phone' && (
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
              Welcome back!
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-poppins)',
                color: '#6B7280',
                mb: 4,
              }}
            >
              Sign in to continue to D-hub services
            </Typography>

            {/* 🔥 Google Sign-In Button - Shows logged-in accounts */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignIn}
              disabled={loading}
              sx={{
                height: '56px',
                borderRadius: '8px',
                borderColor: '#E5E7EB',
                color: '#1F2937',
                fontFamily: 'var(--font-poppins)',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '16px',
                mb: 3,
                '&:hover': {
                  borderColor: '#037166',
                  backgroundColor: 'rgba(3, 113, 102, 0.05)',
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Continue with Google'}
            </Button>

            <Divider sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-poppins)',
                  color: '#6B7280',
                  fontSize: '14px',
                }}
              >
                OR
              </Typography>
            </Divider>

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
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && phoneNumber.length === 10) {
                    handlePhoneContinue();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    fontFamily: 'var(--font-poppins)',
                  },
                }}
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handlePhoneContinue}
              disabled={phoneNumber.length !== 10 || loading}
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
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Continue'}
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
              Enter the 6-digit OTP sent to your mobile number +91 {phoneNumber}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, mb: 2, justifyContent: 'center' }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    style: {
                      textAlign: 'center',
                      fontSize: '24px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-poppins)',
                    },
                  }}
                  sx={{
                    width: '60px',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      height: '60px',
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
                Didn't Receive Code? {timer > 0 ? `00:${timer.toString().padStart(2, '0')}` : ''}
              </Typography>
              <Button
                onClick={handleResend}
                disabled={timer > 0 || loading}
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
                {loading ? 'Sending...' : 'RESEND'}
              </Button>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyOtp}
              disabled={otp.join('').length !== 6 || loading}
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
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Verify & Continue'}
            </Button>

            <Button
              fullWidth
              onClick={() => {
                setStep('phone');
                setOtp(['', '', '', '', '', '']);
                setError('');
              }}
              sx={{
                mt: 2,
                color: '#6B7280',
                fontFamily: 'var(--font-poppins)',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Change Phone Number
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
                animation: 'scaleIn 0.5s ease-out',
                '@keyframes scaleIn': {
                  '0%': {
                    transform: 'scale(0)',
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                  },
                },
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
              Sign In Successful
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-poppins)',
                color: '#6B7280',
                textAlign: 'center',
              }}
            >
              You are all set to start booking services
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
