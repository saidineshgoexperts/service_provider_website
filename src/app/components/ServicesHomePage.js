'use client';

import { Box } from '@mui/material';
import FeaturedServices from './FeaturedServices';
import RecentlyBookedServices from './RecentlyBookedServices';
import PromotionalBanners from './PromotionalBanners';
import AppDownloadSection from './AppDownloadSection';
import NearbyStores from './NearbyStores';
import PopularServicesCenters from './PopularServicesCenters';
import KnowledgeSpace from './KnowledgeSpace';
import NewsletterSection from './NewsletterSection';

export default function ServicesHomePage() {
  return (
    <Box sx={{ backgroundColor: 'background.default' }}>
      <FeaturedServices />
      <RecentlyBookedServices />
      <PromotionalBanners />
      <AppDownloadSection />
      <NearbyStores />
      <PopularServicesCenters />
      <KnowledgeSpace />
      <NewsletterSection />
    </Box>
  );
}
