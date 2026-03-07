'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AdherentGateProps {
  children: React.ReactNode;
  /** Contenu affiché à la place si non adhérent (défaut: message + CTA adhésion) */
  fallback?: React.ReactNode;
}

/**
 * Affiche les enfants uniquement si l'utilisateur est adhérent à jour.
 * Sinon affiche un message invitant à adhérer (ou le fallback personnalisé).
 */
export function AdherentGate({ children, fallback }: AdherentGateProps) {
  const { isAuthenticated, isAdherent, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  if (isAdherent) {
    return <>{children}</>;
  }

  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  return (
    <Card variant="elevated" className="p-8 text-center">
      <h3 className="font-display text-xl font-bold text-neutral-900 mb-2">
        Réservé aux adhérents
      </h3>
      <p className="text-neutral-600 mb-6">
        Cette section est réservée aux membres à jour de leur cotisation. Renouvelez votre adhésion
        pour accéder aux avantages.
      </p>
      <Button asChild variant="primary">
        <Link href="/adhesion">Voir l&apos;adhésion</Link>
      </Button>
    </Card>
  );
}
