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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { URLS } from '@/app/utilis/urls';
import { useLocation } from '@/app/contexts/LocationContext';

const API_BASE_URL = 'https://api.doorstephub.com';
const TABS = ['About', 'Services', 'Portfolio', 'Location', 'Reviews'];

export default function ServiceCenterDetail({ params }) {
  const { id } = params; // ✅ GET ID FROM URL

  console.log('Service Center ID:', id);

  const router = useRouter();
  const { location } = useLocation?.() || {};

  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState(null);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);


  // Fetch service center detail
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const body = { serviceCenterId: id };
        if (location?.latitude && location?.longitude) {
          body.lattitude = parseFloat(location.latitude);
          body.longitude = parseFloat(location.longitude);
        }

        const res = await fetch(URLS.getServiceCenterDetail, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error('Failed to load service center');

        const result = await res.json();

        if (!result.success || !result.data) {
          throw new Error('No data');
        }

        const sc = result.data;

        setCenter({
          id: sc._id,
          name: sc.name || `${sc.firstName} ${sc.lastName}`,
          city: sc.city || sc.cityName || 'Hyderabad',
          rating: sc.rating || 4.5,
          ratingCount: sc.ratingCount || 22,
          jobsDone: sc.jobsDone || sc.totalOrders || 53,
          startingPrice: sc.startingPrice || sc.minFare || 125,
          bannerImage: sc.bannerImage
            ? `${API_BASE_URL}/${sc.bannerImage}`
            : `${API_BASE_URL}/${sc.mainImage || sc.image || ''}`,
          description:
            sc.description ||
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text ever since the 1500s.',
          address: sc.address || 'Hyderabad, Telangana, India',
          coordinates: sc.location || null,
        });

        setServices(
          (sc.services || []).map((s) => ({
            id: s._id,
            name: s.name,
            price: s.serviceCharge || s.minFare || 299,
          }))
        );

        setPortfolio(
          (sc.portfolioImages || []).map((img, idx) => ({
            id: idx,
            src: `${API_BASE_URL}/${img}`,
          }))
        );

        setReviews(
          (sc.reviews || []).map((r, idx) => ({
            id: idx,
            name: r.name || 'Customer',
            date: r.date || '23 Dec, 2025',
            rating: r.rating || 4,
            comment: r.comment || '',
          }))
        );
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, location?.latitude, location?.longitude]);

  const handleTabChange = (_e, value) => setTab(value);

  const handleSendMessage = () => {
    if (!center) return;
    router.push(`/booking?serviceCenterId=${center.id}&type=center`);
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
        <CircularProgress />
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
    <Box sx={{ background: 'linear-gradient(#0f9c8e, #ffffff)', minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 6 }}>
        {/* Top section: banner + right info card */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '2fr 1.1fr' },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Banner */}
          <Card
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 18px 40px rgba(0,0,0,0.25)',
            }}
          >
            <CardMedia
              component="img"
              image={center.bannerImage || '/placeholder-service.jpg'}
              alt={center.name}
              sx={{ height: { xs: 220, md: 260 }, objectFit: 'cover' }}
            />
          </Card>

          {/* Right info card */}
          <Card
            sx={{
              borderRadius: 3,
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {center.name} | {center.city}
            </Typography>

            <Stack direction="row" spacing={1.5}>
              <InfoStat
                icon={<StarIcon fontSize="small" />}
                label={`${center.rating}`}
                sub={`${center.ratingCount}+ ratings`}
              />
              <InfoStat
                icon={<CalendarTodayIcon fontSize="small" />}
                label={center.jobsDone}
                sub="Jobs Done"
              />
              <InfoStat
                icon={<span>₹</span>}
                label={`₹${center.startingPrice}`}
                sub="Starting Price"
              />
            </Stack>

            <Box
              sx={{
                mt: 1,
                p: 1.5,
                borderRadius: 2,
                border: '1px dashed rgba(0,0,0,0.12)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarTodayIcon fontSize="small" color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Select Date
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Select Date &amp; Time
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={handleSendMessage}
                sx={{
                  borderRadius: 999,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Send Message Request
              </Button>
            </Box>
          </Card>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
            backgroundColor: '#ffffff',
            borderRadius: 999,
            minHeight: 0,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: 14,
              minHeight: 0,
              py: 1,
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          {TABS.map((label, index) => (
            <Tab
              key={label}
              label={label}
              sx={{
                borderRadius: 999,
                px: 4,
                mr: 0.5,
                bgcolor: tab === index ? 'primary.main' : 'transparent',
                color: tab === index ? '#ffffff' : 'text.primary',
                '&:hover': { bgcolor: tab === index ? 'primary.main' : 'rgba(15,156,142,0.06)' },
              }}
            />
          ))}
        </Tabs>

        {/* Tab panels */}
        <Box sx={{ backgroundColor: '#ffffff', borderRadius: 2, p: 3 }}>
          {tab === 0 && <AboutTab center={center} />}
          {tab === 1 && <ServicesTab services={services} />}
          {tab === 2 && <PortfolioTab portfolio={portfolio} />}
          {tab === 3 && <LocationTab center={center} />}
          {tab === 4 && <ReviewsTab reviews={reviews} />}
        </Box>
      </Container>
    </Box>
  );
}

/* --- Small sub components --- */

function InfoStat({ icon, label, sub }) {
  return (
    <Box
      sx={{
        flex: 1,
        borderRadius: 2,
        bgcolor: 'rgba(15,156,142,0.06)',
        p: 1.2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          bgcolor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{label}</Typography>
        <Typography sx={{ fontSize: 11 }} color="text.secondary">
          {sub}
        </Typography>
      </Box>
    </Box>
  );
}

function AboutTab({ center }) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        About
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {center.description}
      </Typography>
    </Box>
  );
}

function ServicesTab({ services }) {
  if (!services.length) {
    return <Typography>No services listed.</Typography>;
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Services
      </Typography>
      <Stack spacing={1}>
        {services.map((s) => (
          <Box
            key={s.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 1,
              bgcolor: '#f8fafc',
              px: 2,
              py: 1,
            }}
          >
            <Typography variant="body2">{s.name}</Typography>
            <Chip
              label={`₹${s.price}`}
              color="primary"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function PortfolioTab({ portfolio }) {
  if (!portfolio.length) {
    return <Typography>No portfolio images.</Typography>;
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Portfolio
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 1,
        }}
      >
        {portfolio.map((p) => (
          <Card key={p.id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
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
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Location
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <RoomIcon color="primary" />
        <Typography variant="body2" color="text.secondary">
          {center.address}
        </Typography>
      </Box>
      {/* Placeholder map image - replace with real map if needed */}
      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          src="/static/map-placeholder.png"
          alt="Map"
          sx={{ height: 260, objectFit: 'cover' }}
        />
      </Card>
    </Box>
  );
}

function ReviewsTab({ reviews }) {
  if (!reviews.length) {
    return <Typography>No reviews yet.</Typography>;
  }

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Reviews
      </Typography>
      <Stack spacing={1.5}>
        {reviews.map((r) => (
          <Box
            key={r.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 1,
              bgcolor: '#f8fafc',
              px: 2,
              py: 1.2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {r.name?.[0] || 'U'}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {r.name}
                </Typography>
                <Rating
                  value={Number(r.rating) || 4}
                  size="small"
                  precision={0.5}
                  readOnly
                />
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              {r.date}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
