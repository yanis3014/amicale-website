'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ActivityGalleryProps {
  images: string[];
  title: string;
}

export function ActivityGallery({ images, title }: ActivityGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    if (lightboxIndex !== null) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  if (!images || images.length === 0) return null;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((i) =>
      i === null ? null : i === 0 ? images.length - 1 : i - 1
    );
  };
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((i) =>
      i === null ? null : i === images.length - 1 ? 0 : i + 1
    );
  };

  return (
    <>
      <div className="mb-12">
        <h2 className="text-2xl font-display font-bold text-forest-800 mb-6 border-b border-primary-200 pb-2">
          Galerie
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 hover:ring-2 hover:ring-primary-500 transition-all"
            >
              <img
                src={image}
                alt={`${title} - Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={images[lightboxIndex]}
            alt={`${title} - Photo ${lightboxIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/30"
            aria-label="Suivant"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  );
}
