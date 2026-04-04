import { useSEO } from "@/hooks/useSEO";
import HeroSection from "@/components/sections/HeroSection";
import ImpactStats from "@/components/sections/ImpactStats";
import InitiativeCards from "@/components/sections/InitiativeCards";
import ImpactMap from "@/components/sections/ImpactMap";
import HowItWorks from "@/components/sections/HowItWorks";
import ScrollingStoriesStrip from "@/components/sections/ScrollingStoriesStrip";
import ImpactStory from "@/components/sections/ImpactStory";
import Testimonials from "@/components/sections/Testimonials";
import LatestStories from "@/components/sections/LatestStories";
import TrustBand from "@/components/sections/TrustBand";
import PartnerStrip from "@/components/sections/PartnerStrip";

const Home = () => {
  useSEO("Home", "AGSWS — Medical aid, education, and emergency care for families in Kolkata.");

  return (
    <main id="main-content">
      <HeroSection />
      <ImpactStats />
      <InitiativeCards />
      <ImpactMap />
      <HowItWorks />
      <ScrollingStoriesStrip />
      <ImpactStory />
      <Testimonials />
      <LatestStories />
      <TrustBand />
      <PartnerStrip />
    </main>
  );
};

export default Home;
