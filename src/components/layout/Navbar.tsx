import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Search, Heart, BookOpen, Handshake, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";
import { openCommandPalette } from "@/components/ui/CommandPalette";
import Magnetic from "@/components/ui/Magnetic";
import { prefetchRoute } from "@/lib/route-prefetch";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

  const [msgIndex, setMsgIndex] = useState(0);
  const messages = [
    "Active Campaign: Provide Emergency Medical Kits",
    "Support a Child's Education for a Year",
    "Join our Volunteer Network Today"
  ];
  useEffect(() => {
    const int = setInterval(() => setMsgIndex((i) => (i + 1) % messages.length), 4000);
    return () => clearInterval(int);
  }, []);

  const location = useLocation();
  const isHome = location.pathname === "/";
  const { t } = useLanguage();
  const { openOverlay } = useDonateOverlay();

  const { scrollY } = useScroll();
  const headerBg = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0)", "rgba(255,255,255,0.96)"]);
  const headerShadow = useTransform(scrollY, [0, 80], ["none", "0 1px 20px rgba(0,0,0,0.07)"]);
  const headerBlur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(12px)"]);

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v >= 80));
    return unsub;
  }, [scrollY]);

  const initiativeChildren = [
    { label: "Medical Aid", path: "/initiatives/medical", icon: Heart, desc: "Emergency care & hospital support" },
    { label: "Education Support", path: "/initiatives/education", icon: BookOpen, desc: "Scholarships & tutoring programs" },
    { label: "CSR Partnership", path: "/csr", icon: Handshake, desc: "Corporate social responsibility" },
    { label: "Volunteer Portal", path: "/volunteer-portal", icon: Award, desc: "Track hours & get certified" },
  ];

  const navLinks = [
    { label: t("nav.home") || "Home", path: "/" },
    { label: t("nav.about") || "About", path: "/about" },
    {
      label: t("nav.initiatives") || "Initiatives",
      path: "/initiatives",
      children: initiativeChildren,
    },
    { label: "Members", path: "/members" },
    { label: t("nav.events") || "Events", path: "/events" },
    { label: "Gallery", path: "/gallery" },
    { label: t("nav.blog") || "Blog", path: "/blog" },
    { label: t("nav.register") || "GoldenAge Care", path: "/register-parent" },
    { label: t("nav.contact") || "Contact", path: "/contact" },
  ];

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const textColor = scrolled || !isHome ? "text-[var(--dark)]" : "text-white";
  const logoText = scrolled || !isHome ? "text-[var(--teal)]" : "text-white";
  const logoSub = scrolled || !isHome ? "text-[var(--teal)] opacity-70" : "text-white opacity-70";
  const iconColor = scrolled || !isHome ? "var(--dark)" : "#ffffff";
  const burgerBg = scrolled || !isHome ? "bg-[var(--dark)]" : "bg-white";

  return (
    <>
      {/* Announcement Bar */}
      <div className="h-[36px] bg-[var(--teal-dark)] text-white flex items-center justify-center sm:justify-between px-3 sm:px-4 fixed top-0 w-full z-[60]">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap min-w-0">
          <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse flex-shrink-0" />
          <span className="text-[11px] sm:text-[12px] font-normal truncate">
            <AnimatePresence mode="wait">
              <motion.span key={msgIndex} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.3 }} className="inline-block">
                {messages[msgIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
        <Link to="/register-parent" className="hidden md:inline-block text-[var(--yellow)] text-[11px] font-semibold hover:underline tracking-wide flex-shrink-0 ml-3">GoldenAge Care →</Link>
      </div>

      <motion.nav
        className="fixed left-0 right-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-in-out"
        style={{
          top: "36px",
          backgroundColor: isHome ? headerBg : "rgba(255,255,255,0.96)",
          boxShadow: isHome ? headerShadow : "0 1px 20px rgba(0,0,0,0.07)",
          backdropFilter: isHome ? headerBlur : "blur(12px)",
          WebkitBackdropFilter: isHome ? headerBlur : "blur(12px)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 xl:px-8 w-full flex items-center justify-between h-[64px] gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0" aria-label="AGSWS Home">
            <span className={`w-2 h-2 rounded-full inline-block flex-shrink-0 transition-colors duration-300 ${scrolled || !isHome ? 'bg-[var(--teal)]' : 'bg-white'}`} />
            <div className="flex flex-col justify-center leading-none">
              <span className={`font-bold text-[17px] sm:text-[18px] leading-none transition-colors duration-300 ${logoText}`} style={{ fontFamily: 'var(--font)' }}>AGSWS</span>
              <span className={`font-medium text-[9px] tracking-[0.12em] uppercase leading-none mt-[3px] transition-colors duration-300 ${logoSub} hidden sm:inline`} style={{ fontFamily: 'var(--font)' }}>Social Welfare Society</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div
            className="hidden lg:flex items-center gap-0.5 xl:gap-1 h-full flex-1 justify-center min-w-0"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => { setDropdownOpen(true); setHovered(link.label); prefetchRoute(link.path); }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  {hovered === link.label && (
                    <motion.span
                      layoutId="navHoverPill"
                      className={`absolute inset-y-[14px] inset-x-0 rounded-full ${scrolled || !isHome ? "bg-[var(--teal-light)]" : "bg-white/10"}`}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <button className={`relative flex items-center gap-1 px-2.5 xl:px-3 text-[12.5px] xl:text-[13px] font-medium whitespace-nowrap transition-colors duration-180 hover:text-[var(--teal)] outline-none ${textColor}`}>
                    {link.label}
                    <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDown size={14} /></motion.div>
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-[52px] left-1/2 -translate-x-1/2 min-w-[320px] bg-white rounded-[10px] shadow-[0_12px_48px_rgba(0,0,0,0.12)] border border-[var(--border-color)] mt-2 p-3"
                      >
                        <div className="flex flex-col gap-0.5">
                          {link.children.map((child) => (
                            <Link
                              key={child.path}
                              to={child.path}
                              className="flex items-center gap-3 px-4 py-3 rounded-[8px] hover:bg-[var(--teal-light)] transition-colors group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-[var(--teal-light)] flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--teal)] transition-colors">
                                <child.icon size={16} className="text-[var(--teal)] group-hover:text-white transition-colors" />
                              </div>
                              <div>
                                <p className="text-[13px] font-[600] text-[var(--dark)] leading-tight">{child.label}</p>
                                <p className="text-[11px] text-[var(--light)] leading-tight mt-0.5">{child.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-[var(--border-color)] mt-2 pt-2 px-4">
                          <Link to="/initiatives" className="text-[12px] font-[600] text-[var(--teal)] hover:underline">View All Initiatives →</Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div
                  key={link.path}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => { setHovered(link.label); prefetchRoute(link.path); }}
                >
                  {hovered === link.label && (
                    <motion.span
                      layoutId="navHoverPill"
                      className={`absolute inset-y-[14px] inset-x-0 rounded-full ${scrolled || !isHome ? "bg-[var(--teal-light)]" : "bg-white/10"}`}
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <Link to={link.path} className={`relative px-2.5 xl:px-3 text-[12.5px] xl:text-[13px] font-medium whitespace-nowrap transition-colors duration-180 hover:text-[var(--teal)] outline-none ${location.pathname === link.path ? "text-[var(--teal)]" : textColor}`}>
                    {link.label}
                    {location.pathname === link.path && (
                      <motion.div layoutId="activeNavIndicator" className="absolute -bottom-[18px] left-2.5 right-2.5 h-[2px] bg-[var(--teal)] rounded-full" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                    )}
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            <button
              onClick={openCommandPalette}
              aria-label="Search — press Command or Control plus K"
              className={`group flex items-center gap-2 h-[34px] pl-3 pr-2 rounded-full border transition-colors duration-200 outline-none ${
                scrolled || !isHome
                  ? "border-[var(--border-color)] bg-[var(--bg)] hover:border-[var(--teal)]/40 hover:bg-white"
                  : "border-white/15 bg-white/[0.06] hover:bg-white/[0.12]"
              }`}
            >
              <Search size={15} className="transition-colors duration-300" style={{ color: iconColor, opacity: 0.75 }} />
              <span className={`text-[12px] font-medium hidden xl:inline ${scrolled || !isHome ? "text-[var(--light)]" : "text-white/60"}`}>
                Search
              </span>
              <span
                className={`hidden xl:flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                  scrolled || !isHome
                    ? "bg-white border border-[var(--border-color)] text-[var(--light)]"
                    : "bg-white/10 border border-white/15 text-white/60"
                }`}
              >
                {isMac ? "⌘" : "Ctrl"} K
              </span>
            </button>

            <Magnetic strength={4}>
              <motion.button
                onClick={openOverlay}
                whileHover={{ scale: 1.03, boxShadow: "var(--shadow-yellow)" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="bg-[var(--yellow)] text-[var(--dark)] font-semibold text-[12.5px] xl:text-[13px] h-[36px] xl:h-[38px] px-4 xl:px-5 rounded-full border-none flex items-center justify-center whitespace-nowrap cursor-pointer"
              >
                {t("nav.donate")}
              </motion.button>
            </Magnetic>
          </div>

          {/* Mobile Right */}
          <div className="lg:hidden flex items-center gap-1 flex-shrink-0">
            <button
              onClick={openCommandPalette}
              aria-label="Search"
              className="flex items-center justify-center w-[40px] h-[40px] outline-none"
            >
              <Search size={19} color={mobileOpen ? "var(--dark)" : iconColor} className="transition-colors duration-300" />
            </button>

          {/* Mobile Hamburger */}
          <div className="flex items-center justify-center w-[40px] h-[40px] cursor-pointer z-[9999]" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
            <div className="relative w-[20px] h-[14px]">
              <span className={`absolute left-0 w-[20px] h-[2px] rounded-[2px] transition-all [transition-duration:280ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${burgerBg}`} style={{ top: "0px", transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none", backgroundColor: mobileOpen ? "var(--dark)" : undefined }} />
              <span className={`absolute left-0 top-[6px] w-[20px] h-[2px] rounded-[2px] transition-all [transition-duration:280ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${burgerBg}`} style={{ opacity: mobileOpen ? 0 : 1, transform: mobileOpen ? "scaleX(0)" : "scaleX(1)", backgroundColor: mobileOpen ? "var(--dark)" : undefined }} />
              <span className={`absolute left-0 w-[20px] h-[2px] rounded-[2px] transition-all [transition-duration:280ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] ${burgerBg}`} style={{ top: "12px", transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none", backgroundColor: mobileOpen ? "var(--dark)" : undefined }} />
            </div>
          </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 bg-[rgba(0,0,0,0.45)] z-[9997]" onClick={() => setMobileOpen(false)} style={{ top: "36px" }} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 32, stiffness: 280 }} className="fixed inset-y-0 right-0 w-[100vw] bg-white z-[9998] flex flex-col overflow-y-auto" style={{ top: "36px" }}>
              <div className="flex flex-col px-5 pt-6 pb-10">
                {/* Search shortcut — opens the same palette as ⌘K on desktop */}
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  onClick={() => { setMobileOpen(false); openCommandPalette(); }}
                  className="mb-5 flex h-[46px] w-full items-center gap-3 rounded-[10px] border border-[var(--border-color)] bg-[var(--bg)] px-4 text-left press"
                >
                  <Search size={17} className="text-[var(--light)]" />
                  <span className="text-[14px] text-[var(--light)]">Search pages and actions…</span>
                </motion.button>

                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.div key={link.path || link.label} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 + i * 0.045, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}>
                      {link.children ? (
                        <div className="flex flex-col gap-1 py-2">
                          <span className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--light)]">{link.label}</span>
                          {link.children.map((child) => (
                            <Link key={child.path} to={child.path} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[15px] font-medium text-[var(--mid)] transition-colors active:bg-[var(--teal-light)]">
                              <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--teal-light)]">
                                <child.icon size={15} className="text-[var(--teal)]" />
                              </span>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <Link
                          to={link.path}
                          onClick={() => setMobileOpen(false)}
                          className={`block rounded-[8px] px-3 py-3 text-[16px] font-semibold transition-colors active:bg-[var(--teal-light)] ${
                            location.pathname === link.path ? "bg-[var(--teal-light)] text-[var(--teal)]" : "text-[var(--dark)]"
                          }`}
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: navLinks.length * 0.045, duration: 0.3 }} className="mt-7 flex flex-col gap-2.5">
                  <button onClick={() => { setMobileOpen(false); openOverlay(); }} className="press flex h-[50px] w-full items-center justify-center rounded-full border-none bg-[var(--yellow)] text-[15px] font-semibold text-[var(--dark)] shadow-[var(--shadow-yellow)]">
                    {t("nav.donate")}
                  </button>
                  <Link to="/apply" onClick={() => setMobileOpen(false)} className="press flex h-[50px] w-full items-center justify-center rounded-full border border-[var(--border-color)] text-[15px] font-semibold text-[var(--dark)]">
                    Apply for Support
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
