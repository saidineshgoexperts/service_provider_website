'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  CircularProgress,
  Divider,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CardMedia,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StoreIcon from '@mui/icons-material/Store';
import ExtensionIcon from '@mui/icons-material/Extension';
import CloseIcon from '@mui/icons-material/Close';

const API_BASE_URL = 'https://api.doorstephub.com';

export default function BookingPreview() {
  const router = useRouter();
  const params = useParams();
  const providerId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [cartData, setCartData] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [error, setError] = useState(null);
  const [updatingItem, setUpdatingItem] = useState(null);
  
  // Addon states
  const [addonsData, setAddonsData] = useState([]);
  const [loadingAddons, setLoadingAddons] = useState(false);
  const [selectedServiceForAddons, setSelectedServiceForAddons] = useState(null);
  const [addonDialog, setAddonDialog] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState({});

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };

  // Fetch cart data
  useEffect(() => {
    const fetchCartData = async () => {
      const token = getAuthToken();
      if (!token) {
        setError('Please login to continue');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('https://api.doorstephub.com/v1/dhubApi/app/service-cart/get', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setCartData(result.cart);
          console.log('✅ Cart data fetched:', result.cart);
        } else {
          throw new Error(result.message || 'Failed to fetch cart');
        }
      } catch (err) {
        console.error('❌ Error fetching cart:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Get booking info from localStorage
    if (typeof window !== 'undefined') {
      const bookingContext = JSON.parse(localStorage.getItem('bookingContext')) || {};
      setBookingInfo(bookingContext);
    }

    fetchCartData();
  }, []);

  // Fetch addons for all services in cart
  useEffect(() => {
    const fetchAddons = async () => {
      if (!cartData?.items?.length) return;

      const token = getAuthToken();
      if (!token) return;

      try {
        setLoadingAddons(true);
        
        // Extract service IDs from cart
        const serviceIds = cartData.items.map(item => 
          item.serviceId?._id || item.serviceId
        );

        const response = await fetch('https://api.doorstephub.com/v1/dhubApi/app/service-addons/services/addons', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceIds: serviceIds,
            providerId:providerId
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setAddonsData(result.data || []);
          console.log('✅ Addons fetched:', result.data);
        }
      } catch (err) {
        console.error('❌ Error fetching addons:', err);
      } finally {
        setLoadingAddons(false);
      }
    };

    fetchAddons();
  }, [cartData]);

  // Open addon selection dialog
  const handleOpenAddonDialog = (service) => {
    const serviceId = service.serviceId?._id || service.serviceId;
    const serviceAddons = addonsData.find(addon => addon.parentServiceId === serviceId);
    
    if (serviceAddons && serviceAddons.addons.length > 0) {
      setSelectedServiceForAddons(serviceAddons);
      setAddonDialog(true);
    }
  };

  // Handle addon quantity change
  const handleAddonQuantityChange = (addonId, delta) => {
    setSelectedAddons(prev => {
      const currentQty = prev[addonId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      if (newQty === 0) {
        const { [addonId]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [addonId]: newQty,
      };
    });
  };

  // Add selected addons to cart (you'll need to implement the API endpoint)
// Add selected addons to cart
const handleAddAddonsToCart = async () => {
  const token = getAuthToken();
  if (!token) {
    alert('Please login to add items');
    return;
  }

  try {
    // Show loading state (optional: you can add a loading state for this)
    const addonsToAdd = Object.entries(selectedAddons).map(([addonId, quantity]) => {
      const addon = selectedServiceForAddons.addons.find(a => a._id === addonId);
      return {
        addonId,
        quantity,
        addon: addon, // Store full addon details
      };
    });

    console.log('📦 Adding addons to cart:', addonsToAdd);

    // Make API calls for each addon sequentially
    const results = [];
    for (const item of addonsToAdd) {
      try {
        const response = await fetch('https://api.doorstephub.com/v1/dhubApi/app/service-cart/add', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceId: item.addonId,
            providerId: cartData.providerId._id,
            quantity: item.quantity,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          console.log(`✅ Added addon: ${item.addon.childServiceName}`);
          results.push({ success: true, addon: item.addon });
        } else {
          console.warn(`⚠️ Failed to add: ${item.addon.childServiceName}`, result.message);
          results.push({ success: false, addon: item.addon, error: result.message });
        }
      } catch (error) {
        console.error(`❌ Error adding addon: ${item.addon.childServiceName}`, error);
        results.push({ success: false, addon: item.addon, error: error.message });
      }
    }

    // Check results
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    if (successCount > 0) {
      // Refresh cart data to show updated cart
      const refreshResponse = await fetch('https://api.doorstephub.com/v1/dhubApi/app/service-cart/get', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const refreshResult = await refreshResponse.json();
      if (refreshResponse.ok && refreshResult.success) {
        setCartData(refreshResult.cart);
      }

      // Show success message
      if (failCount === 0) {
        alert(`✅ Successfully added ${successCount} addon(s) to cart!`);
      } else {
        alert(`⚠️ Added ${successCount} addon(s). ${failCount} failed to add.`);
      }
    } else {
      alert('❌ Failed to add addons to cart. Please try again.');
    }

    // Close dialog and reset selections
    setAddonDialog(false);
    setSelectedAddons({});

  } catch (error) {
    console.error('❌ Error in handleAddAddonsToCart:', error);
    alert('Failed to add addons. Please try again.');
  }
};

  // Remove item from cart
  const removeItem = async (serviceId) => {
    const token = getAuthToken();
    if (!token) return;

    setUpdatingItem(serviceId);

    try {
      const response = await fetch('https://api.doorstephub.com/v1/dhubApi/app/service-cart/remove', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: serviceId,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Refetch cart data
        const refreshResponse = await fetch('https://api.doorstephub.com/v1/dhubApi/app/service-cart/get', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const refreshResult = await refreshResponse.json();
        if (refreshResponse.ok && refreshResult.success) {
          setCartData(refreshResult.cart);
        }
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleContinue = () => {
    router.push('/payment');
  };

  // Check if service has addons
  const hasAddons = (serviceId) => {
    const id = serviceId?._id || serviceId;
    return addonsData.some(addon => addon.parentServiceId === id && addon.addons.length > 0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: '#037166' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography color="error" align="center">{error}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="contained" onClick={() => router.back()}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#F9FAFB', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Booking Preview
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
          {/* Left Section - Services */}
          <Box>
            {/* Provider Info Card */}
            {cartData?.providerId && (
              <Card sx={{ mb: 3, borderRadius: 2, border: '2px solid #037166' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 56, height: 56, backgroundColor: '#037166' }}>
                      <StoreIcon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {cartData.providerId.firstName} {cartData.providerId.lastName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <LocationOnIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {cartData.providerId.address}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Booking Details Card */}
            {bookingInfo && (bookingInfo.bookedDate || bookingInfo.bookedTime) && (
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Booking Details
                  </Typography>
                  <Stack spacing={2}>
                    {bookingInfo.bookedDate && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: '#F0FDF4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <CalendarTodayIcon sx={{ color: '#037166', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Date
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {bookingInfo.displayDate || bookingInfo.bookedDate}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    {bookingInfo.bookedTime && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: '#F0FDF4',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <AccessTimeIcon sx={{ color: '#037166', fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Time
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {bookingInfo.displayTime || bookingInfo.bookedTime}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Selected Services */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Selected Services ({cartData?.totalItems || 0})
                </Typography>

                {!cartData?.items?.length ? (
                  <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    No services in cart
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {cartData.items.map((item) => {
                      const serviceId = item.serviceId?._id || item.serviceId;
                      const serviceHasAddons = hasAddons(serviceId);
                      
                      return (
                        <Card
                          key={item._id}
                          sx={{
                            border: '1px solid #E5E7EB',
                            borderRadius: 2,
                            boxShadow: 'none',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              {/* Service Image */}
                              <Box
                                sx={{
                                  width: 100,
                                  height: 100,
                                  borderRadius: 2,
                                  overflow: 'hidden',
                                  backgroundColor: '#F3F4F6',
                                  flexShrink: 0,
                                }}
                              >
                                {item.serviceImage || item.serviceId?.image ? (
                                  <img
                                    src={`${API_BASE_URL}/${item.serviceImage || item.serviceId.image}`}
                                    alt={item.serviceName || item.serviceId?.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="caption" color="text.secondary">
                                      No Image
                                    </Typography>
                                  </Box>
                                )}
                              </Box>

                              {/* Service Details */}
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                                  {item.serviceName || item.serviceId?.name}
                                </Typography>
                                {item.description && (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                    {item.description}
                                  </Typography>
                                )}
                                {item.priceUnit && (
                                  <Typography variant="caption" sx={{ display: 'block', color: '#037166', mb: 1 }}>
                                    {item.priceUnit}
                                  </Typography>
                                )}
                                <Typography variant="h6" sx={{ color: '#037166', fontWeight: 700 }}>
                                  ₹{item.price}
                                </Typography>
                                
                                {/* Add Addons Button */}
                                {serviceHasAddons && (
                                  <Button
                                    size="small"
                                    startIcon={<ExtensionIcon />}
                                    onClick={() => handleOpenAddonDialog(item)}
                                    disabled={loadingAddons}
                                    sx={{
                                      mt: 1,
                                      textTransform: 'none',
                                      color: '#037166',
                                      borderColor: '#037166',
                                      '&:hover': {
                                        backgroundColor: '#F0FDF4',
                                        borderColor: '#025f56',
                                      },
                                    }}
                                    variant="outlined"
                                  >
                                    Add Extras
                                  </Button>
                                )}
                              </Box>

                              {/* Delete Button */}
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => removeItem(serviceId)}
                                  disabled={updatingItem === serviceId}
                                  sx={{ color: '#EF4444' }}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Box>

          {/* Right Section - Summary */}
          <Box>
            <Card sx={{ borderRadius: 2, position: 'sticky', top: 20 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Price Summary
                </Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Service Cost
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      ₹{cartData?.totalServiceCost || 0}
                    </Typography>
                  </Box>

                  {cartData?.platformFee > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Platform Fee
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{cartData.platformFee}
                      </Typography>
                    </Box>
                  )}

                  {cartData?.consultationFee > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Consultation Fee
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{cartData.consultationFee}
                      </Typography>
                    </Box>
                  )}

                  {cartData?.gstAmount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        GST
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ₹{cartData.gstAmount}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Final Amount
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#037166' }}>
                    ₹{cartData?.finalAmount || 0}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleContinue}
                  disabled={!cartData?.items?.length}
                  sx={{
                    backgroundColor: '#037166',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#025f56',
                      boxShadow: '0 8px 24px rgba(3,113,102,0.3)',
                    },
                    '&:disabled': {
                      backgroundColor: '#9CA3AF',
                    },
                  }}
                >
                  Continue to Checkout
                </Button>

                <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', mt: 2 }}>
                  Only Consultation fee Charged
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* Addon Selection Dialog */}
      <Dialog
        open={addonDialog}
        onClose={() => {
          setAddonDialog(false);
          setSelectedAddons({});
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle sx={{ pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Add Extras
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Enhance your service with these add-ons
            </Typography>
          </Box>
          <IconButton
            onClick={() => {
              setAddonDialog(false);
              setSelectedAddons({});
            }}
            sx={{ color: 'text.secondary' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 3 }}>
          {selectedServiceForAddons && (
            <>
              {/* Parent Service Info */}
              <Card sx={{ mb: 3, backgroundColor: '#F0FDF4', border: '2px solid #037166' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Adding extras to:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#037166' }}>
                    {selectedServiceForAddons.parentServiceName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Base Price: ₹{selectedServiceForAddons.parentServicePrice}
                  </Typography>
                </CardContent>
              </Card>

              {/* Addons List */}
              <Stack spacing={2}>
                {selectedServiceForAddons.addons.map((addon) => {
                  const quantity = selectedAddons[addon._id] || 0;
                  
                  return (
                    <Card
                      key={addon._id}
                      sx={{
                        border: quantity > 0 ? '2px solid #037166' : '1px solid #E5E7EB',
                        borderRadius: 2,
                        transition: 'all 0.2s',
                        backgroundColor: quantity > 0 ? '#F0FDF4' : '#FFFFFF',
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          {/* Addon Image */}
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              overflow: 'hidden',
                              backgroundColor: '#F3F4F6',
                              flexShrink: 0,
                            }}
                          >
                            {addon.image ? (
                              <img
                                src={`${API_BASE_URL}/${addon.image.replace(/\\/g, '/')}`}
                                alt={addon.childServiceName}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            ) : (
                              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ExtensionIcon sx={{ fontSize: 32, color: '#9CA3AF' }} />
                              </Box>
                            )}
                          </Box>

                          {/* Addon Details */}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                              {addon.childServiceName}
                            </Typography>
                            {addon.description && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                {addon.description}
                              </Typography>
                            )}
                            {addon.priceUnit && (
                              <Chip
                                label={addon.priceUnit}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  backgroundColor: '#E0F2FE',
                                  color: '#0369A1',
                                  mb: 1,
                                }}
                              />
                            )}
                            <Typography variant="h6" sx={{ color: '#037166', fontWeight: 700 }}>
                              ₹{addon.price}
                            </Typography>
                          </Box>

                          {/* Quantity Controls */}
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {quantity === 0 ? (
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleAddonQuantityChange(addon._id, 1)}
                                sx={{
                                  borderColor: '#037166',
                                  color: '#037166',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  '&:hover': {
                                    backgroundColor: '#F0FDF4',
                                    borderColor: '#025f56',
                                  },
                                }}
                              >
                                Add
                              </Button>
                            ) : (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  border: '2px solid #037166',
                                  borderRadius: 2,
                                  padding: '4px 8px',
                                  backgroundColor: '#FFFFFF',
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => handleAddonQuantityChange(addon._id, -1)}
                                  sx={{
                                    padding: '4px',
                                    color: '#037166',
                                    '&:hover': {
                                      backgroundColor: '#DCFCE7',
                                    },
                                  }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 700, color: '#037166' }}>
                                  {quantity}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleAddonQuantityChange(addon._id, 1)}
                                  sx={{
                                    padding: '4px',
                                    color: '#037166',
                                    '&:hover': {
                                      backgroundColor: '#DCFCE7',
                                    },
                                  }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => {
              setAddonDialog(false);
              setSelectedAddons({});
            }}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddAddonsToCart}
            disabled={Object.keys(selectedAddons).length === 0}
            sx={{
              backgroundColor: '#037166',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                backgroundColor: '#025f56',
              },
              '&:disabled': {
                backgroundColor: '#9CA3AF',
              },
            }}
          >
            Add {Object.keys(selectedAddons).length > 0 ? `(${Object.keys(selectedAddons).length})` : ''} to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
