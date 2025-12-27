'use client';
import { Box, Container } from '@mui/material';

export default function GradientSection({ 
  children,
  fullHeight = false,
  minHeight = '500px',
  containerMaxWidth = 'xl',
  centerContent = false,
  py = 8
}) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #037166 79.71%, #FFFFFF 103.51%)',
        minHeight: fullHeight ? '100vh' : minHeight,
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: centerContent ? 'flex' : 'block',
        alignItems: centerContent ? 'center' : 'stretch',
        py: py,
      }}
    >
      <Container maxWidth={containerMaxWidth}>
        {children}
      </Container>
    </Box>
  );
}
