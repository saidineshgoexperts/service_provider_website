'use client';

import { Box, Typography, Button, Grid, Skeleton } from '@mui/material';
import { useState } from 'react';

export default function ServiceTabs({ service, loading = false }) {
  const [activeTab, setActiveTab] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const providerRateCards = service?.provider_rate_cards || [];
  const serviceImages = service?.serviceImages || [];
  const customerRatings = service?.customerRatings || [];

  const displayedReviews = showAllReviews ? customerRatings : customerRatings.slice(0, 4);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating));
  };

  // Skeleton for Services Tab
  const SkeletonServicesTab = () => (
    <Box
      sx={{
        width: '1170px',
        maxWidth: '100%',
      }}
    >
      {/* Title Skeleton */}
      <Skeleton
        variant="text"
        width={150}
        height={32}
        animation="wave"
        sx={{ mb: 3, bgcolor: 'grey.200' }}
      />

      {/* Services Grid Skeleton */}
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid
            item
            xs={6}
            key={index}
            sx={{
              maxWidth: '50%',
              flexBasis: '50%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#F3F4F6',
                p: 2,
                gap: 3,
                borderRadius: '8px',
                minHeight: '60px',
              }}
            >
              <Skeleton
                variant="text"
                width="60%"
                height={20}
                animation="wave"
                sx={{ bgcolor: 'grey.300' }}
              />
              <Skeleton
                variant="text"
                width={80}
                height={24}
                animation="wave"
                sx={{ bgcolor: 'grey.300' }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Skeleton for Portfolio Tab
  const SkeletonPortfolioTab = () => (
    <Box>
      {/* Title Skeleton */}
      <Skeleton
        variant="text"
        width={150}
        height={32}
        animation="wave"
        sx={{ mb: 3, bgcolor: 'grey.200' }}
      />

      {/* Portfolio Grid Skeleton */}
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={6} sm={4} key={index}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              animation="wave"
              sx={{
                borderRadius: '10px',
                bgcolor: 'grey.200',
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Skeleton for Reviews Tab
  const SkeletonReviewsTab = () => (
    <Box>
      {/* Title Skeleton */}
      <Skeleton
        variant="text"
        width={150}
        height={32}
        animation="wave"
        sx={{ mb: 3, bgcolor: 'grey.200' }}
      />

      {/* Reviews List Skeleton */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 2,
              borderBottom: index < 3 ? '1px solid #E5E7EB' : 'none',
            }}
          >
            {/* Left Side - Avatar & Review */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
              {/* Avatar Skeleton */}
              <Skeleton
                variant="circular"
                width={48}
                height={48}
                animation="wave"
                sx={{ bgcolor: 'grey.200' }}
              />

              {/* Review Content Skeleton */}
              <Box sx={{ flex: 1 }}>
                <Skeleton
                  variant="text"
                  width={120}
                  height={20}
                  animation="wave"
                  sx={{ mb: 0.5, bgcolor: 'grey.200' }}
                />
                <Skeleton
                  variant="text"
                  width={100}
                  height={18}
                  animation="wave"
                  sx={{ mb: 0.5, bgcolor: 'grey.200' }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  height={16}
                  animation="wave"
                  sx={{ bgcolor: 'grey.200' }}
                />
              </Box>
            </Box>

            {/* Right Side - Date Skeleton */}
            <Skeleton
              variant="text"
              width={80}
              height={16}
              animation="wave"
              sx={{ bgcolor: 'grey.200' }}
            />
          </Box>
        ))}
      </Box>

      {/* Show More Button Skeleton */}
      <Skeleton
        variant="rectangular"
        width="100%"
        height={48}
        animation="wave"
        sx={{
          mt: 3,
          borderRadius: '8px',
          bgcolor: 'grey.200',
        }}
      />
    </Box>
  );

  // Loading State
  if (loading) {
    return (
      <Box>
        {/* Tabs Header Skeleton */}
        <Box
          sx={{
            display: 'flex',
            gap: '10px',
            width: { xs: '100%', md: '680px' },
            height: '56px',
            mb: 4,
          }}
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              sx={{
                flex: 1,
                height: '56px',
                borderRadius: '50px',
                bgcolor: 'grey.200',
              }}
              animation="wave"
            />
          ))}
        </Box>

        {/* Tab Content Skeleton (Services by default) */}
        <SkeletonServicesTab />
      </Box>
    );
  }

  return (
    <Box>
      {/* Tabs Header */}
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          width: { xs: '100%', md: '680px' },
          height: '56px',
          mb: 4,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <Button
          onClick={() => setActiveTab(0)}
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: 'auto' },
            height: '46px',
            borderRadius: '8px',
            backgroundColor: activeTab === 0 ? '#037166' : '#E5E7EB',
            color: activeTab === 0 ? 'white' : '#6B7280',
            fontFamily: 'var(--font-inter)',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: activeTab === 0 ? '#025951' : '#D1D5DB',
            },
          }}
        >
          Services
        </Button>
        <Button
          onClick={() => setActiveTab(1)}
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: 'auto' },
          height: '46px',
            borderRadius: '8px',
            backgroundColor: activeTab === 1 ? '#037166' : '#E5E7EB',
            color: activeTab === 1 ? 'white' : '#6B7280',
            fontFamily: 'var(--font-inter)',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: activeTab === 1 ? '#025951' : '#D1D5DB',
            },
          }}
        >
          Portfolio
        </Button>
        <Button
          onClick={() => setActiveTab(2)}
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: 'auto' },
          height: '46px',
            borderRadius: '8px',
            backgroundColor: activeTab === 2 ? '#037166' : '#E5E7EB',
            color: activeTab === 2 ? 'white' : '#6B7280',
            fontFamily: 'var(--font-inter)',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: activeTab === 2 ? '#025951' : '#D1D5DB',
            },
          }}
        >
          Reviews
        </Button>
      </Box>

      {/* Services Tab */}
      {activeTab === 0 && (
        <Box
          sx={{
            width: { xs: '100%', lg: '1170px' },
            maxWidth: '100%',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              color: '#1F2937',
              fontSize: { xs: '20px', md: '24px' },
              mb: 3,
            }}
          >
            Services
          </Typography>
          {providerRateCards.length > 0 ? (
            <Grid
              container
              spacing={2}
              sx={{
                width: '100%',
              }}
            >
              {providerRateCards.map((item) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  key={item.id}
                  sx={{
                    maxWidth: { xs: '100%', sm: '50%' },
                    flexBasis: { xs: '100%', sm: '50%' },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#E0F2F1',
                      p: 2,
                      gap: 3,
                      borderRadius: '8px',
                      minHeight: '60px',
                      width: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: '#B2DFDB',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(3, 113, 102, 0.15)',
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 500,
                        color: '#1F2937',
                        flex: 1,
                        fontSize: { xs: '14px', md: '16px' },
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 700,
                        color: '#037166',
                        fontSize: { xs: '16px', md: '18px' },
                        whiteSpace: 'nowrap',
                      }}
                    >
                      ₹{item.price}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                color: '#6B7280',
                py: 4,
                textAlign: 'center',
              }}
            >
              No services available
            </Typography>
          )}
        </Box>
      )}

      {/* Portfolio Tab */}
      {activeTab === 1 && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              color: '#1F2937',
              fontSize: { xs: '20px', md: '24px' },
              mb: 3,
            }}
          >
            Portfolio
          </Typography>
          {serviceImages.length > 0 ? (
            <Grid container spacing={2}>
              {serviceImages.map((img, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    component="img"
                    src={`https://api.doorstephub.com/${img}`}
                    alt={`Portfolio ${index + 1}`}
                    sx={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                    onError={(e) => {
                      e.target.src = '/placeholder-service.jpg';
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                color: '#6B7280',
                py: 4,
                textAlign: 'center',
              }}
            >
              No portfolio images available
            </Typography>
          )}
        </Box>
      )}

      {/* Reviews Tab */}
      {activeTab === 2 && (
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 700,
              color: '#1F2937',
              fontSize: { xs: '20px', md: '24px' },
              mb: 3,
            }}
          >
            Reviews
          </Typography>
          {displayedReviews.length > 0 ? (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {displayedReviews.map((review, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: { xs: 2, sm: 0 },
                      pb: 2,
                      borderBottom: index < displayedReviews.length - 1 ? '1px solid #E5E7EB' : 'none',
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: '#037166',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          fontWeight: 600,
                          color: 'white',
                          flexShrink: 0,
                        }}
                      >
                        {review.name.charAt(0).toUpperCase()}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: 'var(--font-inter)',
                            fontWeight: 600,
                            color: '#1F2937',
                            fontSize: { xs: '14px', md: '16px' },
                          }}
                        >
                          {review.name}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#FFA500', my: 0.5 }}>
                          {renderStars(review.rating)}
                        </Typography>
                        {review.comment && (
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-inter)',
                              fontSize: { xs: '13px', md: '14px' },
                              color: '#6B7280',
                              mt: 0.5,
                            }}
                          >
                            {review.comment}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '14px',
                        color: '#6B7280',
                        flexShrink: 0,
                      }}
                    >
                      {formatDate(review.date)}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {customerRatings.length > 4 && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  sx={{
                    mt: 3,
                    height: '48px',
                    borderRadius: '8px',
                    borderColor: '#037166',
                    color: '#037166',
                    fontFamily: 'var(--font-inter)',
                    textTransform: 'none',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#025951',
                      backgroundColor: 'rgba(3, 113, 102, 0.05)',
                    },
                  }}
                >
                  {showAllReviews ? 'Show Less' : 'Show More'}
                </Button>
              )}
            </>
          ) : (
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                color: '#6B7280',
                py: 4,
                textAlign: 'center',
              }}
            >
              No reviews available
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
