import type { Metadata } from 'next';
import { Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Administration - Amicale Pharmacie',
  description: 'Espace d\'administration de l\'Amicale',
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12">
            <div className="w-20 h-20 bg-pharma-blue-100 dark:bg-pharma-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-pharma-blue-600" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Espace Administration
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Cette section est en cours de développement. L'authentification et l'interface d'administration seront bientôt disponibles.
            </p>

            <div className="bg-pharma-blue-50 dark:bg-pharma-blue-900/20 border border-pharma-blue-200 dark:border-pharma-blue-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-pharma-blue-900 dark:text-pharma-blue-100 mb-3">
                Fonctionnalités à venir
              </h2>
              <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start">
                  <span className="text-pharma-green-600 mr-2">✓</span>
                  Gestion des événements
                </li>
                <li className="flex items-start">
                  <span className="text-pharma-green-600 mr-2">✓</span>
                  Suivi des inscriptions
                </li>
                <li className="flex items-start">
                  <span className="text-pharma-green-600 mr-2">✓</span>
                  Gestion des paiements
                </li>
                <li className="flex items-start">
                  <span className="text-pharma-green-600 mr-2">✓</span>
                  Statistiques et rapports
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
