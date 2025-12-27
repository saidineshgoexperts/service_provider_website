'use client';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <Link href={category.href} style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'scale(1.03)',
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        }}
      >
        <Card
          sx={{
            height: '100%',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
              '& .category-overlay': {
                backgroundColor: 'rgba(3, 113, 102, 0.15)',
              },
            },
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="160"
              image={category.image}
              alt={category.title}
              sx={{
                transition: 'transform 0.4s ease',
              }}
            />
            <Box
              className="category-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'transparent',
                transition: 'background-color 0.3s ease',
              }}
            />
          </Box>
          
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{
                fontWeight: 600,
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              {category.title}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Link>
  );
}
