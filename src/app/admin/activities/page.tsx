'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { mockActivities } from '@/lib/mockActivities';

export default function AdminActivitiesPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Actualités
          </h1>
          <p className="text-gray-600">
            Publiez et gérez les actualités de l'amicale
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-brand-green text-white rounded-lg font-semibold hover:bg-brand-green-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Actualité
        </button>
      </div>

      {/* Form Panel */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Créer une nouvelle actualité
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Titre
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Catégorie
              </label>
              <select className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none">
                <option>Projet</option>
                <option>Vie Étudiante</option>
                <option>Flash Info</option>
                <option>Événement</option>
                <option>Partenariat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Résumé
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contenu complet
              </label>
              <textarea
                rows={8}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Galerie photos (simulation)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-blue transition-colors cursor-pointer">
                <p className="text-gray-500">Cliquez pour ajouter des photos</p>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button className="px-6 py-2 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue-600 transition-colors">
                Publier
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div className="grid grid-cols-1 gap-6">
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {activity.title}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {activity.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">
                  {activity.summary}
                </p>
                <p className="text-sm text-gray-500">
                  Publié le {new Date(activity.published_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button className="px-4 py-2 bg-brand-blue-50 text-brand-blue rounded-lg font-medium hover:bg-brand-blue-100 transition-colors flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
