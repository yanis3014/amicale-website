'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Images, Clock, MapPin } from 'lucide-react';
import { getAdminEvents } from '@/lib/api/admin';
import { uploadEventGallery, deleteEventGalleryImage } from '@/lib/api/events';
import type { ApiEvent } from '@/lib/api/types';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import { getToken } from '@/lib/api/client';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';

const MAX_GALLERY = 20;

export default function AdminEvenementsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryEvent, setGalleryEvent] = useState<ApiEvent | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const loadEvents = useCallback(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getAdminEvents()
      .then(setEvents)
      .catch(() => {
        toast.error('Erreur lors du chargement des événements');
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const now = new Date();
  const pastEvents = events.filter((e) => new Date(e.date) < now);

  const openGallery = (event: ApiEvent) => {
    setGalleryEvent(event);
    setGalleryFiles([]);
  };

  const closeGallery = () => {
    setGalleryEvent(null);
    setGalleryFiles([]);
  };

  const handleUploadGallery = async () => {
    if (!galleryEvent || galleryFiles.length === 0) return;
    const current = galleryEvent.gallery_images?.length ?? 0;
    if (current + galleryFiles.length > MAX_GALLERY) {
      toast.error(`Maximum ${MAX_GALLERY} photos par galerie.`);
      return;
    }
    try {
      setUploading(true);
      const res = await uploadEventGallery(galleryEvent.id, galleryFiles);
      setGalleryEvent({ ...galleryEvent, gallery_images: res.gallery_images ?? [] });
      setGalleryFiles([]);
      toast.success('Photos ajoutées');
      loadEvents();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveGalleryImage = async (index: number) => {
    if (!galleryEvent) return;
    try {
      const res = await deleteEventGalleryImage(galleryEvent.id, index);
      setGalleryEvent({ ...galleryEvent, gallery_images: res.gallery_images ?? [] });
      toast.success('Photo supprimée');
      loadEvents();
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Archives (événements passés)
        </h1>
        <p className="text-neutral-600">
          Les événements dont la date est passée apparaissent ici. Vous ne pouvez pas en créer : ajoutez uniquement les photos de la galerie pour chaque événement passé (visible sur la page Archives du site).
        </p>
      </div>

      {pastEvents.length === 0 ? (
        <EmptyState
          title="Aucune archive"
          description="Les événements passés s'affichent ici automatiquement. Vous pourrez alors ajouter les photos de chaque événement."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {pastEvents.map((event) => (
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
                  <h3 className="text-xl font-bold text-neutral-900 mb-2">
                    {event.titre}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-neutral-600 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {new Date(event.date).toLocaleString('fr-FR', {
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
                  </div>
                  <p className="text-neutral-600 text-sm mb-3 line-clamp-2">
                    {event.description || '—'}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <Images className="w-4 h-4" />
                    {event.gallery_images?.length ?? 0} photo(s) en galerie
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => openGallery(event)}
                  leftIcon={<Images className="w-4 h-4" />}
                >
                  Gérer les photos
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!galleryEvent}
        onClose={closeGallery}
        title={galleryEvent ? `Galerie — ${galleryEvent.titre}` : 'Galerie'}
        size="lg"
      >
        {galleryEvent && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              Ajoutez jusqu'à {MAX_GALLERY} photos pour cet événement passé. Elles seront visibles sur la page Archives du site.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {(galleryEvent.gallery_images ?? []).map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100 group"
                >
                  <Image
                    src={getImageUrl(url)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Ajouter des photos
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  const current = galleryEvent.gallery_images?.length ?? 0;
                  setGalleryFiles(files.slice(0, Math.max(0, MAX_GALLERY - current)));
                }}
                className="w-full text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold"
              />
              {galleryFiles.length > 0 && (
                <p className="text-xs text-neutral-500 mt-1">
                  {galleryFiles.length} fichier(s) prêt(s) à l'envoi.
                </p>
              )}
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button type="button" variant="secondary" onClick={closeGallery}>
                Fermer
              </Button>
              <Button
                type="button"
                onClick={handleUploadGallery}
                disabled={galleryFiles.length === 0}
                loading={uploading}
              >
                Enregistrer les photos
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
