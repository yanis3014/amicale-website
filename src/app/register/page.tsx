'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api/client';

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

  const strength = passwordStrength(password);
  const isConfirmMatch = confirmPassword ? password === confirmPassword : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
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
      router.push('/membres');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Inscription impossible');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-[40%] bg-gradient-to-br from-primary-600 to-forest-800 text-white relative overflow-hidden">
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
        <div className="relative z-10 flex flex-col justify-center p-12">
          <h1 className="font-display text-2xl font-bold mb-2">Amicale FPHM</h1>
          <p className="text-primary-200 italic text-sm mb-12">Unis pour l&apos;excellence de l&apos;enseignement pharmaceutique</p>
          <div className="space-y-4">
            {[
              'Créez votre compte enseignant en quelques minutes.',
              'Accédez aux événements et avantages réservés aux membres.',
              'Rejoignez l\'Amicale des enseignants de la FPHM.',
            ].map((quote, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-4 text-sm">
                &ldquo;{quote}&rdquo;
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:justify-center bg-neutral-50 p-6 md:p-12 overflow-auto">
        <div className="md:hidden mb-8">
          <Link href="/" className="font-display font-bold text-primary-600 text-xl">
            Amicale FPHM
          </Link>
        </div>
        <Card variant="elevated" className="max-w-md w-full mx-auto p-8 md:p-10">
          <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">
            Créer un compte enseignant
          </h2>
          <p className="text-neutral-600 text-sm mb-6">
            Accédez à l&apos;espace membre de l&apos;Amicale (réservé aux enseignants de la FPHM).
          </p>
          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
              <Input
                label="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
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
            />
            <div>
              <Input
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-neutral-200">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 transition-colors ${
                          i <= strength.score ? strength.color : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{strength.label}</p>
                </div>
              )}
            </div>
            <div>
              <Input
                label="Confirmer le mot de passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordMatch(e.target.value ? e.target.value === password : null);
                }}
                error={
                  confirmPassword && !passwordMatch
                    ? 'Les mots de passe ne correspondent pas'
                    : undefined
                }
                rightIcon={
                  confirmPassword
                    ? passwordMatch
                      ? <CheckCircle className="w-5 h-5 text-primary-500" />
                      : <XCircle className="w-5 h-5 text-red-500" />
                    : undefined
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full py-2.5 px-4 rounded-xl border-2 border-neutral-200 bg-white font-body focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
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
              placeholder="ex. Pharmacie Clinique, Biochimie..."
              value={departement}
              onChange={(e) => setDepartement(e.target.value)}
              required
            />
            <Input
              label="Téléphone"
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
            <Button type="submit" variant="primary" size="xl" className="w-full" disabled={submitting}>
              {submitting ? 'Inscription...' : "S'inscrire"}
            </Button>
          </form>
          <p className="mt-6 text-center text-neutral-600 text-sm">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-primary-600 font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
