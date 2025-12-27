'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function LayoutContent({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/signin' || pathname === '/signup';

  if (hideLayout) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
