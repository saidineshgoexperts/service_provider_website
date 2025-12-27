'use client';
import { Box } from '@mui/material';
import Image from 'next/image';
import { useRef, useState } from 'react';

const serviceImages = [
  { id: 1, image: '/images/service.jpg', alt: 'Kitchen Cleaning Service' },
  { id: 2, image: '/images/service.jpg', alt: 'Appliance Repair' },
  { id: 3, image: '/images/service.jpg', alt: 'Door Installation' },
  { id: 4, image: '/images/service.jpg', alt: 'Floor Cleaning' },
  { id: 5, image: '/images/service.jpg', alt: 'Home Maintenance' },
  { id: 6, image: '/images/service.jpg', alt: 'Deep Cleaning' },
  { id: 7, image: '/images/service.jpg', alt: 'Professional Service' },
  { id: 8, image: '/images/service.jpg', alt: 'Expert Care' },
];

export default function ServiceGalleryCarousel() {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 3, md: 4 },
        backgroundColor: 'primary.main',
        position: 'relative',
      }}
    >
      <Box
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        sx={{
          display: 'flex',
          gap: { xs: 1.5, md: 2 },
          overflowX: 'auto',
          overflowY: 'hidden',
          px: { xs: 2, md: 3 },
          cursor: isDragging ? 'grabbing' : 'grab',
          scrollBehavior: 'smooth',
          userSelect: 'none',
          '&::-webkit-scrollbar': {
            height: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 10,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            },
          },
        }}
      >
        {serviceImages.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              minWidth: { xs: '160px', sm: '180px', md: '200px' },
              height: { xs: '240px', sm: '280px', md: '320px' },
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              flexShrink: 0,
              opacity: 0,
              animation: `fadeInSlide 0.6s ease-out ${index * 0.08}s forwards`,
              '@keyframes fadeInSlide': {
                from: {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.3)',
                '& .image-overlay': {
                  opacity: 1,
                },
                '& img': {
                  transform: 'scale(1.08)',
                },
              },
            }}
          >
            <Box
              component="img"
              src={item.image}
              alt={item.alt}
              draggable="false"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
            
            {/* Hover Overlay */}
            <Box
              className="image-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to top, rgba(3, 113, 102, 0.9), transparent 60%)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 2,
              }}
            >
              <Box
                component="span"
                sx={{
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '13px', md: '14px' },
                }}
              >
                {item.alt}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
