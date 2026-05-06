import type { Metadata } from 'next';
import { DynamicPageContent } from '@/components/a-propos/DynamicPageContent';

export const metadata: Metadata = {
  title: 'Présentation - Amicale FPHM',
  description: "Présentation de l'Amicale des Enseignants de la Faculté de Pharmacie de Monastir",
};

export default function PresentationPage() {
  return (
    <DynamicPageContent
      settingKey="presentation"
      pageTitle="Présentation"
      placeholder="Contenu à venir : présentation de l'Amicale, ses objectifs et son rôle au sein de la Faculté de Pharmacie de Monastir."
      excludeFromRelated="presentation"
    />
  );
}
