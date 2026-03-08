import type { Metadata } from 'next';
import { DynamicPageContent } from '@/components/a-propos/DynamicPageContent';

export const metadata: Metadata = {
  title: 'Historique - Amicale FPHM',
  description: "Historique de l'Amicale des Enseignants de la Faculté de Pharmacie de Monastir",
};

export default function HistoriquePage() {
  return (
    <DynamicPageContent
      settingKey="historique"
      imageKey="historique_image"
      pageTitle="Historique"
      placeholder="Contenu à venir : dates clés et évolution de l'Amicale depuis sa création."
      excludeFromRelated="historique"
    />
  );
}
