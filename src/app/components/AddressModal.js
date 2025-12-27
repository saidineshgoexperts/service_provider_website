'use client';

import { Box, Typography, TextField, Button, Dialog, IconButton, ToggleButtonGroup, ToggleButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useState } from 'react';

export default function AddressModal({ open, onClose, onSave }) {
  const [addressType, setAddressType] = useState('Home');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    flatNo: '',
    area: '',
    addressLine1: '',
  });

  const handleSave = () => {
    onSave({
      ...formData,
      type: addressType,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxWidth: '1200px',
          height: '90vh',
        },
      }}
    >
      <Box sx={{ display: 'flex', height: '100%' }}>
        {/* Left Side - Map */}
        <Box
          sx={{
            width: '50%',
            position: 'relative',
            backgroundColor: '#E5E7EB',
          }}
        >
          {/* Map Placeholder - Integrate Google Maps here */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#9CA3AF' }}>Map View</Typography>
          </Box>

          {/* Search Box */}
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              right: 20,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search location"
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Box>

          {/* Current Location Button */}
          <Button
            startIcon={<MyLocationIcon />}
            sx={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              backgroundColor: 'white',
              color: '#037166',
              fontFamily: 'var(--font-inter)',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: '#F3F4F6',
              },
            }}
          >
            Go to current location
          </Button>
        </Box>

        {/* Right Side - Form */}
        <Box
          sx={{
            width: '50%',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 3,
              borderBottom: '1px solid #E5E7EB',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                color: '#1F2937',
              }}
            >
              Enter complete address
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Form Content */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
            {/* Address Type */}
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                color: '#1F2937',
                mb: 2,
              }}
            >
              Save address as *
            </Typography>
            <ToggleButtonGroup
              value={addressType}
              exclusive
              onChange={(e, val) => val && setAddressType(val)}
              sx={{ mb: 3 }}
            >
              <ToggleButton
                value="Home"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  textTransform: 'none',
                  px: 4,
                  '&.Mui-selected': {
                    backgroundColor: '#037166',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#025951',
                    },
                  },
                }}
              >
                🏠 Home
              </ToggleButton>
              <ToggleButton
                value="Work"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  textTransform: 'none',
                  px: 4,
                  '&.Mui-selected': {
                    backgroundColor: '#037166',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#025951',
                    },
                  },
                }}
              >
                💼 Work
              </ToggleButton>
              <ToggleButton
                value="Other"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  textTransform: 'none',
                  px: 4,
                  '&.Mui-selected': {
                    backgroundColor: '#037166',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#025951',
                    },
                  },
                }}
              >
                📍 Other
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Full Name */}
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
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
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />

            {/* Phone Number */}
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                color: '#1F2937',
                mb: 1,
              }}
            >
              Phone Number
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />

            {/* Flat/House No */}
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                color: '#1F2937',
                mb: 1,
              }}
            >
              Flat / House No.
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter flat or house number"
              value={formData.flatNo}
              onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />

            {/* Area/Locality */}
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                color: '#1F2937',
                mb: 1,
              }}
            >
              Area / Locality
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter area or locality"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />

            {/* Address Line 1 */}
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                color: '#1F2937',
                mb: 1,
              }}
            >
              Address Line 1
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter complete address"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
              }}
            />
          </Box>

          {/* Save Button */}
          <Box sx={{ p: 3, borderTop: '1px solid #E5E7EB' }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSave}
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
              }}
            >
              Save Address
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
