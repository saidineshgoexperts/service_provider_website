'use client';
import { Card, CardMedia, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

export default function ServiceCard({ service }) {
  return (
    <Box
      sx={{
        transition: 'transform 0.3s ease-out',
        '&:hover': {
          transform: 'translateY(-8px)',
        },
      }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
            '& .service-overlay': {
              opacity: 1,
            },
            '& .service-image': {
              transform: 'scale(1.05)',
            },
          },
        }}
      >
        {/* Status Badge */}
        <Chip
          label={service.status}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
            backgroundColor: 'primary.main',
            color: 'white',
            fontWeight: 600,
          }}
        />

        {/* Image */}
        <Box sx={{ overflow: 'hidden', position: 'relative', height: 200 }}>
          <CardMedia
            component="img"
            height="200"
            image={service.image}
            alt={service.title}
            className="service-image"
            sx={{
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          
          {/* Hover Overlay */}
          <Box
            className="service-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgba(3, 113, 102, 0.9), transparent)',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              display: 'flex',
              alignItems: 'flex-end',
              padding: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
              View Details →
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
            {service.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <StarIcon sx={{ color: '#FFA500', fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {service.rating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({service.reviews} reviews)
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
            {service.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
              ₹{service.price}
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 12px rgba(3, 113, 102, 0.3)',
                },
                '&:active': {
                  transform: 'translateX(2px)',
                },
              }}
            >
              Book Now
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
