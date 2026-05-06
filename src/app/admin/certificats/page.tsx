'use client';

import { useEffect, useMemo, useState } from 'react';
import { Award, Lightbulb, Loader2, Save, Send } from 'lucide-react';
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
import { getPageSetting, setPageSetting, uploadCertificateTemplatePdf } from '@/lib/api/settings';

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
  const [showTemplateHelp, setShowTemplateHelp] = useState(false);
  const [templateUrl, setTemplateUrl] = useState('');
  const [nameX, setNameX] = useState('170');
  const [nameY, setNameY] = useState('255');
  const [nameSize, setNameSize] = useState('28');
  const [uploadingTemplate, setUploadingTemplate] = useState(false);
  const [savingTemplateConfig, setSavingTemplateConfig] = useState(false);

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

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [templateRes, xRes, yRes, sizeRes] = await Promise.all([
          getPageSetting('certificate_event_template_pdf'),
          getPageSetting('certificate_event_name_x'),
          getPageSetting('certificate_event_name_y'),
          getPageSetting('certificate_event_name_size'),
        ]);
        if (!alive) return;
        setTemplateUrl(templateRes.value || '');
        setNameX(xRes.value || '170');
        setNameY(yRes.value || '255');
        setNameSize(sizeRes.value || '28');
      } catch {
        if (!alive) return;
        toast.error('Impossible de charger la configuration du template PDF');
      }
    })();
    return () => {
      alive = false;
    };
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

  const handleTemplateUpload = async (file?: File | null) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Veuillez sélectionner un fichier PDF');
      return;
    }
    setUploadingTemplate(true);
    try {
      const res = await uploadCertificateTemplatePdf(file);
      setTemplateUrl(res.value || '');
      toast.success('Template PDF importé');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l’upload du template');
    } finally {
      setUploadingTemplate(false);
    }
  };

  const handleSaveTemplateConfig = async () => {
    setSavingTemplateConfig(true);
    try {
      await Promise.all([
        setPageSetting('certificate_event_name_x', nameX.trim() || '170'),
        setPageSetting('certificate_event_name_y', nameY.trim() || '255'),
        setPageSetting('certificate_event_name_size', nameSize.trim() || '28'),
      ]);
      toast.success('Configuration du template enregistrée');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSavingTemplateConfig(false);
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

      <div className="bg-white rounded-xl border border-neutral-100 p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-neutral-900">Template PDF personnalisé</h2>
            <p className="text-sm text-neutral-600">
              Importez votre PDF officiel (tampon/logo), puis réglez la position du nom.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplateHelp((v) => !v)}
            leftIcon={<Lightbulb className="w-4 h-4" />}
          >
            Lampe aide
          </Button>
        </div>

        {showTemplateHelp && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm p-3 space-y-2">
            <p><strong>Comment préparer le PDF :</strong></p>
            <p>1) Dans votre modèle, laissez une zone vide à l’endroit exact du nom du participant.</p>
            <p>2) Mettez un repère temporaire visuel (ex: "NOM ICI") lors des tests puis retirez-le.</p>
            <p>3) Réglez X / Y / Taille ci-dessous, envoyez un certificat test et ajustez jusqu’à alignement parfait.</p>
            <p>4) Le système remplit automatiquement le nom complet au moment de l’envoi.</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex-1 min-w-0">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Template PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => void handleTemplateUpload(e.target.files?.[0])}
              className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-neutral-900 file:px-3 file:py-2 file:text-white hover:file:bg-neutral-800"
              disabled={uploadingTemplate}
            />
          </div>
        </div>

        {templateUrl && (
          <p className="text-sm text-neutral-600 break-all">
            Template actif: <span className="font-medium text-neutral-900">{templateUrl}</span>
          </p>
        )}

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <p className="text-xs font-medium text-neutral-700 mb-2">Repère visuel des coordonnées PDF</p>
          <div className="relative mx-auto h-44 w-36 rounded border-2 border-neutral-400 bg-white">
            <div className="absolute inset-x-2 bottom-2 border-t border-dashed border-neutral-300" />
            <div className="absolute inset-y-2 left-2 border-l border-dashed border-neutral-300" />
            <div className="absolute left-2 right-4 bottom-2 h-0.5 bg-sky-600" />
            <div className="absolute bottom-[5px] right-3 text-[11px] font-medium text-sky-700">X →</div>
            <div className="absolute bottom-2 left-[5px] top-4 w-0.5 bg-violet-600" />
            <div className="absolute left-2 top-3 text-[11px] font-medium text-violet-700">Y ↑</div>
            <div className="absolute left-1.5 bottom-1.5 h-1.5 w-1.5 rounded-full bg-neutral-700" />
            <span className="absolute left-[54%] bottom-[58%] -translate-x-1/2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200">
              Nom
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-600">Origine en bas à gauche.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Position X (plus grand = plus à droite)
            </label>
            <input
              type="number"
              value={nameX}
              onChange={(e) => setNameX(e.target.value)}
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Position Y (plus grand = plus haut)
            </label>
            <input
              type="number"
              value={nameY}
              onChange={(e) => setNameY(e.target.value)}
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Taille du nom</label>
            <input
              type="number"
              value={nameSize}
              onChange={(e) => setNameSize(e.target.value)}
              className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
        <p className="text-xs text-neutral-600">
          Les valeurs X, Y et la taille sont exprimées en points PDF (<span className="font-medium">pt</span>).
          Référence utile: 72 pt = 1 pouce.
        </p>
        <div>
          <Button
            onClick={handleSaveTemplateConfig}
            disabled={savingTemplateConfig}
            leftIcon={savingTemplateConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          >
            {savingTemplateConfig ? 'Enregistrement…' : 'Enregistrer la configuration'}
          </Button>
        </div>
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
