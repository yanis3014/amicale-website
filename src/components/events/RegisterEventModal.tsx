'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { registerToEvent } from '@/lib/api/events';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import type { ApiEvent } from '@/lib/api/types';

interface RegisterEventModalProps {
  event: ApiEvent;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function RegisterEventModal({ event, isOpen, onClose, onSuccess }: RegisterEventModalProps) {
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await registerToEvent(event.id);
      toast.success('Inscription enregistrée. Vous recevrez une confirmation par email.');
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Inscription impossible');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="S'inscrire à l'événement">
      <div className="space-y-4">
        <p className="text-neutral-600">
          Confirmer votre inscription à <strong>{event.titre}</strong> ?
        </p>
        <p className="text-sm text-neutral-500">
          {event.date && new Date(event.date).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
          {event.lieu && ` — ${event.lieu}`}
        </p>
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting || event.places_restantes === 0}>
            {submitting ? 'Inscription...' : "Confirmer l'inscription"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
