'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { submitCotisation } from '@/lib/api/cotisations';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';

interface CotisationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ANNEE_COURANTE = new Date().getFullYear();
const ANNEES_UNIVERSITAIRES = [
  `${ANNEE_COURANTE - 1}-${ANNEE_COURANTE}`,
  `${ANNEE_COURANTE}-${ANNEE_COURANTE + 1}`,
];

export function CotisationModal({ isOpen, onClose, onSuccess }: CotisationModalProps) {
  const toast = useToast();
  const [montant, setMontant] = useState<string>('25');
  const [anneeUniversitaire, setAnneeUniversitaire] = useState(
    `${ANNEE_COURANTE}-${ANNEE_COURANTE + 1}`
  );
  const [methodePaiement, setMethodePaiement] = useState('');
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(montant.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) {
      toast.error('Montant invalide');
      return;
    }
    setSubmitting(true);
    try {
      await submitCotisation({
        montant: amount,
        annee_universitaire: anneeUniversitaire,
        methode_paiement: methodePaiement || undefined,
        reference: reference || undefined,
      });
      toast.success('Demande de cotisation enregistrée. Elle sera traitée par l\'équipe.');
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Envoi impossible');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Payer ma cotisation" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Montant (DT)"
          type="text"
          inputMode="decimal"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          required
        />
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
            Année universitaire
          </label>
          <select
            value={anneeUniversitaire}
            onChange={(e) => setAnneeUniversitaire(e.target.value)}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-[var(--line)] bg-white font-body focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            required
          >
            {ANNEES_UNIVERSITAIRES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Méthode de paiement (optionnel)"
          placeholder="Virement, espèces..."
          value={methodePaiement}
          onChange={(e) => setMethodePaiement(e.target.value)}
        />
        <Input
          label="Référence / N° reçu (optionnel)"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
        <div className="flex gap-3 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Annuler
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Envoi...' : 'Envoyer la demande'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
