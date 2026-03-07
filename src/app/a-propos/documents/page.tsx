import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documents - Amicale FPHM',
  description: 'Documents administratifs, RNE, JORT - Amicale des Enseignants de la FPHM',
};

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold text-neutral-900 mb-4">
          Documents
        </h1>
        <p className="text-neutral-600">RNE, JORT et documents administratifs — contenu à venir.</p>
      </div>
    </div>
  );
}
