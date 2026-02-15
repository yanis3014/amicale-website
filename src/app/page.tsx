import { PulseBar } from '@/components/home/PulseBar';
import { HeroSection } from '@/components/home/HeroSection';
import { EventsSection } from '@/components/home/EventsSection';
import { VideoSection } from '@/components/home/VideoSection';
import { PartnersSection } from '@/components/home/PartnersSection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PulseBar />
      <HeroSection />
      <EventsSection />
      <VideoSection />
      <PartnersSection />
    </div>
  );
}
