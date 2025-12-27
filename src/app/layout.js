'use client';

import { Poppins } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Script from 'next/script';
import ThemeProvider from '../app/components/providers/ThemeProvider';
import { LocationProvider } from '../app/contexts/LocationContext';
import { AuthProvider, useAuth } from '../app/contexts/AuthContext';
import { BookingProvider } from '../app/contexts/BookingContext';
import Header from '../app/components/layout/Header';
import Footer from '../app/components/layout/Footer';
import './globals.css';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

// 🔥 Google One Tap Component
function GoogleOneTap() {
  const { user, login } = useAuth();
  const pathname = usePathname();

  // Don't show on auth pages or when user is logged in
  const shouldShowOneTap = !user && pathname !== '/signin' && pathname !== '/signup';

  useEffect(() => {
    if (!shouldShowOneTap) return;

    // Wait for Google script to load
    const checkGoogle = setInterval(() => {
      if (window.google) {
        clearInterval(checkGoogle);
        initializeGoogleOneTap();
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  }, [shouldShowOneTap]);

  const initializeGoogleOneTap = () => {
    try {
      window.google.accounts.id.initialize({
        // 🔥 Replace with your Web Client ID from Firebase Console
        // Get it from: Authentication → Google → Web SDK configuration
        client_id: '765532412552-7v0ncn48vg0gt3acpg711tb089261i8v.apps.googleusercontent.com',
        callback: handleGoogleOneTapResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
        context: 'signin',
      });

      // Show One Tap prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log('One Tap not displayed:', notification.getNotDisplayedReason());
        }
      });
    } catch (error) {
      console.error('Error initializing Google One Tap:', error);
    }
  };

  const handleGoogleOneTapResponse = async (response) => {
    try {
      console.log('📤 Google One Tap - Sending ID Token to backend...');

      // Send to your backend API
      const res = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/auth/loginWithGoogle',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: response.credential,
            fcmtoken: '1234',
          }),
        }
      );

      const data = await res.json();
      console.log('📥 Backend Response:', data);

      if (data.status === 'success' || data.success === true) {
        const userData = {
          phone: data.data?.mobile || '',
          name: data.data?.name || 'User',
          email: data.data?.email || '',
          userId: data.data?.userId || '',
        };

        if (data.data?.token || data.token) {
          localStorage.setItem('authToken', data.data?.token || data.token);
        }

        login(userData);
        console.log('✅ Google One Tap login successful');
      }
    } catch (error) {
      console.error('❌ Google One Tap Error:', error);
    }
  };

  return null;
}

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/signin' || pathname === '/signup';

  return (
    <html 
      lang="en" 
      className={poppins.variable}
      data-scroll-behavior="smooth"
    >
      <head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBNVn5j-M6F4VHkaOluoOcVY3K5r2-NlPk&libraries=places&loading=async`}
          async
          defer
        ></script>
      </head>
      <body className={poppins.className}>
        {/* 🔥 Load Google One Tap Script */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={() => console.log('✅ Google One Tap script loaded')}
        />

        <ThemeProvider>
          <AuthProvider>
            <LocationProvider>
              <BookingProvider>
                {/* 🔥 Google One Tap Component */}
                <GoogleOneTap />
                
                {!hideLayout && <Header />}
                <main>{children}</main>
                {!hideLayout && <Footer />}
              </BookingProvider>
            </LocationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
