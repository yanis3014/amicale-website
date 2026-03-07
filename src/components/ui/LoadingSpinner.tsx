'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 32,
  lg: 64,
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const px = sizeMap[size];
  return (
    <Loader2
      className={`animate-spin text-primary-500 ${className}`}
      style={{ width: px, height: px }}
    />
  );
};
