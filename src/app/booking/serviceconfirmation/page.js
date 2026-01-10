'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExtensionIcon from '@mui/icons-material/Extension';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function BookingConfirmationPage() {
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [cartData, setCartData] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [removingItem, setRemovingItem] = useState(null);

  const GUEST_CART_KEY = 'guestCart';
  const BOOKING_DETAILS_KEY = 'bookingDetails';

  useEffect(() => {
    loadCartAndBookingDetails();
    fetchAddresses();
  }, []);

  const loadCartAndBookingDetails = () => {
    if (typeof window === 'undefined') return;

    try {
      const savedCart = localStorage.getItem(GUEST_CART_KEY);
      const savedBookingDetails = localStorage.getItem(BOOKING_DETAILS_KEY);

      console.log('📦 Loading cart from localStorage');

      if (!savedCart) {
        setError('No cart data found. Please add items to cart first.');
        return;
      }

      const parsedCart = JSON.parse(savedCart);
      const parsedBooking = savedBookingDetails ? JSON.parse(savedBookingDetails) : null;

      console.log('✅ Parsed cart:', parsedCart);
      console.log('✅ Cart items:', parsedCart.items);
      console.log('✅ Cart addons:', parsedCart.addons);
      console.log('✅ BasePrice:', parsedCart.basePrice);
      console.log('✅ InspectionCost:', parsedCart.inspectionCost);
      console.log('✅ ServiceBookingCost:', parsedCart.serviceBookingCost);
      console.log('✅ Parsed booking:', parsedBooking);

      if (!parsedCart.items || parsedCart.items.length === 0) {
        setError('Your cart is empty');
        return;
      }

      setCartData(parsedCart);
      
      if (!parsedBooking) {
        console.warn('⚠️ No booking details found. Creating default...');
        const defaultBooking = {
          bookedDate: new Date().toISOString().split('T')[0],
          bookedTime: '10:00 AM',
        };
        setBookingDetails(defaultBooking);
        localStorage.setItem(BOOKING_DETAILS_KEY, JSON.stringify(defaultBooking));
      } else {
        setBookingDetails(parsedBooking);
      }

      console.log('✅ Cart loaded:', parsedCart.items.length, 'items');
      console.log('✅ Addons loaded:', parsedCart.addons?.length || 0, 'addons');
    } catch (error) {
      console.error('❌ Error reading from localStorage:', error);
      setError('Failed to load cart data');
    }
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError('Please login to continue');
        setLoading(false);
        return;
      }

      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/getuseraddress',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        const addressList = data.data || [];
        setAddresses(addressList);

        if (addressList.length > 0) {
          const defaultAddr = addressList.find((addr) => addr.defaultAddress);
          const firstAddr = addressList[0];
          const addressToSelect = defaultAddr ? defaultAddr._id : firstAddr._id;
          setSelectedAddress(addressToSelect);
          console.log('✅ Auto-selected address:', addressToSelect);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching addresses:', error);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (serviceId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = {
      ...cartData,
      items: cartData.items.map((item) =>
        item.serviceId === serviceId
          ? { ...item, quantity: newQuantity }
          : item
      ),
    };

    setCartData(updatedCart);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedCart));
    console.log('✅ Quantity updated:', serviceId, newQuantity);
  };

  const handleAddonQuantityChange = (addonId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = {
      ...cartData,
      addons: cartData.addons.map((addon) =>
        addon.addonId === addonId
          ? { ...addon, quantity: newQuantity }
          : addon
      ),
    };

    setCartData(updatedCart);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedCart));
    console.log('✅ Addon quantity updated:', addonId, newQuantity);
  };

  const handleRemoveItem = async (serviceId) => {
    try {
      setRemovingItem(serviceId);
      const token = localStorage.getItem('authToken');

      console.log('🗑️ Removing item:', serviceId);

      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/service-cart/remove',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ serviceId }),
        }
      );

      const data = await response.json();
      console.log('📥 Remove response:', data);

      const updatedCart = {
        ...cartData,
        items: cartData.items.filter((item) => item.serviceId !== serviceId),
      };

      setCartData(updatedCart);
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedCart));

      if (updatedCart.items.length === 0) {
        setError('Your cart is empty. Redirecting...');
        setTimeout(() => router.push('/'), 2000);
      }

      console.log('✅ Item removed successfully');
    } catch (error) {
      console.error('❌ Error removing item:', error);
      setError('Failed to remove item');
    } finally {
      setRemovingItem(null);
    }
  };

  const handleRemoveAddon = async (addonId) => {
    try {
      setRemovingItem(addonId);
      
      const updatedCart = {
        ...cartData,
        addons: cartData.addons.filter((addon) => addon.addonId !== addonId),
      };

      setCartData(updatedCart);
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updatedCart));

      console.log('✅ Addon removed successfully');
    } catch (error) {
      console.error('❌ Error removing addon:', error);
      setError('Failed to remove addon');
    } finally {
      setRemovingItem(null);
    }
  };

  const handleAddressSelect = (id) => {
    setSelectedAddress(id);
    console.log('✅ Address selected:', id);
  };

  const handleAddNewAddress = () => {
    router.push('/booking/address');
  };

  const calculateServicesTotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateAddonsTotal = () => {
    if (!cartData?.addons) return 0;
    return cartData.addons.reduce((sum, addon) => sum + (addon.price * addon.quantity), 0);
  };

  const calculateGrandTotal = () => {
    const servicesTotal = calculateServicesTotal();
    const addonsTotal = calculateAddonsTotal();
    const basePrice = cartData?.basePrice || 0;
    const inspectionCost = cartData?.inspectionCost || 0;
    
    return servicesTotal + addonsTotal + basePrice + inspectionCost;
  };

  const calculateBookingCharge = () => {
    return cartData?.serviceBookingCost || 0;
  };

  const isButtonEnabled = () => {
    const hasAddress = !!selectedAddress;
    const notLoading = !bookingLoading;
    const hasBooking = !!bookingDetails;
    const hasDateAndTime = bookingDetails?.bookedDate && bookingDetails?.bookedTime;
    
    return hasAddress && notLoading && hasBooking && hasDateAndTime;
  };

  const handlePayAndContinue = () => {
    if (!cartData || !cartData.items || cartData.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!bookingDetails || !bookingDetails.bookedDate || !bookingDetails.bookedTime) {
      setError('Please select date and time first');
      return;
    }

    if (!selectedAddress) {
      setError('Please select an address');
      return;
    }

    setBookingLoading(true);

    try {
      const updatedBookingDetails = {
        serviceAddressId: selectedAddress,
        bookedDate: bookingDetails.bookedDate,
        bookedTime: bookingDetails.bookedTime,
        sourceOfLead: cartData.sourceOfLead || 'Website',
      };

      localStorage.setItem(BOOKING_DETAILS_KEY, JSON.stringify(updatedBookingDetails));
      console.log('✅ Booking details saved, redirecting to payment...');

      router.push('/payment');
    } catch (error) {
      console.error('❌ Error:', error);
      setError('Failed to proceed. Please try again.');
      setBookingLoading(false);
    }
  };

  const getAddressIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'home':
        return <HomeIcon sx={{ fontSize: 18, color: '#037166' }} />;
      case 'work':
        return <WorkIcon sx={{ fontSize: 18, color: '#037166' }} />;
      default:
        return <LocationOnIcon sx={{ fontSize: 18, color: '#037166' }} />;
    }
  };

  const selectedAddressData = addresses.find((a) => a._id === selectedAddress);
  const servicesTotal = calculateServicesTotal();
  const addonsTotal = calculateAddonsTotal();
  const grandTotal = calculateGrandTotal();
  const bookingCharge = calculateBookingCharge();

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #FDCB6A 0%, #FFFFFF 100%)',
        minHeight: '100vh',
        py: 3,
      }}
    >
      <Container 
        maxWidth="lg"
      >
        {error && (
          <Alert
            severity="error"
            onClose={() => setError('')}
            sx={{ mb: 3, fontFamily: 'var(--font-inter)', borderRadius: 2 }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* 🔥 Left Side - Address Selection (Scrollable) */}
          <Box 
            sx={{ 
              flex: 1,
              maxHeight: { xs: 'none', md: 'calc(100vh - 100px)' },
              overflowY: { xs: 'visible', md: 'auto' },
              pr: { xs: 0, md: 2 },
              // Hide scrollbar but keep functionality
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE and Edge
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '12px',
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 700,
                    color: '#1F2937',
                    fontSize: '16px',
                  }}
                >
                  Add Address
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddNewAddress}
                  sx={{
                    backgroundColor: '#037166',
                    color: 'white',
                    fontFamily: 'var(--font-inter)',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    py: 1,
                    borderRadius: '8px',
                    fontSize: '14px',
                    '&:hover': { backgroundColor: '#025951' },
                  }}
                >
                  Add New Address
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: '#037166' }} />
                </Box>
              ) : addresses.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography
                    sx={{ fontFamily: 'var(--font-inter)', color: '#6B7280', mb: 2 }}
                  >
                    No addresses added yet
                  </Typography>
                </Box>
              ) : (
                <RadioGroup value={selectedAddress}>
                  {addresses.map((address) => (
                    <Box
                      key={address._id}
                      onClick={() => handleAddressSelect(address._id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        p: 2,
                        mb: 2,
                        borderRadius: '8px',
                        border:
                          selectedAddress === address._id
                            ? '2px solid #037166'
                            : '1px solid #E5E7EB',
                        backgroundColor:
                          selectedAddress === address._id ? '#F0FDFA' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: '#037166' },
                      }}
                    >
                      <FormControlLabel
                        value={address._id}
                        control={
                          <Radio
                            sx={{
                              color: '#037166',
                              '&.Mui-checked': { color: '#037166' },
                            }}
                          />
                        }
                        label=""
                        sx={{ m: 0 }}
                      />

                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          {getAddressIcon(address.type)}
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-inter)',
                              fontWeight: 700,
                              fontSize: '15px',
                              color: '#1F2937',
                            }}
                          >
                            {address.name}
                          </Typography>
                          {address.type && (
                            <Box
                              sx={{
                                backgroundColor: '#E0F2F1',
                                color: '#037166',
                                px: 1,
                                py: 0.25,
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                              }}
                            >
                              {address.type.toUpperCase()}
                            </Box>
                          )}
                        </Box>

                        <Typography
                          sx={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '13px',
                            color: '#6B7280',
                            lineHeight: 1.5,
                          }}
                        >
                          {address.flat}, {address.area}
                          <br />
                          {address.addressLineOne}
                          {address.addressLineTwo && `, ${address.addressLineTwo}`}
                          <br />
                          {address.cityName}, {address.stateName} - {address.postalCode}
                        </Typography>

                        <Typography
                          sx={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '13px',
                            color: '#1F2937',
                            fontWeight: 600,
                            mt: 0.5,
                          }}
                        >
                          Contact - {address.phone}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="small"
                          sx={{
                            color: '#037166',
                            fontFamily: 'var(--font-inter)',
                            textTransform: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          sx={{
                            color: '#EF4444',
                            fontFamily: 'var(--font-inter)',
                            textTransform: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </RadioGroup>
              )}
            </Paper>
          </Box>

          {/* 🔥 Right Side - Booking Details Card (Sticky - No Scroll) */}
          <Box sx={{ width: { xs: '100%', md: '380px' } }}>
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                maxWidth: '380px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                p: '22px',
                gap: '20px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'white',
                position: { xs: 'static', md: 'sticky' },
                top: { xs: 'auto', md: 20 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: '#1F2937',
                }}
              >
                Booking Details
              </Typography>

              {/* Cart Items + Addons - Vertical Scrollable Container (Hidden Scrollbar) */}
              <Box
                sx={{
                  maxHeight: '300px',
                  minHeight: '55px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  pr: 1,
                  // Hide scrollbar but keep functionality
                  '&::-webkit-scrollbar': { 
                    display: 'none',
                  },
                  scrollbarWidth: 'none', // Firefox
                  msOverflowStyle: 'none', // IE and Edge
                }}
              >
                {/* Main Services */}
                {cartData?.items?.map((item) => (
                  <Box
                    key={item.serviceId}
                    sx={{
                      width: '100%',
                      minHeight: '79px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderRadius: '8px',
                      border: '1px solid #E5E7EB',
                      padding: '14px',
                      backgroundColor: '#F9FAFB',
                      boxSizing: 'border-box',
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#1F2937',
                          mb: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '16px',
                          fontWeight: 700,
                          color: '#037166',
                        }}
                      >
                        ₹{item.price}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          border: '1px solid #E5E7EB',
                          borderRadius: '6px',
                          px: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item.serviceId, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          sx={{ p: 0.5, color: '#037166' }}
                        >
                          <RemoveIcon sx={{ fontSize: 16 }} />
                        </IconButton>

                        <Typography
                          sx={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#1F2937',
                            minWidth: '20px',
                            textAlign: 'center',
                          }}
                        >
                          {item.quantity}
                        </Typography>

                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item.serviceId, item.quantity + 1)
                          }
                          sx={{ p: 0.5, color: '#037166' }}
                        >
                          <AddIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() => handleRemoveItem(item.serviceId)}
                        disabled={removingItem === item.serviceId}
                        sx={{ p: 0.5, color: '#EF4444' }}
                      >
                        {removingItem === item.serviceId ? (
                          <CircularProgress size={16} sx={{ color: '#EF4444' }} />
                        ) : (
                          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                ))}

                {/* Addons Section */}
                {cartData?.addons && cartData.addons.length > 0 && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                      <Divider sx={{ flex: 1 }} />
                      <Chip 
                        icon={<ExtensionIcon sx={{ fontSize: 16 }} />}
                        label="Add-ons" 
                        size="small"
                        sx={{ 
                          backgroundColor: '#E0F2F1',
                          color: '#037166',
                          fontWeight: 600,
                          fontSize: '12px',
                        }}
                      />
                      <Divider sx={{ flex: 1 }} />
                    </Box>

                    {cartData.addons.map((addon) => (
                      <Box
                        key={addon.addonId}
                        sx={{
                          width: '100%',
                          minHeight: '79px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          borderRadius: '8px',
                          border: '1.5px solid #B2DFDB',
                          padding: '14px',
                          backgroundColor: '#E0F2F1',
                          boxSizing: 'border-box',
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            backgroundColor: '#037166',
                            color: 'white',
                            px: 1,
                            py: 0.25,
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          Add-on
                        </Box>

                        <Box sx={{ flex: 1, minWidth: 0, mt: 2.5 }}>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#1F2937',
                              mb: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {addon.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: '16px',
                              fontWeight: 700,
                              color: '#037166',
                            }}
                          >
                            ₹{addon.price}
                            {addon.priceUnit && (
                              <Typography
                                component="span"
                                sx={{
                                  fontSize: '12px',
                                  fontWeight: 400,
                                  color: '#6B7280',
                                  ml: 0.5,
                                }}
                              >
                                / {addon.priceUnit}
                              </Typography>
                            )}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              border: '1px solid #037166',
                              borderRadius: '6px',
                              px: 0.5,
                              backgroundColor: 'white',
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleAddonQuantityChange(addon.addonId, addon.quantity - 1)
                              }
                              disabled={addon.quantity <= 1}
                              sx={{ p: 0.5, color: '#037166' }}
                            >
                              <RemoveIcon sx={{ fontSize: 16 }} />
                            </IconButton>

                            <Typography
                              sx={{
                                fontFamily: 'var(--font-inter)',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: '#037166',
                                minWidth: '20px',
                                textAlign: 'center',
                              }}
                            >
                              {addon.quantity}
                            </Typography>

                            <IconButton
                              size="small"
                              onClick={() =>
                                handleAddonQuantityChange(addon.addonId, addon.quantity + 1)
                              }
                              sx={{ p: 0.5, color: '#037166' }}
                            >
                              <AddIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() => handleRemoveAddon(addon.addonId)}
                            disabled={removingItem === addon.addonId}
                            sx={{ p: 0.5, color: '#EF4444' }}
                          >
                            {removingItem === addon.addonId ? (
                              <CircularProgress size={16} sx={{ color: '#EF4444' }} />
                            ) : (
                              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                            )}
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </>
                )}
              </Box>

              {/* Price Breakdown Card */}
              <Paper
                elevation={0}
                sx={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: '#037166',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <ReceiptLongIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                    }}
                  >
                    Price Breakdown
                  </Typography>
                </Box>

                <Box sx={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {servicesTotal > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '13px',
                          color: '#6B7280',
                          fontWeight: 500,
                        }}
                      >
                        Services Subtotal
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '14px',
                          color: '#1F2937',
                          fontWeight: 600,
                        }}
                      >
                        ₹{servicesTotal}
                      </Typography>
                    </Box>
                  )}

                  {addonsTotal > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '13px',
                          color: '#6B7280',
                          fontWeight: 500,
                        }}
                      >
                        Add-ons Subtotal
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '14px',
                          color: '#1F2937',
                          fontWeight: 600,
                        }}
                      >
                        ₹{addonsTotal}
                      </Typography>
                    </Box>
                  )}

                  {(servicesTotal > 0 || addonsTotal > 0) && (
                    <Divider sx={{ my: 0.5 }} />
                  )}

                  {cartData?.basePrice > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ReceiptLongIcon sx={{ fontSize: 16, color: '#D97706' }} />
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '13px',
                            color: '#78350F',
                            fontWeight: 600,
                          }}
                        >
                          Base Service Charge
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '14px',
                          color: '#92400E',
                          fontWeight: 700,
                        }}
                      >
                        ₹{cartData.basePrice}
                      </Typography>
                    </Box>
                  )}

                  {cartData?.inspectionCost > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BuildIcon sx={{ fontSize: 16, color: '#2563EB' }} />
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '13px',
                            color: '#1E40AF',
                            fontWeight: 600,
                          }}
                        >
                          Inspection Fee
                        </Typography>
                        <Tooltip
                          title="To be collected at doorstep"
                          placement="top"
                          arrow
                        >
                          <InfoOutlinedIcon sx={{ fontSize: 14, color: '#6B7280', cursor: 'help' }} />
                        </Tooltip>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '14px',
                          color: '#1E40AF',
                          fontWeight: 700,
                        }}
                      >
                        ₹{cartData.inspectionCost}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 0.5 }} />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: '#F9FAFB',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#6B7280',
                      }}
                    >
                      Total Service Amount
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#1F2937',
                      }}
                    >
                      ₹{grandTotal}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 0.5 }} />

                  {bookingCharge > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px',
                        borderRadius: '8px',
                        backgroundColor: '#F0F9F7',
                        border: '2px solid #037166',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentIcon sx={{ fontSize: 18, color: '#037166' }} />
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-inter)',
                            fontSize: '14px',
                            color: '#037166',
                            fontWeight: 700,
                          }}
                        >
                          Booking Charge (Pay Now)
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '20px',
                          fontWeight: 700,
                          color: '#037166',
                        }}
                      >
                        ₹{bookingCharge}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 1,
                      padding: '12px',
                      borderRadius: '6px',
                      backgroundColor: '#FEF3C7',
                      border: '1px solid #FDE68A',
                    }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 18, color: '#92400E', mt: 0.2 }} />
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '12px',
                          color: '#78350F',
                          fontWeight: 600,
                          lineHeight: 1.5,
                        }}
                      >
                        Payment Process:
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-inter)',
                          fontSize: '11px',
                          color: '#92400E',
                          lineHeight: 1.5,
                          mt: 0.5,
                        }}
                      >
                        • Pay ₹{bookingCharge} now to confirm booking
                        <br />
                        • Inspection fee (₹{cartData?.inspectionCost || 0}) collected at doorstep
                        <br />
                        • Service charges paid after completion
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {bookingDetails && (
                <Box
                  sx={{
                    width: '100%',
                    minHeight: '85px',
                    borderRadius: '4px',
                    padding: '14px',
                    gap: '8px',
                    backgroundColor: '#F0F9F7',
                    border: '1px solid #D4EAE8',
                    boxSizing: 'border-box',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#6B7280',
                      mb: 1,
                    }}
                  >
                    Selected Date & Time
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CalendarMonthIcon sx={{ fontSize: 16, color: '#037166' }} />
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '14px',
                        color: '#1F2937',
                        fontWeight: 600,
                      }}
                    >
                      {bookingDetails.bookedDate}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: '#037166' }} />
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '14px',
                        color: '#1F2937',
                        fontWeight: 600,
                      }}
                    >
                      {bookingDetails.bookedTime}
                    </Typography>
                  </Stack>
                </Box>
              )}

              {selectedAddressData && (
                <Box
                  sx={{
                    width: '100%',
                    minHeight: '85px',
                    borderRadius: '4px',
                    padding: '14px',
                    gap: '8px',
                    backgroundColor: '#F0F9F7',
                    border: '1px solid #D4EAE8',
                    boxSizing: 'border-box',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {getAddressIcon(selectedAddressData.type)}
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#1F2937',
                      }}
                    >
                      {selectedAddressData.name}
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: '#037166',
                        color: 'white',
                        px: 1,
                        py: 0.25,
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {selectedAddressData.type?.toUpperCase()}
                    </Box>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '12px',
                      color: '#6B7280',
                      lineHeight: 1.4,
                    }}
                  >
                    {selectedAddressData.flat}, {selectedAddressData.area}
                  </Typography>
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                onClick={handlePayAndContinue}
                disabled={!isButtonEnabled()}
                sx={{
                  width: '100%',
                  height: '52px',
                  borderRadius: '8px',
                  backgroundColor: '#037166',
                  color: 'white',
                  fontFamily: 'var(--font-inter)',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '16px',
                  '&:hover': { backgroundColor: '#025951' },
                  '&:disabled': { 
                    backgroundColor: '#D1D5DB',
                    color: '#9CA3AF'
                  },
                }}
              >
                {bookingLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  `Pay ₹${bookingCharge} & Confirm Booking`
                )}
              </Button>

              {!isButtonEnabled() && (
                <Typography
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontSize: '12px',
                    color: '#EF4444',
                    textAlign: 'center',
                    mt: -2,
                  }}
                >
                  {!selectedAddress && '⚠️ Please select an address'}
                  {!bookingDetails && '⚠️ Please select date and time first'}
                  {!bookingDetails?.bookedDate && '⚠️ Missing booking date'}
                  {!bookingDetails?.bookedTime && '⚠️ Missing booking time'}
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
