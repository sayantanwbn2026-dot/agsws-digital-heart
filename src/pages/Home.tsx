import { useSEO } from "@/hooks/useSEO";
import HeroSection from "@/components/sections/HeroSection";
import ImpactStats from "@/components/sections/ImpactStats";
import InitiativeCards from "@/components/sections/InitiativeCards";
import HowItWorks from "@/components/sections/HowItWorks";
import ScrollingStoriesStrip from "@/components/sections/ScrollingStoriesStrip";
import ImpactStory from "@/components/sections/ImpactStory";
import Testimonials from "@/components/sections/Testimonials";
import LatestStories from "@/components/sections/LatestStories";
import TrustBand from "@/components/sections/TrustBand";
import PartnerStrip from "@/components/sections/PartnerStrip";
import { WaveDivider } from "@/components/layout/WaveDivider";

const Home = () => {
  useSEO("Home", "AGSWS — Medical aid, education, and emergency care for families in Kolkata.");

  return (
    <main id="main-content">
      <HeroSection />
      <ImpactStats />
      <InitiativeCards />
      <HowItWorks />
      <ScrollingStoriesStrip />
      <ImpactStory />
      <WaveDivider top="#0F1F20" bottom="#F7F8F9" />
      <Testimonials />
      <LatestStories />
      <WaveDivider top="#FFFFFF" bottom="#1F9AA8" />
      <TrustBand />
      <WaveDivider top="#1F9AA8" bottom="#FFFFFF" />
      <PartnerStrip />
    </main>
  );
};

export default Home;
