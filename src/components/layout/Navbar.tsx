import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import DonateButton from "../ui/DonateButton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { language, setLanguage, t } = useLanguage();
  const { openOverlay } = useDonateOverlay();

  const { scrollY, scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const shadowOpacity = useTransform(scrollY, [0, 80], [0, 0.08]);
  const navBg = useMotionTemplate`rgba(255,255,255,${bgOpacity})`;
  const navShadow = useMotionTemplate`0 1px 20px rgba(0,0,0,${shadowOpacity})`;

  // Text color switches at threshold
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 60));
    return unsub;
  }, [scrollY]);

  const navLinks = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.about"), path: "/about" },
    {
      label: t("nav.initiatives"),
      path: "/initiatives",
      children: [
        { label: "Medical Aid", path: "/initiatives/medical" },
        { label: "Education Support", path: "/initiatives/education" },
      ],
    },
    { label: t("nav.events"), path: "/events" },
    { label: t("nav.resources"), path: "/resources" },
    { label: t("nav.blog"), path: "/blog" },
    { label: t("nav.register"), path: "/register-parent" },
    { label: t("nav.contact"), path: "/contact" },
  ];

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const textColor = scrolled || !isHome ? "text-text-dark" : "text-primary-foreground";
  const logoColor = scrolled || !isHome ? "text-teal" : "text-primary-foreground";

  return (
    <>
      <a href="#main-content" className="skip-to-main">Skip to main content</a>

      {/* Top info strip */}
      <div className="bg-teal-dark h-6 flex items-center px-4 sm:px-6 z-[60] relative">
        <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
          <span className="text-[10px] text-primary-foreground/60 hidden sm:inline">Est. 2020 · Kolkata, West Bengal · Registered NGO</span>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-primary-foreground/60 hidden sm:inline">+91 98765 43210 | info@agsws.org</span>
            <div className="flex items-center bg-white/10 rounded-full overflow-hidden">
              <button onClick={() => setLanguage("en")} className={`text-[10px] font-medium px-2 py-0.5 transition-colors ${language === "en" ? "bg-teal text-white" : "text-white/60"}`}>EN</button>
              <button onClick={() => setLanguage("bn")} className={`text-[10px] font-medium px-2 py-0.5 transition-colors ${language === "bn" ? "bg-teal text-white" : "text-white/60"}`}>বাং</button>
            </div>
          </div>
        </div>
      </div>

      <motion.nav
        className="fixed top-6 left-0 right-0 z-50 transition-colors duration-300"
        style={{
          backgroundColor: isHome ? navBg : "rgba(255,255,255,1)",
          boxShadow: isHome ? navShadow : "0 1px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex items-center justify-between h-[64px] sm:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex flex-col" aria-label="AGSWS Home">
            <div className={`flex items-center gap-2 ${logoColor}`}>
              <span className="w-2 h-2 rounded-full bg-teal inline-block" />
              <span className="font-bold text-lg sm:text-xl tracking-tight">AGSWS</span>
            </div>
            <span className={`text-[10px] font-medium tracking-[0.15em] uppercase ml-4 ${scrolled || !isHome ? "text-text-mid" : "text-primary-foreground/70"}`}>
              Social Welfare Society
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className={`flex items-center gap-1 text-sm font-medium transition-colors duration-150 hover:text-teal ${textColor}`}>
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-52 bg-card rounded-xl shadow-brand-lg border border-border overflow-hidden"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="flex items-center px-4 py-3 text-sm font-medium text-text-dark hover:bg-teal-light border-l-2 border-transparent hover:border-l-teal transition-all duration-200"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-sm font-medium transition-colors duration-150 hover:text-teal ${textColor}`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-teal"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              )
            )}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2 rounded-full hover:bg-teal-light transition-colors ${textColor}`}
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <DonateButton className="px-6 py-2.5 text-sm" onClick={openOverlay}>
              {t("nav.donate")}
            </DonateButton>
          </div>

          {/* Mobile Hamburger — animated bars */}
          <button
            className={`lg:hidden z-[9999] flex flex-col justify-center items-center w-10 h-10 gap-[6px] ${textColor}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${mobileOpen ? "rotate-45 translate-y-[8px] bg-text-dark" : scrolled || !isHome ? "bg-text-dark" : "bg-primary-foreground"}`} />
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${mobileOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"} ${scrolled || !isHome ? "bg-text-dark" : "bg-primary-foreground"}`} />
            <span className={`block w-5 h-[2px] rounded-full transition-all duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${mobileOpen ? "-rotate-45 -translate-y-[8px] bg-text-dark" : scrolled || !isHome ? "bg-text-dark" : "bg-primary-foreground"}`} />
          </button>
        </div>

        {/* Scroll progress bar */}
        <motion.div className="h-[2px] bg-teal origin-left" style={{ width: progressWidth }} />

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -80, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute top-full left-0 right-0 bg-card shadow-brand-lg h-20 flex items-center px-6"
            >
              <form onSubmit={handleSearch} className="max-w-[600px] mx-auto w-full">
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search stories, campaigns, events, FAQs..."
                  autoFocus
                  className="w-full text-lg text-text-dark border-b-2 border-teal bg-transparent outline-none py-2 placeholder:text-text-light"
                />
              </form>
              <button onClick={() => setSearchOpen(false)} className="absolute right-6 text-text-light hover:text-text-dark">
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu — slides from right */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="fixed inset-0 bg-black/45 z-[9997]"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 32, stiffness: 280, mass: 0.8 }}
                className="fixed inset-y-0 right-0 w-full max-w-sm bg-card z-[9998] flex flex-col overflow-y-auto"
              >
                <div className="absolute top-20 right-10 w-[300px] h-[300px] rounded-full bg-teal/[0.06] blur-3xl pointer-events-none" />
                <div className="flex flex-col gap-5 px-8 pt-24 pb-8">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.path || link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.055, duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      {link.children ? (
                        <div className="flex flex-col gap-2">
                          <span className="text-lg font-semibold text-text-dark">{link.label}</span>
                          {link.children.map((child) => (
                            <Link key={child.path} to={child.path} className="text-base text-text-mid hover:text-teal transition-colors pl-4">
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link to={link.path} className="text-lg font-semibold text-text-dark hover:text-teal transition-colors block">
                          {link.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.28 }}
                  >
                    <DonateButton className="px-8 py-3 text-base w-full" onClick={() => { setMobileOpen(false); openOverlay(); }}>
                      {t("nav.donate")}
                    </DonateButton>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
