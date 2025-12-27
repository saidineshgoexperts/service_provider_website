'use client';

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ServiceCard({ service }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  // 🔑 NORMALIZED VALUES (WORKS FOR BOTH)
  const id = service.id || service._id;
  const type = service.type; // 'service' | 'center'
  const title = service.title || service.name;
  const description =
    service.description?.replace(/<[^>]*>/g, '') ||
    'Professional service by certified technicians.';

  const imageUrl =
    service.image ||
    service.mainImage ||
    service.logo ||
    '/placeholder-service.jpg';

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
  };

  const handleBookNow = () => {
    console.log('🔍 Navigating from card:', id, type);

    if (type === 'center') {
      router.push(`/service-center/${id}`);
    } else {
      router.push(`/service/${id}`);
    }
  };

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: '350px',
        height: '456px',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
      }}
    >
      {/* IMAGE */}
      <Box sx={{ position: 'relative', height: 200 }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={title}
          sx={{ height: '100%', objectFit: 'cover' }}
        />

        {/* RATING */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            background: '#fff',
            px: 1.5,
            py: 0.5,
            borderRadius: 20,
          }}
        >
          <StarIcon sx={{ fontSize: 16, color: '#037166' }} />
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
            {service.rating || '4.5'}
          </Typography>
        </Box>

        {/* FAVORITE */}
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: '#fff',
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: '#EF4444' }} />
          ) : (
            <FavoriteBorderIcon />
          )}
        </IconButton>
      </Box>

      {/* CONTENT */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          sx={{
            fontSize: 16,
            fontWeight: 700,
            mb: 1,
            fontFamily: 'Poppins',
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: 13,
            color: '#6B7280',
            mb: 2,
            fontFamily: 'Poppins',
          }}
        >
          {description}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          fullWidth
          variant="contained"
          onClick={handleBookNow}
          sx={{
            backgroundColor: '#037166',
            textTransform: 'none',
            fontFamily: 'Poppins',
            '&:hover': { backgroundColor: '#025951' },
          }}
        >
          {type === 'center' ? 'View Center' : 'Book Now'}
        </Button>
      </CardContent>
    </Card>
  );
}
