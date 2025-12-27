'use client';
import { Box } from '@mui/material';

export default function GradientBackground({ 
  children, 
  variant = 'default',
  minHeight = '600px',
  fullHeight = false,
  py = 0
}) {
  const gradients = {
    default: 'linear-gradient(180deg, #037166 79.71%, #FFFFFF 103.51%)',
    reverse: 'linear-gradient(0deg, #037166 79.71%, #FFFFFF 103.51%)',
    hero: 'linear-gradient(180deg, #037166 0%, #037166 70%, #FFFFFF 100%)',
    subtle: 'linear-gradient(180deg, #037166 85%, #FFFFFF 100%)',
  };

  return (
    <Box
      sx={{
        background: gradients[variant],
        minHeight: fullHeight ? '100vh' : minHeight,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        py: py,
      }}
    >
      {children}
    </Box>
  );
}
