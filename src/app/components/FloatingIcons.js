'use client';

import { Box } from '@mui/material';
import WashingMachineIcon from '@mui/icons-material/LocalLaundryService';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TvIcon from '@mui/icons-material/Tv';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';

export default function FloatingIcons() {
  // Left side icons
  const leftIcons = [
    { Icon: WashingMachineIcon, top: '10%', left: '5%', delay: 0, duration: 3 },
    { Icon: AcUnitIcon, top: '40%', left: '8%', delay: 0.5, duration: 4 },
    { Icon: WaterDropIcon, top: '70%', left: '3%', delay: 1, duration: 3.5 },
  ];

  // Right side icons
  const rightIcons = [
    { Icon: KitchenIcon, top: '15%', right: '6%', delay: 0.3, duration: 3.5 },
    { Icon: TvIcon, top: '45%', right: '4%', delay: 0.8, duration: 4 },
    { Icon: BoltIcon, top: '75%', right: '7%', delay: 1.2, duration: 3 },
  ];

  const iconStyle = {
    position: 'absolute',
    color: 'rgba(255, 255, 255, 0.15)',
    fontSize: { xs: '40px', md: '60px' },
    zIndex: 1,
    animation: 'float 3s ease-in-out infinite',
    '@keyframes float': {
      '0%, 100%': {
        transform: 'translateY(0px) rotate(0deg)',
      },
      '50%': {
        transform: 'translateY(-20px) rotate(5deg)',
      },
    },
  };

  return (
    <>
      {/* Left Side Icons */}
      {leftIcons.map(({ Icon, top, left, delay, duration }, index) => (
        <Box
          key={`left-${index}`}
          sx={{
            ...iconStyle,
            top,
            left,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        >
          <Icon sx={{ fontSize: 'inherit' }} />
        </Box>
      ))}

      {/* Right Side Icons */}
      {rightIcons.map(({ Icon, top, right, delay, duration }, index) => (
        <Box
          key={`right-${index}`}
          sx={{
            ...iconStyle,
            top,
            right,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        >
          <Icon sx={{ fontSize: 'inherit' }} />
        </Box>
      ))}
    </>
  );
}
