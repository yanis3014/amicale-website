import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-brand-blue">{icon}</span>}
        <span className="text-3xl md:text-4xl font-bold text-gray-900">{value}</span>
      </div>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};
