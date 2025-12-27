'use client';

import Script from 'next/script';

export default function ClientScripts() {
  return (
    <>
      {/* Google Maps API */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${
          process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
          'AIzaSyBNVn5j-M6F4VHkaOluoOcVY3K5r2-NlPk'
        }&libraries=places&loading=async`}
        strategy="beforeInteractive"
        onLoad={() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Google Maps loaded');
          }
        }}
        onError={(e) => {
          console.error('❌ Google Maps failed to load:', e);
        }}
      />
      
      {/* Google One Tap Script */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Google One Tap script loaded');
          }
        }}
        onError={(e) => {
          console.error('❌ Google One Tap script failed to load:', e);
        }}
      />
    </>
  );
}
