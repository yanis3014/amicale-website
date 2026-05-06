'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/api/client';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/membres';

  React.useEffect(() => {
    if (isAuthenticated && user) {
      const destination = user.role === 'admin' ? '/admin/dashboard' : redirectTo;
      router.replace(destination);
    }
  }, [isAuthenticated, user, redirectTo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login({ email, password });
      // Admin → espace admin, membre → espace membre (ou redirect demandé)
      const destination = user?.role === 'admin' ? '/admin/dashboard' : redirectTo;
      router.push(destination);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Connexion impossible');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div
        className="hidden md:flex md:w-[40%] text-white relative overflow-hidden"
        style={{
          backgroundColor: 'var(--accent-deep)',
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 16px)',
        }}
      >
        <div className="relative z-10 flex flex-col justify-center p-12">
          <h1 className="font-display text-2xl font-bold mb-2">Amicale FPHM</h1>
          <p className="text-primary-200 italic text-sm mb-12">Unis pour l&apos;excellence de l&apos;enseignement pharmaceutique</p>
          <div className="space-y-4">
            <div className="bg-white/10 rounded-2xl p-4 text-sm">L&apos;association des enseignants de la Faculté de Pharmacie de Monastir.</div>
            <div className="bg-white/10 rounded-2xl p-4 text-sm">Des événements et formations tout au long de l&apos;année.</div>
            <div className="bg-white/10 rounded-2xl p-4 text-sm">Rejoignez des centaines de membres actifs.</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:justify-center bg-[var(--bg)] p-6 md:p-12">
        <div className="md:hidden mb-8">
          <Link href="/" className="font-display font-bold text-[var(--accent)] text-xl">Amicale FPHM</Link>
        </div>
        <Card variant="elevated" className="max-w-md w-full mx-auto p-8 md:p-10 bg-[var(--surface)] border-[var(--line)] shadow-[0_4px_16px_rgba(20,50,38,0.06)]">
          <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">Connexion</h2>
          <p className="text-neutral-600 text-sm mb-6">Espace réservé aux enseignants membres de l&apos;Amicale.</p>
          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-50 rounded-xl px-4 py-2">{error}</p>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input label="Email" type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Mot de passe" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" variant="primary" size="xl" className="w-full" disabled={submitting}>
              {submitting ? 'Connexion...' : 'Se connecter'}
            </Button>
            <p className="text-center text-sm">
              <Link href="/forgot-password" className="text-[var(--accent)] hover:underline font-medium">Mot de passe oublié ?</Link>
            </p>
          </form>
          <p className="mt-6 text-center text-neutral-600 text-sm">
            Pas encore de compte ? <Link href="/register" className="text-[var(--accent)] font-semibold hover:underline">S&apos;inscrire</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[var(--bg)]"><div className="animate-pulse text-neutral-500">Chargement...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}
