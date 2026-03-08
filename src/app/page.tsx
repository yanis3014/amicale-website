import { PulseBar } from '@/components/home/PulseBar';
import { HeroSection } from '@/components/home/HeroSection';
import { EventsSection } from '@/components/home/EventsSection';
import { VideoSection } from '@/components/home/VideoSection';
import { PartnersSection } from '@/components/home/PartnersSection';
import { getPageSetting } from '@/lib/api/settings';
import { getEvents } from '@/lib/api/events';
import { getPartenaires } from '@/lib/api/partenaires';

async function getPageSettingSafe(key: string): Promise<{ value: string | null } | null> {
  try {
    return await getPageSetting(key);
  } catch {
    return null;
  }
}

export default async function HomePage() {
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

  const banderole = banderoleRes?.value?.trim() ?? '';
  const videoUrl = videoUrlRes?.value?.trim() ?? '';
  const anneeUniversitaire =
    anneeRes?.value?.trim() ||
    `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
  const heroImage = heroImageRes?.value?.trim() || null;
  const heroText = heroTextRes?.value?.trim() || null;
  const heroTitle = heroTitleRes?.value?.trim() || null;
  const membersCountText = membersCountTextRes?.value?.trim() || null;
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
