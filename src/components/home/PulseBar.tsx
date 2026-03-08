'use client';

import React from 'react';
import { X } from 'lucide-react';

interface PulseBarProps {
  banderole: string;
}

export const PulseBar: React.FC<PulseBarProps> = ({ banderole }) => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!banderole || !isVisible) return null;

  return (
    <div className="bg-primary-500 text-white py-2.5 px-4 relative overflow-hidden">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-sm font-medium flex items-center gap-2">
            <span className="inline-flex animate-ping">📢</span>
            {banderole}
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 hover:opacity-75 transition-opacity flex-shrink-0"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
