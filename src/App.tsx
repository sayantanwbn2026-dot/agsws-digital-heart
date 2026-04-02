import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DonateOverlayProvider } from "@/contexts/DonateOverlayContext";
import { useLenis } from "@/hooks/useLenis";
import LiveTicker from "./components/layout/LiveTicker";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import StickyDonationRibbon from "./components/layout/StickyDonationRibbon";
import MobileBottomNav from "./components/layout/MobileBottomNav";
import LoadingScreen from "./components/layout/LoadingScreen";
import BackToTop from "./components/ui/BackToTop";
import { AnimatePresence, motion } from "framer-motion";
import CookieConsent from "./components/ui/CookieConsent";
import DonateChoiceOverlay from "./components/ui/DonateChoiceOverlay";
import { useEffect } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import Initiatives from "./pages/Initiatives";
import MedicalAid from "./pages/MedicalAid";
import EducationSupport from "./pages/EducationSupport";
import DonateMedical from "./pages/DonateMedical";
import DonateEducation from "./pages/DonateEducation";
import RegisterParent from "./pages/RegisterParent";
import TrackRegistration from "./pages/TrackRegistration";
import TrackDonation from "./pages/TrackDonation";
import DonorWall from "./pages/DonorWall";
import CSRPartnership from "./pages/CSRPartnership";
import VolunteerPortal from "./pages/VolunteerPortal";
import ApplyForSupport from "./pages/ApplyForSupport";
import Resources from "./pages/Resources";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";
import FAQ from "./pages/FAQ";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import ImpactReport from "./pages/ImpactReport";
import Updates from "./pages/Updates";
import SearchPage from "./pages/Search";
import TransparencyPage from "./pages/TransparencyPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("agsws_admin") === "true";
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

const queryClient = new QueryClient();

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="will-change-transform"
      >
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/initiatives" element={<Initiatives />} />
          <Route path="/initiatives/medical" element={<MedicalAid />} />
          <Route path="/initiatives/education" element={<EducationSupport />} />
          <Route path="/donate" element={<Navigate to="/donate/medical" replace />} />
          <Route path="/donate/medical" element={<DonateMedical />} />
          <Route path="/donate/education" element={<DonateEducation />} />
          <Route path="/register-parent" element={<RegisterParent />} />
          <Route path="/track" element={<TrackRegistration />} />
          <Route path="/track-donation" element={<TrackDonation />} />
          <Route path="/donor-wall" element={<DonorWall />} />
          <Route path="/csr" element={<CSRPartnership />} />
          <Route path="/volunteer-portal" element={<VolunteerPortal />} />
          <Route path="/apply" element={<ApplyForSupport />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/impact" element={<ImpactReport />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const AppInner = () => {
  useLenis();

  return (
    <>
      <LoadingScreen />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1A1D2E',
            color: '#FFFFFF',
            borderRadius: '10px',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif',
            padding: '12px 18px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            maxWidth: '360px',
          },
          success: {
            iconTheme: { primary: '#1F9AA8', secondary: '#FFFFFF' },
            duration: 3000,
          },
          error: {
            iconTheme: { primary: '#DC2626', secondary: '#FFFFFF' },
            duration: 4000,
          },
        }}
      />
      <BrowserRouter>
        <ScrollToTop />
        <DonateChoiceOverlay />
        <LiveTicker />
        <Navbar />
        <AnimatedRoutes />
        <Footer />
        <StickyDonationRibbon />
        <BackToTop />
        <MobileBottomNav />
        <CookieConsent />
      </BrowserRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <DonateOverlayProvider>
          <AppInner />
        </DonateOverlayProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
