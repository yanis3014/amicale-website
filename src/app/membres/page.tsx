'use client';

import { useState, useEffect } from 'react';
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
  CreditCard,
} from 'lucide-react';
import { getMyProfile, getMyEvents } from '@/lib/api/members';
import { getAvantages } from '@/lib/api/avantages';
import { useAuth } from '@/contexts/AuthContext';
import type { ApiUser } from '@/lib/api/types';
import type { ApiRegistration } from '@/lib/api/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

function formatAdherentBadge(adherentExpiresAt: string | null | undefined): string {
  if (!adherentExpiresAt) return `Adhérent ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
  const d = new Date(adherentExpiresAt);
  const m = d.getMonth() + 1;
  const y = d.getFullYear();
  return `Adhérent jusqu'au ${String(m).padStart(2, '0')}/${y}`;
}

export default function DashboardMembrePage() {
  const { user: contextUser } = useAuth();
  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [events, setEvents] = useState<ApiRegistration[]>([]);
  const [avantages, setAvantages] = useState<{ id: number; libelle: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState(false);
  const [activeTab, setActiveTab] = useState<'profil' | 'evenements' | 'avantages' | 'certificats'>('profil');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ApiRegistration | null>(null);

  // Utiliser l'utilisateur du contexte dès l'arrivée (évite "impossible de charger" après login)
  const displayProfile = profile ?? contextUser ?? null;

  useEffect(() => {
    let cancelled = false;
    if (contextUser) setProfile(contextUser);
    setLoading(true);
    setProfileError(false);
    Promise.all([getMyProfile(), getMyEvents(), getAvantages()])
      .then(([p, e, a]) => {
        if (!cancelled) {
          setProfile(p);
          setEvents(e);
          setAvantages(a.map((x) => ({ id: x.id, libelle: x.libelle })));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProfileError(true);
          if (!contextUser) setProfile(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [contextUser?.id]);

  const now = new Date();
  const upcomingEvents = events.filter((e) => e.date && new Date(e.date) >= now);
  const pastEvents = events.filter((e) => e.date && new Date(e.date) < now);

  const tabs = [
    { id: 'profil' as const, label: 'Mon Profil', icon: User },
    { id: 'evenements' as const, label: 'Mes Événements', icon: Calendar },
    { id: 'avantages' as const, label: 'Mes Avantages', icon: Gift },
    { id: 'certificats' as const, label: 'Mes Certificats', icon: Award },
  ];

  const handleShowTicket = (event: ApiRegistration) => {
    setSelectedEvent(event);
    setQrModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!displayProfile) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-600">Impossible de charger votre profil.</p>
        {profileError && (
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="text-[var(--accent)] font-medium hover:underline"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  const isAdherent = displayProfile.is_adherent && (displayProfile.adherent_expires_at ? new Date(displayProfile.adherent_expires_at) > now : true);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="bg-[var(--surface-2)] text-[var(--ink)] py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--accent)] text-[var(--bg)] flex items-center justify-center [font-family:'Newsreader',serif] font-medium text-xl">
                {displayProfile.prenom?.[0]}
                {displayProfile.nom?.[0]}
              </div>
              <div>
                <h1 className="[font-family:'Newsreader',serif] text-2xl md:text-3xl font-normal">
                  {displayProfile.prenom} {displayProfile.nom}
                </h1>
              </div>
            </div>
            {isAdherent && (
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--bg)] rounded-full font-medium">
                {formatAdherentBadge(displayProfile.adherent_expires_at)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg)] border-b border-[var(--line)] sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    isActive ? 'text-[var(--ink)]' : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accent)] transition-transform duration-200"
                      style={{ transform: 'translateX(0)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profil' && (
          <div className="space-y-8">
            <div className="p-8 rounded-2xl shadow-2xl text-[var(--bg)] max-w-2xl relative overflow-hidden bg-[var(--accent-deep)]">
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
                    <h3 className="[font-family:'Newsreader',serif] text-lg font-medium tracking-wide opacity-95">
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
                    {displayProfile.numero_membre ?? '—'}
                  </p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Titulaire</p>
                    <p className="[font-family:'Newsreader',serif] text-2xl font-medium">
                      {displayProfile.prenom} {displayProfile.nom}
                    </p>
                  </div>
                  {displayProfile.adherent_expires_at && (
                    <div className="text-right">
                      <p className="text-xs opacity-75">Valide jusqu&apos;au</p>
                      <p className="text-lg font-bold">
                        {new Date(displayProfile.adherent_expires_at).toLocaleDateString('fr-FR', {
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[var(--line)] p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Informations personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-600 mb-2">Email</label>
                  <p className="text-neutral-900">{displayProfile.email}</p>
                </div>
                {displayProfile.telephone && (
                  <div>
                    <label className="block text-sm font-semibold text-neutral-600 mb-2">Téléphone</label>
                    <p className="text-neutral-900">{displayProfile.telephone}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-neutral-600 mb-2">Statut adhérent</label>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isAdherent ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {isAdherent ? formatAdherentBadge(displayProfile.adherent_expires_at) : 'Non adhérent'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evenements' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Prochains événements
              </h2>
              {upcomingEvents.length === 0 ? (
                <p className="text-neutral-600">Aucune inscription à venir.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`flex rounded-xl overflow-hidden bg-white shadow-card border border-neutral-100 ${
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
                          {event.date && (
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
                          )}
                          {event.lieu && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.lieu}
                            </div>
                          )}
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
                          className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center gap-2"
                        >
                          <QrCode className="w-4 h-4" />
                          Mon Ticket
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Historique
              </h2>
              {pastEvents.length === 0 ? (
                <p className="text-neutral-600">Aucun événement passé.</p>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-[var(--line)] overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[var(--bg)] border-b border-[var(--line)]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                          Événement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">
                          Lieu
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      {pastEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-[var(--bg)]">
                          <td className="px-6 py-4 font-medium text-neutral-900">
                            {event.titre}
                          </td>
                          <td className="px-6 py-4 text-neutral-600">
                            {event.date && new Date(event.date).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 text-neutral-600">{event.lieu ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'avantages' && (
          <div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
              Mes Avantages
            </h2>
            {avantages.length === 0 ? (
              <p className="text-neutral-500">Aucun avantage configuré pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {avantages.map((advantage) => (
                  <div
                    key={advantage.id}
                    className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6 flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                    <p className="text-neutral-900 font-medium pt-2">{advantage.libelle}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificats' && (
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Mes Certificats
            </h2>
            <p className="text-neutral-600">
              Les attestations et certificats seront disponibles prochainement.
            </p>
          </div>
        )}
      </div>

      {qrModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setQrModalOpen(false)}
          />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <button
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">Mon Ticket</h3>
              <p className="text-neutral-600 mb-6">{selectedEvent.titre}</p>
              <div className="bg-neutral-100 aspect-square rounded-xl flex items-center justify-center mb-6">
                <div className="w-48 h-48 bg-white p-4 rounded-lg shadow-inner flex items-center justify-center text-neutral-400 text-sm">
                  QR code
                </div>
              </div>
              <div className="space-y-2 text-sm text-neutral-600">
                {selectedEvent.date && (
                  <p>
                    <strong>Date :</strong>{' '}
                    {new Date(selectedEvent.date).toLocaleDateString('fr-FR')}
                  </p>
                )}
                {selectedEvent.lieu && (
                  <p>
                    <strong>Lieu :</strong> {selectedEvent.lieu}
                  </p>
                )}
                {displayProfile?.numero_membre && (
                  <p>
                    <strong>Code :</strong> TICKET-{selectedEvent.id}-{displayProfile.numero_membre}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
  );
}
