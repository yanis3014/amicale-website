'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Protège l'espace membre : les admins sont redirigés vers le dashboard admin,
 * les autres utilisateurs connectés voient l'espace membre.
 */
export default function ProtectedMembres({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAdmin, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    if (isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [isAdmin, isLoading, isAuthenticated, router]);

  if (isAuthenticated && isAdmin) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ProtectedRoute redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}
