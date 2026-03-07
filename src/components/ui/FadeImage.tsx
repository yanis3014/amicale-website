'use client';

import React, { useState } from 'react';

interface FadeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export function FadeImage({ src, alt, className = '', ...props }: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <span className="relative block">
      {!loaded && (
        <span className="absolute inset-0 rounded-lg skeleton-shimmer" aria-hidden />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={
          (className || '') +
          ' transition-opacity duration-500 ' +
          (loaded ? 'opacity-100' : 'opacity-0')
        }
        {...props}
      />
    </span>
  );
}
