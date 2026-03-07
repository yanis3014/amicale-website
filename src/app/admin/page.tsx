'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirige /admin vers /admin/dashboard.
 */
export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return null;
}
