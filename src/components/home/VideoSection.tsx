'use client';

import React from 'react';

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  const u = url.trim();
  // YouTube: watch?v=ID ou youtu.be/ID ou embed/ID
  const ytMatch = u.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;
  // Vimeo
  const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return null;
}

interface VideoSectionProps {
  videoUrl: string | null;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ videoUrl }) => {
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;
  const isDirectVideo =
    videoUrl &&
    !embedUrl &&
    /\.(mp4|webm|ogg)(\?|$)/i.test(videoUrl);

  if (!videoUrl) {
    return null;
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-neutral-900 aspect-video max-h-[500px]">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Vidéo Amicale"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : isDirectVideo ? (
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-contain"
              playsInline
            />
          ) : null}
        </div>
      </div>
    </section>
  );
};
