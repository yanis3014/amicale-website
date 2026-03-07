'use client';

import { useState } from 'react';
import { 
  User, 
  Calendar, 
  Gift, 
  Award,
  QrCode,
  Download,
  CheckCircle,
  Clock,
  MapPin,
  X,
  CreditCard
} from 'lucide-react';

const memberData = {
  nom: 'Ben Salem',
  prenom: 'Ahmed',
  grade: 'Maître de Conférences',
  departement: 'Pharmacie Clinique',
  email: 'ahmed.bensalem@fphm.tn',
  telephone: '+216 20 123 456',
  numeroMembre: 'FPHM-2024-0142',
};
const isAdherent = true;

const upcomingEvents = [
  { id: '1', titre: 'Congrès National des Enseignants 2026', date: '2026-03-15T19:00:00', lieu: 'Hôtel des Lumières', prix: 25, statut: 'confirmed' as const },
  { id: '2', titre: 'Journée Scientifique de la Faculté', date: '2026-02-22T09:00:00', lieu: 'Amphithéâtre A', prix: 0, statut: 'pending' as const },
];

const pastEvents = [
  { id: '3', titre: 'Congrès National 2025', date: '2026-02-10', lieu: 'Monastir' },
  { id: '4', titre: 'Formation Continue — Bonnes pratiques', date: '2026-01-20', lieu: 'Salle 201' },
];

const certificates = [
  { id: '1', nom: 'Attestation de participation — Congrès 2025', date: '2025-12-15', type: 'Événement' },
  { id: '2', nom: 'Attestation de Membre 2025-2026', date: '2025-09-01', type: 'Adhésion' },
];

const advantages = [
  'Accès à la bibliothèque de ressources pédagogiques de l\'Amicale',
  'Tarifs préférentiels sur les congrès et journées scientifiques',
  'Bulletin trimestriel et actualités réservées aux membres',
  'Formations continues à tarif adhérent',
  'Réseau des enseignants en pharmacie',
];

export default function DashboardMembrePage() {
  const [activeTab, setActiveTab] = useState<'profil' | 'evenements' | 'avantages' | 'certificats'>('profil');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const tabs = [
    { id: 'profil' as const, label: 'Mon Profil', icon: User },
    { id: 'evenements' as const, label: 'Mes Événements', icon: Calendar },
    { id: 'avantages' as const, label: 'Mes Avantages', icon: Gift },
    { id: 'certificats' as const, label: 'Mes Certificats', icon: Award },
  ];

  const handleShowTicket = (event: any) => {
    setSelectedEvent(event);
    setQrModalOpen(true);
  };

  const handleDownloadCertificate = (cert: any) => {
    alert(`Téléchargement du PDF : ${cert.nom}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-forest-700 text-white py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center font-display font-bold text-xl">
                {memberData.prenom[0]}
                {memberData.nom[0]}
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  {memberData.prenom} {memberData.nom}
                </h1>
              </div>
            </div>
            {isAdherent ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-full font-semibold">
                Adhérent 2025-2026
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-gold-500/20 text-gold-700 rounded-2xl">
                <span className="font-medium">Devenez adhérent pour débloquer tous les avantages</span>
                <button type="button" className="px-4 py-2 bg-gold-500 text-white rounded-xl font-semibold hover:bg-gold-600 transition-colors">
                  Devenir adhérent
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex gap-2 overflow-x-auto">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                    isActive ? 'text-primary-600' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 transition-transform duration-200"
                      style={{ transform: 'translateX(0)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* PROFIL TAB */}
        {activeTab === 'profil' && (
          <div className="space-y-8">
            {/* Carte de Membre Virtuelle */}
            <div className="bg-gradient-to-br from-primary-700 to-forest-800 p-8 rounded-2xl shadow-2xl text-white max-w-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="pharma-pattern-dash" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="white" strokeWidth="1" fill="none" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#pharma-pattern-dash)" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide opacity-90">
                      Amicale de la Faculté
                    </h3>
                    <p className="text-xs opacity-75">de Pharmacie de Monastir</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm opacity-90 mb-1">Numéro de membre</p>
                  <p className="text-xl font-mono font-bold tracking-widest">
                    {memberData.numeroMembre}
                  </p>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Titulaire</p>
                    <p className="text-2xl font-bold">
                      {memberData.prenom} {memberData.nom}
                    </p>
                    
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-75">Valide jusqu'au</p>
                    <p className="text-lg font-bold">09/2026</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations Personnelles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informations Personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Email
                  </label>
                  <p className="text-gray-900">{memberData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Téléphone
                  </label>
                  <p className="text-gray-900">{memberData.telephone}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Grade
                  </label>
                  <p className="text-gray-900">{memberData.grade}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Département
                  </label>
                  <p className="text-gray-900">{memberData.departement}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Statut adhérent
                  </label>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                    Adhérent {new Date().getFullYear()}-{new Date().getFullYear() + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉVÉNEMENTS TAB */}
        {activeTab === 'evenements' && (
          <div className="space-y-8">
            {/* Prochains Événements */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Prochains Événements
              </h2>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`flex rounded-xl overflow-hidden bg-white shadow-card border border-neutral-100 hover:shadow-card-lg transition-all ${
                      event.statut === 'confirmed'
                        ? 'border-l-4 border-l-primary-500'
                        : 'border-l-4 border-l-gold-500'
                    }`}
                  >
                    <div className="flex-1 p-6">
                      <h3 className="font-display text-xl font-bold text-neutral-900 mb-3">
                        {event.titre}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.lieu}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center gap-3 p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          event.statut === 'confirmed'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gold-500/20 text-gold-700'
                        }`}
                      >
                        {event.statut === 'confirmed' ? 'Confirmé' : 'En attente'}
                      </span>
                      <button
                          onClick={() => handleShowTicket(event)}
                          className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
                        >
                          <QrCode className="w-4 h-4" />
                          Mon Ticket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historique */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Historique
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Événement
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                        Lieu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pastEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {event.titre}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(event.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{event.lieu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* AVANTAGES TAB */}
        {activeTab === 'avantages' && (
          <div className="relative">
            <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
              Mes Avantages (adhérent)
            </h2>
            {!isAdherent ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 blur-sm pointer-events-none select-none">
                  {advantages.map((adv, i) => (
                    <div key={i} className="bg-white rounded-xl border border-neutral-100 p-6 flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-primary-600" />
                      </div>
                      <p className="text-neutral-900 font-medium pt-2">{adv}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center py-16">
                  <p className="text-2xl font-display font-bold text-neutral-800 mb-4">Réservé aux adhérents</p>
                  <p className="text-neutral-600 mb-6 text-center max-w-md">Payez votre cotisation annuelle pour accéder aux avantages réservés aux enseignants membres.</p>
                  <button type="button" className="px-8 py-4 bg-primary-500 text-white rounded-xl font-bold text-lg hover:bg-primary-600 shadow-glow transition-all">
                    Devenir adhérent — 25 DT/an
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advantages.map((advantage, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-primary-600" />
                    </div>
                    <p className="text-neutral-900 font-medium pt-2">{advantage}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CERTIFICATS TAB */}
        {activeTab === 'certificats' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Mes Certificats
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Nom du certificat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {certificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {cert.nom}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                          {cert.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(cert.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDownloadCertificate(cert)}
                          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Télécharger PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setQrModalOpen(false)}
          ></div>
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Mon Ticket
              </h3>
              <p className="text-gray-600 mb-6">{selectedEvent.titre}</p>

              {/* QR Code simulé */}
              <div className="bg-slate-100 aspect-square rounded-xl flex items-center justify-center mb-6">
                <div className="w-48 h-48 bg-white p-4 rounded-lg shadow-inner">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100" height="100" fill="white" />
                    <pattern id="qr" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                      <rect width="5" height="5" fill="black" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#qr)" />
                    <rect x="10" y="10" width="20" height="20" fill="white" />
                    <rect x="70" y="10" width="20" height="20" fill="white" />
                    <rect x="10" y="70" width="20" height="20" fill="white" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Date :</strong>{' '}
                  {new Date(selectedEvent.date).toLocaleDateString('fr-FR')}
                </p>
                <p>
                  <strong>Lieu :</strong> {selectedEvent.lieu}
                </p>
                <p>
                  <strong>Code :</strong> TICKET-{selectedEvent.id}-{memberData.numeroMembre}
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-6">
                Présentez ce QR code à l'entrée de l'événement
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
