'use client';

import { AppBar, Toolbar, Button, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import UserProfileMenu from './UserProfileMenu';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSignIn = () => {
    router.push('/signin');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        pt: 2,
        px: { xs: 2, md: 6 },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 0 }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => router.push('/')}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '3px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.5rem',
                color: 'white',
                fontFamily: 'var(--font-poppins)',
              }}
            >
              D-hub
            </Box>
          </Box>
        </Box>

        {/* Navigation Links */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 4,
            alignItems: 'center',
          }}
        >
          <Button
            sx={{
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'var(--font-poppins)',
              textTransform: 'none',
            }}
          >
            Home
          </Button>
          <Button
            sx={{
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'var(--font-poppins)',
              textTransform: 'none',
            }}
          >
            Service Center
          </Button>
          <Button
            sx={{
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'var(--font-poppins)',
              textTransform: 'none',
            }}
          >
            Nearby Services
          </Button>
          <Button
            sx={{
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'var(--font-poppins)',
              textTransform: 'none',
            }}
          >
            Popular Services
          </Button>
          <Button
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              color: 'white',
              fontSize: '1rem',
              fontFamily: 'var(--font-poppins)',
              textTransform: 'none',
            }}
          >
            More
          </Button>
        </Box>

        {/* Right Side Buttons */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            sx={{
              color: 'white',
              borderColor: 'white',
              borderWidth: 2,
              fontFamily: 'var(--font-poppins)',
              textTransform: 'none',
              '&:hover': {
                borderColor: 'white',
                borderWidth: 2,
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Contact Us
          </Button>

          {user ? (
            <UserProfileMenu user={user} onLogout={handleLogout} />
          ) : (
            <Button
              variant="contained"
              onClick={handleSignIn}
              sx={{
                backgroundColor: '#0D4F4E',
                color: 'white',
                fontFamily: 'var(--font-poppins)',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#0A3938',
                },
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
