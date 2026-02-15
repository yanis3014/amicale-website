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
              className="flex items-center justify-center h-16 px-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              {/* Placeholder - À remplacer par de vraies images */}
              <div className="text-xl font-bold text-gray-400 text-center">
                {partner.logo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
