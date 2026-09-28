import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
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
import PreviewBar from "./components/layout/PreviewBar";
import BackToTop from "./components/ui/BackToTop";
import { AnimatePresence, motion } from "framer-motion";
import CookieConsent from "./components/ui/CookieConsent";
import DonateChoiceOverlay from "./components/ui/DonateChoiceOverlay";
import CommandPalette from "./components/ui/CommandPalette";
import ScrollProgress from "./components/ui/ScrollProgress";
import RouteFallback from "./components/ui/RouteFallback";
import { useCardSpotlight } from "@/hooks/useCardSpotlight";
import { registerRoute, prefetchWhenIdle } from "@/lib/route-prefetch";
import ErrorBoundary from "./components/ErrorBoundary";
import { useEffect, useState, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { syncPreviewFromURL } from "@/lib/cms-preview";
// Home ships in the entry chunk: it's the landing page for most visitors, so
// making it wait on a second round-trip would cost LCP for no benefit.
import Home from "./pages/Home";

/**
 * Split a route out of the entry bundle and register its loader for prefetching.
 * Visitors on a slow connection — which is most of the people this site is for —
 * should not download the receipt generator, the events calendar and the admin
 * CMS just to read the homepage.
 */
const page = <T extends { default: React.ComponentType<unknown> }>(
  path: string,
  loader: () => Promise<T>
) => {
  registerRoute(path, loader);
  return lazy(loader);
};

const About = page("/about", () => import("./pages/About"));
const Initiatives = page("/initiatives", () => import("./pages/Initiatives"));
const MedicalAid = page("/initiatives/medical", () => import("./pages/MedicalAid"));
const EducationSupport = page("/initiatives/education", () => import("./pages/EducationSupport"));
const DonateMedical = page("/donate/medical", () => import("./pages/DonateMedical"));
const DonateEducation = page("/donate/education", () => import("./pages/DonateEducation"));
const RegisterParent = page("/register-parent", () => import("./pages/RegisterParent"));
const TrackRegistration = page("/track", () => import("./pages/TrackRegistration"));
const TrackDonation = page("/track-donation", () => import("./pages/TrackDonation"));
const DonorWall = page("/donor-wall", () => import("./pages/DonorWall"));
const CSRPartnership = page("/csr", () => import("./pages/CSRPartnership"));
const VolunteerPortal = page("/volunteer-portal", () => import("./pages/VolunteerPortal"));
const ApplyForSupport = page("/apply", () => import("./pages/ApplyForSupport"));
const Resources = page("/resources", () => import("./pages/Resources"));
const Blog = page("/blog", () => import("./pages/Blog"));
const BlogPost = page("/blog/:slug", () => import("./pages/BlogPost"));
const Contact = page("/contact", () => import("./pages/Contact"));
const ThankYou = page("/thank-you", () => import("./pages/ThankYou"));
const DonationComplete = page("/donation-complete", () => import("./pages/DonationComplete"));
const DonationCancelled = page("/donation-cancelled", () => import("./pages/DonationCancelled"));
const EventRegistration = page("/events/register", () => import("./pages/EventRegistration"));
const FAQ = page("/faq", () => import("./pages/FAQ"));
const Events = page("/events", () => import("./pages/Events"));
const Gallery = page("/gallery", () => import("./pages/Gallery"));
const Members = page("/members", () => import("./pages/Members"));
const ImpactReport = page("/impact", () => import("./pages/ImpactReport"));
const Updates = page("/updates", () => import("./pages/Updates"));
const SearchPage = page("/search", () => import("./pages/Search"));
const TransparencyPage = page("/transparency", () => import("./pages/TransparencyPage"));
const SystemHealth = page("/system/health", () => import("./pages/SystemHealth"));
const AdminLogin = page("/admin/login", () => import("./pages/admin/AdminLogin"));
const AdminDashboard = page("/admin", () => import("./pages/admin/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = page("/privacy", () => import("./pages/legal/PrivacyPolicy"));
const TermsOfUse = page("/terms", () => import("./pages/legal/TermsOfUse"));
const RefundPolicy = page("/refund", () => import("./pages/legal/RefundPolicy"));

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

// Scroll to top on route change.
// When Lenis smooth-scroll is active it keeps its OWN internal scroll
// position, so a bare window.scrollTo leaves the two out of sync (the page
// snaps back on the next wheel/touch). Reset Lenis directly when present, and
// always fall back to native scroll so reduced-motion users (Lenis disabled)
// still land at the top.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    // Suspense sits OUTSIDE AnimatePresence on purpose. With it nested inside
    // the keyed child, `mode="wait"` deadlocks against lazy routes: it holds the
    // incoming child back until the outgoing exit finishes, that child suspends
    // on its chunk, and the swap never completes — the URL changes but the old
    // page stays on screen. Hoisting the boundary lets the fallback replace the
    // whole animated area while the chunk loads.
    <Suspense fallback={<RouteFallback />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14, scale: 0.99, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
          exit={{ opacity: 0, y: -10, scale: 0.99, filter: "blur(4px)" }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          className="will-change-transform"
        >
        <Routes location={location}>
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
          <Route path="/donation-cancelled" element={<DonationCancelled />} />
          <Route path="/events/register" element={<EventRegistration />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/members" element={<Members />} />
          <Route path="/impact" element={<ImpactReport />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/transparency" element={<TransparencyPage />} />
          <Route path="/system/health" element={<SystemHealth />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </motion.div>
      </AnimatePresence>
    </Suspense>
  );
};

const AppLayout = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      {/* Keyboard users can jump the fixed header + full nav on every page.
          The `.skip-to-main` styles already existed; nothing rendered one. */}
      {!isAdmin && (
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
      )}
      {!isAdmin && <ScrollProgress />}
      {!isAdmin && <PreviewBar />}
      {!isAdmin && <DonateChoiceOverlay />}
      {!isAdmin && <CommandPalette />}
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
  useCardSpotlight();

  useEffect(() => {
    syncPreviewFromURL();
  }, []);

  // Warm the routes visitors reach most often once the main thread settles, so
  // the first navigation after landing feels instant despite the code split.
  useEffect(() => {
    prefetchWhenIdle([
      "/donate/medical",
      "/about",
      "/initiatives",
      "/register-parent",
      "/contact",
    ]);
  }, []);

  return (
    <>
      <LoadingScreen />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1A1D2E',
            color: '#FFFFFF',
            borderRadius: '8px',
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
          <ErrorBoundary>
            <AppInner />
          </ErrorBoundary>
        </DonateOverlayProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
