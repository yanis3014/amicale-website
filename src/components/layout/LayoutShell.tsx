'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

const FULLPAGE_PATHS = ['/login', '/register'];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;
  const isFullPage = pathname ? FULLPAGE_PATHS.includes(pathname) : false;

  if (isAdmin || isFullPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
