'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LocationSearch from '../LocationSearch';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Service Center', href: '/service-center' },
  { label: 'Nearby Services', href: '/nearby-services' },
  { label: 'Popular Services', href: '/popular-services' },
];

const nomoreItems = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
  { label: 'Support', href: '/support' },
];

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNomoreClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNomoreClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    router.push('/');
  };

  const handleProfile = () => {
    handleUserMenuClose();
    router.push('/profile');
  };

  // Get first letter of name for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'white',
          boxShadow: scrolled 
            ? '0 2px 8px rgba(0, 0, 0, 0.08)' 
            : '0 1px 3px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          height: '90px',
        }}
      >
        <Container 
          maxWidth="xl"
          sx={{ height: '100%' }}
        >
          <Toolbar 
            disableGutters 
            sx={{ 
              justifyContent: 'space-between',
              height: '90px',
              minHeight: '90px !important',
              gap: { xs: 1, md: 2 },
            }}
          >
            {/* Logo */}
            <Box
              sx={{
                opacity: 0,
                transform: 'translateX(-20px)',
                animation: 'fadeInLeft 0.5s ease-out forwards',
                flexShrink: 0,
                '@keyframes fadeInLeft': {
                  to: {
                    opacity: 1,
                    transform: 'translateX(0)',
                  },
                },
              }}
            >
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <Box
                  component="img"
                  src="/dhub-logo.jpg"
                  alt="D-hub"
                  sx={{ 
                    height: 55,
                    width: 'auto',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                />
              </Link>
            </Box>

            {/* Location Search - Visible on Desktop and Tablet */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                flex: '0 1 auto',
                opacity: 0,
                transform: 'translateY(-10px)',
                animation: 'fadeInDown 0.4s ease-out forwards',
                animationDelay: '0.1s',
                '@keyframes fadeInDown': {
                  to: {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <LocationSearch />
            </Box>

            {/* Desktop Navigation */}
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                gap: 0.5,
                alignItems: 'center',
                flex: '0 1 auto',
              }}
            >
              {navItems.map((item, index) => (
                <Box
                  key={item.href}
                  sx={{
                    opacity: 0,
                    transform: 'translateY(-10px)',
                    animation: 'fadeInDown 0.4s ease-out forwards',
                    animationDelay: `${0.2 + index * 0.08}s`,
                  }}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <Button
                    component={Link}
                    href={item.href}
                    sx={{
                      color: 'text.primary',
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 600,
                      fontSize: '16px',
                      lineHeight: '24px',
                      px: 2.5,
                      py: 1,
                      position: 'relative',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: 'primary.main',
                        backgroundColor: 'transparent',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: hoveredItem === item.label ? '80%' : '0%',
                        height: '2px',
                        backgroundColor: 'primary.main',
                        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </Box>
              ))}

              {/* Nomore Dropdown */}
              <Box
                sx={{
                  opacity: 0,
                  transform: 'translateY(-10px)',
                  animation: 'fadeInDown 0.4s ease-out forwards',
                  animationDelay: '0.52s',
                }}
              >
                <Button
                  onClick={handleNomoreClick}
                  endIcon={
                    <KeyboardArrowDownIcon 
                      sx={{ 
                        transition: 'transform 0.3s ease',
                        transform: anchorEl ? 'rotate(180deg)' : 'rotate(0deg)',
                      }} 
                    />
                  }
                  sx={{
                    color: 'text.primary',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '24px',
                    px: 2.5,
                    py: 1,
                    transition: 'color 0.3s ease',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  Nomore
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleNomoreClose}
                  sx={{
                    '& .MuiPaper-root': {
                      mt: 1,
                      minWidth: 180,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  {nomoreItems.map((item) => (
                    <MenuItem
                      key={item.href}
                      component={Link}
                      href={item.href}
                      onClick={handleNomoreClose}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        fontFamily: 'var(--font-inter)',
                        fontSize: '15px',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(3, 113, 102, 0.08)',
                          color: 'primary.main',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Box>

            {/* Action Buttons - Desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center', flexShrink: 0 }}>
              <Box
                sx={{
                  opacity: 0,
                  transform: 'scale(0.9)',
                  animation: 'fadeInScale 0.4s ease-out forwards',
                  animationDelay: '0.6s',
                  '@keyframes fadeInScale': {
                    to: {
                      opacity: 1,
                      transform: 'scale(1)',
                    },
                  },
                }}
              >
                <Button
                  variant="outlined"
                  component={Link}
                  href="/contact"
                  sx={{
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '24px',
                    px: 3,
                    py: 1,
                    borderRadius: '5px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(3, 113, 102, 0.04)',
                      transform: 'translateY(-1px) scale(1.02)',
                      boxShadow: '0 4px 12px rgba(3, 113, 102, 0.15)',
                    },
                    '&:active': {
                      transform: 'translateY(-1px) scale(0.98)',
                    },
                  }}
                >
                  Contact Us
                </Button>
              </Box>
              
             <Box
  sx={{
    opacity: 0,
    transform: 'scale(0.9)',
    animation: 'fadeInScale 0.4s ease-out forwards',
    animationDelay: '0.68s',
    '@keyframes fadeInScale': {
      to: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
  }}
>
  {user ? (
    <>
      <IconButton
        onClick={handleUserMenuOpen}
        sx={{ p: 0 }}
      >
        <Avatar
          src={
            user?.image && !user.image.includes('default_image')
              ? user.image.startsWith('http')
                ? user.image
                : `https://api.doorstephub.com${user.image}`
              : undefined
          }
          alt={user?.name}
          sx={{
            width: 42,
            height: 42,
            backgroundColor: 'primary.main',
            fontFamily: 'var(--font-inter)',
            fontWeight: 600,
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.08)',
              boxShadow: '0 4px 12px rgba(3, 113, 102, 0.3)',
            },
          }}
        >
          {getInitials(user?.name)}
        </Avatar>
      </IconButton>

      {/* User Menu Dropdown */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1.5,
            minWidth: 240,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info */}
        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography
            sx={{
              fontFamily: 'var(--font-inter)',
              fontWeight: 600,
              fontSize: '1rem',
              color: '#1F2937',
              mb: 0.5,
            }}
          >
            {user.name}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-inter)',
              fontSize: '0.875rem',
              color: '#6B7280',
            }}
          >
            {user.email}
          </Typography>
          {user.phone && (
            <Typography
              sx={{
                fontFamily: 'var(--font-inter)',
                fontSize: '0.875rem',
                color: '#6B7280',
              }}
            >
              +91 {user.phone}
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem 
          onClick={handleProfile}
          sx={{
            py: 1.5,
            px: 2.5,
            fontFamily: 'var(--font-inter)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(3, 113, 102, 0.08)',
            },
          }}
        >
          <PersonIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: 'primary.main' }} />
          My Profile
        </MenuItem>

        <MenuItem 
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2.5,
            fontFamily: 'var(--font-inter)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(220, 38, 38, 0.08)',
            },
          }}
        >
          <LogoutIcon sx={{ mr: 1.5, fontSize: '1.2rem', color: '#DC2626' }} />
          <Typography sx={{ color: '#DC2626' }}>Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  ) : (
    <Button
      variant="contained"
      component={Link}
      href="/signin"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white', 
        fontFamily: 'var(--font-inter)',
        fontWeight: 600,
        fontSize: '16px',
        lineHeight: '24px',
        px: 3,
        py: 1,
        borderRadius: '5px',
        boxShadow: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          backgroundColor: 'primary.dark',
          transform: 'translateY(-1px) scale(1.02)',
          boxShadow: '0 6px 16px rgba(3, 113, 102, 0.3)',
        },
        '&:active': {
          transform: 'translateY(-1px) scale(0.98)',
        },
      }}
    >
      Sign In
    </Button>
  )}
</Box>

            </Box>

            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { md: 'none' }, 
                color: 'text.primary',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Spacer to prevent content overlap */}
      <Toolbar sx={{ minHeight: '90px !important' }} />

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: 280,
            pt: 2,
          },
        }}
      >
        <Box sx={{ px: 2, mb: 2 }}>
          <Box
            component="img"
            src="/dhub-logo.jpg"
            alt="D-hub"
            sx={{ height: 40, mb: 2 }}
          />
          
          {/* Mobile User Info */}
          {user && (
            <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(3, 113, 102, 0.08)', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'primary.main',
                    fontFamily: 'var(--font-inter)',
                    fontWeight: 600,
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: '#1F2937',
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-inter)',
                      fontSize: '0.75rem',
                      color: '#6B7280',
                    }}
                  >
                    {user.email}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          
          {/* Mobile Location Search */}
          <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 2 }}>
            <LocationSearch />
          </Box>
        </Box>
        
        <List>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={handleDrawerToggle}
                sx={{
                  py: 1.5,
                  px: 3,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(3, 113, 102, 0.08)',
                    '& .MuiListItemText-primary': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontFamily: 'var(--font-inter)',
                      fontWeight: 500,
                      fontSize: '15px',
                      transition: 'color 0.2s ease',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          
          {nomoreItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={handleDrawerToggle}
                sx={{
                  py: 1.5,
                  px: 3,
                  pl: 5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(3, 113, 102, 0.08)',
                  },
                }}
              >
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontFamily: 'var(--font-inter)',
                      fontSize: '14px',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}

          {/* Mobile User Menu Items */}
          {user && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleDrawerToggle();
                    router.push('/profile');
                  }}
                  sx={{
                    py: 1.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(3, 113, 102, 0.08)',
                    },
                  }}
                >
                  <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <ListItemText 
                    primary="My Profile"
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 500,
                        fontSize: '15px',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    handleDrawerToggle();
                    handleLogout();
                  }}
                  sx={{
                    py: 1.5,
                    px: 3,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    },
                  }}
                >
                  <LogoutIcon sx={{ mr: 2, color: '#DC2626' }} />
                  <ListItemText 
                    primary="Logout"
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontFamily: 'var(--font-inter)',
                        fontWeight: 500,
                        fontSize: '15px',
                        color: '#DC2626',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>

        {/* Mobile Action Buttons */}
        {!user && (
          <Box sx={{ px: 2, mt: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              variant="outlined"
              component={Link}
              href="/contact"
              fullWidth
              onClick={handleDrawerToggle}
              sx={{
                color: 'primary.main',
                borderColor: 'primary.main',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                py: 1.2,
              }}
            >
              Contact Us
            </Button>
            <Button
              variant="contained"
              component={Link}
              href="/signin"
              fullWidth
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: 'primary.main',
                fontFamily: 'var(--font-inter)',
                fontWeight: 600,
                py: 1.2,
              }}
            >
              Sign In
            </Button>
          </Box>
        )}
      </Drawer>
    </>
  );
}
