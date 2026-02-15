import { Mail, Linkedin, GraduationCap, Award } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nos Enseignants - Amicale Pharmacie',
  description: 'Découvrez le corps professoral qui soutient l\'excellence et accompagne la vie associative de la faculté',
};

// Mock data pour les enseignants
const enseignants = [
  {
    id: '1',
    nom: 'Pr. Mahmoud Ben Salem',
    titre: 'Doyen de la Faculté',
    specialite: 'Pharmacologie Clinique',
    email: 'mahmoud.bensalem@fphm.tn',
    linkedin: null,
  },
  {
    id: '2',
    nom: 'Pr. Amira Khelifi',
    titre: 'Chef de Département',
    specialite: 'Pharmacognosie & Phytochimie',
    email: 'amira.khelifi@fphm.tn',
    linkedin: 'amira-khelifi',
  },
  {
    id: '3',
    nom: 'Dr. Karim Dhouib',
    titre: 'Maître de Conférences',
    specialite: 'Chimie Analytique',
    email: 'karim.dhouib@fphm.tn',
    linkedin: null,
  },
  {
    id: '4',
    nom: 'Pr. Sonia Gharbi',
    titre: 'Professeur Chercheur',
    specialite: 'Biotechnologie Pharmaceutique',
    email: 'sonia.gharbi@fphm.tn',
    linkedin: 'sonia-gharbi',
  },
  {
    id: '5',
    nom: 'Dr. Youssef Trabelsi',
    titre: 'Responsable Recherche',
    specialite: 'Pharmacie Galénique',
    email: 'youssef.trabelsi@fphm.tn',
    linkedin: null,
  },
  {
    id: '6',
    nom: 'Pr. Leila Mansour',
    titre: 'Parrain de Promotion 2024',
    specialite: 'Microbiologie & Immunologie',
    email: 'leila.mansour@fphm.tn',
    linkedin: 'leila-mansour',
  },
  {
    id: '7',
    nom: 'Dr. Mehdi Bouaziz',
    titre: 'Coordinateur Stages',
    specialite: 'Pharmacie Hospitalière',
    email: 'mehdi.bouaziz@fphm.tn',
    linkedin: null,
  },
  {
    id: '8',
    nom: 'Pr. Nadia Jlassi',
    titre: 'Directrice Recherche',
    specialite: 'Toxicologie & Pharmacovigilance',
    email: 'nadia.jlassi@fphm.tn',
    linkedin: 'nadia-jlassi',
  },
];

export default function EnseignantsPage() {
  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Hero Banner Section */}
      <div className="relative h-[100vh] w-full overflow-hidden">
        {/* 1. L'image de fond qui remplit tout l'espace */}
        <img 
          src="/images/enseignants.jpeg" 
          alt="Corps professoral de la Faculté de Pharmacie" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* 2. Overlay sombre pour la lisibilité du texte (très important !) */}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          
          {/* 3. Texte par-dessus l'image (si tu veux le gérer en code pour le SEO) */}
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Le Corps Professoral & Nos Parrains
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-3xl drop-shadow-md">
            Ils soutiennent l'excellence et accompagnent la vie associative de la faculté
          </p>
          
        </div>
      </div>

      {/* Section Introduction */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-slate-600 leading-relaxed">
            L'Amicale de la Faculté de Pharmacie entretient des liens privilégiés avec le corps professoral. 
            Nos enseignants ne sont pas seulement des formateurs académiques, mais aussi des mentors 
            et des parrains qui soutiennent activement nos initiatives étudiantes. Leur expertise, 
            leur engagement et leur bienveillance contribuent à faire de notre faculté un lieu d'excellence 
            et d'épanouissement personnel.
          </p>
        </div>
      </div>

      {/* Section Grille des Enseignants */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Membres du Conseil Scientifique
          </h2>
          <p className="text-gray-600">
            Les piliers académiques qui accompagnent notre parcours
          </p>
        </div>

        {/* Grille Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {enseignants.map((enseignant) => (
            <div 
              key={enseignant.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              {/* Photo Placeholder */}
              <div className="relative">
                {/* TODO: Remplacer par next/image avec la photo de portrait */}
                <div className="aspect-square bg-slate-200 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-slate-300 flex items-center justify-center">
                    <Award className="w-12 h-12 text-slate-400" />
                  </div>
                </div>
                
                {/* Badge décoratif */}
                <div className="absolute top-4 right-4 bg-brand-blue text-white px-3 py-1 rounded-full text-xs font-semibold">
                  📚 Enseignant
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className="p-6">
                {/* Nom */}
                <h3 className="text-xl font-bold text-brand-blue mb-1">
                  {enseignant.nom}
                </h3>
                
                {/* Titre académique */}
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  {enseignant.titre}
                </p>
                
                {/* Spécialité */}
                <p className="text-sm text-gray-600 mb-4">
                  {enseignant.specialite}
                </p>

                {/* Séparateur */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {/* Icônes de contact */}
                  <div className="flex items-center gap-3">
                    {/* Email */}
                    <a
                      href={`mailto:${enseignant.email}`}
                      className="flex items-center justify-center w-9 h-9 bg-brand-blue-50 text-brand-blue rounded-full hover:bg-brand-blue hover:text-white transition-colors"
                      title={`Contacter ${enseignant.nom}`}
                    >
                      <Mail className="w-4 h-4" />
                    </a>

                    {/* LinkedIn (si disponible) */}
                    {enseignant.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${enseignant.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-9 h-9 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                        title="Profil LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section CTA (Optionnel) */}
      <div className="bg-brand-blue text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Vous souhaitez devenir parrain d'une promotion ?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre réseau de parrains et accompagnez les futurs pharmaciens dans leur parcours professionnel
          </p>
          <a
            href="mailto:asso.fphm@gmail.com"
            className="inline-block px-8 py-4 bg-white text-brand-blue rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </div>
  );
}
