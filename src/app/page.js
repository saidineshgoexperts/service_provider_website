import HeroSection from '../app/components/home/HeroSection';
import CategoriesSection from '../app/components/CategoriesSection';
import FeaturedServices from '../app/components/FeaturedServices';
import RecentlyBookedServices from '../app/components/RecentlyBookedServices';
import PromotionalBanners from '../app/components/PromotionalBanners';
import AppDownloadSection from '../app/components/AppDownloadSection';
import NearbyStores from '../app/components/NearbyStores';
import PopularServicesCenters from '../app/components/PopularServicesCenters';
import KnowledgeSpace from '../app/components/KnowledgeSpace';
import NewsletterSection from '../app/components/NewsletterSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CategoriesSection />
      <FeaturedServices />
      <RecentlyBookedServices />
      <PromotionalBanners />
      <AppDownloadSection />
      <NearbyStores />
      <PopularServicesCenters />
      <KnowledgeSpace />
      {/* <NewsletterSection /> */}
    </main>
  );
}
