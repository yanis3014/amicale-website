import type { Metadata } from 'next';
import { DynamicPageContent } from '@/components/a-propos/DynamicPageContent';

export const metadata: Metadata = {
  title: 'Missions & Visions - Amicale FPHM',
  description: "Missions et visions de l'Amicale des Enseignants de la Faculté de Pharmacie de Monastir",
};

export default function MissionsVisionsPage() {
  return (
    <DynamicPageContent
      settingKey="missions_visions"
      pageTitle="Missions & Visions"
      placeholder="Contenu à venir : les missions et la vision de l'Amicale pour les enseignants et la vie associative de la faculté."
      excludeFromRelated="missions_visions"
    />
  );
}
