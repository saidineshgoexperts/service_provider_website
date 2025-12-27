// components/layout/UserProfileMenu.js
'use client';

import { Avatar, IconButton, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserProfileMenu({ user, onLogout }) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    router.push('/profile');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        sx={{ p: 0 }}
      >
        <Avatar
          sx={{
            width: 45,
            height: 45,
            backgroundColor: '#0D4F4E',
            border: '2px solid white',
            fontFamily: 'var(--font-poppins)',
            fontWeight: 600,
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          }}
        >
          {getInitials(user.name)}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-poppins)',
              fontWeight: 600,
              fontSize: '1rem',
              color: '#1F2937',
            }}
          >
            {user.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-poppins)',
              fontSize: '0.875rem',
              color: '#6B7280',
            }}
          >
            {user.email}
          </Typography>
          {user.phone && (
            <Typography
              sx={{
                fontFamily: 'var(--font-poppins)',
                fontSize: '0.875rem',
                color: '#6B7280',
              }}
            >
              +91 {user.phone}
            </Typography>
          )}
        </Box>

        <Divider />

        <MenuItem onClick={handleProfile} sx={{ fontFamily: 'var(--font-poppins)', py: 1.5 }}>
          <PersonIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: '#037166' }} />
          My Profile
        </MenuItem>

        <MenuItem onClick={onLogout} sx={{ fontFamily: 'var(--font-poppins)', py: 1.5 }}>
          <LogoutIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: '#DC2626' }} />
          <Typography sx={{ color: '#DC2626' }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
