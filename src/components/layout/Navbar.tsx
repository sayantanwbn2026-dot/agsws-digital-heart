import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Rotating messages for announcement
  const [msgIndex, setMsgIndex] = useState(0);
  const messages = [
    "Active Campaign: Provide Emergency Medical Kits",
    "Support a Child's Education for a Year",
    "Join our Volunteer Network Today"
  ];
  useEffect(() => {
    const int = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 4000);
    return () => clearInterval(int);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
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

  const navLinks = [
    { label: t("nav.home") || "Home", path: "/" },
    { label: t("nav.about") || "About", path: "/about" },
    {
      label: t("nav.initiatives") || "Initiatives",
      path: "/initiatives",
      children: [
        { label: "Medical Aid", path: "/initiatives/medical" },
        { label: "Education Support", path: "/initiatives/education" },
      ],
    },
    { label: t("nav.events") || "Events", path: "/events" },
    { label: t("nav.resources") || "Resources", path: "/resources" },
    { label: t("nav.blog") || "Blog", path: "/blog" },
    { label: t("nav.register") || "Register", path: "/register-parent" },
    { label: t("nav.contact") || "Contact", path: "/contact" },
  ];

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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

  const textColor = scrolled || !isHome ? "text-[var(--dark)]" : "text-white";
  const logoText = scrolled || !isHome ? "text-[var(--teal)]" : "text-white";
  const logoSub = scrolled || !isHome ? "text-[var(--teal)] opacity-70" : "text-white opacity-70";
  const iconColor = scrolled || !isHome ? "var(--dark)" : "#ffffff";
  const burgerBg = scrolled || !isHome ? "bg-[var(--dark)]" : "bg-white";

  return (
    <>
      {/* Announcement Bar */}
      <div className="h-[36px] bg-[var(--teal-dark)] text-white flex items-center justify-center sm:justify-between px-4 fixed top-0 w-full z-[60]">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse flex-shrink-0" />
          <span className="text-[12px] font-normal min-w-[280px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={msgIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {messages[msgIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
        <Link to="/register-parent" className="hidden sm:inline-block text-[var(--yellow)] text-[11px] font-semibold hover:underline tracking-wide">
          Register →
        </Link>
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
        <div className="max-w-[1200px] mx-auto px-4 md:px-[32px] w-full flex items-center justify-between h-[64px]">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 h-full" aria-label="AGSWS Home">
            <span className={`w-2 h-2 rounded-full inline-block flex-shrink-0 transition-colors duration-300 ${scrolled || !isHome ? 'bg-[var(--teal)]' : 'bg-white'}`} />
            <div className="flex flex-col gap-[1px] justify-center mt-1">
              <span className={`font-bold text-[18px] leading-none transition-colors duration-300 ${logoText}`} style={{ fontFamily: 'var(--font)' }}>
                AGSWS
              </span>
              <span className={`font-medium text-[9px] tracking-[0.12em] uppercase leading-none transition-colors duration-300 ${logoSub}`} style={{ fontFamily: 'var(--font)' }}>
                Social Welfare Society
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-[36px] h-full">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className={`flex items-center gap-[4px] text-[13px] font-medium transition-colors duration-180 hover:text-[var(--teal)] outline-none ${textColor}`}>
                    {link.label}
                    <motion.div
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={14} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="global-card absolute top-[52px] left-0 min-w-[220px] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] mt-2 p-[8px] flex flex-col gap-1"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className="flex items-center px-[16px] py-[10px] text-[13px] font-medium text-[var(--dark)] rounded-[var(--radius-md)] hover:bg-[var(--teal-light)] hover:text-[var(--teal)] border-l-[3px] border-transparent hover:border-l-[var(--teal)] transition-all duration-200"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div key={link.path} className="relative h-full flex items-center">
                  <Link
                    to={link.path}
                    className={`relative text-[13px] font-medium transition-colors duration-180 hover:text-[var(--teal)] outline-none ${
                      location.pathname === link.path ? "text-[var(--teal)]" : textColor
                    }`}
                  >
                    {link.label}
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute -bottom-[20px] left-0 right-0 h-[2px] bg-[var(--teal)] rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-[24px]">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="transition-transform hover:scale-110 outline-none"
              aria-label="Search"
            >
              <Search size={18} color={iconColor} className="transition-colors duration-300" />
            </button>
            <motion.button
              onClick={openOverlay}
              whileHover={{ scale: 1.03, boxShadow: "var(--shadow-yellow)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="bg-[var(--yellow)] text-[var(--dark)] font-semibold text-[13px] h-[38px] px-[20px] rounded-full border-none flex items-center justify-center whitespace-nowrap cursor-pointer"
            >
              {t("nav.donate")}
            </motion.button>
          </div>

          {/* Mobile Hamburger */}
          <div
            className="lg:hidden flex items-center justify-center w-[40px] h-[40px] cursor-pointer z-[9999]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <div className="relative w-[20px] h-[14px]">
              <span 
                className={`absolute left-0 w-[20px] h-[2px] rounded-[2px] transition-all duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${burgerBg}`}
                style={{
                  top: "0px",
                  transform: mobileOpen ? "translateY(6px) rotate(45deg)" : "none",
                  backgroundColor: mobileOpen ? "var(--dark)" : undefined
                }}
              />
              <span 
                className={`absolute left-0 top-[6px] w-[20px] h-[2px] rounded-[2px] transition-all duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${burgerBg}`}
                style={{
                  opacity: mobileOpen ? 0 : 1,
                  transform: mobileOpen ? "scaleX(0)" : "scaleX(1)",
                  backgroundColor: mobileOpen ? "var(--dark)" : undefined
                }}
              />
              <span 
                className={`absolute left-0 w-[20px] h-[2px] rounded-[2px] transition-all duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${burgerBg}`}
                style={{
                  top: "12px",
                  transform: mobileOpen ? "translateY(-6px) rotate(-45deg)" : "none",
                  backgroundColor: mobileOpen ? "var(--dark)" : undefined
                }}
              />
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="global-card absolute top-full left-0 right-0 shadow-[var(--shadow-lg)] z-40 border-0 rounded-none border-b border-[var(--border-color)]"
            >
              <form onSubmit={handleSearch} className="max-w-[800px] mx-auto relative flex items-center">
                <Search size={18} className="text-[var(--light)] absolute left-0" />
                <input placeholder=" "
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles, generic terms, or initiatives..."
                  autoFocus
                  className="w-full text-[16px] text-[var(--dark)] font-normal border-b-2 border-[var(--border-color)] focus:border-[var(--teal)] transition-colors py-3 pl-8 pr-8 outline-none bg-transparent"
                  style={{ fontFamily: 'var(--font)' }}
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="absolute right-0 text-[var(--light)] hover:text-[var(--dark)] transition-colors">
                  <X size={20} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu — slides from right */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-[rgba(0,0,0,0.45)] z-[9997]"
              onClick={() => setMobileOpen(false)}
              style={{ top: "36px" }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 280 }}
              className="fixed inset-y-0 right-0 w-[100vw] bg-white z-[9998] flex flex-col overflow-y-auto"
              style={{ top: "36px" }}
            >
              <div className="flex flex-col gap-6 px-6 pt-12 pb-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path || link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.055, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    {link.children ? (
                      <div className="flex flex-col gap-4">
                        <span className="text-[16px] font-semibold text-[var(--dark)] uppercase tracking-wider text-[11px]">{link.label}</span>
                        {link.children.map((child) => (
                          <Link 
                            key={child.path} 
                            to={child.path} 
                            onClick={() => setMobileOpen(false)}
                            className="text-[15px] font-medium text-[var(--mid)] hover:text-[var(--teal)] transition-colors pl-4 border-l-[3px] border-[var(--border-color)] hover:border-[var(--teal)] py-1"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link 
                        to={link.path} 
                        onClick={() => setMobileOpen(false)}
                        className="text-[16px] font-semibold text-[var(--dark)] hover:text-[var(--teal)] transition-colors block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.055, duration: 0.3 }}
                  className="mt-8"
                >
                  <button
                    onClick={() => { setMobileOpen(false); openOverlay(); }}
                    className="w-full bg-[var(--yellow)] text-[var(--dark)] font-semibold text-[15px] h-[48px] rounded-full border-none flex items-center justify-center shadow-[var(--shadow-sm)] active:scale-95 transition-transform"
                  >
                    {t("nav.donate")}
                  </button>
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
