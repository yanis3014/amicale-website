import React from 'react';

const partners = [
  { name: 'MEDILABSANTE', logo: 'MEDILABS' },
  { name: 'PHARMACORPS', logo: 'PHARMACORPS' },
  { name: 'BioChem+', logo: 'BioChem+' },
  { name: 'UNIVERSITÉ', logo: 'UNIVERSITÉ' },
];

export const PartnersSection: React.FC = () => {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-8">
          Nos Partenaires
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center h-16 px-8 text-neutral-400 hover:text-primary-600 transition-colors duration-300 grayscale hover:grayscale-0"
            >
              <div className="px-6 py-3 rounded-xl border border-neutral-200 hover:border-primary-200 transition-all duration-300">
                <span className="text-base font-bold text-current">
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
