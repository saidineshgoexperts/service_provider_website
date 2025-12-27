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
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocation } from '../contexts/LocationContext';
import { URLS } from '../utilis/urls';

export default function CategoriesSection() {
  const router = useRouter();
  const scrollContainerRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [error, setError] = useState(null);
  const [detectedCity, setDetectedCity] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { location } = useLocation();

  const API_BASE_URL = 'https://api.doorstephub.com';
  const CATEGORIES_ENDPOINT = URLS.getAllTopCategories;
  const SUBCATEGORIES_ENDPOINT = URLS.getSubcategoriesbasedbyId;

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, [location.latitude, location.longitude]);

  const fetchCategories = async () => {
    try {
      console.log('🔄 Fetching categories...');

      setLoading(true);
      setError(null);

      let requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (location.latitude && location.longitude) {
        requestOptions.body = JSON.stringify({
          lattitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
        });
        console.log('📍 Fetching with location:', {
          lat: location.latitude,
          lng: location.longitude,
          address: location.address,
        });
      } else {
        requestOptions.body = JSON.stringify({});
        console.log('🌍 Fetching all categories (no location filter)');
      }

      const response = await fetch(CATEGORIES_ENDPOINT, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const result = await response.json();
      console.log('📥 API Response:', result);

      if (result.success && result.data) {
        if (result.detectedCity) {
          setDetectedCity(result.detectedCity);
          console.log('📍 Detected city:', result.detectedCity);
        } else {
          setDetectedCity(null);
          console.log('🌍 Showing all categories');
        }

        const transformedCategories = result.data.map((category) => ({
          id: category._id,
          title: category.name,
          image: `${API_BASE_URL}/${category.image}`,
          alt: `${category.name} Service`,
          count: category.Count,
          status: category.status,
          cityName: category.cityName,
        }));

        console.log('✅ Categories loaded:', transformedCategories.length);
        setCategories(transformedCategories);
      } else {
        console.log('❌ No categories in response');
        setCategories([]);
      }
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async (categoryId) => {
    try {
      setLoadingSubcategories(true);

      const response = await fetch(SUBCATEGORIES_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryId: categoryId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subcategories');
      }

      const result = await response.json();

      if (result.success && result.data) {
        const transformedSubcategories = result.data.map((subcategory) => ({
          id: subcategory._id,
          title: subcategory.name,
          image: `${API_BASE_URL}/${subcategory.image}`,
          alt: `${subcategory.name} Service`,
          status: subcategory.status,
        }));

        setSubcategories(transformedSubcategories);
      } else {
        setSubcategories([]);
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
      setSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setOpenModal(true);
    fetchSubcategories(category.id);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCategory(null);
    setSubcategories([]);
  };

  const handleSubcategoryClick = (subcategory) => {
    console.log('Subcategory clicked:', subcategory);
    router.push(`/subcategory/${subcategory.id}`);
    handleCloseModal();
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 220;
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

  const handleRetry = () => {
    fetchCategories();
  };

  // Skeleton Card Component
  const SkeletonCard = () => (
    <Card
      sx={{
        minWidth: '205px',
        maxWidth: '205px',
        height: '169.56px',
        flexShrink: 0,
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height={110}
        animation="wave"
        sx={{ bgcolor: 'grey.200' }}
      />
      <CardContent
        sx={{
          height: '59.56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 1.5,
          px: 1,
        }}
      >
        <Skeleton
          variant="text"
          width="80%"
          height={20}
          animation="wave"
          sx={{ bgcolor: 'grey.200' }}
        />
      </CardContent>
    </Card>
  );

  // Skeleton Subcategory Card
  const SkeletonSubcategoryCard = () => (
    <Card
      sx={{
        height: '160px',
        borderRadius: '8px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height={100}
        animation="wave"
        sx={{ bgcolor: 'grey.200' }}
      />
      <CardContent
        sx={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 1,
          px: 1,
        }}
      >
        <Skeleton
          variant="text"
          width="70%"
          height={16}
          animation="wave"
          sx={{ bgcolor: 'grey.200' }}
        />
      </CardContent>
    </Card>
  );

  // Loading state with Shimmer
  if (loading) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          backgroundColor: '#FFFFFF',
          position: 'relative',
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ pl: { xs: 2, md: '127px' }, pr: { xs: 2, md: 4 } }}>
          {/* Header Skeleton */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box>
              <Skeleton
                variant="text"
                width={{ xs: 120, md: 180 }}
                height={20}
                animation="wave"
                sx={{ mb: 1, bgcolor: 'grey.200' }}
              />
              <Skeleton
                variant="text"
                width={{ xs: 250, md: 350 }}
                height={{ xs: 32, md: 48 }}
                animation="wave"
                sx={{ bgcolor: 'grey.200' }}
              />
            </Box>

            {/* Navigation Arrows Skeleton */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '10px' }}>
              <Skeleton
                variant="rectangular"
                width={44}
                height={44}
                animation="wave"
                sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
              />
              <Skeleton
                variant="rectangular"
                width={44}
                height={44}
                animation="wave"
                sx={{ borderRadius: '8px', bgcolor: 'grey.200' }}
              />
            </Box>
          </Box>

          {/* Categories Carousel Skeleton */}
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
              overflowX: 'hidden',
              pb: 2,
            }}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Box
                key={index}
                sx={{
                  display: { 
                    xs: index === 0 ? 'block' : 'none', 
                    sm: index < 2 ? 'block' : 'none',
                    md: 'block' 
                  }
                }}
              >
                <SkeletonCard />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    );
  }

  // Error state with Professional Design
  if (error) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          backgroundColor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: '500px',
            mx: 2,
            px: { xs: 3, md: 4 },
            py: { xs: 3, md: 4 },
            borderRadius: 3,
            backgroundColor: '#FEF2F2',
            border: '2px solid #DC2626',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)',
          }}
        >
          {/* Error Icon */}
          <Box
            sx={{
              width: { xs: 56, md: 64 },
              height: { xs: 56, md: 64 },
              borderRadius: '50%',
              backgroundColor: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem' },
                color: 'white',
              }}
            />
          </Box>

          {/* Error Title */}
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              color: '#991B1B',
              mb: 2,
              lineHeight: 1.3,
            }}
          >
            Failed to Load Categories
          </Typography>

          {/* Error Description */}
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontSize: { xs: '0.938rem', md: '1rem' },
              color: '#7F1D1D',
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            We're having trouble connecting to our servers. Please check your
            internet connection and try again.
          </Typography>

          {/* Action Button */}
          <Button
            variant="contained"
            onClick={handleRetry}
            startIcon={<RefreshIcon />}
            sx={{
              backgroundColor: '#DC2626',
              color: 'white',
              px: 4,
              py: 1.5,
              fontSize: { xs: '0.938rem', md: '1rem' },
              fontWeight: 600,
              fontFamily: 'var(--font-inter)',
              textTransform: 'none',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#B91C1C',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(220, 38, 38, 0.4)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            Try Again
          </Button>

          {/* Help Text */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 2.5,
              color: '#991B1B',
              fontSize: { xs: '0.813rem', md: '0.875rem' },
              fontFamily: 'var(--font-inter)',
            }}
          >
            If the problem persists, please contact support
          </Typography>
        </Box>
      </Box>
    );
  }

  // No categories found
  if (categories.length === 0) {
    return (
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          backgroundColor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Box sx={{ textAlign: 'center', maxWidth: '500px', px: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 600,
              mb: 2,
              color: 'text.primary',
            }}
          >
            No Services Available
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: 'var(--font-inter)',
              color: 'text.secondary',
              mb: 1,
            }}
          >
            {detectedCity
              ? `Sorry, we don't have services available in ${detectedCity} yet.`
              : 'No services available at the moment.'}
          </Typography>
          {location.address && (
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'var(--font-inter)',
                color: 'text.disabled',
              }}
            >
              Current location: {location.address}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#FFFFFF',
        position: 'relative',
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ pl: { xs: 2, md: '127px' }, pr: { xs: 2, md: 4 } }}>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                mb: 0.5,
                display: 'block',
              }}
            >
              {detectedCity ? `Categories in ${detectedCity}` : 'All Categories'}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
                fontFamily: 'var(--font-inter)',
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
              }}
            >
              Explore Our Top Categories
            </Typography>
          </Box>

          {/* Navigation Arrows */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: '10px',
            }}
          >
            <IconButton
              onClick={() => scroll('left')}
              sx={{
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: 'background.paper',
                border: '1px solid #E5E7EB',
                opacity: 1,
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
                width: '44px',
                height: '44px',
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: 'primary.main',
                opacity: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              <ArrowForwardIosIcon sx={{ fontSize: '1rem', color: 'white' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Categories Carousel */}
        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            pb: 2,
          }}
        >
          {categories.map((category) => (
            <Card
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              sx={{
                minWidth: '205px',
                maxWidth: '205px',
                height: '169.56px',
                flexShrink: 0,
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                backgroundColor: '#FFFFFF',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  transform: 'translateY(-4px)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardMedia
                component="img"
                image={category.image}
                alt={category.alt}
                sx={{
                  height: '110px',
                  width: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.style.background = '#E5E7EB';
                }}
              />

              <CardContent
                sx={{
                  backgroundColor: 'transparent',
                  textAlign: 'center',
                  py: 1.5,
                  px: 1,
                  height: '59.56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    color: 'text.primary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {category.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Subcategories Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            width: { xs: '95%', sm: '586px' },
            maxWidth: '586px',
            minHeight: '322px',
            borderRadius: '12px',
            backgroundColor: '#FFFFFF',
            opacity: 1,
            m: 2,
          },
        }}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <DialogTitle
          sx={{
            height: '50px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '10px',
            pt: '14px',
            pr: '12px',
            pb: '12px',
            pl: { xs: '16px', sm: '32px' },
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            borderBottom: '1px solid #E5E7EB',
            opacity: 1,
            m: 0,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 600,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              color: 'text.primary',
              lineHeight: '24px',
            }}
          >
            {selectedCategory?.title}
          </Typography>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              width: '24px',
              height: '24px',
              p: 0,
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon sx={{ fontSize: '20px' }} />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 3,
            pb: 3,
            px: { xs: 2, sm: 3 },
          }}
        >
          {loadingSubcategories ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 2,
                mt: 1,
              }}
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: {
                      xs: index < 2 ? 'block' : 'none',
                      sm: index < 3 ? 'block' : 'none',
                      md: 'block',
                    },
                  }}
                >
                  <SkeletonSubcategoryCard />
                </Box>
              ))}
            </Box>
          ) : subcategories.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gap: 2,
                mt: 1,
              }}
            >
              {subcategories.map((sub) => (
                <Card
                  key={sub.id}
                  onClick={() => handleSubcategoryClick(sub)}
                  sx={{
                    height: '160px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    backgroundColor: '#FFFFFF',
                    '&:hover': {
                      boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                      transform: 'translateY(-4px)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={sub.image}
                    alt={sub.alt}
                    sx={{
                      height: '100px',
                      width: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.background = '#E5E7EB';
                    }}
                  />

                  <CardContent
                    sx={{
                      backgroundColor: '#FFFFFF',
                      textAlign: 'center',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 1,
                      px: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 600,
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.3,
                      }}
                    >
                      {sub.title}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '200px',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontFamily: 'var(--font-inter)',
                  textAlign: 'center',
                }}
              >
                No subcategories available
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
