'use client';

import { X, GraduationCap, Shield } from 'lucide-react';
import Link from 'next/link';

interface EspaceMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EspaceMemberModal({ isOpen, onClose }: EspaceMemberModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Espace Membre
          </h2>
          <p className="text-gray-600">
            Choisissez votre portail d'accès
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Portail Étudiant */}
          <Link 
            href="/dashboard"
            onClick={onClose}
            className="group"
          >
            <div className="bg-gradient-to-br from-brand-green-50 to-brand-green-100 rounded-xl p-8 border-2 border-brand-green-200 hover:border-brand-green hover:shadow-xl transition-all cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-green rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Portail Étudiant
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Accédez à votre profil, vos inscriptions et vos événements
                </p>
                <div className="mt-auto pt-4">
                  <span className="text-brand-green font-semibold group-hover:underline">
                    Accéder →
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Administration */}
          <Link 
            href="/admin/dashboard"
            onClick={onClose}
            className="group"
          >
            <div className="bg-gradient-to-br from-brand-blue-50 to-brand-blue-100 rounded-xl p-8 border-2 border-brand-blue-200 hover:border-brand-blue hover:shadow-xl transition-all cursor-pointer h-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Administration
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Gérez les événements, membres et finances de l'amicale
                </p>
                <div className="mt-auto pt-4">
                  <span className="text-brand-blue font-semibold group-hover:underline">
                    Accéder →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
