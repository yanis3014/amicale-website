'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  hint,
  options,
  value = '',
  onChange,
  placeholder = 'Sélectionner...',
  size = 'md',
  className = '',
  disabled = false,
}) => {
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-2.5 px-4 text-base',
    lg: 'py-3 px-4 text-lg',
  };

  const wrapperClasses = [
    'relative w-full rounded-xl border-2 bg-white font-body transition-all cursor-pointer',
    error
      ? 'border-red-400 ring-2 ring-red-100'
      : 'border-[var(--line)] focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100',
    sizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
          {label}
        </label>
      )}
      <div className={wrapperClasses}>
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-transparent pr-10 outline-none cursor-pointer text-neutral-800"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
      </div>
      {hint && !error && (
        <p className="text-xs text-neutral-500 mt-1">{hint}</p>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};
