'use client';
import { Box } from '@mui/material';

export default function AnimatedLine() {
  return (
    <Box
      sx={{
        width: '100%',
        height: 2,
        backgroundColor: 'rgba(3, 113, 102, 0.1)',
        position: 'relative',
        overflow: 'hidden',
        my: 6,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '50%',
          background: 'linear-gradient(90deg, transparent, #037166, transparent)',
          animation: 'slideAnimation 3s ease-in-out infinite',
          '@keyframes slideAnimation': {
            '0%': {
              transform: 'translateX(-100%)',
            },
            '83.33%': {
              transform: 'translateX(200%)',
            },
            '100%': {
              transform: 'translateX(200%)',
            },
          },
        }}
      />
    </Box>
  );
}
