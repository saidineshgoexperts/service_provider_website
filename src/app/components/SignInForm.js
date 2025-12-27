'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  Stack,
} from '@mui/material';

const countryCodes = [
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
];

export default function SignInForm() {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');

  const handleContinue = () => {
    console.log('Continue with:', countryCode, mobileNumber);
  };

  const handleSignUpClick = () => {
    router.push('/signup');
  };

  return (
    <Box
      sx={{
        height: '100vh', // Changed from minHeight to height
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      {/* Left Panel - Welcome Section */}
      <Box
        sx={{
          flex: { xs: 'none', md: 1 },
          bgcolor: 'primary.main',
          color: 'white',
          p: { xs: 4, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          height: { xs: '40vh', md: '100vh' }, // Changed from minHeight to height
          overflow: 'hidden',
        }}
      >
        {/* Decorative Icons */}
        <Box
          sx={{
            position: 'absolute',
            top: 40,
            left: 40,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Box sx={{ transform: 'rotate(45deg)', fontSize: '2rem' }}>💎</Box>
          <Box sx={{ fontSize: '2rem' }}>🍭</Box>
        </Box>

        {/* Logo */}
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              D
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, opacity: 0.9 }}>
            D-hub
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Doorstep Hub
          </Typography>
        </Box>

        {/* Welcome Text */}
        <Box>
          <Typography
            variant="h3"
            sx={{ mb: 2, fontWeight: 600, lineHeight: 1.2 }}
          >
            Welcome to
            <br />
            D-hub
          </Typography>
          <Typography
            variant="body1"
            sx={{ opacity: 0.8, maxWidth: 400, lineHeight: 1.6 }}
          >
            Clarity gives you the blocks & components you need to create a truly
            professional website.
          </Typography>
        </Box>

        {/* Decorative Bottom Elements */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            right: 40,
            display: 'flex',
            gap: 2,
            opacity: 0.6,
          }}
        >
          <Box sx={{ fontSize: '2rem' }}>🏠</Box>
          <Box sx={{ fontSize: '2rem' }}>🔑</Box>
          <Box sx={{ fontSize: '2rem', transform: 'rotate(-15deg)' }}>📐</Box>
        </Box>
      </Box>

      {/* Right Panel - Sign In Form */}
      <Box
        sx={{
          flex: { xs: 'none', md: 1 },
          bgcolor: 'background.default',
          p: { xs: 4, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: { xs: '60vh', md: '100vh' }, // Changed from implicit to explicit height
          overflow: 'auto', // Allow scrolling only on this panel if needed
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 450 }}>
          {/* Top Right Sign Up Link */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 8,
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Don't have an account?
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              sx={{ px: 3 }}
              onClick={handleSignUpClick}
            >
              Sign Up
            </Button>
          </Box>

          {/* Welcome Back */}
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Welcome back!
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 6, lineHeight: 1.6 }}
          >
            Clarity gives you the blocks and components you need to create a
            truly professional website.
          </Typography>

          {/* Mobile Number Input */}
          <Stack spacing={3}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: 'text.primary' }}
            >
              Mobile Number
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* Country Code Selector */}
              <FormControl sx={{ minWidth: 120 }}>
                <Select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  displayEmpty
                  sx={{
                    bgcolor: 'white',
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    },
                  }}
                >
                  {countryCodes.map((item) => (
                    <MenuItem key={item.code} value={item.code}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{item.flag}</span>
                        <span>{item.code}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Mobile Number Field */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                sx={{ bgcolor: 'white' }}
              />
            </Box>

            {/* Continue Button */}
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleContinue}
              sx={{
                py: 1.5,
                mt: 2,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Continue
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
