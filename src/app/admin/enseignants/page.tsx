'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { getAdminEnseignants } from '@/lib/api/admin';
import { useAuth } from '@/contexts/AuthContext';
import {
  createEnseignant,
  updateEnseignant,
  deleteEnseignant,
  reorderEnseignant,
  uploadEnseignantPhoto,
} from '@/lib/api/enseignants';
import { getPageSetting, uploadEnseignantsHeaderImage } from '@/lib/api/settings';
import type { ApiEnseignant } from '@/lib/api/types';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';

const defaultForm = {
  nom: '',
  titre: '',
  specialite: '',
  email: '',
  linkedin: '',
  ordre: 0,
  is_active: true,
};

export default function AdminEnseignantsPage() {
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const [enseignants, setEnseignants] = useState<ApiEnseignant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ApiEnseignant | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiEnseignant | null>(null);
  const [headerImage, setHeaderImage] = useState<string | null>(null);
  const [headerUploading, setHeaderUploading] = useState(false);
  const toast = useToast();

  const loadHeader = useCallback(() => {
    getPageSetting('enseignants_header_image')
      .then((s) => setHeaderImage(s.value || null))
      .catch(() => setHeaderImage(null));
  }, []);

  const load = useCallback(() => {
    if (!user || !isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getAdminEnseignants()
      .then(setEnseignants)
      .catch(() => {
        toast.error('Erreur lors du chargement des enseignants');
        setEnseignants([]);
      })
      .finally(() => setLoading(false));
    // toast volontairement exclu des deps pour éviter une boucle de re-renders
  }, [user, isAdmin]);

  useEffect(() => {
    if (authLoading) return;
    loadHeader();
    load();
  }, [authLoading, load, loadHeader]);

  const handleHeaderImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image (JPG, PNG, etc.)');
      return;
    }
    setHeaderUploading(true);
    try {
      await uploadEnseignantsHeaderImage(file);
      loadHeader();
      toast.success('Photo du header mise à jour');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setHeaderUploading(false);
      e.target.value = '';
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData(defaultForm);
    setPhotoFile(null);
    setShowForm(true);
  };

  const openEdit = (e: ApiEnseignant) => {
    setEditing(e);
    setFormData({
      nom: e.nom,
      titre: e.titre ?? '',
      specialite: e.specialite ?? '',
      email: e.email ?? '',
      linkedin: e.linkedin ?? '',
      ordre: e.ordre ?? 0,
      is_active: e.is_active ?? true,
    });
    setPhotoFile(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormData(defaultForm);
    setPhotoFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nom: formData.nom,
      titre: formData.titre,
      specialite: formData.specialite,
      email: formData.email,
      linkedin: formData.linkedin,
      ordre: formData.ordre,
      is_active: formData.is_active,
    };
    try {
      setUploading(true);
      if (editing) {
        await updateEnseignant(editing.id, payload);
        if (photoFile) {
          await uploadEnseignantPhoto(editing.id, photoFile);
        }
        toast.success('Enseignant mis à jour');
      } else {
        const created = await createEnseignant(payload);
        if (photoFile) {
          await uploadEnseignantPhoto(created.id, photoFile);
        }
        toast.success('Enseignant créé');
      }
      closeForm();
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteEnseignant(deleteTarget.id);
      toast.success('Enseignant supprimé');
      setDeleteTarget(null);
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const moveOrder = async (enseignant: ApiEnseignant, direction: 'up' | 'down') => {
    const idx = enseignants.findIndex((e) => e.id === enseignant.id);
    if (idx < 0) return;
    const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= enseignants.length) return;
    const other = enseignants[nextIdx];
    try {
      await reorderEnseignant(other.id, enseignant.ordre);
      await reorderEnseignant(enseignant.id, other.ordre);
      toast.success('Ordre mis à jour');
      load();
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
            Gestion des Enseignants
          </h1>
          <p className="text-neutral-600">
            Ordre d&apos;affichage, fiches et statut actif/inactif
          </p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-5 h-5" />}>
          Nouvel Enseignant
        </Button>
      </div>

      {/* Photo header page Nos Enseignants */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-neutral-900 mb-2">Photo header — Page « Nos Enseignants »</h2>
        <p className="text-sm text-neutral-600 mb-4">
          Image affichée en bannière sur la page publique. Vous pouvez la changer (ex. tous les 3 ans).
        </p>
        <div className="flex flex-wrap items-end gap-4">
          {headerImage && (
            <div className="w-48 h-24 rounded-lg overflow-hidden bg-neutral-100 border border-[var(--line)]">
              <img
                src={getImageUrl(headerImage)}
                alt="Header actuel"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <label className="inline-flex flex-col gap-1">
            <span className="text-sm font-medium text-neutral-700">
              {headerImage ? 'Changer la photo' : 'Ajouter une photo'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleHeaderImageChange}
              disabled={headerUploading}
              className="text-sm text-neutral-600 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold"
            />
          </label>
          {headerUploading && (
            <span className="text-sm text-neutral-500">Envoi en cours…</span>
          )}
        </div>
      </div>

      {enseignants.length === 0 ? (
        <EmptyState
          title="Aucun enseignant"
          description="Ajoutez le premier enseignant."
          action={{ label: 'Nouvel Enseignant', onClick: openCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {enseignants.map((e, idx) => (
            <div
              key={e.id}
              className={`bg-white rounded-xl shadow-sm border p-6 transition-shadow hover:shadow-md overflow-hidden ${
                e.is_active ? 'border-neutral-100' : 'border-amber-200 bg-amber-50/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0">
                  {e.photo_url ? (
                    <Image
                      src={getImageUrl(e.photo_url)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display font-bold text-[var(--accent)] text-xl">
                      {e.nom.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-neutral-900">{e.nom}</h3>
                  {e.titre && (
                    <p className="text-sm text-neutral-600">{e.titre}</p>
                  )}
                  {(() => {
                    const spec = e.specialite?.trim();
                    const sameCharOnly = spec && new Set(spec.replace(/\s/g, '').split('')).size <= 1;
                    if (!spec || sameCharOnly) return null;
                    return (
                      <p className="text-xs text-neutral-500">
                        <span className="text-neutral-400">Spécialité : </span>
                        {spec}
                      </p>
                    );
                  })()}
                  <span
                    className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                      e.is_active ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {e.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-neutral-100 min-w-0">
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => moveOrder(e, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Monter"
                  >
                    <ChevronUp className="w-5 h-5 text-neutral-600" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveOrder(e, 'down')}
                    disabled={idx === enseignants.length - 1}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Descendre"
                  >
                    <ChevronDown className="w-5 h-5 text-neutral-600" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 min-w-0 flex-shrink">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(e)}
                    leftIcon={<Edit className="w-4 h-4 flex-shrink-0" />}
                    className="!px-3 whitespace-nowrap"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 !px-3 whitespace-nowrap"
                    onClick={() => setDeleteTarget(e)}
                    leftIcon={<Trash2 className="w-4 h-4 flex-shrink-0" />}
                  >
                    Suppr.
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editing ? "Modifier l'enseignant" : 'Nouvel enseignant'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Titre
            </label>
            <input
              type="text"
              required
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="ex: Professeur"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Spécialité
            </label>
            <input
              type="text"
              required
              value={formData.specialite}
              onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              LinkedIn
            </label>
            <input
              type="url"
              required
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Ordre d&apos;affichage
            </label>
            <input
              type="number"
              required
              min={0}
              value={formData.ordre}
              onChange={(e) => setFormData({ ...formData, ordre: Number(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-neutral-300 text-[var(--accent)] focus:ring-primary-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-neutral-700">
              Visible sur le site (actif)
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold"
            />
            {editing?.photo_url && !photoFile && (
              <p className="text-xs text-neutral-500 mt-1">Photo actuelle conservée si vide.</p>
            )}
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={closeForm}>
              Annuler
            </Button>
            <Button type="submit" loading={uploading}>
              {editing ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer l'enseignant"
        message={
          deleteTarget
            ? `Êtes-vous sûr de vouloir supprimer « ${deleteTarget.nom} » ?`
            : ''
        }
        confirmLabel="Supprimer"
        dangerMode
      />
    </div>
  );
}
