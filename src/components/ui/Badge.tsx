'use client';

import React from 'react';

const variantStyles: Record<string, string> = {
  success: 'bg-primary-100 text-primary-700',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-neutral-100 text-neutral-700',
  primary: 'bg-[var(--accent-tint)] text-[var(--accent)] border border-[var(--accent-soft)]',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  teal: 'bg-teal-100 text-teal-700',
  gold: 'bg-[var(--gold-soft)] text-[var(--gold)] border border-[var(--gold-soft)]',
};

interface BadgeProps {
  variant?:
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral'
    | 'primary'
    | 'purple'
    | 'orange'
    | 'teal'
    | 'gold';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  const style = variantStyles[variant] ?? variantStyles.neutral;

  return (
    <span
      className={`rounded-full font-semibold ${style} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};
