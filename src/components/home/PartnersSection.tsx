import React from 'react';

const partners = [
  { name: 'MEDILABSANTE', logo: 'MEDILABS' },
  { name: 'PHARMACORPS', logo: 'PHARMACORPS' },
  { name: 'BioChem+', logo: 'BioChem+' },
  { name: 'UNIVERSITÉ', logo: 'UNIVERSITÉ' },
];

export const PartnersSection: React.FC = () => {
  return (
    <section className="py-16 bg-neutral-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
          Nos Partenaires
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="flex items-center justify-center h-16 px-8 opacity-70 hover:opacity-100 transition-all duration-300 transform hover:scale-105"
            >
              {/* Logo badge moderne */}
              <div className="px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg border border-slate-200 hover:border-brand-blue hover:shadow-md transition-all duration-300">
                <span className="text-base font-bold text-slate-700">
                  {partner.logo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
