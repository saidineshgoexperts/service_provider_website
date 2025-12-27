'use client';

import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Chip,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { urls } from '../utils/urls';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
    userUniqueId: '',
    isRegistered: false,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Get auth token from localStorage
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    const response = await fetch(urls.fetchUserProfile, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    return response.json();
  };

  // Update user profile
  const updateUserProfile = async (formData) => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    const response = await fetch(urls.updateUserProfile, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    return response.json();
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchUserProfile();
      console.log('📥 Profile data:', response);

      if (response.success && response.data) {
        const userData = response.data;
        
        setProfile({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          image: userData.image || '',
          userUniqueId: userData.userUniqueId || '',
          isRegistered: userData.isRegistered || false,
        });

        // Set image preview - check if it's default image
        if (userData.image && !userData.image.includes('default_image')) {
          const fullImageUrl = userData.image.startsWith('http') 
            ? userData.image 
            : `${urls.baseurl}${userData.image}`;
          setImagePreview(fullImageUrl);
        }
      }
    } catch (err) {
      console.error('❌ Error loading profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setSelectedImage(file);
      setError(null); // Clear any previous errors
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      console.log('📤 Updating profile...');
      const response = await updateUserProfile(formData);
      console.log('✅ Profile updated:', response);

      if (response.success) {
        setSuccess(true);
        
        // Update auth context with new data
        const updatedUser = response.data || {};
        login({
          ...user,
          name: updatedUser.name || profile.name,
          email: updatedUser.email || profile.email,
          image: updatedUser.image || profile.image,
        });

        // Reload profile to get latest data
        setTimeout(() => {
          loadProfile();
          setSuccess(false);
          setSelectedImage(null); // Clear selected image
        }, 2000);
      }
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#F9FAFB',
        }}
      >
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F9FAFB',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <IconButton
          onClick={() => router.back()}
          sx={{
            mb: 3,
            bgcolor: 'white',
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Card
          elevation={2}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #037166 0%, #025952 100%)',
              py: 4,
              px: 3,
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 700,
                mb: 1,
              }}
            >
              My Profile
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 2,
              }}
            >
              Manage your account information
            </Typography>
            
            {/* User ID Chip */}
            {profile.userUniqueId && (
              <Chip
                label={`ID: ${profile.userUniqueId}`}
                icon={profile.isRegistered ? <VerifiedIcon /> : undefined}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
            )}
          </Box>

          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Profile updated successfully!
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 4,
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={imagePreview}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: '2.5rem',
                      fontWeight: 600,
                      bgcolor: '#037166',
                      border: '4px solid white',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                  >
                    {!imagePreview && getInitials(profile.name)}
                  </Avatar>
                  
                  <IconButton
                    onClick={handleAvatarClick}
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      width: 40,
                      height: 40,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />

          
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: 'text.secondary',
                    }}
                  >
                    Full Name *
                  </Typography>
                  <TextField
                    fullWidth
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: 'text.secondary',
                    }}
                  >
                    Email Address *
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: 'text.secondary',
                    }}
                  >
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    name="phone"
                    value={profile.phone}
                    placeholder="Phone number"
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'grey.100',
                      },
                    }}
                    helperText="Phone number cannot be changed"
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mt: 4,
                  justifyContent: 'flex-end',
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  disabled={saving}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
