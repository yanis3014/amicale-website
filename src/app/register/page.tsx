'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, CreditCard, Lock } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api/client';
import { submitCotisation } from '@/lib/api/cotisations';

function passwordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: '', color: 'bg-neutral-200' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['Faible', 'Moyen', 'Bon', 'Fort'];
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-primary-500', 'bg-primary-600'];
  return { score, label: labels[score - 1] || '', color: colors[score - 1] || 'bg-neutral-200' };
}

const GRADE_TO_ANNEE: Record<string, number> = {
  Professeur: 6,
  'Maître de Conférences': 5,
  'Maître Assistant': 4,
  Assistant: 3,
  Autre: 1,
};

const ANNEE_UNIVERSITAIRE = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
const MONTANT_ADHESION = 25;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [grade, setGrade] = useState('');
  const [departement, setDepartement] = useState('');
  const [telephone, setTelephone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  const strength = passwordStrength(password);
  const isConfirmMatch = confirmPassword ? password === confirmPassword : null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
      setCardData((prev) => ({ ...prev, number: formatted }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\//g, '');
    if (value.length <= 4 && /^\d*$/.test(value)) {
      const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
      setCardData((prev) => ({ ...prev, expiry: formatted }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    if (!cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv) {
      setError('Veuillez remplir les informations de paiement (adhésion obligatoire).');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await register({
        nom,
        prenom,
        email,
        password,
        telephone: telephone || undefined,
        annee: grade ? GRADE_TO_ANNEE[grade] : undefined,
      });
      const last4 = cardData.number.replace(/\s/g, '').slice(-4);
      await submitCotisation({
        montant: MONTANT_ADHESION,
        annee_universitaire: ANNEE_UNIVERSITAIRE,
        methode_paiement: 'carte',
        reference: last4 ? `****${last4}` : undefined,
      });
      router.push('/membres');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Inscription impossible');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-neutral-50">
      {/* Panneau gauche */}
      <div className="hidden md:flex md:w-[38%] relative bg-gradient-to-br from-primary-600 to-forest-800 text-white flex-shrink-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pharma-reg" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 2v6M10 12v6M2 10h6M12 10h6" stroke="currentColor" strokeWidth="0.8" fill="none" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#pharma-reg)" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col justify-center p-8">
          <h1 className="font-display text-xl font-bold mb-2">Amicale FPHM</h1>
          <p className="text-primary-200 italic text-sm mb-8">Unis pour l&apos;excellence de l&apos;enseignement pharmaceutique</p>
          <div className="space-y-3">
            {[
              'Créez votre compte en payant l\'adhésion annuelle (25 DT).',
              'Accès aux événements et avantages réservés aux membres.',
            ].map((quote, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-3 text-sm">
                &ldquo;{quote}&rdquo;
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu droit : formulaire + paiement, sans scroll page */}
      <div className="flex-1 flex flex-col min-h-0 md:justify-center p-4 md:p-6">
        <div className="md:hidden mb-4 flex-shrink-0">
          <Link href="/" className="font-display font-bold text-primary-600 text-lg">
            Amicale FPHM
          </Link>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Card variant="elevated" className="max-w-lg w-full mx-auto p-5 md:p-6">
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-1">
              Créer un compte — Adhésion obligatoire
            </h2>
            <p className="text-neutral-600 text-xs mb-4">
              Compte réservé aux enseignants de la FPHM. L&apos;adhésion annuelle ({MONTANT_ADHESION} DT) est réglée à l&apos;inscription.
            </p>
            {error && (
              <p className="text-red-600 text-xs mb-3 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                  size="sm"
                />
                <Input
                  label="Nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  size="sm"
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                error={emailError}
                required
                size="sm"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Input
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    size="sm"
                  />
                  {password && (
                    <div className="mt-1 flex gap-0.5 h-1 rounded-full overflow-hidden bg-neutral-200">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 transition-colors ${
                            i <= strength.score ? strength.color : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    label="Confirmer"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordMatch(e.target.value ? e.target.value === password : null);
                    }}
                    error={
                      confirmPassword && !passwordMatch
                        ? 'Non identique'
                        : undefined
                    }
                    rightIcon={
                      confirmPassword
                        ? passwordMatch
                          ? <CheckCircle className="w-4 h-4 text-primary-500" />
                          : <XCircle className="w-4 h-4 text-red-500" />
                        : undefined
                    }
                    required
                    size="sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border-2 border-neutral-200 bg-white font-body text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    <option value="Professeur">Professeur</option>
                    <option value="Maître de Conférences">Maître de Conférences</option>
                    <option value="Maître Assistant">Maître Assistant</option>
                    <option value="Assistant">Assistant</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <Input
                  label="Département"
                  placeholder="ex. Pharmacie Clinique..."
                  value={departement}
                  onChange={(e) => setDepartement(e.target.value)}
                  required
                  size="sm"
                />
              </div>
              <Input
                label="Téléphone"
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                size="sm"
              />

              {/* Bloc paiement adhésion */}
              <div className="border-t border-neutral-200 pt-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-semibold text-neutral-800">Paiement adhésion {MONTANT_ADHESION} DT</span>
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" />
                    Sécurisé
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nom sur la carte"
                    value={cardData.name}
                    onChange={(e) => setCardData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full py-2 px-3 rounded-lg border-2 border-neutral-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    required
                    disabled={submitting}
                  />
                  <input
                    type="text"
                    placeholder="Numéro carte (16 chiffres)"
                    value={cardData.number}
                    onChange={handleCardNumberChange}
                    className="w-full py-2 px-3 rounded-lg border-2 border-neutral-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    required
                    disabled={submitting}
                  />
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={cardData.expiry}
                    onChange={handleExpiryChange}
                    className="w-full py-2 px-3 rounded-lg border-2 border-neutral-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    required
                    disabled={submitting}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardData.cvv}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v.length <= 3 && /^\d*$/.test(v)) setCardData((prev) => ({ ...prev, cvv: v }));
                    }}
                    className="w-full py-2 px-3 rounded-lg border-2 border-neutral-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full mt-2" disabled={submitting}>
                {submitting ? 'Inscription et paiement...' : `S'inscrire et payer ${MONTANT_ADHESION} DT`}
              </Button>
            </form>
            <p className="mt-4 text-center text-neutral-500 text-xs">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-primary-600 font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
