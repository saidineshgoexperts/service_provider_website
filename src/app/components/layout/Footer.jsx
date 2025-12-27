'use client';

import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  Button,
  Link as MuiLink,
  IconButton,
  Divider,
} from '@mui/material';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
    ],
    services: [
      { label: 'AC Repair', href: '/services/ac-repair' },
      { label: 'Washing Machine', href: '/services/washing-machine' },
      { label: 'Refrigerator', href: '/services/refrigerator' },
      { label: 'TV Repair', href: '/services/tv-repair' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Service Status', href: '/status' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Refund Policy', href: '/refund' },
    ],
  };

  const socialIcons = [
    { icon: <FacebookIcon />, href: 'https://facebook.com', label: 'Facebook' },
    { icon: <TwitterIcon />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <InstagramIcon />, href: 'https://instagram.com', label: 'Instagram' },
    { icon: <LinkedInIcon />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <YouTubeIcon />, href: 'https://youtube.com', label: 'YouTube' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#037166',
        color: 'white',
        pt: 8,
        pb: 3,
        mt: 8,
      }}
    >
      <Container 
        maxWidth="xl"
        sx={{
          maxWidth: '1444px',
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Newsletter Subscription Section */}
        <Box
          sx={{
            mb: 8,
            opacity: 0,
            animation: 'fadeInUp 0.6s ease-out forwards',
            '@keyframes fadeInUp': {
              from: {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              to: {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* Left Side - Text Content */}
            <Grid item xs={12} md={5}>
              <Box sx={{ maxWidth: '500px' }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '14px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    mb: 1,
                    display: 'block',
                    textAlign: 'left',
                  }}
                >
                  SUBSCRIBE CENTER
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 700,
                    fontSize: { xs: '28px', md: '36px' },
                    mb: 2,
                    lineHeight: 1.3,
                    textAlign: 'left',
                  }}
                >
                  Stay Updated With Service Offers
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'var(--font-inter)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    lineHeight: 1.6,
                    textAlign: 'left',
                  }}
                >
                  Subscribe to get the latest deals, maintenance tips, and service
                  updates delivered to your inbox.
                </Typography>
              </Box>
            </Grid>

            {/* Right Side - Email Form (Horizontal Layout) */}
            <Grid item xs={12} md={7}>
              <Box
                component="form"
                onSubmit={handleSubscribe}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  width: '100%',
                }}
              >
                {/* Email Label */}
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '15px',
                    fontWeight: 500,
                    textAlign: 'left',
                  }}
                >
                  Email
                </Typography>

                {/* Email Input + Button (Same Line) */}
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    width: '100%',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                  }}
                >
                  {/* Email Input - Flexible Width */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    placeholder="Enter your email here...."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{
                      flex: 1,
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      transition: 'transform 0.3s ease',
                      '&:focus-within': {
                        transform: 'translateY(-2px)',
                      },
                      '& .MuiOutlinedInput-root': {
                        fontSize: '15px',
                        fontFamily: 'var(--font-inter)',
                        '& fieldset': {
                          borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                          borderColor: 'transparent',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(3, 113, 102, 0.3)',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        py: 1.8,
                        px: 2,
                      },
                    }}
                  />

                  {/* Subscribe Button - Fixed Width */}
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: '#025952',
                      color: 'white',
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 600,
                      fontSize: '16px',
                      px: 5,
                      py: 1.8,
                      borderRadius: '8px',
                      textTransform: 'none',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      '&:hover': {
                        backgroundColor: '#014a43',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                        transform: 'translateY(-2px) scale(1.03)',
                      },
                      '&:active': {
                        transform: 'translateY(-2px) scale(0.97)',
                      },
                    }}
                  >
                    Subscribe Now
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 6 }} />

        {/* Footer Links */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Box
              sx={{
                mb: 3,
                opacity: 0,
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: '0.1s',
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Box
                component="img"
                src="./dhub-logo.jpg"
                alt="D-hub"
                sx={{ height: 40, mb: 2 }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.7,
                  mb: 3,
                  fontSize: '14px',
                }}
              >
                Your trusted partner for all home appliance repair and
                maintenance services.
              </Typography>
              {/* Social Icons */}
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {socialIcons.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      width: 40,
                      height: 40,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'white',
                        color: '#037166',
                        transform: 'translateY(-3px) scale(1.1)',
                      },
                      '&:active': {
                        transform: 'translateY(-3px) scale(0.95)',
                      },
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid item xs={6} sm={6} md={2}>
            <Box
              sx={{
                opacity: 0,
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: '0.2s',
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  fontSize: '16px',
                  mb: 2.5,
                }}
              >
                Company
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {footerLinks.company.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                      width: 'fit-content',
                      '&:hover': {
                        color: 'white',
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Services Links */}
          <Grid item xs={6} sm={6} md={2}>
            <Box
              sx={{
                opacity: 0,
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: '0.3s',
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  fontSize: '16px',
                  mb: 2.5,
                }}
              >
                Services
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {footerLinks.services.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                      width: 'fit-content',
                      '&:hover': {
                        color: 'white',
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Support Links */}
          <Grid item xs={6} sm={6} md={2}>
            <Box
              sx={{
                opacity: 0,
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: '0.4s',
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  fontSize: '16px',
                  mb: 2.5,
                }}
              >
                Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {footerLinks.support.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                      width: 'fit-content',
                      '&:hover': {
                        color: 'white',
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Legal Links */}
          <Grid item xs={6} sm={6} md={3}>
            <Box
              sx={{
                opacity: 0,
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: '0.5s',
                '@keyframes fadeInUp': {
                  from: {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-inter)',
                  fontWeight: 700,
                  fontSize: '16px',
                  mb: 2.5,
                }}
              >
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {footerLinks.legal.map((link) => (
                  <MuiLink
                    key={link.href}
                    component={Link}
                    href={link.href}
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      color: 'rgba(255, 255, 255, 0.8)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      display: 'inline-block',
                      width: 'fit-content',
                      '&:hover': {
                        color: 'white',
                        transform: 'translateX(5px)',
                      },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />

        {/* Bottom Bar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'var(--font-inter)',
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '14px',
            }}
          >
            © {new Date().getFullYear()} D-hub. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <MuiLink
              component={Link}
              href="/sitemap"
              sx={{
                fontFamily: 'var(--font-inter)',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              Sitemap
            </MuiLink>
            <MuiLink
              component={Link}
              href="/accessibility"
              sx={{
                fontFamily: 'var(--font-inter)',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              Accessibility
            </MuiLink>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
