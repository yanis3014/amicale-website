import type { Metadata } from 'next';
import { DynamicPageContent } from '@/components/a-propos/DynamicPageContent';

export const metadata: Metadata = {
  title: 'Valeurs - Amicale FPHM',
  description: "Les valeurs de l'Amicale des Enseignants de la Faculté de Pharmacie de Monastir",
};

export default function ValeursPage() {
  return (
    <DynamicPageContent
      settingKey="valeurs"
      imageKey="valeurs_image"
      pageTitle="Valeurs"
      placeholder="Contenu à venir : les valeurs portées par l'Amicale (solidarité, excellence, engagement, etc.)."
      excludeFromRelated="valeurs"
    />
  );
}
