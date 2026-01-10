'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Button,
  Stack,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
  Checkbox,
  Divider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DateTimePicker from '../../components/DateTimePicker';
import ServiceBookingCard from '../../components/ServiceBookingCard';

const API_BASE_URL = 'https://api.doorstephub.com';
const TABS = ['About', 'Services', 'Portfolio', 'Location', 'Reviews'];
const BOOKING_KEY = 'bookingContext';
const GUEST_CART_KEY = 'guestCart';

export default function ServiceCenterDetail() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openBookingCard, setOpenBookingCard] = useState(false);
  const [openDateTimePicker, setOpenDateTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedServiceCount, setSelectedServiceCount] = useState(0);
  
  // Addon Modal States
  const [openAddonModal, setOpenAddonModal] = useState(false);
  const [addonsData, setAddonsData] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState({});
  const [loadingAddons, setLoadingAddons] = useState(false);
  const [addonQuantities, setAddonQuantities] = useState({});

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };

  const formatDateTime = (dateObj) => {
    if (!dateObj) return null;

    try {
      let date;

      if (dateObj.date && dateObj.month && dateObj.time) {
        const monthDate = new Date(dateObj.month);
        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();
        const day = dateObj.date;

        const timeMatch = dateObj.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1], 10);
          const minutes = parseInt(timeMatch[2], 10);
          const meridiem = timeMatch[3].toUpperCase();

          if (meridiem === 'PM' && hours !== 12) {
            hours += 12;
          } else if (meridiem === 'AM' && hours === 12) {
            hours = 0;
          }

          date = new Date(year, month, day, hours, minutes, 0);
        } else {
          return null;
        }
      } else if (dateObj instanceof Date) {
        date = dateObj;
      } else if (typeof dateObj === 'string' || typeof dateObj === 'number') {
        date = new Date(dateObj);
      } else if (typeof dateObj === 'object') {
        if (typeof dateObj.toDate === 'function') {
          date = dateObj.toDate();
        } else if (typeof dateObj.format === 'function') {
          try {
            date = new Date(dateObj.toISOString?.() || dateObj.toString());
          } catch {
            return null;
          }
        } else if (dateObj.$d) {
          date = new Date(dateObj.$d);
        } else {
          date = new Date(dateObj);
        }
      }

      if (!date || isNaN(date.getTime())) {
        console.error('❌ Invalid date created:', date);
        return null;
      }

      return {
        dateObject: date,
        isoString: date.toISOString(),
        displayDate: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        displayTime: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        formattedDateTime: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
      };
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  };

  // ✅ Clear cart when entering this page
  useEffect(() => {
    const clearCart = async () => {
      const token = getAuthToken();
      
      if (!token) {
        console.log('⚠️ No auth token, skipping cart clear');
        return;
      }

      try {
        console.log('🗑️ Clearing cart on page load...');
        
        const response = await fetch(
          'https://api.doorstephub.com/v1/dhubApi/app/service-cart/clear',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          console.log('✅ Cart cleared successfully on page load');
          
          // Also clear localStorage cart data
          localStorage.removeItem(GUEST_CART_KEY);
          
          // Show success notification
          setSnackbar({
            open: true,
            message: 'Cart has been cleared',
            severity: 'info'
          });
        } else {
          console.error('❌ Failed to clear cart:', result.message);
        }
      } catch (error) {
        console.error('❌ Error clearing cart on page load:', error);
      }
    };

    // Call clear cart function
    clearCart();
  }, []); // Empty dependency array - runs only once on mount

useEffect(() => {
  if (!id) return;

  if (typeof window !== 'undefined') {
    try {
      const existingBooking = JSON.parse(localStorage.getItem(BOOKING_KEY)) || {};

      const updatedBooking = {
        ...existingBooking,
        providerId: id,
        sourceOfLead: 'Website',
        basePrice: center?.startingPrice || center?.BasePrice || 0, // 🔥 NEW
      };

      localStorage.setItem(BOOKING_KEY, JSON.stringify(updatedBooking));
    } catch (error) {
      console.error('Error setting providerId:', error);
    }
  }
}, [id, center]); // 🔥 CHANGED: Added center dependency


  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
  try {
    setLoading(true);
    setError(null);

    const apiUrl = `https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/service_center_services/${id}`;

    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error('Failed to load service center');

    const result = await res.json();

    if (!result.success) {
      throw new Error('No data');
    }

    const sc = result.serviceCenter;
    const aboutData = result.about || {};
    const portfolioData = result.portfolio || {};
    const reviewsData = result.reviews || [];
    const servicesData = result.services || [];
    const locationData = result.location || {};
    const bannerImage = result.banner_image || '/uploads/thumbn_ph_image/default_image.jpg';

    let bannerImageUrl = '/placeholder-service.jpg';
    if (bannerImage && bannerImage !== '/uploads/thumbn_ph_image/default_image.jpg') {
      if (bannerImage.startsWith('http')) {
        bannerImageUrl = bannerImage;
      } else if (bannerImage.startsWith('/')) {
        bannerImageUrl = `${API_BASE_URL}${bannerImage}`;
      } else {
        bannerImageUrl = `${API_BASE_URL}/${bannerImage}`;
      }
    }

    setCenter({
      id: id,
      name: `${sc.firstName || ''} ${sc.lastName || ''}`.trim(),
      city: locationData.address?.split(',').pop()?.trim() || 'India',
      rating: sc.avgRating || 0,
      ratingCount: sc.totalRatings || 0,
      jobsDone: sc.totalOrders || 0,
      startingPrice: sc.BasePrice || 0,
      inspectionCost: sc.inspectionCost || 0,
      serviceBookingCost: sc.serviceBookingCost || 0,
      basePrice: sc.BasePrice || 0,
      totalViews: sc.totalViews || 0,
      bannerImage: bannerImageUrl,
      logo: sc.logo 
        ? (sc.logo.startsWith('http') ? sc.logo : `${API_BASE_URL}/${sc.logo}`) 
        : '/placeholder-logo.jpg',
      description: aboutData.bio || 'Professional service center providing quality services',
      address: locationData.address || 'Location not specified',
      coordinates: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      },
      updateTime: sc.updateTime || 'Recently',
      serviceId: id,
      serviceName: `${sc.firstName || ''} ${sc.lastName || ''}`.trim(),
    });

    // 🔥 NEW: Store pricing details in localStorage immediately after fetching
    if (typeof window !== 'undefined') {
      try {
        // Update bookingContext
        const existingBooking = JSON.parse(localStorage.getItem(BOOKING_KEY)) || {};
        const updatedBooking = {
          ...existingBooking,
          providerId: id,
          sourceOfLead: 'Website',
          basePrice: sc.BasePrice || 0,
          inspectionCost: sc.inspectionCost || 0,
          serviceBookingCost: sc.serviceBookingCost || 0,
          totalViews: sc.totalViews || 0,
        };
        localStorage.setItem(BOOKING_KEY, JSON.stringify(updatedBooking));
        console.log('✅ Booking context updated with pricing:', updatedBooking);

        // Update or create guestCart with pricing
        const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || {
          items: [],
          addons: [],
          providerId: id,
          sourceOfLead: 'Website',
          guestSessionId: crypto.randomUUID(),
          createdAt: Date.now(),
        };
        
        // Add pricing fields to cart
        guestCart.basePrice = sc.BasePrice || 0;
        guestCart.inspectionCost = sc.inspectionCost || 0;
        guestCart.serviceBookingCost = sc.serviceBookingCost || 0;
        guestCart.totalViews = sc.totalViews || 0;
        guestCart.providerId = id;
        
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
        console.log('✅ Guest cart updated with pricing:', guestCart);
      } catch (error) {
        console.error('❌ Error storing pricing in localStorage:', error);
      }
    }

    // Set services, portfolio, reviews as before...
    setServices(
      servicesData.map((s) => ({
        id: s.id,
        serviceId: s.serviceId,
        name: s.name || s.serviceName || 'Service',
        price: s.price || s.serviceCharge || s.minFare || 0,
        description: s.description || 'Professional service by experts',
        image: s.image 
          ? (s.image.startsWith('http') ? s.image : `${API_BASE_URL}/${s.image}`)
          : 'https://via.placeholder.com/204x140/037166/FFFFFF?text=No+Image',
      }))
    );

    const portfolioImages = portfolioData.images || [];
    setPortfolio(
      portfolioImages
        .filter((img) => img && img !== '/uploads/thumbn_ph_image/default_image.jpg')
        .map((img, idx) => ({
          id: idx,
          src: img.startsWith('http') ? img : `${API_BASE_URL}${img.startsWith('/') ? img : '/' + img}`,
        }))
    );

    setReviews(
      reviewsData.map((r, idx) => ({
        id: idx,
        name: r.name || 'Customer',
        date: r.date || new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        rating: r.rating || 0,
        comment: r.description || r.comment || '',
      }))
    );
  } catch (e) {
    console.error('Error fetching service center:', e);
    setError(e.message);
  } finally {
    setLoading(false);
  }
};


    fetchDetail();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 7);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Listen for cart updates
  useEffect(() => {
    const updateServiceCount = () => {
      try {
        const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY));
        const count = guestCart?.items?.length || 0;
        setSelectedServiceCount(count);
        console.log(`📊 Cart count updated: ${count} services`);
      } catch (error) {
        setSelectedServiceCount(0);
      }
    };

    // Initial count
    updateServiceCount();

    // Listen for custom cart update events
    const handleCartUpdate = (event) => {
      console.log('🔄 Cart updated event received:', event.detail);
      updateServiceCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', updateServiceCount);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', updateServiceCount);
    };
  }, []);

  const handleDateTimeSelect = () => {
    setOpenDateTimePicker(true);
  };

  const handleDateTimeConfirm = (dateTime) => {
    console.log('📅 Received dateTime:', dateTime, 'Type:', typeof dateTime);

    const formatted = formatDateTime(dateTime);
    
    if (!formatted) {
      console.error('❌ Failed to format date/time');
      return;
    }

    setSelectedDateTime(formatted);
    
    if (typeof window !== 'undefined') {
      try {
        const existingBooking = JSON.parse(localStorage.getItem(BOOKING_KEY)) || {};
        
        const date = formatted.dateObject;
        const bookedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const meridiem = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        const bookedTime = `${hours}:${minutes} ${meridiem}`;
        
        const updatedBooking = {
          ...existingBooking,
          providerId: id,
          sourceOfLead: 'Website',
          bookedDate: bookedDate,
          bookedTime: bookedTime,
          selectedDateTime: formatted.isoString,
          formattedDateTime: formatted.formattedDateTime,
          displayDate: formatted.displayDate,
          displayTime: formatted.displayTime,
        };
        
        localStorage.setItem(BOOKING_KEY, JSON.stringify(updatedBooking));
        console.log('✅ Date/Time stored:', updatedBooking);
      } catch (error) {
        console.error('Error storing date/time:', error);
      }
    }

    console.log('Selected Date/Time:', formatted.formattedDateTime);
    setOpenDateTimePicker(false);
  };

  // Fetch addons for selected services
  const fetchAddons = async (selectedServiceIds) => {
    if (selectedServiceIds.length === 0) {
      return [];
    }

    setLoadingAddons(true);
    try {
      const response = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/applience-repairs-website/service-addons',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            serviceIds: selectedServiceIds,
            providerId: id,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        console.log('✅ Addons fetched:', result.data);
        return result.data || [];
      } else {
        console.error('Failed to fetch addons:', result.message);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching addons:', error);
      return [];
    } finally {
      setLoadingAddons(false);
    }
  };

  // ✅ ENHANCED: handleSendMessage with better debugging
  const handleSendMessage = async () => {
    console.log('🚀 handleSendMessage called');
    
    // Get fresh cart data
    let guestCart;
    try {
      guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY));
      console.log('📦 Retrieved cart from localStorage:', guestCart);
    } catch (error) {
      console.error('❌ Error parsing cart:', error);
      guestCart = null;
    }
    
    const selectedServiceIds = guestCart?.items?.map(item => item.serviceId) || [];
    const serviceNames = guestCart?.items?.map(item => item.name) || [];

    console.log('🔍 Selected Service IDs:', selectedServiceIds);
    console.log('🔍 Service Names:', serviceNames);

    // Service validation
    if (selectedServiceIds.length === 0) {
      setSnackbar({
        open: true,
        message: '⚠️ No services selected. Please select services from the Services tab.',
        severity: 'warning'
      });
      setTab(1); // Auto-switch to Services tab
      return;
    }

    // Date validation
    if (!selectedDateTime) {
      setSnackbar({
        open: true,
        message: `📅 Please select a date and time for your ${selectedServiceIds.length} service${selectedServiceIds.length > 1 ? 's' : ''}`,
        severity: 'warning'
      });
      setOpenDateTimePicker(true);
      return;
    }

    // Success feedback
    console.log('✅ Validation passed! Proceeding with:');
    console.log('- Services:', serviceNames.join(', '));
    console.log('- Date/Time:', selectedDateTime.displayDate, selectedDateTime.displayTime);

    // Fetch addons
    const addons = await fetchAddons(selectedServiceIds);
    console.log('📋 Fetched addons:', addons);
    
    if (addons.length > 0) {
      setAddonsData(addons);
      setOpenAddonModal(true);
    } else {
      proceedAfterAddonSelection();
    }
  };

  const proceedAfterAddonSelection = () => {
    const token = getAuthToken();
    
    if (!token) {
      // User not logged in - show toast and redirect to login
      setSnackbar({
        open: true,
        message: 'Please login to continue',
        severity: 'warning'
      });
      
      // Store current page URL for redirect after login
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectAfterLogin', pathname);
      }
      
      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        router.push(`/signin?redirect=${encodeURIComponent(pathname)}`);
      }, 1500);
      return;
    }

    // User is logged in - proceed to booking preview
    router.push('/booking/serviceconfirmation');
  };

  const handleAddonToggle = (parentServiceId, addonId) => {
    const key = `${parentServiceId}_${addonId}`;
    setSelectedAddons(prev => {
      const newState = { ...prev };
      if (newState[key]) {
        delete newState[key];
        // Reset quantity when deselecting
        setAddonQuantities(prevQty => {
          const newQty = { ...prevQty };
          delete newQty[key];
          return newQty;
        });
      } else {
        newState[key] = true;
        // Set default quantity to 1
        setAddonQuantities(prevQty => ({
          ...prevQty,
          [key]: 1
        }));
      }
      return newState;
    });
  };

  const handleAddonQuantityChange = (parentServiceId, addonId, increment) => {
    const key = `${parentServiceId}_${addonId}`;
    setAddonQuantities(prev => {
      const currentQty = prev[key] || 1;
      const newQty = increment ? currentQty + 1 : Math.max(1, currentQty - 1);
      return {
        ...prev,
        [key]: newQty
      };
    });
  };



  // ✅ ENHANCED: handleConfirmAddons with proper addon storage
const handleConfirmAddons = async () => {
  const token = getAuthToken();
  
  // Prepare addon items with complete information
  const addonItems = [];
  Object.keys(selectedAddons).forEach(key => {
    const [parentServiceId, addonId] = key.split('_');
    const quantity = addonQuantities[key] || 1;
    
    const parentService = addonsData.find(d => d.parentServiceId === parentServiceId);
    if (parentService) {
      const addon = parentService.addons.find(a => a._id === addonId);
      if (addon) {
        addonItems.push({
          addonId: addon._id,
          parentServiceId: parentServiceId,
          name: addon.childServiceName,
          price: addon.price,
          quantity: quantity,
          priceUnit: addon.priceUnit || 'unit',
          description: addon.description || '',
          image: addon.image || '',
          timestamp: Date.now(),
        });
      }
    }
  });

  console.log('🔧 Prepared addon items:', addonItems);

  // Always get the current cart from localStorage
  const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || {
    items: [],
    addons: [],
    providerId: id,
    sourceOfLead: 'Website',
    guestSessionId: crypto.randomUUID(),
    createdAt: Date.now(),
  };

  if (!token) {
    // ✅ GUEST USER: Save addons to localStorage
    // Replace addons array completely with new selection
    guestCart.addons = addonItems;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
    console.log('✅ Addons saved to guest cart:', guestCart);

    // Show success message
    if (addonItems.length > 0) {
      setSnackbar({
        open: true,
        message: `${addonItems.length} addon${addonItems.length > 1 ? 's' : ''} added to cart`,
        severity: 'success'
      });
    }
  } else {
    // ✅ LOGGED-IN USER: Add addons to API cart AND localStorage
    for (const addonItem of addonItems) {
      try {
        const response = await fetch(
          'https://api.doorstephub.com/v1/dhubApi/app/service-cart/add',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              itemType: 'addon',
              itemId: addonItem.addonId,
              parentServiceId: addonItem.parentServiceId,
              providerId: id,
              providerType: 'regular',
              quantity: addonItem.quantity,
            }),
          }
        );

        const result = await response.json();
        if (response.ok && result.success) {
          console.log(`✅ Addon added to API cart: ${addonItem.name}`);
        } else {
          console.error(`❌ Failed to add addon: ${addonItem.name}`, result.message);
        }
      } catch (error) {
        console.error(`❌ Error adding addon: ${addonItem.name}`, error);
      }
    }

    // ✅ SYNC: Also save to localStorage for consistency
    guestCart.addons = addonItems;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
    console.log('✅ Addons synced to localStorage:', guestCart);

    // Show success message
    if (addonItems.length > 0) {
      setSnackbar({
        open: true,
        message: `${addonItems.length} addon${addonItems.length > 1 ? 's' : ''} added to cart`,
        severity: 'success'
      });
    }
  }

  // ✅ Dispatch event to update other components
  window.dispatchEvent(new CustomEvent('cartUpdated', { 
    detail: guestCart 
  }));

  // Trigger parent update
  if (typeof window !== 'undefined' && window.updateCartCount) {
    window.updateCartCount();
  }

  // Close modal and proceed
  setOpenAddonModal(false);
  setTimeout(() => {
    proceedAfterAddonSelection();
  }, 500);
};


  const handleSkipAddons = () => {
    setOpenAddonModal(false);
    proceedAfterAddonSelection();
  };

  const calculateAddonTotal = () => {
    let total = 0;
    Object.keys(selectedAddons).forEach(key => {
      const [parentServiceId, addonId] = key.split('_');
      const quantity = addonQuantities[key] || 1;
      
      const parentService = addonsData.find(d => d.parentServiceId === parentServiceId);
      if (parentService) {
        const addon = parentService.addons.find(a => a._id === addonId);
        if (addon) {
          total += addon.price * quantity;
        }
      }
    });
    return total;
  };

  const handleSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  if (loading) {
    return (
      <Box
        sx={{
          py: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (error || !center) {
    return (
      <Box
        sx={{
          py: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Typography color="error">
          Failed to load service center details. Please try again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(180deg, #0A7E72 0%, #FFFFFF 35%)', 
        minHeight: '100vh', 
        pb: 6 
      }}
    >
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' },
            gap: 3,
            mb: 3,
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              position: 'relative',
            }}
          >
            <CardMedia
              component="img"
              image={center.bannerImage}
              alt={center.name}
              sx={{ 
                height: { xs: 240, md: 300 }, 
                objectFit: 'cover',
              }}
            />
            
            <Box
              sx={{
                position: 'absolute',
                bottom: 12,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: 0.75,
                zIndex: 2,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: idx === currentSlide ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: idx === currentSlide ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </Box>
          </Card>

          <Card
            sx={{
              width: '463px',
              minHeight: '378.59px',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <Typography 
              sx={{ 
                fontWeight: 700,
                fontSize: '20px',
                lineHeight: '28px',
                color: '#000000',
                margin: 0,
              }}
            >
              {center.name} | {center.city}
            </Typography>

            <Box
              sx={{
                width: '415px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ gap: '12px' }}>
                <InfoStat
                  icon={<StarIcon sx={{ fontSize: 24, color: '#037166' }} />}
                  label={center.rating.toFixed(1)}
                  sub={`${center.ratingCount}+ ratings`}
                />
                <InfoStat
                  icon={<CheckCircleIcon sx={{ fontSize: 24, color: '#037166' }} />}
                  label={center.jobsDone}
                  sub="Jobs Done"
                />
                <InfoStat
                  icon={<CurrencyRupeeIcon sx={{ fontSize: 24, color: '#037166' }} />}
                  label={`₹${center.startingPrice}`}
                  sub="Starting Price"
                />
              </Stack>
            </Box>

            <Box
              sx={{
                width: '415px',
                paddingTop: '16px',
                borderTop: '1px solid #E5E7EB',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '22px',
                }}
              >
                <Box 
                  onClick={handleDateTimeSelect}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8,
                    },
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: 24, color: '#037166' }} />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        color: '#6B7280',
                        fontWeight: 400,
                        lineHeight: '16px',
                      }}
                    >
                      {selectedDateTime ? 'Selected Date' : 'Select Date'}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#037166',
                        lineHeight: '24px',
                      }}
                    >
                      {selectedDateTime ? 'Click to change' : 'Select Date & Time'}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  sx={{
                    backgroundColor: '#037166',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '24px',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: '#025f56',
                      boxShadow: '0 6px 16px rgba(10,126,114,0.4)',
                    },
                  }}
                >
                  Send Message Request
                  {selectedServiceCount > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        borderRadius: '50%',
                        width: 24,
                        height: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
                      }}
                    >
                      {selectedServiceCount}
                    </Box>
                  )}
                </Button>
              </Box>

              {/* Selected Services Summary */}
              {selectedServiceCount > 0 && (
                <Box
                  sx={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#E0F2F1',
                    borderRadius: '8px',
                    border: '1px solid #B2DFDB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ fontSize: 18, color: '#037166' }} />
                    <Typography
                      sx={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#037166',
                        lineHeight: '16px',
                      }}
                    >
                      {selectedServiceCount} Service{selectedServiceCount > 1 ? 's' : ''} Selected
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={() => setTab(1)}
                    sx={{
                      textTransform: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#037166',
                      minWidth: 'auto',
                      padding: '4px 8px',
                      '&:hover': {
                        backgroundColor: '#B2DFDB',
                      },
                    }}
                  >
                    View
                  </Button>
                </Box>
              )}

              {selectedDateTime && (
                <Box
                  sx={{
                    width: '100%',
                    padding: '16px',
                    backgroundColor: '#F0FDF4',
                    borderRadius: '8px',
                    border: '1.5px solid #86EFAC',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    animation: 'fadeIn 0.3s ease-in',
                    '@keyframes fadeIn': {
                      from: { opacity: 0, transform: 'translateY(-10px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#037166',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 22, color: '#FFFFFF' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: '11px',
                        color: '#6B7280',
                        fontWeight: 500,
                        lineHeight: '14px',
                        mb: 0.5,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Scheduled For
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#037166',
                        lineHeight: '20px',
                      }}
                    >
                      {selectedDateTime.displayDate}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#059669',
                        lineHeight: '18px',
                        mt: 0.25,
                      }}
                    >
                      {selectedDateTime.displayTime}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={handleDateTimeSelect}
                    sx={{
                      color: '#037166',
                      backgroundColor: '#FFFFFF',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        backgroundColor: '#DCFCE7',
                      },
                    }}
                  >
                    <CalendarTodayIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Card>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            mb: 3,
            flexWrap: 'wrap',
          }}
        >
          {TABS.map((label, index) => (
            <Box
              key={label}
              onClick={() => setTab(index)}
              sx={{
                px: 3,
                py: 1,
                borderRadius: '6px',
                backgroundColor: tab === index ? '#037166' : '#D1D5DB',
                color: tab === index ? '#FFFFFF' : '#000000',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                userSelect: 'none',
                '&:hover': {
                  backgroundColor: tab === index ? '#025f56' : '#C4C8CC',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              {label}
            </Box>
          ))}
        </Box>

        <Box 
          sx={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 3, 
            p: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          {tab === 0 && <AboutTab center={center} />}
          {tab === 1 && (
            <ServicesTab 
              services={services} 
              providerId={id}
              onSnackbar={handleSnackbar}
              onCartUpdate={(cart) => {
                console.log('🔄 Cart updated in parent:', cart);
                setSelectedServiceCount(cart.items?.length || 0);
              }}
            />
          )}
          {tab === 2 && <PortfolioTab portfolio={portfolio} />}
          {tab === 3 && <LocationTab center={center} />}
          {tab === 4 && <ReviewsTab reviews={reviews} />}
        </Box>
      </Container>

      {/* Date Time Picker Dialog */}
      <DateTimePicker
        open={openDateTimePicker}
        onClose={() => setOpenDateTimePicker(false)}
        onConfirm={handleDateTimeConfirm}
        serviceName={center?.name}
      />

      {/* Addon Selection Modal */}
      <Dialog
        open={openAddonModal}
        onClose={() => {}}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #E5E7EB',
          pb: 2,
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#037166' }}>
            Add Extra Services (Optional)
          </Typography>
          <IconButton onClick={handleSkipAddons} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {loadingAddons ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#037166' }} />
            </Box>
          ) : addonsData.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No add-ons available for selected services
            </Typography>
          ) : (
            <Box sx={{ maxHeight: '60vh', overflowY: 'auto', pr: 1 }}>
              {addonsData.map((parentService, index) => (
                <Box key={parentService.parentServiceId} sx={{ mb: 4 }}>
                  {/* Parent Service Header */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#000000', mb: 0.5 }}>
                      {parentService.parentServiceName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{parentService.parentServicePrice}
                    </Typography>
                  </Box>

                  {/* Addons List */}
                  <Stack spacing={2}>
                    {parentService.addons.map((addon) => {
                      const key = `${parentService.parentServiceId}_${addon._id}`;
                      const isSelected = selectedAddons[key];
                      const quantity = addonQuantities[key] || 1;
                      
                      return (
                        <Card
                          key={addon._id}
                          sx={{
                            p: 2,
                            border: isSelected ? '2px solid #037166' : '1px solid #E5E7EB',
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: '#037166',
                              boxShadow: '0 4px 12px rgba(3,113,102,0.1)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleAddonToggle(parentService.parentServiceId, addon._id)}
                              sx={{
                                color: '#037166',
                                '&.Mui-checked': {
                                  color: '#037166',
                                },
                                mt: -1,
                              }}
                            />

                            {addon.image && (
                              <Box
                                component="img"
                                src={addon.image.startsWith('http') ? addon.image : `${API_BASE_URL}/${addon.image.replace(/\\/g, '/')}`}
                                alt={addon.childServiceName}
                                sx={{
                                  width: 80,
                                  height: 80,
                                  borderRadius: 2,
                                  objectFit: 'cover',
                                }}
                              />
                            )}

                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                {addon.childServiceName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {addon.description}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#037166', fontWeight: 600 }}>
                                ₹{addon.price} {addon.priceUnit && `/ ${addon.priceUnit}`}
                              </Typography>
                            </Box>

                            {isSelected && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddonQuantityChange(parentService.parentServiceId, addon._id, false);
                                  }}
                                  sx={{
                                    border: '1px solid #E5E7EB',
                                    width: 28,
                                    height: 28,
                                  }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>
                                  {quantity}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddonQuantityChange(parentService.parentServiceId, addon._id, true);
                                  }}
                                  sx={{
                                    border: '1px solid #037166',
                                    backgroundColor: '#037166',
                                    color: '#FFFFFF',
                                    width: 28,
                                    height: 28,
                                    '&:hover': {
                                      backgroundColor: '#025f56',
                                    },
                                  }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        </Card>
                      );
                    })}
                  </Stack>

                  {index < addonsData.length - 1 && (
                    <Divider sx={{ mt: 3 }} />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ 
          borderTop: '1px solid #E5E7EB', 
          px: 3, 
          py: 2,
          flexDirection: 'column',
          gap: 2,
        }}>
          {Object.keys(selectedAddons).length > 0 && (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {Object.keys(selectedAddons).length} addon{Object.keys(selectedAddons).length > 1 ? 's' : ''} selected
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#037166' }}>
                +₹{calculateAddonTotal()}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
            <Button
              onClick={handleSkipAddons}
              variant="outlined"
              fullWidth
              sx={{
                borderColor: '#E5E7EB',
                color: '#6B7280',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#D1D5DB',
                  backgroundColor: '#F9FAFB',
                },
              }}
            >
              Skip
            </Button>
            <Button
              onClick={handleConfirmAddons}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#037166',
                color: '#FFFFFF',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#025f56',
                },
              }}
            >
              {Object.keys(selectedAddons).length > 0 ? 'Confirm Add-ons' : 'Continue Without Add-ons'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Booking Card Dialog */}
      <Dialog
        open={openBookingCard}
        onClose={() => setOpenBookingCard(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: '463px',
            m: 2,
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {center && <ServiceBookingCard service={center} />}
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '.MuiSnackbar-anchorOriginTopRight': {
            top: '24px',
            right: '24px',
          },
        }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%', minWidth: '300px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

// ==========================================
// HELPER COMPONENTS
// ==========================================

function InfoStat({ icon, label, sub }) {
  return (
    <Box
      sx={{
        flex: 1,
        borderRadius: '8px',
        backgroundColor: '#F3F4F6',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 0.5,
        }}
      >
        {icon}
      </Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '18px',
          lineHeight: '24px',
          color: '#037166',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '12px',
          color: '#6B7280',
          textAlign: 'center',
          lineHeight: '16px',
        }}
      >
        {sub}
      </Typography>
    </Box>
  );
}

function AboutTab({ center }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        About
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {center.description}
      </Typography>
    </Box>
  );
}

function ServicesTab({ services, providerId, onSnackbar, onCartUpdate }) {
  const [selectedServices, setSelectedServices] = useState({});
  const [loading, setLoading] = useState({});

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  };

  useEffect(() => {
    const initializeCart = async () => {
      const token = getAuthToken();
      
      if (!token) {
        // Guest user - load from localStorage
        try {
          const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY));
          if (guestCart && guestCart.items && guestCart.items.length > 0) {
            const selectedMap = {};
            guestCart.items.forEach(item => {
              selectedMap[item.serviceId] = true;
            });
            setSelectedServices(selectedMap);
            console.log('✅ Guest cart loaded from localStorage:', guestCart);
          }
        } catch (error) {
          console.error('Error loading guest cart:', error);
        }
      } else {
        // Logged-in user - fetch from API
        try {
          const response = await fetch(
            'https://api.doorstephub.com/v1/dhubApi/app/service-cart/get',
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            }
          );
          
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.cart && result.cart.items) {
              const selectedMap = {};
              result.cart.items.forEach(item => {
                selectedMap[item.serviceId || item.itemId] = true;
              });
              setSelectedServices(selectedMap);
              console.log('✅ User cart loaded from API:', result.cart);
            }
          }
        } catch (error) {
          console.error('❌ Error fetching user cart:', error);
        }
      }
    };

    initializeCart();
  }, []);

  const toggleServiceSelection = async (service) => {
  const token = getAuthToken();
  const isCurrentlySelected = selectedServices[service.id];
  
  // Validate service ID
  const serviceItemId = service.id || service.serviceId;
  
  if (!serviceItemId) {
    console.error('❌ No valid service ID found!');
    onSnackbar('Invalid service ID', 'error');
    return;
  }
  
  setLoading((prev) => ({ ...prev, [serviceItemId]: true }));

  try {
    if (!token) {
      // ========================================
      // GUEST USER - localStorage operations
      // ========================================
      const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || {
        items: [],
        addons: [],
        providerId: providerId,
        sourceOfLead: 'Website',
        guestSessionId: crypto.randomUUID(),
        createdAt: Date.now(),
      };

      if (isCurrentlySelected) {
        // REMOVE service from guest cart
        guestCart.items = guestCart.items.filter(item => item.serviceId !== serviceItemId);
        
        // REMOVE related addons from guest cart
        guestCart.addons = guestCart.addons.filter(addon => addon.parentServiceId !== serviceItemId);
        
        setSelectedServices((prev) => {
          const updated = { ...prev };
          delete updated[serviceItemId];
          return updated;
        });
        onSnackbar(`${service.name} removed from cart`, 'info');
      } else {
        // ADD service to guest cart
        guestCart.items.push({
          serviceId: serviceItemId,
          name: service.name,
          price: service.price,
          quantity: 1,
          timestamp: Date.now(),
        });
        setSelectedServices((prev) => ({
          ...prev,
          [serviceItemId]: true,
        }));
        onSnackbar(`${service.name} added to cart`, 'success');
      }

      if (!guestCart.providerId) {
        guestCart.providerId = providerId;
      }

      // ✅ CRITICAL: Save to localStorage
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
      console.log('📦 Guest cart updated:', guestCart);
      
      // ✅ Trigger parent component update
      if (onCartUpdate) {
        onCartUpdate(guestCart);
      }
      
      // ✅ Dispatch custom event for cross-component sync
      window.dispatchEvent(new CustomEvent('cartUpdated', { 
        detail: guestCart 
      }));
      
    } else {
      // ========================================
      // LOGGED-IN USER - API operations + localStorage sync
      // ========================================
      if (isCurrentlySelected) {
        // STEP 1: Get current cart to find related addons
        const getCartResponse = await fetch(
          'https://api.doorstephub.com/v1/dhubApi/app/service-cart/get',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        const cartData = await getCartResponse.json();
        console.log('Current cart data:', cartData);

        // STEP 2: Find and remove related addons first
        if (cartData.success && cartData.cart && cartData.cart.addons) {
          const relatedAddons = cartData.cart.addons.filter(
            addon => addon.parentServiceId === serviceItemId
          );
          
          console.log(`Found ${relatedAddons.length} related addons to remove`);
          
          for (const addon of relatedAddons) {
            try {
              const removeAddonResponse = await fetch(
                'https://api.doorstephub.com/v1/dhubApi/app/service-cart/remove',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    itemType: 'addon',
                    itemId: addon.addonId || addon.itemId || addon.id,
                  }),
                }
              );
              
              const addonResult = await removeAddonResponse.json();
              if (addonResult.success) {
                console.log(`✅ Removed addon: ${addon.name || addon.childServiceName}`);
              }
            } catch (addonError) {
              console.error('Error removing addon:', addonError);
            }
          }
        }

        // STEP 3: Remove the main service
        const response = await fetch(
          'https://api.doorstephub.com/v1/dhubApi/app/service-cart/remove',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              itemType: 'service',
              itemId: serviceItemId,
            }),
          }
        );
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          setSelectedServices((prev) => {
            const updated = { ...prev };
            delete updated[serviceItemId];
            return updated;
          });
          onSnackbar(`${service.name} and related add-ons removed`, 'info');
          
          // ✅ FIX: Sync to localStorage after API removal
          const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || {
            items: [],
            addons: [],
            providerId: providerId,
            sourceOfLead: 'Website',
          };
          
          guestCart.items = guestCart.items.filter(item => item.serviceId !== serviceItemId);
          guestCart.addons = guestCart.addons.filter(addon => addon.parentServiceId !== serviceItemId);
          
          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
          console.log('📦 localStorage synced after API removal:', guestCart);
          
          // Trigger update
          if (onCartUpdate) {
            onCartUpdate(guestCart);
          }
          window.dispatchEvent(new CustomEvent('cartUpdated', { detail: guestCart }));
        } else {
          throw new Error(result.message || 'Failed to remove from cart');
        }
      } else {
        // ADD to API cart
        const response = await fetch(
          'https://api.doorstephub.com/v1/dhubApi/app/service-cart/add',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              itemType: 'service',
              itemId: serviceItemId,
              providerId: providerId,
              providerType: 'regular',
              quantity: 1,
            }),
          }
        );
        
        const result = await response.json();
        console.log('Add API response:', result);
        
        if (response.ok && result.success) {
          setSelectedServices((prev) => ({
            ...prev,
            [serviceItemId]: true,
          }));
          onSnackbar(`${service.name} added to cart`, 'success');
          
          // ✅ FIX: Sync to localStorage after API addition
          const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || {
            items: [],
            addons: [],
            providerId: providerId,
            sourceOfLead: 'Website',
            guestSessionId: crypto.randomUUID(),
            createdAt: Date.now(),
          };
          
          // Check if item already exists
          const existingItem = guestCart.items.find(item => item.serviceId === serviceItemId);
          
          if (!existingItem) {
            guestCart.items.push({
              serviceId: serviceItemId,
              name: service.name,
              price: service.price,
              quantity: 1,
              timestamp: Date.now(),
            });
          }
          
          if (!guestCart.providerId) {
            guestCart.providerId = providerId;
          }
          
          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
          console.log('📦 localStorage synced after API addition:', guestCart);
          
          // Trigger update
          if (onCartUpdate) {
            onCartUpdate(guestCart);
          }
          window.dispatchEvent(new CustomEvent('cartUpdated', { detail: guestCart }));
        } else {
          throw new Error(result.message || 'Failed to add to cart');
        }
      }
    }
  } catch (error) {
    console.error('❌ Error toggling service:', error);
    onSnackbar('Failed to update cart. Please try again.', 'error');
  } finally {
    setLoading((prev) => ({ ...prev, [serviceItemId]: false }));
  }
};


  if (!services.length) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
        No services available at the moment.
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontSize: '20px', color: '#000000' }}>
        Services
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: '16px',
          mb: 3,
        }}
      >
        {services.map((service) => {
          const isSelected = selectedServices[service.id];
          const isLoading = loading[service.id];

          return (
            <Box
              key={service.id}
              onClick={() => !isLoading && toggleServiceSelection(service)}
              sx={{
                width: '100%',
                maxWidth: '278.5px',
                height: '47px',
                borderRadius: '4px',
                padding: '10px',
                backgroundColor: isSelected ? '#037166' : '#D9EAE8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: 1,
                border: 'none',
                boxShadow: 'none',
                '&:hover': {
                  opacity: 0.9,
                  transform: isLoading ? 'none' : 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              }}
            >
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '150%',
                  letterSpacing: '-0.01em',
                  color: isSelected ? '#FFFFFF' : '#000000',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {service.name}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '150%',
                  color: isSelected ? '#FFFFFF' : '#037166',
                  whiteSpace: 'nowrap',
                  marginRight: '12px',
                }}
              >
                ₹{service.price}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '24px',
                }}
              >
                {isLoading ? (
                  <CircularProgress size={20} sx={{ color: isSelected ? '#FFFFFF' : '#037166' }} />
                ) : isSelected ? (
                  <CheckCircleIcon sx={{ fontSize: 22, color: '#FFFFFF' }} />
                ) : null}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function PortfolioTab({ portfolio }) {
  if (!portfolio.length) {
    return <Typography color="text.secondary">No portfolio images.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Portfolio
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 1.5,
        }}
      >
        {portfolio.map((p) => (
          <Card
            key={p.id}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.03)',
              },
            }}
          >
            <CardMedia component="img" src={p.src} alt="" sx={{ height: 150, objectFit: 'cover' }} />
          </Card>
        ))}
      </Box>
    </Box>
  );
}

function LocationTab({ center }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Location
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3, gap: 1 }}>
        <RoomIcon sx={{ color: 'primary.main', fontSize: 20, mt: 0.3 }} />
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          {center.address}
        </Typography>
      </Box>
    </Box>
  );
}

function ReviewsTab({ reviews }) {
  if (!reviews.length) {
    return <Typography color="text.secondary">No reviews yet.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Reviews
      </Typography>
      <Stack spacing={2}>
        {reviews.map((review) => (
          <Card key={review.id} sx={{ p: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {review.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {review.date}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  sx={{
                    fontSize: 16,
                    color: i < review.rating ? '#FFA500' : '#E0E0E0',
                  }}
                />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {review.comment}
            </Typography>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
