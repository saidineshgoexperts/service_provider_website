'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

export default function GoogleOneTap() {
  const { user, login } = useAuth();
  const pathname = usePathname();

  // Don't show on auth pages or when user is logged in
  const shouldShowOneTap = !user && pathname !== '/signin' && pathname !== '/signup';

  useEffect(() => {
    if (!shouldShowOneTap || typeof window === 'undefined') return;

    // Wait for Google script to load
    const checkGoogle = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkGoogle);
        initializeGoogleOneTap();
      }
    }, 100);

    // Timeout after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkGoogle);
    }, 10000);

    return () => {
      clearInterval(checkGoogle);
      clearTimeout(timeout);
    };
  }, [shouldShowOneTap]);

  const initializeGoogleOneTap = () => {
    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '765532412552-7v0ncn48vg0gt3acpg711tb089261i8v.apps.googleusercontent.com',
        callback: handleGoogleOneTapResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        ux_mode: 'popup',
        itp_support: true,
      });

      // Show One Tap prompt
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log('One Tap not displayed:', notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log('One Tap skipped:', notification.getSkippedReason());
        }
      });
    } catch (error) {
      console.error('Error initializing Google One Tap:', error);
    }
  };

  const handleGoogleOneTapResponse = async (response) => {
    try {
      console.log('📤 Google One Tap - Sending ID Token to backend...');

      const res = await fetch(
        'https://api.doorstephub.com/v1/dhubApi/app/auth/loginWithGoogle',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: response.credential,
            fcmtoken: '1234', // TODO: Implement real FCM token
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

        // Store auth token
        const token = data.data?.token || data.token;
        if (token) {
          localStorage.setItem('authToken', token);
        }

        login(userData);
        console.log('✅ Google One Tap login successful');
      } else {
        console.error('❌ Login failed:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Google One Tap Error:', error);
    }
  };

  return null; // This component doesn't render anything
}
