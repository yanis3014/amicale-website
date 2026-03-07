'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-[40%] bg-gradient-to-br from-primary-600 to-forest-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pharma-login" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 2v6M10 12v6M2 10h6M12 10h6" stroke="currentColor" strokeWidth="0.8" fill="none" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#pharma-login)" />
          </svg>
        </div>
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

      <div className="flex-1 flex flex-col md:justify-center bg-neutral-50 p-6 md:p-12">
        <div className="md:hidden mb-8">
          <Link href="/" className="font-display font-bold text-primary-600 text-xl">Amicale FPHM</Link>
        </div>
        <Card variant="elevated" className="max-w-md w-full mx-auto p-8 md:p-10">
          <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">Connexion</h2>
          <p className="text-neutral-600 text-sm mb-6">Espace réservé aux enseignants membres de l&apos;Amicale.</p>
          <form className="space-y-5">
            <Input label="Email" type="email" placeholder="vous@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Mot de passe" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" variant="primary" size="xl" className="w-full">Se connecter</Button>
            <p className="text-center text-sm">
              <Link href="/forgot-password" className="text-primary-600 hover:underline font-medium">Mot de passe oublié ?</Link>
            </p>
          </form>
          <p className="mt-6 text-center text-neutral-600 text-sm">
            Pas encore de compte ? <Link href="/register" className="text-primary-600 font-semibold hover:underline">S&apos;inscrire</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
