import React from 'react';

interface DateBadgeProps {
  date: string; // Format: "2024-03-15"
}

export const DateBadge: React.FC<DateBadgeProps> = ({ date }) => {
  const dateObj = new Date(date);
  const month = dateObj.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
  const day = dateObj.getDate();

  return (
    <div className="bg-white rounded-lg shadow-md p-3 text-center min-w-[60px]">
      <div className="text-xs font-semibold text-gray-500 mb-1">{month}</div>
      <div className="text-2xl font-bold text-gray-900">{day}</div>
    </div>
  );
};
