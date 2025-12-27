// src/components/common/FontTest.jsx
'use client';
import { Typography, Box } from '@mui/material';

export default function FontTest() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h1" sx={{ mb: 2 }}>Heading 1 - Poppins 700</Typography>
      <Typography variant="h2" sx={{ mb: 2 }}>Heading 2 - Poppins 600</Typography>
      <Typography variant="h3" sx={{ mb: 2 }}>Heading 3 - Poppins 600</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>Body 1 - Poppins 400</Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>Body 2 - Poppins 400</Typography>
    </Box>
  );
}
