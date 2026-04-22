import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import DonationComplete from "./pages/DonationComplete";
import EventRegistration from "./pages/EventRegistration";
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
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfUse from "./pages/legal/TermsOfUse";
import RefundPolicy from "./pages/legal/RefundPolicy";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Two-step check: a token must exist locally AND it must validate server-side.
  // The localStorage flag alone is not trusted — server validation is required
  // before rendering any admin UI. If validation fails, we wipe local state and
  // redirect to login.
  const [state, setState] = useState<"checking" | "ok" | "fail">("checking");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("agsws_admin_token") || "";
    if (!token) {
      setState("fail");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await supabase.functions.invoke("cms-auth", {
          body: { verify: true },
          headers: { Authorization: `Bearer ${token}` },
        });
        if (cancelled) return;
        if (res.data?.valid) {
          setState("ok");
        } else {
          localStorage.removeItem("agsws_admin");
          localStorage.removeItem("agsws_admin_token");
          setState("fail");
        }
      } catch {
        if (!cancelled) setState("fail");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state === "fail") {
      navigate("/admin/login", { replace: true });
    }
  }, [state, navigate]);

  if (state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Verifying admin session…
      </div>
    );
  }
  if (state === "fail") return null;
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
          <Route path="/donation-complete" element={<DonationComplete />} />
          <Route path="/events/register" element={<EventRegistration />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/impact" element={<ImpactReport />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const AppLayout = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <DonateChoiceOverlay />}
      {!isAdmin && <LiveTicker />}
      {!isAdmin && <Navbar />}
      <AnimatedRoutes />
      {!isAdmin && <Footer />}
      {!isAdmin && <StickyDonationRibbon />}
      {!isAdmin && <BackToTop />}
      {!isAdmin && <MobileBottomNav />}
      {!isAdmin && <CookieConsent />}
    </>
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
        <AppLayout />
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
