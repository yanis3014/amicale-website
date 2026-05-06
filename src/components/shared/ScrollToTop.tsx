'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const THRESHOLD = 300;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > THRESHOLD);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scroll = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scroll}
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 bg-[var(--accent)] text-white rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(20,50,38,0.12)] transition-all duration-300 hover:bg-[var(--accent-deep)] ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
      }`}
      aria-label="Retour en haut"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
