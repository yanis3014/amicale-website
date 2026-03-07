'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  getActivities,
  getActivity,
  createActivity,
  updateActivity,
  deleteActivity,
  publishActivity,
  uploadActivityImage,
  uploadActivityGallery,
  deleteActivityGalleryImage,
} from '@/lib/api/activities';
import type { ApiActivity } from '@/lib/api/types';
import type { ActivityCategory } from '@/lib/api/activities';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';

const CATEGORIES: { value: ActivityCategory; label: string; color: string }[] = [
  { value: 'projet', label: 'Projet', color: 'bg-blue-100 text-blue-800' },
  { value: 'vie_etudiante', label: 'Vie étudiante', color: 'bg-green-100 text-green-800' },
  { value: 'flash_info', label: 'Flash info', color: 'bg-amber-100 text-amber-800' },
  { value: 'evenement', label: 'Événement', color: 'bg-purple-100 text-purple-800' },
  { value: 'partenariat', label: 'Partenariat', color: 'bg-forest-100 text-forest-800' },
];

const defaultForm = {
  title: '',
  summary: '',
  content: '',
  category: 'flash_info' as ActivityCategory,
};

export default function AdminAnnoncesPage() {
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ApiActivity | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiActivity | null>(null);
  const toast = useToast();

  const loadActivities = useCallback(() => {
    setLoading(true);
    getActivities({ all: true })
      .then(setActivities)
      .catch(() => {
        toast.error('Erreur lors du chargement des actualités');
        setActivities([]);
      })
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const openCreate = () => {
    setEditingActivity(null);
    setFormData(defaultForm);
    setMainImageFile(null);
    setGalleryFiles([]);
    setShowForm(true);
  };

  const openEdit = async (activity: ApiActivity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      summary: activity.summary ?? '',
      content: activity.content ?? '',
      category: activity.category,
    });
    setMainImageFile(null);
    setGalleryFiles([]);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingActivity(null);
    setFormData(defaultForm);
    setMainImageFile(null);
    setGalleryFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      summary: formData.summary || undefined,
      content: formData.content || undefined,
      category: formData.category,
    };
    try {
      setUploading(true);
      if (editingActivity) {
        await updateActivity(editingActivity.id, payload);
        if (mainImageFile) {
          await uploadActivityImage(editingActivity.id, mainImageFile);
        }
        if (galleryFiles.length > 0) {
          await uploadActivityGallery(editingActivity.id, galleryFiles);
        }
        toast.success('Actualité mise à jour');
      } else {
        const created = await createActivity(payload);
        if (mainImageFile) {
          await uploadActivityImage(created.id, mainImageFile);
        }
        if (galleryFiles.length > 0) {
          await uploadActivityGallery(created.id, galleryFiles);
        }
        toast.success('Actualité créée');
      }
      closeForm();
      loadActivities();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteActivity(deleteTarget.id);
      toast.success('Actualité supprimée');
      setDeleteTarget(null);
      loadActivities();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handlePublish = async (activity: ApiActivity) => {
    try {
      await publishActivity(activity.id);
      toast.success(activity.is_published ? 'Actualité dépubliée' : 'Actualité publiée');
      loadActivities();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const handleRemoveGalleryImage = async (activityId: number, index: number) => {
    try {
      await deleteActivityGalleryImage(activityId, index);
      toast.success('Image supprimée');
      loadActivities();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const categoryLabel = (cat: ActivityCategory) =>
    CATEGORIES.find((c) => c.value === cat)?.label ?? cat;
  const categoryColor = (cat: ActivityCategory) =>
    CATEGORIES.find((c) => c.value === cat)?.color ?? 'bg-neutral-100 text-neutral-800';

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
            Gestion des Actualités
          </h1>
          <p className="text-neutral-600">
            Publiez et gérez les actualités (activités) de l&apos;amicale
          </p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-5 h-5" />}>
          Nouvelle Actualité
        </Button>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          title="Aucune actualité"
          description="Créez votre première actualité."
          action={{ label: 'Nouvelle Actualité', onClick: openCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {activity.main_image && (
                  <div className="relative w-full sm:w-40 h-32 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                    <Image
                      src={getImageUrl(activity.main_image)}
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
                      {activity.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryColor(activity.category)}`}
                    >
                      {categoryLabel(activity.category)}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        activity.is_published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {activity.is_published ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  <p className="text-neutral-600 line-clamp-2 text-sm mb-2">
                    {activity.summary || '—'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {activity.published_at
                      ? `Publié le ${new Date(activity.published_at).toLocaleDateString('fr-FR')}`
                      : 'Non publié'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-neutral-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePublish(activity)}
                >
                  {activity.is_published ? 'Dépublier' : 'Publier'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(activity)}
                  leftIcon={<Edit className="w-4 h-4" />}
                >
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setDeleteTarget(activity)}
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
        title={editingActivity ? "Modifier l'actualité" : 'Nouvelle actualité'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Catégorie *
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value as ActivityCategory })
              }
              className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Résumé
            </label>
            <textarea
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Contenu (Markdown)
            </label>
            <textarea
              rows={8}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              placeholder="Vous pouvez utiliser **gras**, *italique*, [liens](url)..."
            />
            {formData.content && (
              <div className="mt-2 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <p className="text-xs font-semibold text-neutral-500 mb-2">Aperçu :</p>
                <div className="prose prose-sm max-w-none text-neutral-700">
                  <ReactMarkdown>{formData.content}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Image principale
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImageFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold"
            />
            {editingActivity?.main_image && !mainImageFile && (
              <p className="text-xs text-neutral-500 mt-1">Image actuelle conservée si vide.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Galerie (max 6 images)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGalleryFiles(Array.from(e.target.files ?? []).slice(0, 6))}
              className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold"
            />
            {editingActivity?.gallery_images?.length ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {editingActivity.gallery_images.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 group"
                  >
                    <Image
                      src={getImageUrl(url)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(editingActivity.id, idx)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            {galleryFiles.length > 0 && (
              <p className="text-xs text-neutral-500 mt-1">
                {galleryFiles.length} fichier(s) sélectionné(s) pour la galerie.
              </p>
            )}
          </div>
          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="secondary" onClick={closeForm}>
              Annuler
            </Button>
            <Button type="submit" loading={uploading}>
              {editingActivity ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Supprimer l'actualité"
        message={
          deleteTarget
            ? `Êtes-vous sûr de vouloir supprimer « ${deleteTarget.title} » ? Cette action est irréversible.`
            : ''
        }
        confirmLabel="Supprimer"
        dangerMode
      />
    </div>
  );
}
