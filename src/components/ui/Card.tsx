'use client';

import React from 'react';

type CardVariant = 'default' | 'elevated' | 'bordered' | 'glass';

interface CardProps {
  variant?: CardVariant;
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-[var(--surface)] border border-[var(--line)] shadow-[0_4px_16px_rgba(20,50,38,0.06)]',
  elevated: 'bg-[var(--surface)] border border-[var(--line)] shadow-[0_4px_16px_rgba(20,50,38,0.06)]',
  bordered: 'bg-[var(--surface)] border border-[var(--line)] shadow-[0_4px_16px_rgba(20,50,38,0.06)]',
  glass:
    'bg-white/70 backdrop-blur-md border border-[var(--line)] shadow-[0_4px_16px_rgba(20,50,38,0.06)]',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  children,
  className = '',
}) => {
  const hoverClasses = hover
    ? 'hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(20,50,38,0.09)] transition-all duration-300'
    : '';

  return (
    <div
      className={`rounded-[var(--radius-lg,28px)] ${variantClasses[variant]} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-[var(--line)] ${className}`}>
    {children}
  </div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 bg-[var(--surface-2)] border-t border-[var(--line)] ${className}`}>
    {children}
  </div>
);
