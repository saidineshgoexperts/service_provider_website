'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import { BookingProvider } from './contexts/BookingContext';
import GoogleOneTap from './components/auth/GoogleOneTap';
import theme from './theme';

export default function Providers({ children }) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <LocationProvider>
            <BookingProvider>
              <GoogleOneTap />
              {children}
            </BookingProvider>
          </LocationProvider>
        </AuthProvider>
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
