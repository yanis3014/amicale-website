import { PulseBar } from '@/components/home/PulseBar';
import { HeroSection } from '@/components/home/HeroSection';
import { EventsSection } from '@/components/home/EventsSection';
import { VideoSection } from '@/components/home/VideoSection';
import { PartnersSection } from '@/components/home/PartnersSection';
import { getPageSetting } from '@/lib/api/settings';
import { getEvents } from '@/lib/api/events';
import { getPartenaires } from '@/lib/api/partenaires';
import type { ApiEvent, ApiPartenaire } from '@/lib/api/types';

async function getPageSettingSafe(key: string): Promise<{ value: string | null } | null> {
  try {
    return await getPageSetting(key);
  } catch {
    return null;
  }
}

/** Récupère les données de la page d'accueil ; en cas d'erreur (ex. build sans API), retourne des valeurs par défaut. */
async function getHomeData() {
  const currentYear = new Date().getFullYear();
  const defaults = {
    banderole: '',
    videoUrl: '',
    anneeUniversitaire: `${currentYear}-${currentYear + 1}`,
    heroImage: null as string | null,
    heroText: null as string | null,
    heroTitle: null as string | null,
    membersCountText: null as string | null,
    events: [] as ApiEvent[],
    partenaires: [] as ApiPartenaire[],
  };
  try {
    const [banderoleRes, videoUrlRes, anneeRes, heroImageRes, events, partenaires, heroTextRes, heroTitleRes, membersCountTextRes] = await Promise.all([
      getPageSetting('home_banderole'),
      getPageSetting('home_video_url'),
      getPageSetting('home_annee_universitaire'),
      getPageSetting('home_hero_image'),
      getEvents({ upcoming: true }),
      getPartenaires(),
      getPageSettingSafe('home_hero_text'),
      getPageSettingSafe('home_hero_title'),
      getPageSettingSafe('home_members_count_text'),
    ]);
    return {
      banderole: banderoleRes?.value?.trim() ?? '',
      videoUrl: videoUrlRes?.value?.trim() ?? '',
      anneeUniversitaire: anneeRes?.value?.trim() || defaults.anneeUniversitaire,
      heroImage: heroImageRes?.value?.trim() || null,
      heroText: heroTextRes?.value?.trim() || null,
      heroTitle: heroTitleRes?.value?.trim() || null,
      membersCountText: membersCountTextRes?.value?.trim() || null,
      events: events ?? [],
      partenaires: partenaires ?? [],
    };
  } catch {
    return defaults;
  }
}

export default async function HomePage() {
  const data = await getHomeData();
  const { banderole, videoUrl, anneeUniversitaire, heroImage, heroText, heroTitle, membersCountText, events, partenaires } = data;
  const nextEvent = events.length > 0 ? events[0] : null;

  return (
    <div className="min-h-screen">
      <PulseBar banderole={banderole} />
      <HeroSection
        anneeUniversitaire={anneeUniversitaire}
        nextEvent={nextEvent}
        heroImageUrl={heroImage}
        heroTitle={heroTitle}
        heroText={heroText}
        membersCountText={membersCountText}
      />
      <EventsSection />
      <VideoSection videoUrl={videoUrl || null} />
      <PartnersSection partenaires={partenaires} />
    </div>
  );
}
