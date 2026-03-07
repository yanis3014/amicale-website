'use client';

import { X, UserCircle, Shield } from 'lucide-react';
import Link from 'next/link';

interface EspaceMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EspaceMemberModal({ isOpen, onClose }: EspaceMemberModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-neutral-500" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
            Espace Enseignant Membre
          </h2>
          <p className="text-neutral-600 font-body">
            Réservé aux enseignants membres de l&apos;Amicale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/login" onClick={onClose} className="group">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 border-2 border-primary-200 hover:border-primary hover:shadow-xl transition-all cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UserCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Espace Membre
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Accédez à votre profil, vos inscriptions aux événements de l&apos;Amicale et vos avantages adhérent
                </p>
                <span className="text-primary font-semibold group-hover:underline">
                  Se connecter →
                </span>
              </div>
            </div>
          </Link>

          <Link href="/admin/dashboard" onClick={onClose} className="group">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8 border-2 border-primary-200 hover:border-primary hover:shadow-xl transition-all cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Administration
                </h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Gérez les événements, les enseignants membres et les finances de l&apos;Amicale
                </p>
                <span className="text-primary font-semibold group-hover:underline">
                  Accéder →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
