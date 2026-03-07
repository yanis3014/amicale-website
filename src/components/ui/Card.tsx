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
    'bg-white rounded-2xl shadow-card border border-neutral-100',
  elevated: 'bg-white rounded-2xl shadow-card-lg',
  bordered: 'border-2 border-neutral-200 rounded-2xl bg-white',
  glass:
    'bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-card',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  hover = false,
  children,
  className = '',
}) => {
  const hoverClasses = hover
    ? 'hover:-translate-y-1 hover:shadow-card-lg transition-all duration-300'
    : '';

  return (
    <div
      className={`${variantClasses[variant]} ${hoverClasses} ${className}`}
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
  <div className={`px-6 py-4 border-b border-neutral-100 ${className}`}>
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
  <div className={`px-6 py-4 bg-neutral-50 border-t border-neutral-100 ${className}`}>
    {children}
  </div>
);
