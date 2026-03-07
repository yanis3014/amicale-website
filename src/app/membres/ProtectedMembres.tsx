'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProtectedMembres({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute redirectTo="/login">
      {children}
    </ProtectedRoute>
  );
}
