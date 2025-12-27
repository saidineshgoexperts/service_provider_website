'use client';

import { Box, Container, Typography, TextField, Button, Stack } from '@mui/material';

export default function NewsletterSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background: 'linear-gradient(135deg, #037166 0%, #14B8A6 100%)',
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="overline"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
              mb: 1,
              display: 'block',
            }}
          >
            Subscribe Center
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.25rem' },
              fontWeight: 700,
              color: 'white',
              mb: 2,
            }}
          >
            Stay Updated With Service Offers
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              mb: 4,
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            Subscribe to get the latest deals, maintenance tips, and service updates delivered to
            your inbox
          </Typography>

          {/* Email Form */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            <TextField
              fullWidth
              placeholder="Enter your email here..."
              variant="outlined"
              sx={{
                backgroundColor: 'white',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'transparent',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#000000',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                minWidth: { xs: '100%', sm: 160 },
                '&:hover': {
                  backgroundColor: '#1F2937',
                },
              }}
            >
              Subscribe Now
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
