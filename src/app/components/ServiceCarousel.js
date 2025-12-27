'use client';

import { Box, Typography } from '@mui/material';
import Image from 'next/image';

export default function ServiceCarousel() {
  // Placeholder images - replace with actual service images
  const services = [
    { id: 1, alt: 'Appliance repair service 1' },
    { id: 2, alt: 'Appliance repair service 2' },
    { id: 3, alt: 'Appliance repair service 3' },
    { id: 4, alt: 'Appliance repair service 4' },
    { id: 5, alt: 'Appliance repair service 5' },
    { id: 6, alt: 'Appliance repair service 6' },
    { id: 7, alt: 'Appliance repair service 7' },
    { id: 8, alt: 'Appliance repair service 8' },
  ];

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        pb: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          px: 3,
          overflowX: 'auto',
          pb: 2,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {services.map((service) => (
          <Box
            key={service.id}
            sx={{
              minWidth: { xs: 180, sm: 200, md: 240 },
              height: { xs: 240, sm: 280, md: 320 },
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#E0E0E0',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {/* Placeholder - replace with actual images */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#F5F5F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage:
                  'linear-gradient(45deg, #E8E8E8 25%, transparent 25%, transparent 75%, #E8E8E8 75%), linear-gradient(45deg, #E8E8E8 25%, transparent 25%, transparent 75%, #E8E8E8 75%)',
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 10px 10px',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: '#999', fontWeight: 500 }}
              >
                Service Image {service.id}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
