'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { getToken } from '@/lib/api/client';
import {
  getAdminPartenaires,
  createPartenaire,
  updatePartenaire,
  deletePartenaire,
  uploadPartenaireLogo,
} from '@/lib/api/partenaires';
import type { ApiPartenaire } from '@/lib/api/types';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';

const defaultForm = {
  nom: '',
  url: '',
  ordre: 0,
  is_active: true,
};

export default function AdminPartenairesPage() {
  const [partenaires, setPartenaires] = useState<ApiPartenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ApiPartenaire | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiPartenaire | null>(null);
  const toast = useToast();

  const load = useCallback(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getAdminPartenaires()
      .then(setPartenaires)
      .catch(() => {
        toast.error('Erreur lors du chargement des partenaires');
        setPartenaires([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setFormData(defaultForm);
    setLogoFile(null);
    setShowForm(true);
  };

  const openEdit = (p: ApiPartenaire) => {
    setEditing(p);
    setFormData({
      nom: p.nom,
      url: p.url ?? '',
      ordre: p.ordre ?? 0,
      is_active: p.is_active ?? true,
    });
    setLogoFile(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormData(defaultForm);
    setLogoFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUploading(true);
      if (editing) {
        await updatePartenaire(editing.id, {
          nom: formData.nom,
          url: formData.url,
          ordre: formData.ordre,
          is_active: formData.is_active,
        });
        if (logoFile) {
          await uploadPartenaireLogo(editing.id, logoFile);
        }
        toast.success('Partenaire mis à jour');
      } else {
        const created = await createPartenaire({
          nom: formData.nom,
          url: formData.url,
          ordre: formData.ordre,
          is_active: formData.is_active,
        });
        if (logoFile) {
          await uploadPartenaireLogo(created.id, logoFile);
        }
        toast.success('Partenaire créé');
      }
      closeForm();
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePartenaire(deleteTarget.id);
      toast.success('Partenaire supprimé');
      setDeleteTarget(null);
      load();
    } catch (err) {
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
            Partenaires
          </h1>
          <p className="text-neutral-600">
            Gérer les logos et liens des partenaires affichés sur la page publique.
          </p>
        </div>
        <Button onClick={openCreate} leftIcon={<Plus className="w-5 h-5" />}>
          Nouveau partenaire
        </Button>
      </div>

      {partenaires.length === 0 ? (
        <EmptyState
          title="Aucun partenaire"
          description="Ajoutez le premier partenaire."
          action={{ label: 'Nouveau partenaire', onClick: openCreate }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {partenaires.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-xl shadow-sm border p-6 transition-shadow hover:shadow-md ${
                p.is_active ? 'border-neutral-100' : 'border-amber-200 bg-amber-50/30'
              }`}
            >
              <div className="flex flex-col items-center text-center mb-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center mb-3">
                  {p.logo_url ? (
                    <img
                      src={getImageUrl(p.logo_url)}
                      alt={p.nom}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <span className="text-2xl font-display font-bold text-neutral-400">
                      {p.nom.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-neutral-900">{p.nom}</h3>
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--accent)] hover:underline truncate max-w-full"
                  >
                    {p.url}
                  </a>
                )}
                <span
                  className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                    p.is_active ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {p.is_active ? 'Visible' : 'Masqué'}
                </span>
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(p)}
                  leftIcon={<Edit className="w-4 h-4" />}
                >
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setDeleteTarget(p)}
                  leftIcon={<Trash2 className="w-4 h-4" />}
                >
                  Suppr.
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editing ? 'Modifier le partenaire' : 'Nouveau partenaire'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nom *</label>
            <input
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">URL du site</label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Ordre d&apos;affichage</label>
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
              id="is_active_part"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-neutral-300 text-[var(--accent)] focus:ring-primary-500"
            />
            <label htmlFor="is_active_part" className="text-sm font-medium text-neutral-700">
              Visible sur le site
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Logo {editing && '(laisser vide pour conserver l&apos;actuel)'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold"
            />
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
        title="Supprimer le partenaire"
        message={
          deleteTarget
            ? `Êtes-vous sûr de vouloir supprimer « ${deleteTarget.nom } » ?`
            : ''
        }
        confirmLabel="Supprimer"
        dangerMode
      />
    </div>
  );
}
