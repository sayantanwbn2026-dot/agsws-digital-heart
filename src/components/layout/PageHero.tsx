import { motion } from "framer-motion";
import { Home } from "lucide-react";
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
  teal: "from-[hsl(187,70%,39%)] to-[hsl(187,68%,27%)]",
  "teal-dark": "from-[hsl(187,68%,27%)] to-[hsl(187,68%,8%)]",
  warm: "from-[hsl(28,22%,62%)] to-[hsl(187,70%,39%)]",
  purple: "from-[hsl(242,29%,50%)] to-[hsl(187,70%,39%)]",
  dark: "from-[hsl(187,68%,10%)] to-[hsl(187,68%,27%)]",
};

const sizePadding: Record<string, string> = {
  sm: "pt-32 pb-12 sm:pt-36 sm:pb-14",
  md: "pt-36 pb-16 sm:pt-40 sm:pb-18",
  lg: "pt-40 pb-20 sm:pt-48 sm:pb-24",
};

const PageHero = ({
  label,
  title,
  subtitle,
  bgVariant = "teal",
  breadcrumb,
  size = "md",
  align = "left",
  children,
}: PageHeroProps) => {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <section className={`relative bg-gradient-to-br ${bgGradients[bgVariant]} overflow-hidden ${sizePadding[size]}`}>
      {/* Geometric accents */}
      <svg className="absolute -top-[60px] -right-[60px] w-[300px] h-[300px] opacity-10 pointer-events-none" viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="140" stroke="hsl(187,52%,93%)" strokeWidth="1" fill="none" />
      </svg>
      <div className="absolute -bottom-[30px] left-10 w-[120px] h-[120px] rounded-full bg-[hsl(187,52%,93%)]/5 pointer-events-none" />

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
      }} />

      <div className={`relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col ${alignClass}`}>
        {breadcrumb && (
          <motion.nav
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center gap-1.5 mb-4 flex-wrap"
            aria-label="Breadcrumb"
          >
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i === 0 && <Home size={12} className="text-primary-foreground/65" />}
                {crumb.href ? (
                  <Link to={crumb.href} className="text-xs text-primary-foreground/65 hover:text-primary-foreground hover:underline transition-opacity">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-xs text-primary-foreground/85">{crumb.label}</span>
                )}
                {i < breadcrumb.length - 1 && <span className="text-xs text-primary-foreground/35">/</span>}
              </span>
            ))}
          </motion.nav>
        )}

        {label && (
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="inline-block text-[11px] font-semibold uppercase tracking-[0.08em] text-primary-foreground bg-primary-foreground/15 border border-primary-foreground/20 rounded-full px-3.5 py-1 mb-3"
          >
            {label}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[clamp(28px,4vw,48px)] font-bold tracking-[-0.02em] leading-[1.15] text-primary-foreground"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            className="text-[clamp(14px,1.8vw,17px)] text-primary-foreground/80 leading-[1.65] max-w-[560px] mt-3"
          >
            {subtitle}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-4"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
