import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, HeartHandshake, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";
import { useCMSData } from "@/hooks/useCMSData";
import { useCMSList } from "@/hooks/useCMSList";

type HeroRecord = {
  headline: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  background_image: string | null;
};

const fallbackHero: HeroRecord = {
  headline: "Changing Lives, One Act of Compassion at a Time.",
  subtitle:
    "Providing medical aid, education support, and emergency care for families across Kolkata. Every rupee is mapped to real impact.",
  cta_text: "Donate Now",
  cta_link: "/donate",
  background_image: null,
};

const fallbackStats = [
  { value: "2,400+", label: "Patients aided" },
  { value: "850+", label: "Children educated" },
  { value: "120+", label: "Families registered" },
];

const trustPoints = ["80G-ready giving", "2-hour emergency coordination", "GoldenAge support in Kolkata"];

const isExternalLink = (link: string) => /^https?:\/\//i.test(link);
const isDonateLink = (link: string) => /donate/i.test(link);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { openOverlay } = useDonateOverlay();
  const { data: cmsHero } = useCMSData<HeroRecord>("cms_hero", fallbackHero);
  const { data: cmsStats } = useCMSList<any>("cms_stats", [], {
    orderBy: { column: "sort_order" },
    limit: 3,
  });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const opacityOut = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const hero = { ...fallbackHero, ...cmsHero };
  const stats = cmsStats.length
    ? cmsStats.slice(0, 3).map((item: any) => ({
        value: item.value || "0",
        label: item.label || "Impact",
      }))
    : fallbackStats;

  const headlineWords = hero.headline.trim().split(/\s+/).filter(Boolean);
  const accentStart = Math.max(headlineWords.length - 2, 0);
  const primaryLink = hero.cta_link || fallbackHero.cta_link;
  const primaryLabel = hero.cta_text || fallbackHero.cta_text;

  const primaryActionClasses =
    "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-bold text-accent-foreground shadow-[var(--shadow-yellow)] transition-transform duration-300 hover:-translate-y-0.5";
  const secondaryActionClasses =
    "inline-flex items-center justify-center gap-2 rounded-full border border-background/20 bg-background/10 px-8 py-4 text-sm font-semibold text-background/90 backdrop-blur-xl transition-colors duration-300 hover:bg-background/15";

  const renderPrimaryAction = () => {
    if (isDonateLink(primaryLink)) {
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openOverlay}
          className={primaryActionClasses}
        >
          {primaryLabel}
          <ArrowRight size={16} />
        </motion.button>
      );
    }

    if (isExternalLink(primaryLink)) {
      return (
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={primaryLink}
          target="_blank"
          rel="noreferrer"
          className={primaryActionClasses}
        >
          {primaryLabel}
          <ArrowRight size={16} />
        </motion.a>
      );
    }

    return (
      <Link to={primaryLink} className={primaryActionClasses}>
        {primaryLabel}
        <ArrowRight size={16} />
      </Link>
    );
  };

  return (
    <section ref={sectionRef} className="relative flex min-h-[100svh] items-center overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        {hero.background_image && (
          <img
            src={hero.background_image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 18% 18%, hsl(var(--accent) / 0.2), transparent 26%), radial-gradient(circle at 82% 16%, hsl(var(--primary) / 0.25), transparent 30%), linear-gradient(135deg, hsl(var(--foreground) / 0.92), hsl(var(--primary) / 0.78), hsl(var(--foreground) / 0.82))`,
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--background) / 0.12) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--background) / 0.12) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
      </motion.div>

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <motion.div style={{ y: contentY, opacity: opacityOut }} className="container relative z-10 py-28 lg:py-32 will-change-transform">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-background/10 bg-background/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-background/70 backdrop-blur-xl">
          <Sparkles size={12} className="text-accent" />
          Kolkata care network · CMS-powered launch
        </div>

        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
          <div className="max-w-3xl">
            <h1 className="max-w-none text-[clamp(3rem,8vw,7rem)] font-black leading-[0.95] tracking-[-0.05em] text-background">
              {headlineWords.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: index * 0.05, duration: 0.45 }}
                  className={`inline-block mr-3 ${index >= accentStart ? "text-accent" : "text-background"}`}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.45 }}
              className="mt-6 max-w-2xl text-[clamp(1rem,1.8vw,1.2rem)] leading-8 text-background/70"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.45 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              {renderPrimaryAction()}
              <Link to="/initiatives" className={secondaryActionClasses}>
                Explore initiatives
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {trustPoints.map((point, index) => (
                <span
                  key={point}
                  className="inline-flex items-center gap-2 rounded-full border border-background/10 bg-background/10 px-4 py-2 text-xs font-medium text-background/75 backdrop-blur-xl"
                >
                  {index === 0 ? <Shield size={13} className="text-accent" /> : <HeartHandshake size={13} className="text-accent" />}
                  {point}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="hidden lg:block"
          >
            <div className="rounded-[28px] border border-background/10 bg-background/10 p-6 backdrop-blur-2xl shadow-[var(--shadow-lg)]">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-background/60">
                <span className="inline-flex h-2 w-2 rounded-full bg-accent" />
                response network online
              </div>

              <div className="mt-6">
                <p className="text-5xl font-black tracking-[-0.05em] text-background">{stats[0]?.value}</p>
                <p className="mt-2 text-sm font-medium text-background/70">{stats[0]?.label}</p>
              </div>

              <div className="mt-6 space-y-3">
                {stats.slice(1).map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between rounded-2xl border border-background/10 bg-foreground/20 px-4 py-3">
                    <span className="text-sm text-background/65">{stat.label}</span>
                    <span className="text-lg font-bold text-background">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[22px] border border-background/10 bg-foreground/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">GoldenAge Care</p>
                <p className="mt-2 text-sm leading-6 text-background/70">
                  Emergency coordination, family updates, and on-ground support for elders living alone in Kolkata.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.08, duration: 0.45 }}
              className="rounded-[26px] border border-background/10 bg-background/10 p-5 backdrop-blur-xl"
            >
              <p className="text-[clamp(1.8rem,4vw,2.8rem)] font-black leading-none tracking-[-0.04em] text-background">
                {stat.value}
              </p>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-background/60">
                {stat.label}
              </p>
              <div className="mt-4 h-px w-full bg-background/10" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-background/35">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={15} className="text-background/35" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
