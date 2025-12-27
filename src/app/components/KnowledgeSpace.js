'use client';

import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  Skeleton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useRef, useState, useEffect } from 'react';

export default function KnowledgeSpace() {
  const scrollContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const articles = [
    {
      id: 1,
      title: '5 Signs Your Home Appliance Needs Immediate Service',
      excerpt:
        'Noticing unusual noises, low performance, or sudden shutdown? Learn the early warning signs to avoid major...',
      date: '01 Jan 2022',
      image: '/images/article-1.jpg',
    },
    {
      id: 2,
      title: 'Building your API Stack',
      excerpt:
        'A well-maintained AC unit conserves less energy, and lasts longer. This blog contains amazing articles...',
      date: '01 Jan 2022',
      image: '/images/article-2.jpg',
    },
    {
      id: 3,
      title: 'Building your API Stack',
      excerpt:
        'Cleaning filters, and using the right detergent can keep your washing machine...',
      date: '01 Jan 2022',
      image: '/images/article-3.jpg',
    },
    {
      id: 4,
      title: 'Building your API Stack',
      excerpt:
        'Simple habits for better fridge maintenance, and how you can start using today.',
      date: '01 Jan 2022',
      image: '/images/article-4.jpg',
    },
  ];

  // Simulate loading (remove this in production if data comes from API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360;
      const newScrollPosition =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  // Skeleton Article Card Component
  const SkeletonArticleCard = () => (
    <Card
      sx={{
        minWidth: { xs: 280, sm: 320, md: 340 },
        maxWidth: { xs: 280, sm: 320, md: 340 },
        flexShrink: 0,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      {/* Image Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={200}
        animation="wave"
        sx={{ bgcolor: 'grey.200' }}
      />

      {/* Content Skeleton */}
      <CardContent sx={{ p: 3 }}>
        {/* Title Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton
              variant="text"
              width="100%"
              height={24}
              animation="wave"
              sx={{ bgcolor: 'grey.200', mb: 0.5 }}
            />
            <Skeleton
              variant="text"
              width="80%"
              height={24}
              animation="wave"
              sx={{ bgcolor: 'grey.200' }}
            />
          </Box>
          <Skeleton
            variant="circular"
            width={16}
            height={16}
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
        </Box>

        {/* Excerpt Skeleton */}
        <Skeleton
          variant="text"
          width="100%"
          height={18}
          animation="wave"
          sx={{ bgcolor: 'grey.200', mb: 0.5 }}
        />
        <Skeleton
          variant="text"
          width="90%"
          height={18}
          animation="wave"
          sx={{ bgcolor: 'grey.200', mb: 2 }}
        />

        {/* Date Skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Skeleton
            variant="circular"
            width={14}
            height={14}
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
          <Skeleton
            variant="text"
            width={80}
            height={16}
            animation="wave"
            sx={{ bgcolor: 'grey.200' }}
          />
        </Box>
      </CardContent>
    </Card>
  );

  // Loading State with Shimmer
  if (loading) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          backgroundColor: 'secondary.light',
        }}
      >
        <Container maxWidth="xl">
          {/* Header Skeleton */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Skeleton
              variant="text"
              width={100}
              height={20}
              animation="wave"
              sx={{ bgcolor: 'grey.200', mx: 'auto', mb: 1 }}
            />
            <Skeleton
              variant="text"
              width={300}
              height={44}
              animation="wave"
              sx={{ bgcolor: 'grey.200', mx: 'auto', mb: 1 }}
            />
            <Skeleton
              variant="text"
              width={500}
              height={24}
              animation="wave"
              sx={{ bgcolor: 'grey.200', mx: 'auto' }}
            />
          </Box>

          {/* Articles Carousel Skeleton */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              overflowX: 'hidden',
              pb: 2,
            }}
          >
            {/* Show 1 card on mobile, 4 on desktop */}
            {Array.from({ length: 4 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: {
                    xs: index === 0 ? 'block' : 'none',
                    sm: index < 2 ? 'block' : 'none',
                    md: index < 3 ? 'block' : 'none',
                    lg: 'block',
                  },
                }}
              >
                <SkeletonArticleCard />
              </Box>
            ))}
          </Box>

          {/* Navigation Arrows Skeleton */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              gap: 2,
              mb: 4,
            }}
          >
            <Skeleton
              variant="rectangular"
              width={40}
              height={40}
              animation="wave"
              sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
            />
            <Skeleton
              variant="rectangular"
              width={40}
              height={40}
              animation="wave"
              sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
            />
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: 'secondary.light',
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontFamily: 'var(--font-inter)',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              mb: 1,
              display: 'block',
            }}
          >
            Our Blog
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem', lg: '2.5rem' },
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
            }}
          >
            Knowledge Space
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'var(--font-inter)',
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            The latest industry news, interviews, technologies, and resources.
          </Typography>
        </Box>

        {/* Articles Carousel */}
        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            pb: 2,
          }}
        >
          {articles.map((article) => (
            <Card
              key={article.id}
              sx={{
                minWidth: { xs: 280, sm: 320, md: 340 },
                maxWidth: { xs: 280, sm: 320, md: 340 },
                flexShrink: 0,
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  backgroundColor: '#E5E7EB',
                  backgroundImage:
                    'linear-gradient(45deg, #F3F4F6 25%, transparent 25%, transparent 75%, #F3F4F6 75%), linear-gradient(45deg, #F3F4F6 25%, transparent 25%, transparent 75%, #F3F4F6 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 10px 10px',
                }}
              />

              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {article.title}
                  <ArrowForwardIcon sx={{ fontSize: '1rem', color: 'primary.main' }} />
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    color: 'text.secondary',
                    mb: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: 40,
                  }}
                >
                  {article.excerpt}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarTodayIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: 'var(--font-inter)',
                      color: 'text.secondary',
                    }}
                  >
                    {article.date}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Navigation Arrows */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            gap: 2,
            mb: 4,
          }}
        >
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              backgroundColor: 'background.paper',
              width: 40,
              height: 40,
              border: '1px solid #E5E7EB',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: '#F9FAFB',
                borderColor: '#D1D5DB',
              },
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: '1rem', color: 'text.primary', ml: 0.5 }} />
          </IconButton>
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              backgroundColor: 'primary.main',
              width: 40,
              height: 40,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: '1rem', color: 'white' }} />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
}
