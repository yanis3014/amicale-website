'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  MapPin,
  Download,
} from 'lucide-react';
import { getAdminEvents } from '@/lib/api/admin';
import {
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  uploadEventImage,
  getRegistrations,
  confirmRegistration,
  cancelRegistration,
} from '@/lib/api/events';
import type { ApiEvent } from '@/lib/api/types';
import type { ApiRegistration } from '@/lib/api/types';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';

interface RegistrationWithUser extends ApiRegistration {
  nom?: string;
  prenom?: string;
  email?: string;
  numero_membre?: string | null;
}

const defaultForm = {
  titre: '',
  description: '',
  long_description: '',
  date: '',
  prix: 0,
  prix_adherent: '' as number | '',
  capacite: 0,
  lieu: '',
  categorie: '',
};

function exportRegistrationsToCsv(regs: RegistrationWithUser[], eventTitre: string) {
  const headers = ['Nom', 'Prénom', 'Email', 'N° Membre', 'Statut', 'Montant', 'Date inscription'];
  const rows = regs.map((r) => [
    r.nom ?? '',
    r.prenom ?? '',
    r.email ?? '',
    r.numero_membre ?? '',
    r.statut,
    r.montant_paye ?? '',
    r.created_at ? new Date(r.created_at).toLocaleString('fr-FR') : '',
  ]);
  const csv = [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inscriptions-${eventTitre.replace(/\s+/g, '-')}-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ApiEvent | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiEvent | null>(null);
  const [inscritsEvent, setInscritsEvent] = useState<ApiEvent | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationWithUser[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const toast = useToast();

  const loadEvents = useCallback(() => {
    setLoading(true);
    getAdminEvents()
      .then(setEvents)
      .catch(() => {
        toast.error('Erreur lors du chargement des événements');
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const openEdit = (event: ApiEvent) => {
    setEditingEvent(event);
    setFormData({
      titre: event.titre,
      description: event.description ?? '',
      long_description: event.long_description ?? '',
      date: event.date.slice(0, 16),
      prix: event.prix ?? 0,
      prix_adherent: event.prix_adherent ?? '',
      capacite: event.capacite ?? 0,
      lieu: event.lieu ?? '',
      categorie: event.categorie ?? '',
    });
    setImageFile(null);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingEvent(null);
    setFormData(defaultForm);
    setImageFile(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEvent(null);
    setFormData(defaultForm);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      titre: formData.titre,
      description: formData.description || undefined,
      long_description: formData.long_description || undefined,
      date: new Date(formData.date).toISOString(),
      prix: Number(formData.prix) || 0,
      prix_adherent: formData.prix_adherent === '' ? undefined : Number(formData.prix_adherent),
      capacite: Number(formData.capacite) || 0,
      lieu: formData.lieu || undefined,
      categorie: formData.categorie || undefined,
    };
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
        if (imageFile) {
          setUploadingImage(true);
          await uploadEventImage(editingEvent.id, imageFile);
          setUploadingImage(false);
        }
        toast.success('Événement mis à jour');
      } else {
        const created = await createEvent(payload);
        if (imageFile) {
          setUploadingImage(true);
          await uploadEventImage(created.id, imageFile);
          setUploadingImage(false);
        }
        toast.success('Événement créé');
      }
      closeForm();
      loadEvents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEvent(deleteTarget.id);
      toast.success('Événement supprimé');
      setDeleteTarget(null);
      loadEvents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      toast.error(msg);
    }
  };

  const handlePublish = async (event: ApiEvent) => {
    try {
      await publishEvent(event.id);
      toast.success(event.is_published ? 'Événement dépublié' : 'Événement publié');
      loadEvents();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur';
      toast.error(msg);
    }
  };

  const openInscrits = async (event: ApiEvent) => {
    setInscritsEvent(event);
    setLoadingRegs(true);
    try {
      const regs = await getRegistrations(event.id);
      setRegistrations(regs as RegistrationWithUser[]);
    } catch {
      toast.error('Erreur chargement des inscriptions');
      setRegistrations([]);
    } finally {
      setLoadingRegs(false);
    }
  };

  const handleConfirmReg = async (regId: number) => {
    if (!inscritsEvent) return;
    try {
      await confirmRegistration(inscritsEvent.id, regId);
      toast.success('Inscription confirmée');
      const regs = await getRegistrations(inscritsEvent.id);
      setRegistrations(regs as RegistrationWithUser[]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleCancelReg = async (regId: number) => {
    if (!inscritsEvent) return;
    try {
      await cancelRegistration(inscritsEvent.id, regId);
      toast.success('Inscription annulée');
      const regs = await getRegistrations(inscritsEvent.id);
      setRegistrations(regs as RegistrationWithUser[]);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Gestion des Événements
          </h1>
          <p className="text-neutral-600">
            Créez et gérez les événements de l&apos;amicale
          </p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-5 h-5" />}>
          Nouvel Événement
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title="Aucun événement"
          description="Créez votre premier événement pour commencer."
          action={{ label: 'Nouvel Événement', onClick: openCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {event.image_url && (
                  <div className="relative w-full sm:w-40 h-32 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <Image
                      src={getImageUrl(event.image_url)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-neutral-900">
                      {event.titre}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        event.is_published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {event.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                    {event.lieu && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {event.lieu}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      {event.places_restantes}/{event.capacite} places
                    </span>
                  </div>
                  <p className="text-neutral-600 line-clamp-2 text-sm">
                    {event.description || '—'}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-primary-600">
                    {event.prix === 0
                      ? 'Gratuit'
                      : `${event.prix} DT`}
                    {event.prix_adherent != null && event.prix_adherent !== event.prix && (
                      <span className="text-sm font-normal text-neutral-500 ml-1">
                        (adh. {event.prix_adherent} DT)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openInscrits(event)}
                  leftIcon={<Users className="w-4 h-4" />}
                >
                  Inscrits
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePublish(event)}
                >
                  {event.is_published ? 'Dépublier' : 'Publier'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(event)}
                  leftIcon={<Edit className="w-4 h-4" />}
                >
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setDeleteTarget(event)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire Create/Edit */}
      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Titre *
              </label>
              <input
                type="text"
                required
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Date et heure *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Lieu
              </label>
              <input
                type="text"
                value={formData.lieu}
                onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Prix (DT)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.prix}
                onChange={(e) => setFormData({ ...formData, prix: Number(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Prix adhérent (DT)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.prix_adherent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prix_adherent: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Optionnel"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Capacité
              </label>
              <input
                type="number"
                min="0"
                value={formData.capacite}
                onChange={(e) => setFormData({ ...formData, capacite: Number(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Catégorie
              </label>
              <input
                type="text"
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="ex: gala, atelier"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description courte
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Description longue
              </label>
              <textarea
                rows={4}
                value={formData.long_description}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Image de couverture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold"
              />
              {editingEvent?.image_url && !imageFile && (
                <p className="text-xs text-neutral-500 mt-1">
                  Image actuelle conservée si vous ne choisissez pas de fichier.
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={closeForm}>
              Annuler
            </Button>
            <Button type="submit" loading={uploadingImage}>
              {editingEvent ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Inscrits */}
      <Modal
        isOpen={!!inscritsEvent}
        onClose={() => setInscritsEvent(null)}
        title={`Inscrits — ${inscritsEvent?.titre ?? ''}`}
        size="xl"
      >
        {inscritsEvent && (
          <>
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => exportRegistrationsToCsv(registrations, inscritsEvent.titre)}
                disabled={registrations.length === 0}
              >
                Exporter CSV
              </Button>
            </div>
            {loadingRegs ? (
              <div className="py-8 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : registrations.length === 0 ? (
              <p className="text-neutral-500 py-4">Aucune inscription.</p>
            ) : (
              <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-neutral-700">
                        Membre
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-neutral-700">
                        Statut
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-neutral-700">
                        Montant
                      </th>
                      <th className="px-4 py-2 text-left font-semibold text-neutral-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {registrations.map((reg) => (
                      <tr key={reg.id}>
                        <td className="px-4 py-2">
                          <div className="font-medium text-neutral-900">
                            {reg.prenom} {reg.nom}
                          </div>
                          <div className="text-neutral-500">{reg.email}</div>
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              reg.statut === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : reg.statut === 'cancelled'
                                  ? 'bg-neutral-100 text-neutral-600'
                                  : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {reg.statut === 'confirmed'
                              ? 'Confirmé'
                              : reg.statut === 'cancelled'
                                ? 'Annulé'
                                : 'En attente'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {reg.montant_paye != null && reg.montant_paye > 0
                            ? `${reg.montant_paye} DT`
                            : 'Gratuit'}
                        </td>
                        <td className="px-4 py-2">
                          {reg.statut === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleConfirmReg(reg.id)}
                              >
                                Confirmer
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200"
                                onClick={() => handleCancelReg(reg.id)}
                              >
                                Annuler
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer l'événement"
        message={
          deleteTarget
            ? `Êtes-vous sûr de vouloir supprimer « ${deleteTarget.titre } » ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
        dangerMode
      />
    </div>
  );
}
