'use client';

import React from 'react';

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-lg skeleton-shimmer w-full"
          style={{ width: i === lines - 1 && lines > 1 ? '75%' : '100%' }}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-neutral-100 overflow-hidden bg-white ${className}`}
    >
      <div className="h-48 rounded-t-2xl skeleton-shimmer" />
      <div className="p-6 space-y-3">
        <div className="h-5 rounded-lg skeleton-shimmer w-3/4" />
        <div className="h-4 rounded-lg skeleton-shimmer w-full" />
        <div className="h-4 rounded-lg skeleton-shimmer w-1/2" />
      </div>
    </div>
  );
};

export const SkeletonImage: React.FC<{
  aspectRatio?: string;
  className?: string;
}> = ({ aspectRatio = 'aspect-video', className = '' }) => {
  return (
    <div
      className={`rounded-lg skeleton-shimmer ${aspectRatio} ${className}`}
    />
  );
};
