import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#037166', // Your exact teal color
      light: '#14B8A6',
      dark: '#025952',
    },
    secondary: {
      main: '#F0FDFA',
      light: '#CCFBF1',
    },
    background: {
      default: '#F0FDFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
    },
  },
  typography: {
    fontFamily: '"Poppins", sans-serif', // Only Poppins
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      fontFamily: '"Poppins", sans-serif',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: '"Poppins", sans-serif',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      fontFamily: '"Poppins", sans-serif',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
      fontFamily: '"Poppins", sans-serif',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      fontFamily: '"Poppins", sans-serif',
    },
    button: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      fontFamily: '"Poppins", sans-serif',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      fontFamily: '"Poppins", sans-serif',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 6,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(3, 113, 102, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontFamily: '"Poppins", sans-serif',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Poppins", sans-serif',
        },
      },
    },
  },
});

export default theme;
