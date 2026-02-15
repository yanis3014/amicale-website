import React from 'react';

interface CategoryBadgeProps {
  category: 'Social' | 'Académique' | 'Formation' | 'Autre';
}

const categoryStyles = {
  Social: 'bg-purple-100 text-purple-700',
  Académique: 'bg-blue-100 text-blue-700',
  Formation: 'bg-green-100 text-green-700',
  Autre: 'bg-gray-100 text-gray-700',
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryStyles[category]}`}>
      {category}
    </span>
  );
};
