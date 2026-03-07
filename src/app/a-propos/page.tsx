import { Mail } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Nos Enseignants - Amicale FPHM',
  description:
    "Le Bureau et le Conseil d'Administration de l'Amicale des Enseignants de la FPHM",
};

const enseignants = [
  {
    id: '1',
    nom: 'Hajer Rhim',
    titre: 'Présidente',
    specialite: '',
    email: 'asso.fphm@gmail.com',
    linkedin: null as string | null,
    photo_url: null as string | null,
  },
  {
    id: '2',
    nom: 'Nesserine Khalboussi',
    titre: 'Vice Présidente',
    specialite: '',
    email: 'asso.fphm@gmail.com',
    linkedin: null,
    photo_url: null,
  },
  {
    id: '3',
    nom: 'Amira Chrif',
    titre: 'Secrétaire Général',
    specialite: '',
    email: 'asso.fphm@gmail.com',
    linkedin: null,
    photo_url: null,
  },
  {
    id: '4',
    nom: 'Amina Bouattay',
    titre: 'Vice Secrétaire Général',
    specialite: '',
    email: 'asso.fphm@gmail.com',
    linkedin: null,
    photo_url: null,
  },
  {
    id: '5',
    nom: 'Hassen Benabdennebi',
    titre: 'Trésorier',
    specialite: '',
    email: 'asso.fphm@gmail.com',
    linkedin: null,
    photo_url: null,
  },
  {
    id: '6',
    nom: "Selim M'rad",
    titre: 'Vice Trésorier',
    specialite: '',
    email: 'asso.fphm@gmail.com',
    linkedin: null,
    photo_url: null,
  },
  {
    id: '7',
    nom: 'Mohamed Hédi Bencheikh',
    titre: 'Membre',
    specialite: '',
    email: 'asso.fphm@gmail.com',
    linkedin: null,
    photo_url: null,
  },
  {
    id: '8',
    nom: 'Lamia Tilouch et Wafa Kallala',
    titre: 'Membres',
    specialite: '',
    email: 'asso.fphm@gmail.com',
    linkedin: null,
    photo_url: null,
  },
];

function getInitials(nom: string) {
  return nom
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero - overlay dégradé diagonal */}
      <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden">
        <img
          src="/images/enseignants.jpeg"
          alt="Corps professoral de la Faculté de Pharmacie"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-forest-900/70 via-primary-800/50 to-primary-800/40"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-lg">
            Le Corps Professoral & Nos Parrains
          </h1>
          <p className="text-primary-200 italic text-lg md:text-xl max-w-3xl">
            Ils soutiennent l&apos;excellence et accompagnent la vie associative
            de la faculté
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-lg text-neutral-600 leading-relaxed font-body">
            L&apos;Amicale est l&apos;association des enseignants de la Faculté.
            Cette page présente le Bureau et le Conseil d&apos;Administration
            qui font vivre l&apos;Amicale au quotidien.
          </p>
        </div>

        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
            Le Bureau de l&apos;Amicale
          </h2>
          <p className="text-neutral-600 font-body">
            Le Conseil d&apos;Administration qui fait vivre l&apos;association
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {enseignants.map((enseignant) => (
            <Card
              key={enseignant.id}
              variant="default"
              hover
              className="overflow-hidden"
            >
              <div className="relative">
                <div className="aspect-square w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center object-top">
                  {enseignant.photo_url ? (
                    <Image
                      src={enseignant.photo_url}
                      alt={enseignant.nom}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span className="font-display text-3xl font-bold text-primary-600">
                      {getInitials(enseignant.nom)}
                    </span>
                  )}
                </div>
                <div
                  className="h-1 w-full bg-gradient-to-r from-primary-400 to-primary-600"
                  aria-hidden
                />
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-neutral-900 text-lg">
                  {enseignant.nom}
                </h3>
                <p className="text-primary-600 text-sm font-semibold mt-1">
                  {enseignant.titre}
                </p>
                {enseignant.specialite && (
                  <p className="text-neutral-500 text-sm mt-1">
                    {enseignant.specialite}
                  </p>
                )}
                <a
                  href={`mailto:${enseignant.email}`}
                  className="mt-4 inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl text-primary-600 hover:bg-primary-50 font-body font-semibold text-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contacter
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-forest-700 py-16 md:py-20">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-white/5" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Rejoindre l&apos;Amicale
          </h2>
          <p className="text-primary-200 text-lg mb-8 max-w-2xl mx-auto">
            Enseignant à la FPHM ? Adhérez à l&apos;Amicale pour participer aux événements
            et bénéficier des avantages réservés aux membres.
          </p>
          <a href="mailto:asso.fphm@gmail.com">
            <Button
              className="bg-white text-primary-700 font-bold hover:bg-neutral-100"
              size="xl"
            >
              Nous contacter
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
