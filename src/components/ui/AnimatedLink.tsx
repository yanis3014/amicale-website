'use client';

import React from 'react';
import Link from 'next/link';

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedLink({ href, children, className = '' }: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      className={
        'relative font-body font-medium text-neutral-600 hover:text-primary-600 transition-colors group ' +
        className
      }
    >
      {children}
      <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-primary-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
    </Link>
  );
}
