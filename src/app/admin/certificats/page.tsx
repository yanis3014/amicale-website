'use client';

import { useEffect, useMemo, useState } from 'react';
import { Award, Loader2, Send } from 'lucide-react';
import {
  getAdminEvents,
  getAdminCertificateEligibleByEvent,
  sendAdminCertificateForRegistration,
  sendAdminCertificatesBatch,
  type AdminCertificateEligibleItem,
} from '@/lib/api/admin';
import type { ApiEvent } from '@/lib/api/types';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR');
}

export default function AdminCertificatesPage() {
  const toast = useToast();
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [loadingEligible, setLoadingEligible] = useState(false);
  const [eligibleRows, setEligibleRows] = useState<AdminCertificateEligibleItem[]>([]);
  const [sendingOneId, setSendingOneId] = useState<number | null>(null);
  const [sendingBatch, setSendingBatch] = useState(false);

  useEffect(() => {
    setLoadingEvents(true);
    getAdminEvents()
      .then((rows) => {
        setEvents(rows);
        if (rows.length > 0) setSelectedEventId(rows[0].id);
      })
      .catch(() => {
        toast.error('Impossible de charger les événements');
        setEvents([]);
      })
      .finally(() => setLoadingEvents(false));
  }, [toast]);

  const loadEligible = async (eventId: number) => {
    setLoadingEligible(true);
    try {
      const res = await getAdminCertificateEligibleByEvent(eventId);
      setEligibleRows(res.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors du chargement des inscrits');
      setEligibleRows([]);
    } finally {
      setLoadingEligible(false);
    }
  };

  useEffect(() => {
    if (!selectedEventId) return;
    loadEligible(selectedEventId);
  }, [selectedEventId]);

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) || null,
    [events, selectedEventId]
  );
  const eligibleCount = eligibleRows.filter((r) => r.eligible).length;

  const handleSendOne = async (registrationId: number) => {
    if (!selectedEventId) return;
    setSendingOneId(registrationId);
    try {
      const res = await sendAdminCertificateForRegistration(selectedEventId, registrationId);
      if (res.sent) toast.success('Certificat envoyé');
      else toast.success('Certificat déjà existant');
      await loadEligible(selectedEventId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l’envoi');
    } finally {
      setSendingOneId(null);
    }
  };

  const handleSendBatch = async () => {
    if (!selectedEventId) return;
    setSendingBatch(true);
    try {
      const res = await sendAdminCertificatesBatch(selectedEventId);
      toast.success(`${res.sent} certificat(s) envoyé(s) sur ${res.attempted}`);
      await loadEligible(selectedEventId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l’envoi en lot');
    } finally {
      setSendingBatch(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
          <Award className="w-7 h-7 text-[var(--accent)]" />
          Certificats événements
        </h1>
        <p className="text-neutral-600">
          Sélectionnez un événement, puis envoyez les certificats aux inscrits éligibles.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-neutral-100 p-4 flex flex-col lg:flex-row gap-3 lg:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-neutral-700 mb-1">Événement</label>
          <select
            value={selectedEventId ?? ''}
            onChange={(e) => setSelectedEventId(Number(e.target.value) || null)}
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            disabled={loadingEvents || events.length === 0}
          >
            {events.length === 0 ? (
              <option value="">Aucun événement</option>
            ) : (
              events.map((event) => (
                <option key={event.id} value={event.id}>
                  #{event.id} — {event.titre} ({formatDate(event.date)})
                </option>
              ))
            )}
          </select>
        </div>
        <Button
          onClick={handleSendBatch}
          disabled={!selectedEventId || eligibleCount === 0 || sendingBatch || loadingEligible}
          leftIcon={sendingBatch ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        >
          {sendingBatch ? 'Envoi en lot…' : `Envoyer en lot (${eligibleCount})`}
        </Button>
      </div>

      {selectedEvent && (
        <div className="text-sm text-neutral-600">
          Événement sélectionné: <span className="font-medium text-neutral-800">{selectedEvent.titre}</span> — {formatDate(selectedEvent.date)}
        </div>
      )}

      <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-100 bg-[var(--bg)]">
          <h2 className="font-semibold text-neutral-900">Inscrits et éligibilité</h2>
        </div>

        {loadingEligible ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--bg)] border-b border-neutral-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Membre</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Statut inscription</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Certificat</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {eligibleRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-neutral-500">
                      Aucun inscrit membre pour cet événement.
                    </td>
                  </tr>
                ) : (
                  eligibleRows.map((row) => (
                    <tr key={row.registration_id} className="hover:bg-[var(--bg)]/60">
                      <td className="px-4 py-3 text-sm text-neutral-900">
                        {row.prenom} {row.nom}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{row.email}</td>
                      <td className="px-4 py-3 text-sm text-neutral-700">{row.statut}</td>
                      <td className="px-4 py-3 text-sm">
                        {row.has_certificate ? (
                          <span className="text-green-700 font-medium">Déjà envoyé</span>
                        ) : row.eligible ? (
                          <span className="text-amber-700 font-medium">À envoyer</span>
                        ) : (
                          <span className="text-neutral-500">Non éligible</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!row.eligible || sendingBatch || sendingOneId === row.registration_id}
                          onClick={() => handleSendOne(row.registration_id)}
                          leftIcon={
                            sendingOneId === row.registration_id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Send className="w-3.5 h-3.5" />
                          }
                        >
                          Envoyer
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
