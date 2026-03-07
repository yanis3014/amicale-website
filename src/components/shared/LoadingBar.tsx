'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function LoadingBar() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setWidth(0);
    setDone(false);
    const t1 = setTimeout(() => setWidth(90), 0);
    const t2 = setTimeout(() => {
      setWidth(100);
      setDone(true);
    }, 200);
    const t3 = setTimeout(() => {
      setWidth(0);
      setDone(false);
    }, 400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-0.5 z-[9999] bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-200 ease-out"
      style={{
        width: `${width}%`,
        opacity: done ? 0 : 1,
      }}
    />
  );
}
