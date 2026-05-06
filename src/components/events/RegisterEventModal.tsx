'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { registerToEvent, registerToEventGuest } from '@/lib/api/events';
import type { RegisterEventGuestPayload, RegistrationPaymentDetails } from '@/lib/api/events';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/contexts/AuthContext';
import type { ApiEvent } from '@/lib/api/types';
import { LogIn, UserPlus, CreditCard, Lock } from 'lucide-react';

interface RegisterEventModalProps {
  event: ApiEvent;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = 'choice' | 'guest-form' | 'confirm-member';

export function RegisterEventModal({ event, isOpen, onClose, onSuccess }: RegisterEventModalProps) {
  const toast = useToast();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>(isAuthenticated ? 'confirm-member' : 'choice');
  const [submitting, setSubmitting] = useState(false);
  const [guest, setGuest] = useState<RegisterEventGuestPayload>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    titulaire_compte: '',
    reference_paiement: '',
    carte_expiry: '',
  });
  const [cardMember, setCardMember] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [cardGuest, setCardGuest] = useState({ name: '', number: '', expiry: '', cvv: '' });

  const loginRedirect = `/login?redirect=${encodeURIComponent(`/annonces/${event.id}`)}`;
  useEffect(() => {
    if (isOpen) setStep(isAuthenticated ? 'confirm-member' : 'choice');
  }, [isOpen, isAuthenticated]);

  const eventDateStr = event.date
    ? new Date(event.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const isPaidEvent = Number(event.prix) > 0;

  const handleCardNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setCard: React.Dispatch<React.SetStateAction<{ name: string; number: string; expiry: string; cvv: string }>>
  ) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
      setCard((prev) => ({ ...prev, number: formatted }));
    }
  };

  const handleExpiryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setCard: React.Dispatch<React.SetStateAction<{ name: string; number: string; expiry: string; cvv: string }>>
  ) => {
    const value = e.target.value.replace(/\//g, '');
    if (value.length <= 4 && /^\d*$/.test(value)) {
      const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
      setCard((prev) => ({ ...prev, expiry: formatted }));
    }
  };

  const handleMemberConfirm = async () => {
    if (isPaidEvent) {
      if (!cardMember.name?.trim() || !cardMember.number.replace(/\s/g, '') || cardMember.number.replace(/\s/g, '').length < 16 || !cardMember.expiry || !cardMember.cvv || cardMember.cvv.length < 3) {
        toast.error('Veuillez renseigner les informations de carte (nom, numéro 16 chiffres, date, CVV).');
        return;
      }
    }
    setSubmitting(true);
    try {
      const last4 = isPaidEvent ? cardMember.number.replace(/\s/g, '').slice(-4) : '';
      await registerToEvent(event.id, {
        titulaire_compte: isPaidEvent ? cardMember.name.trim() : undefined,
        reference_paiement: last4 ? `****${last4}` : undefined,
        carte_expiry: isPaidEvent ? cardMember.expiry : undefined,
      });
      toast.success('Inscription enregistrée. Vous recevrez une confirmation et un rappel par email.');
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Inscription impossible');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPaidEvent) {
      if (!cardGuest.name?.trim() || !cardGuest.number.replace(/\s/g, '') || cardGuest.number.replace(/\s/g, '').length < 16 || !cardGuest.expiry || !cardGuest.cvv || cardGuest.cvv.length < 3) {
        toast.error('Veuillez renseigner les informations de carte (nom, numéro 16 chiffres, date, CVV).');
        return;
      }
    }
    setSubmitting(true);
    try {
      const last4 = isPaidEvent ? cardGuest.number.replace(/\s/g, '').slice(-4) : '';
      await registerToEventGuest(event.id, {
        nom: guest.nom.trim(),
        prenom: guest.prenom.trim(),
        email: guest.email.trim().toLowerCase(),
        telephone: guest.telephone?.trim() || undefined,
        titulaire_compte: isPaidEvent ? cardGuest.name.trim() : undefined,
        reference_paiement: last4 ? `****${last4}` : undefined,
        carte_expiry: isPaidEvent ? cardGuest.expiry : undefined,
      });
      toast.success('Inscription enregistrée. Vous recevrez une confirmation par email.');
      onClose();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Inscription impossible');
    } finally {
      setSubmitting(false);
    }
  };

  const resetStep = () => {
    setStep(isAuthenticated ? 'confirm-member' : 'choice');
    setGuest({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      titulaire_compte: '',
      reference_paiement: '',
      carte_expiry: '',
    });
    setCardMember({ name: '', number: '', expiry: '', cvv: '' });
    setCardGuest({ name: '', number: '', expiry: '', cvv: '' });
  };

  const handleClose = () => {
    resetStep();
    onClose();
  };

  const title =
    step === 'choice'
      ? "S'inscrire à l'événement"
      : step === 'guest-form'
        ? 'Inscription sans être membre'
        : "S'inscrire à l'événement";

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="md">
      <div className="space-y-4">
        {step === 'choice' && (
          <>
            <p className="text-neutral-600">
              Vous avez un compte ? Connectez-vous pour pré-remplir vos informations et recevoir des
              rappels par email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={loginRedirect}
                onClick={handleClose}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl font-semibold px-6 py-3 bg-[var(--accent)] text-white hover:bg-primary-600 shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                Se connecter
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => setStep('guest-form')}
              >
                <UserPlus className="w-4 h-4" />
                Inscription sans être membre
              </Button>
            </div>
            <p className="text-xs text-neutral-500 text-center">
              Sans compte : vous renseignez vos coordonnées puis recevrez une confirmation par
              email.
            </p>
          </>
        )}

        {step === 'guest-form' && (
          <form onSubmit={handleGuestSubmit} className="space-y-4">
            <p className="text-neutral-600 text-sm">
              Renseignez vos informations. Une confirmation vous sera envoyée par email après
              paiement.
            </p>
            <Input
              label="Nom"
              value={guest.nom}
              onChange={(e) => setGuest((g) => ({ ...g, nom: e.target.value }))}
              required
              placeholder="Votre nom"
            />
            <Input
              label="Prénom"
              value={guest.prenom}
              onChange={(e) => setGuest((g) => ({ ...g, prenom: e.target.value }))}
              required
              placeholder="Votre prénom"
            />
            <Input
              label="Email"
              type="email"
              value={guest.email}
              onChange={(e) => setGuest((g) => ({ ...g, email: e.target.value }))}
              required
              placeholder="vous@exemple.com"
            />
            <Input
              label="Téléphone (optionnel)"
              type="tel"
              value={guest.telephone || ''}
              onChange={(e) => setGuest((g) => ({ ...g, telephone: e.target.value }))}
              placeholder="+216 00 000 000"
            />
            {isPaidEvent && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span className="text-sm font-semibold text-amber-900">Paiement par carte</span>
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    Sécurisé
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Nom sur la carte"
                  value={cardGuest.name}
                  onChange={(e) => setCardGuest((p) => ({ ...p, name: e.target.value }))}
                  className="w-full py-2 px-3 rounded-lg border-2 border-[var(--line)] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  required={isPaidEvent}
                />
                <input
                  type="text"
                  placeholder="Numéro carte (16 chiffres)"
                  value={cardGuest.number}
                  onChange={(e) => handleCardNumberChange(e, setCardGuest)}
                  className="w-full py-2 px-3 rounded-lg border-2 border-[var(--line)] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  required={isPaidEvent}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={cardGuest.expiry}
                    onChange={(e) => handleExpiryChange(e, setCardGuest)}
                    className="w-full py-2 px-3 rounded-lg border-2 border-[var(--line)] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    required={isPaidEvent}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardGuest.cvv}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v.length <= 4 && /^\d*$/.test(v)) setCardGuest((p) => ({ ...p, cvv: v }));
                    }}
                    className="w-full py-2 px-3 rounded-lg border-2 border-[var(--line)] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    required={isPaidEvent}
                  />
                </div>
              </div>
            )}
            <p className="text-sm text-neutral-500">
              {event.titre} — {eventDateStr}
              {event.lieu && ` — ${event.lieu}`}
            </p>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="outline" onClick={() => setStep('choice')} disabled={submitting}>
                Retour
              </Button>
              <Button type="submit" variant="primary" disabled={submitting || event.places_restantes === 0}>
                {submitting ? 'Inscription...' : "S'inscrire et confirmer"}
              </Button>
            </div>
          </form>
        )}

        {step === 'confirm-member' && (
          <>
            <p className="text-neutral-600">
              Confirmer votre inscription à <strong>{event.titre}</strong> ?
            </p>
            <p className="text-sm text-neutral-500">
              {eventDateStr}
              {event.lieu && ` — ${event.lieu}`}
            </p>
            {isPaidEvent && (
              <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span className="text-sm font-semibold text-amber-900">Paiement par carte</span>
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    Sécurisé
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Nom sur la carte"
                  value={cardMember.name}
                  onChange={(e) => setCardMember((p) => ({ ...p, name: e.target.value }))}
                  className="w-full py-2 px-3 rounded-lg border-2 border-[var(--line)] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  required={isPaidEvent}
                />
                <input
                  type="text"
                  placeholder="Numéro carte (16 chiffres)"
                  value={cardMember.number}
                  onChange={(e) => handleCardNumberChange(e, setCardMember)}
                  className="w-full py-2 px-3 rounded-lg border-2 border-[var(--line)] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  required={isPaidEvent}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={cardMember.expiry}
                    onChange={(e) => handleExpiryChange(e, setCardMember)}
                    className="w-full py-2 px-3 rounded-lg border-2 border-[var(--line)] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    required={isPaidEvent}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardMember.cvv}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v.length <= 4 && /^\d*$/.test(v)) setCardMember((p) => ({ ...p, cvv: v }));
                    }}
                    className="w-full py-2 px-3 rounded-lg border-2 border-[var(--line)] text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    required={isPaidEvent}
                  />
                </div>
              </div>
            )}
            <p className="text-sm text-[var(--accent)] font-medium">
              Vous recevrez une confirmation par email ainsi qu’un rappel avant l’événement.
            </p>
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={handleClose} disabled={submitting}>
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handleMemberConfirm}
                disabled={submitting || event.places_restantes === 0}
              >
                {submitting ? 'Inscription...' : "Confirmer l'inscription"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
