import type { Metadata } from 'next';
import { DynamicPageContent } from '@/components/a-propos/DynamicPageContent';

export const metadata: Metadata = {
  title: 'Documents administratifs - Amicale FPHM',
  description: 'Documents administratifs : Statuts, JORT, RNE, RIB - Amicale des Enseignants de la FPHM',
};

export default function DocumentsPage() {
  return (
    <DynamicPageContent
      settingKey="documents"
      filesSettingKey="documents_files"
      pageTitle="Documents administratifs"
      placeholder="Statuts, JORT, RNE, RIB et autres documents officiels — contenu à venir."
      excludeFromRelated="documents"
    />
  );
}
