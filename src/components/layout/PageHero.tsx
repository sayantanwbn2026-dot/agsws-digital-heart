import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  label?: string;
  title: string;
  subtitle?: string;
  bgVariant?: "teal" | "teal-dark" | "warm" | "purple" | "dark";
  breadcrumb?: BreadcrumbItem[];
  size?: "sm" | "md" | "lg";
  align?: "left" | "center";
  children?: ReactNode;
}

const bgGradients: Record<string, string> = {
  teal: "from-[#1F9AA8] to-[#156B75]",
  "teal-dark": "from-[#156B75] to-[#0D1B1C]",
  warm: "from-[#B6A388] to-[#1F9AA8]",
  purple: "from-[#5C5AA6] to-[#1F9AA8]",
  dark: "from-[#0F1F20] to-[#156B75]",
};

const sizePadding: Record<string, string> = {
  sm: "pt-[120px] pb-[48px]",
  md: "pt-[140px] pb-[64px]",
  lg: "pt-[160px] pb-[80px]",
};

const PageHero = ({
  label,
  title,
  subtitle,
  bgVariant = "teal",
  breadcrumb,
  size = "md",
  align = "left", // Note: User requested left alignment exclusively even if center is passed (ignoring custom align mostly, but I'll keep it local if ever requested)
  children,
}: PageHeroProps) => {
  return (
    <section className={`relative overflow-hidden ${sizePadding[size]} bg-gradient-to-br ${bgGradients[bgVariant]}`}>
      {/* GEOMETRIC ACCENTS */}
      <svg 
        className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] opacity-[0.10] pointer-events-none" 
        viewBox="0 0 300 300"
      >
        <circle cx="150" cy="150" r="140" stroke="var(--teal-light)" strokeWidth="2" fill="none" />
      </svg>
      <div className="absolute bottom-[-30px] left-[40px] w-[120px] h-[120px] rounded-full bg-[var(--teal-light)] opacity-[0.05] pointer-events-none" />

      {/* NOISE OVERLAY */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }} 
      />

      {/* CONTENT */}
      {/* Alignment explicitly left on desktop and left on mobile per spec */}
      <div className="relative z-10 w-full max-w-[var(--container)] mx-auto px-[16px] lg:px-[var(--container-px)] text-left flex flex-col items-start">
        
        {/* BREADCRUMB */}
        {breadcrumb && (
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0, ease: "easeOut" }}
            className="flex flex-row items-center gap-[8px] mb-[12px] flex-wrap"
            aria-label="Breadcrumb"
          >
            {breadcrumb.map((crumb, i) => {
              const isLast = i === breadcrumb.length - 1;
              return (
                <span key={i} className="flex items-center gap-[8px]">
                  {crumb.href ? (
                    <Link 
                      to={crumb.href} 
                      className="text-[12px] font-[400] text-white opacity-[0.65] hover:opacity-100 hover:underline transition-opacity"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={`text-[12px] font-[400] text-white ${isLast ? 'opacity-[0.90]' : 'opacity-[0.65]'}`}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && <span className="text-[12px] text-white opacity-[0.35]">/</span>}
                </span>
              );
            })}
          </motion.nav>
        )}

        {/* LABEL */}
        {label && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
            className="inline-block mb-[12px] bg-white/[0.12] border border-white/[0.20] rounded-[var(--radius-full)] px-[14px] py-[4px] text-[11px] font-[600] text-white uppercase tracking-[0.09em]"
          >
            {label}
          </motion.span>
        )}

        {/* TITLE H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14, ease: "easeOut" }}
          className="text-[clamp(28px,4vw,44px)] font-[700] text-white tracking-[-0.02em] leading-[1.15] max-w-[640px]"
        >
          {title}
        </motion.h1>

        {/* SUBTITLE */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22, ease: "easeOut" }}
            className="text-[clamp(14px,1.8vw,17px)] font-[400] text-white opacity-[0.82] leading-[1.65] mt-[12px] max-w-[520px]"
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6 w-full"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
