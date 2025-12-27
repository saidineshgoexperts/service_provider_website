'use client';

import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Stack,
  Avatar,
  Rating,
  CircularProgress,
  IconButton,
  Dialog,
  DialogContent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { URLS } from '@/app/utilis/urls';
import { useLocation } from '@/app/contexts/LocationContext';
import ServiceBookingCard from '../../components/ServiceBookingCard';

const API_BASE_URL = 'https://api.doorstephub.com';
const TABS = ['About', 'Services', 'Portfolio', 'Location', 'Reviews'];

export default function ServiceCenterDetail() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const router = useRouter();
  const { location } = useLocation?.() || {};
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState({});
  const [openBookingCard, setOpenBookingCard] = useState(false);

  const BOOKING_KEY = 'bookingContext';

  // 🔥 Set providerId when component mounts (SERVICE CENTER FLOW)
  useEffect(() => {
    if (!id) return;

    // Store providerId in localStorage for service center flow
    if (typeof window !== 'undefined') {
      try {
        const existingBooking = JSON.parse(localStorage.getItem(BOOKING_KEY)) || {};

        const updatedBooking = {
          ...existingBooking,
          providerId: id, // 🔥 Set service center ID as providerId
          sourceOfLead: 'Website',
        };

        localStorage.setItem(BOOKING_KEY, JSON.stringify(updatedBooking));
        
        // Also update currentBooking for backward compatibility
        localStorage.setItem('currentBooking', JSON.stringify(updatedBooking));
        
        console.log('🚀 SERVICE CENTER FLOW - providerId set:', id);
        console.log('📦 Current booking data:', updatedBooking);
      } catch (error) {
        console.error('Error setting providerId:', error);
      }
    }
  }, [id]);

  // Fetch service center detail using the new API
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

        // Set center data
        setCenter({
          id: id,
          name: `${sc.firstName || ''} ${sc.lastName || ''}`.trim(),
          city: locationData.address?.split(',').pop()?.trim() || 'India',
          rating: sc.avgRating || 4.5,
          ratingCount: sc.totalRatings || 0,
          jobsDone: sc.totalOrders || 0,
          startingPrice: sc.BasePrice || 125,
          inspectionCost: sc.inspectionCost || 0,
          serviceBookingCost: sc.serviceBookingCost || 0,
          bannerImage: sc.logo
            ? `${API_BASE_URL}/${result.banner_image || sc.logo}`
            : '/placeholder-service.jpg',
          logo: sc.logo ? `${API_BASE_URL}/${sc.logo}` : '/placeholder-logo.jpg',
          description: aboutData.bio || 'Professional service center providing quality services',
          address: locationData.address || 'Location not specified',
          coordinates: {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
          },
          totalViews: sc.totalViews || 0,
          updateTime: sc.updateTime || 'Recently',
          serviceId: id,
          serviceName: `${sc.firstName || ''} ${sc.lastName || ''}`.trim(),
        });

        // Set services
        setServices(
          servicesData.map((s) => ({
            id: s.id,
            serviceId: s.serviceId,
            name: s.name || s.serviceName || 'Service',
            price: s.price || s.serviceCharge || s.minFare || 0,
            description: s.description || 'Professional service by experts',
            image: s.image ? `${API_BASE_URL}/${s.image}` : 'https://via.placeholder.com/204x140/037166/FFFFFF?text=No+Image',
          }))
        );

        // Set portfolio
        const portfolioImages = portfolioData.images || [];
        setPortfolio(
          portfolioImages
            .filter((img) => img && img !== '/uploads/thumbn_ph_image/default_image.jpg')
            .map((img, idx) => ({
              id: idx,
              src: `${API_BASE_URL}${img}`,
            }))
        );

        // Set reviews
        setReviews(
          reviewsData.map((r, idx) => ({
            id: idx,
            name: r.name || 'Customer',
            date: r.date || new Date().toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            }),
            rating: r.rating || 4,
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

  // Auto carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 7);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (_e, value) => setTab(value);

  const handleSendMessage = () => {
    setOpenBookingCard(true);
  };

  const toggleFavorite = (serviceId, event) => {
    event.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  // 🔥 Updated handleBookService with proper flow management
  const handleBookService = (service, event) => {
    event.stopPropagation();

    if (!service.id) {
      console.error('❌ Service ID missing', service);
      return;
    }

    // 🔥 Store BOTH providerId and serviceId for SERVICE CENTER FLOW
    if (typeof window !== 'undefined') {
      try {
        const existingBooking = JSON.parse(localStorage.getItem(BOOKING_KEY)) || {};

        const updatedBooking = {
          ...existingBooking,
          providerId: id, // 🔥 Service center ID from URL params
          serviceId: service.id, // 🔥 Service instance ID
          serviceName: service.name,
          servicePrice: service.price || 125,
          sourceOfLead: 'Website',
        };

        localStorage.setItem(BOOKING_KEY, JSON.stringify(updatedBooking));
        
        // Also update currentBooking for backward compatibility
        localStorage.setItem('currentBooking', JSON.stringify(updatedBooking));

        console.log('✅ SERVICE CENTER FLOW - Booking data stored:', {
          providerId: id,
          serviceId: service.id,
          serviceName: service.name,
        });
      } catch (error) {
        console.error('Error storing booking data:', error);
      }
    }

    console.log('🚀 Navigating to service-center-service page');
    console.log('📍 Provider ID (Service Center):', id);
    console.log('📍 Service ID:', service.id);

    // Navigate to service detail page
    router.push(`/service-center-service/${service.id}`);
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
        {/* Top section: banner + right info card */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' },
            gap: 3,
            mb: 3,
          }}
        >
          {/* Banner with Carousel */}
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
            
            {/* Carousel Dots */}
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

          {/* Right info card */}
          <Card
            sx={{
              borderRadius: 3,
              p: 2.5,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2.5,
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                color: 'text.primary',
              }}
            >
              {center.name} | {center.city}
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
              <InfoStat
                icon={<StarIcon sx={{ fontSize: 18, color: '#FFA726' }} />}
                label={center.rating.toFixed(1)}
                sub={`${center.ratingCount}+ ratings`}
              />
              <InfoStat
                icon={<CheckCircleIcon sx={{ fontSize: 18, color: 'primary.main' }} />}
                label={center.jobsDone}
                sub="Jobs Done"
              />
              <InfoStat
                icon={<CurrencyRupeeIcon sx={{ fontSize: 18, color: 'primary.main' }} />}
                label={`₹${center.startingPrice}`}
                sub="Starting Price"
              />
            </Stack>

            <Box
              sx={{
                mt: 'auto',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                fullWidth
                sx={{
                  borderRadius: 999,
                  px: 3,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(10,126,114,0.3)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: '0 6px 16px rgba(10,126,114,0.4)',
                  },
                }}
              >
                Send Message Request
              </Button>
            </Box>
          </Card>
        </Box>

        {/* Tabs */}
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: 999,
            p: 0.5,
            mb: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'inline-flex',
          }}
        >
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 0,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 14,
                minHeight: 0,
                py: 1.2,
                px: 3,
                color: 'text.primary',
                borderRadius: 999,
                transition: 'all 0.2s ease',
                '&.Mui-selected': {
                  color: '#FFFFFF',
                  bgcolor: 'primary.main',
                },
              },
              '& .MuiTabs-indicator': {
                display: 'none',
              },
            }}
          >
            {TABS.map((label) => (
              <Tab key={label} label={label} />
            ))}
          </Tabs>
        </Box>

        {/* Tab panels */}
        <Box 
          sx={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 3, 
            p: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          {tab === 0 && <AboutTab center={center} />}
          {tab === 1 && <ServicesTab services={services} favorites={favorites} toggleFavorite={toggleFavorite} handleBookService={handleBookService} />}
          {tab === 2 && <PortfolioTab portfolio={portfolio} />}
          {tab === 3 && <LocationTab center={center} />}
          {tab === 4 && <ReviewsTab reviews={reviews} />}
        </Box>
      </Container>

      {/* Service Booking Card Dialog */}
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
    </Box>
  );
}

/* --- Small sub components --- */

function InfoStat({ icon, label, sub }) {
  return (
    <Box
      sx={{
        flex: '1 1 auto',
        minWidth: 100,
        borderRadius: 2,
        bgcolor: 'rgba(10,126,114,0.08)',
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography 
          sx={{ 
            fontSize: 11, 
            color: 'text.secondary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {sub}
        </Typography>
      </Box>
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

function ServicesTab({ services, favorites, toggleFavorite, handleBookService }) {
  if (!services.length) {
    return <Typography color="text.secondary">No services listed.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Services
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(auto-fill, minmax(204px, 1fr))',
            sm: 'repeat(auto-fill, minmax(204px, 1fr))',
            md: 'repeat(auto-fill, minmax(204px, 1fr))',
          },
          gap: '6.95px',
        }}
      >
        {services.map((service) => (
          <Card
            key={service.id}
            onClick={(e) => handleBookService(service, e)}
            sx={{
              width: '204px',
              height: '275.05px',
              borderRadius: '6.95px',
              border: '0.87px solid #E5E7EB',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              backgroundColor: '#FFFFFF',
              opacity: 1,
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                component="img"
                image={service.image}
                alt={service.name}
                sx={{
                  height: '140px',
                  objectFit: 'cover',
                  backgroundColor: '#E5E7EB',
                }}
              />

              <IconButton
                onClick={(e) => toggleFavorite(service.id, e)}
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  backgroundColor: 'white',
                  width: 28,
                  height: 28,
                  '&:hover': {
                    backgroundColor: 'white',
                  },
                }}
              >
                {favorites[service.id] ? (
                  <FavoriteIcon sx={{ fontSize: '1rem', color: '#EF4444' }} />
                ) : (
                  <FavoriteBorderIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                )}
              </IconButton>
            </Box>

            <CardContent 
              sx={{ 
                p: 1.5, 
                height: '135.05px', 
                display: 'flex', 
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 0.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {service.name}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  mb: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  minHeight: '28px',
                  lineHeight: 1.4,
                }}
              >
                {service.description}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 'auto',
                  height: '49.91px',
                  pt: '6.95px',
                  pr: '8.11px',
                  pb: '6.95px',
                  pl: '8.11px',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    fontSize: '0.8rem',
                  }}
                >
                  ₹{service.price}
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => handleBookService(service, e)}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    px: 1.5,
                    py: 0.5,
                    minWidth: 'auto',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  Book Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
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
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
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
            <CardMedia
              component="img"
              src={p.src}
              alt=""
              sx={{ height: 150, objectFit: 'cover' }}
            />
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
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {center.address}
        </Typography>
      </Box>
      <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <CardMedia
          component="img"
          src="/static/map-placeholder.png"
          alt="Map"
          sx={{ height: 280, objectFit: 'cover' }}
        />
      </Card>
    </Box>
  );
}

function ReviewsTab({ reviews }) {
  const [visibleCount, setVisibleCount] = useState(4);

  if (!reviews.length) {
    return <Typography color="text.secondary">No reviews yet.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Reviews
      </Typography>
      <Stack spacing={2}>
        {reviews.slice(0, visibleCount).map((r) => (
          <Box
            key={r.id}
            sx={{
              display: 'flex',
              gap: 1.5,
              borderRadius: 2,
              bgcolor: '#F5F5F5',
              p: 2,
            }}
          >
            <Avatar sx={{ width: 40, height: 40, flexShrink: 0 }}>
              {r.name?.[0] || 'U'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {r.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {r.date}
                </Typography>
              </Box>
              <Rating
                value={Number(r.rating) || 4}
                size="small"
                precision={0.5}
                readOnly
                sx={{ mb: r.comment ? 1 : 0 }}
              />
              {r.comment && (
                <Typography variant="body2" color="text.secondary">
                  {r.comment}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Stack>

      {visibleCount < reviews.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => setVisibleCount((prev) => Math.min(prev + 4, reviews.length))}
            sx={{
              borderRadius: 999,
              px: 4,
              py: 1,
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: 'primary.main',
            }}
          >
            Show More
          </Button>
        </Box>
      )}
    </Box>
  );
}
