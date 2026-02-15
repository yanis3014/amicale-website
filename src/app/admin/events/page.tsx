'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Users, Clock, MapPin } from 'lucide-react';
import { mockEvents } from '@/lib/mockData';

export default function AdminEventsPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titre: '',
    date: '',
    prix: '',
    capacite: '',
    lieu: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Événement créé (simulation) !');
    setShowForm(false);
    setFormData({ titre: '', date: '', prix: '', capacite: '', lieu: '' });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion des Événements
          </h1>
          <p className="text-gray-600">
            Créez et gérez les événements de l'amicale
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-brand-green text-white rounded-lg font-semibold hover:bg-brand-green-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouvel Événement
        </button>
      </div>

      {/* Form Modal/Panel */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Créer un nouvel événement
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre de l'événement *
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date et heure *
                </label>
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prix (DT)
                </label>
                <input
                  type="number"
                  value={formData.prix}
                  onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre de places
                </label>
                <input
                  type="number"
                  value={formData.capacite}
                  onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none"
                  min="1"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Lieu
                </label>
                <input
                  type="text"
                  value={formData.lieu}
                  onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-brand-blue focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image de couverture
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-blue transition-colors cursor-pointer">
                  <p className="text-gray-500">Cliquez pour sélectionner une image</p>
                  <p className="text-sm text-gray-400 mt-1">JPG, PNG jusqu'à 10MB</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-blue-600 transition-colors"
              >
                Créer l'événement
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 gap-6">
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {event.titre}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.lieu}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {event.places_restantes}/{event.capacite} places
                  </div>
                </div>
                <p className="text-gray-600 line-clamp-2">
                  {event.description}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className="text-2xl font-bold text-brand-blue">
                  {event.prix === 0 ? 'Gratuit' : `${event.prix} DT`}
                </span>
              </div>
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
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
