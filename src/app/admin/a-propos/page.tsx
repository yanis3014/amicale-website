'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { FileText, FolderOpen, Heart, History, Target, UserCircle, Upload, ImageIcon, Trash2 } from 'lucide-react';
import {
  getPageSetting,
  setPageSetting,
  uploadAProposPageImage,
  uploadAdministrativeDocument,
  getAdministrativeDocumentsAdmin,
  deleteAdministrativeDocumentAdmin,
  type AProposPageKey,
} from '@/lib/api/settings';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { ApiAdministrativeDocument } from '@/lib/api/types';

const SECTIONS: { key: AProposPageKey; label: string; icon: typeof UserCircle }[] = [
  { key: 'mot_du_president', label: 'Mot du président', icon: UserCircle },
  { key: 'presentation', label: 'Présentation', icon: FileText },
  { key: 'historique', label: 'Historique', icon: History },
  { key: 'missions_visions', label: 'Missions & Visions', icon: Target },
  { key: 'valeurs', label: 'Valeurs', icon: Heart },
  { key: 'documents', label: 'Documents administratifs', icon: FolderOpen },
];

export default function AdminAProposPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [documentsFiles, setDocumentsFiles] = useState<ApiAdministrativeDocument[]>([]);
  const [docTitle, setDocTitle] = useState('');
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const documentInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const toast = useToast();

  const load = useCallback(() => {
    setLoading(true);
    const contentKeys = SECTIONS.map((s) => s.key);
    const imageKeys = SECTIONS.map((s) => `${s.key}_image`);
    Promise.all([
      ...contentKeys.map((k) => getPageSetting(k)),
      ...imageKeys.map((k) => getPageSetting(k)),
      getAdministrativeDocumentsAdmin(),
    ])
      .then((results) => {
        const next: Record<string, string> = {};
        const nextEdits: Record<string, string> = {};
        const nextImages: Record<string, string> = {};
        SECTIONS.forEach((s, i) => {
          const v = results[i]?.value ?? '';
          next[s.key] = v;
          nextEdits[s.key] = v;
        });
        SECTIONS.forEach((s, i) => {
          const imgVal = results[contentKeys.length + i]?.value ?? '';
          nextImages[s.key] = imgVal;
        });
        const docs = results[contentKeys.length + imageKeys.length];
        setValues(next);
        setEdits(nextEdits);
        setImages(nextImages);
        setDocumentsFiles(Array.isArray(docs) ? (docs as ApiAdministrativeDocument[]) : []);
      })
      .catch(() => toast.error('Erreur lors du chargement des contenus'))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await setPageSetting(key, edits[key] ?? '');
      setValues((prev) => ({ ...prev, [key]: edits[key] ?? '' }));
      toast.success('Contenu enregistré');
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(null);
    }
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!docTitle.trim()) {
      toast.error('Le titre du document est obligatoire.');
      e.target.value = '';
      return;
    }
    setUploadingDoc(true);
    try {
      await uploadAdministrativeDocument(file, docTitle.trim());
      setDocTitle('');
      await load();
      toast.success('Document ajouté');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setUploadingDoc(false);
      e.target.value = '';
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    setDeletingDocId(docId);
    try {
      await deleteAdministrativeDocumentAdmin(docId);
      await load();
      toast.success('Document supprimé');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDeletingDocId(null);
    }
  };

  const handleImageUpload = async (pageKey: AProposPageKey, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image (JPG, PNG, etc.)');
      e.target.value = '';
      return;
    }
    setUploadingImage(pageKey);
    try {
      const res = await uploadAProposPageImage(pageKey, file);
      setImages((prev) => ({ ...prev, [pageKey]: res.value }));
      toast.success('Image mise à jour');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
    } finally {
      setUploadingImage(null);
      e.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <h1 className="font-display text-2xl font-bold text-neutral-900 mb-6">
          Contenus À propos
        </h1>
        <div className="flex items-center gap-3 text-neutral-600">
          <LoadingSpinner />
          <span>Chargement…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-2xl font-bold text-neutral-900 mb-2">
        Contenus À propos
      </h1>
      <p className="text-neutral-600 mb-8">
        Modifiez le contenu des pages Mot du président, Présentation, Historique, Missions & Visions, Valeurs et Documents administratifs. Utilisez le format Markdown (titres, listes, liens, gras, italique).
      </p>

      <div className="space-y-8">
        <section className="bg-white rounded-xl border border-[var(--line)] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 bg-[var(--bg)] flex items-center gap-3">
            <FolderOpen className="w-5 h-5 text-[var(--accent)]" />
            <h2 className="font-display font-semibold text-neutral-900">Pièces administratives (dashboard membre)</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-neutral-600">
              Déposez ici les statuts, JORT, RNE, RIB, etc. Les membres pourront les consulter depuis leur dashboard.
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs text-neutral-600 mb-1">Titre *</label>
                <input
                  type="text"
                  required
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-72 max-w-full px-3 py-2 border border-[var(--line)] rounded-xl text-sm"
                  placeholder="Ex. Statuts officiels"
                />
              </div>
              <input
                ref={documentInputRef}
                type="file"
                className="hidden"
                onChange={handleDocumentUpload}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => documentInputRef.current?.click()}
                disabled={uploadingDoc}
                leftIcon={uploadingDoc ? <LoadingSpinner /> : <Upload className="w-4 h-4" />}
              >
                {uploadingDoc ? 'Envoi…' : 'Déposer un document'}
              </Button>
            </div>

            <div className="border border-[var(--line)] rounded-xl overflow-hidden">
              {documentsFiles.length === 0 ? (
                <p className="text-sm text-neutral-500 px-4 py-3">Aucun document déposé.</p>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {documentsFiles.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{doc.title || doc.original_name}</p>
                        <a
                          href={getImageUrl(doc.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[var(--accent)] hover:underline"
                        >
                          Ouvrir
                        </a>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200"
                        onClick={() => handleDeleteDocument(doc.id)}
                        loading={deletingDocId === doc.id}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {SECTIONS.map(({ key, label, icon: Icon }) => (
          <section
            key={key}
            className="bg-white rounded-xl border border-[var(--line)] shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-neutral-100 bg-[var(--bg)] flex items-center gap-3">
              <Icon className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="font-display font-semibold text-neutral-900">{label}</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image d&apos;en-tête
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  {images[key] ? (
                    <div className="relative w-40 h-28 rounded-xl overflow-hidden bg-neutral-100 border border-[var(--line)]">
                      <img
                        src={getImageUrl(images[key])}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-28 rounded-xl bg-neutral-100 border border-[var(--line)] flex items-center justify-center text-neutral-400">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <input
                      ref={(el) => { fileInputRefs.current[key] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(key, e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRefs.current[key]?.click()}
                      disabled={uploadingImage === key}
                      leftIcon={uploadingImage === key ? <LoadingSpinner /> : <Upload className="w-4 h-4" />}
                    >
                      {uploadingImage === key ? 'Envoi…' : images[key] ? 'Changer l\'image' : 'Ajouter une image'}
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-700 mb-2">Contenu (Markdown)</h3>
              <textarea
                value={edits[key] ?? ''}
                onChange={(e) => setEdits((prev) => ({ ...prev, [key]: e.target.value }))}
                rows={12}
                className="w-full px-4 py-3 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
                placeholder={`Contenu de la page "${label}" en Markdown…`}
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  Aperçu sur la page publique : /a-propos/{key === 'mot_du_president' ? 'mot-du-president' : key === 'missions_visions' ? 'missions-visions' : key}
                </span>
                <Button
                  onClick={() => handleSave(key)}
                  disabled={saving === key || (edits[key] ?? '') === (values[key] ?? '')}
                  leftIcon={saving === key ? <LoadingSpinner /> : undefined}
                >
                  {saving === key ? 'Enregistrement…' : 'Enregistrer'}
                </Button>
              </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
