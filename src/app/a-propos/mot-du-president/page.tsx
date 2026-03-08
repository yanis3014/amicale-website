import type { Metadata } from 'next';
import { DynamicPageContent } from '@/components/a-propos/DynamicPageContent';

export const metadata: Metadata = {
  title: 'Mot du Président - Amicale FPHM',
  description: "Mot du président de l'Amicale des Enseignants de la FPHM",
};

export default function MotDuPresidentPage() {
  return (
    <DynamicPageContent
      settingKey="mot_du_president"
      imageKey="mot_du_president_image"
      pageTitle="Mot du Président"
      placeholder="Contenu à venir."
      excludeFromRelated="mot_du_president"
    />
  );
}
