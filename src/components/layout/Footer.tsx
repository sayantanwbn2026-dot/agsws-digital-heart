import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Heart, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import toast from "react-hot-toast";
import { useCMSSection } from "@/hooks/useCMSSection";
import { useCMSData } from "@/hooks/useCMSData";
import { isValidEmail, normalizeEmail } from "@/lib/validation";

const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  facebook: Facebook, twitter: Twitter, instagram: Instagram, linkedin: Linkedin, youtube: Youtube,
};

interface FooterContent {
  brand_tagline?: string;
  newsletter_heading?: string;
  newsletter_subtitle?: string;
  copyright_suffix?: string;
  explore_links?: { label: string; path: string }[];
  involved_links?: { label: string; path: string }[];
  impact_stats?: { value: string; label: string }[];
  legal_links?: { label: string; path: string }[];
}

const DEFAULT_CONTENT: FooterContent = {
  brand_tagline: "Serving families across Kolkata with medical aid, education, and emergency care since 2020.",
  newsletter_heading: "Stay Connected",
  newsletter_subtitle: "Get quarterly impact reports and field stories.",
  copyright_suffix: "Built with",
  explore_links: [
    { label: "Home", path: "/" }, { label: "About Us", path: "/about" },
    { label: "Initiatives", path: "/initiatives" }, { label: "Events", path: "/events" },
    { label: "Gallery", path: "/gallery" }, { label: "Blog", path: "/blog" },
    { label: "Resources", path: "/resources" }, { label: "Impact Report", path: "/impact" },
  ],
  involved_links: [
    { label: "Donate Medical Aid", path: "/donate/medical" }, { label: "Donate Education", path: "/donate/education" },
    { label: "GoldenAge Care", path: "/register-parent" }, { label: "Volunteer Portal", path: "/volunteer-portal" },
    { label: "CSR Partnership", path: "/csr" }, { label: "Donor Wall", path: "/donor-wall" },
    { label: "Apply for Support", path: "/apply" }, { label: "Transparency", path: "/transparency" },
  ],
  impact_stats: [
    { value: "2,400+", label: "Patients Aided" }, { value: "850+", label: "Students Sponsored" },
    { value: "120+", label: "Families Registered" }, { value: "₹48L+", label: "Funds Deployed" },
  ],
  legal_links: [
    { label: "Privacy Policy", path: "/privacy" }, { label: "Terms of Use", path: "/terms" },
    { label: "Refund Policy", path: "/refund" },
  ],
};

const SocialIcon = ({ icon: Icon, href, label }: { icon: typeof Facebook; href: string; label: string }) => (
  <motion.a
    href={href} target="_blank" rel="noopener noreferrer"
    whileHover={{ scale: 1.15, y: -2 }} whileTap={{ scale: 0.95 }}
    className="w-10 h-10 rounded-xl bg-white/[0.07] flex items-center justify-center hover:bg-[hsl(var(--primary))]/20 transition-colors duration-300 border border-white/[0.06]"
    aria-label={label}
  >
    <Icon size={16} className="text-white/80" />
  </motion.a>
);

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="group flex items-center gap-1.5 text-[13px] font-medium text-white/60 hover:text-white transition-colors duration-200"
  >
    <span className="group-hover:translate-x-1 transition-transform duration-200">{children}</span>
    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
  </Link>
);

const Footer = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: footerCMS } = useCMSSection<FooterContent>("footer", {});
  const { data: site } = useCMSData<any>("cms_site_settings", {});

  // Merge CMS content with defaults
  const c: FooterContent = {
    ...DEFAULT_CONTENT,
    ...footerCMS,
    explore_links: footerCMS?.explore_links?.length ? footerCMS.explore_links : DEFAULT_CONTENT.explore_links,
    involved_links: footerCMS?.involved_links?.length ? footerCMS.involved_links : DEFAULT_CONTENT.involved_links,
    impact_stats: footerCMS?.impact_stats?.length ? footerCMS.impact_stats : DEFAULT_CONTENT.impact_stats,
    legal_links: footerCMS?.legal_links?.length ? footerCMS.legal_links : DEFAULT_CONTENT.legal_links,
  };

  const socials = [
    { key: "facebook", url: site.social_facebook },
    { key: "twitter", url: site.social_twitter },
    { key: "instagram", url: site.social_instagram },
    { key: "linkedin", url: site.social_linkedin },
    { key: "youtube", url: site.social_youtube },
  ].filter(s => s.url);

  const contactItems = [
    site.contact_address && { icon: MapPin, text: site.contact_address },
    site.contact_phone && { icon: Phone, text: site.contact_phone },
    site.contact_email && { icon: Mail, text: site.contact_email },
  ].filter(Boolean) as { icon: typeof MapPin; text: string }[];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;
    const cleanEmail = normalizeEmail(email);
    if (!isValidEmail(cleanEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await (supabase.from('newsletter_subscriptions' as any) as any)
        .insert({ email: cleanEmail, source: 'footer' });
      // 23505 = unique_violation → already subscribed; treat as success.
      if (error && (error as any).code !== '23505') throw error;
      const alreadySubscribed = !!error && (error as any).code === '23505';
      supabase.functions.invoke('send-email', {
        body: { type: 'newsletter-welcome', to: cleanEmail, data: {} },
      }).catch(err => console.error('[newsletter welcome]', err));
      toast.success(alreadySubscribed ? "You're already subscribed — thanks!" : "Subscribed! Check your inbox.");
      setEmail("");
    } catch (err: any) {
      toast.error(err?.message || "Subscription failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer ref={ref} className="relative bg-[hsl(187,68%,5%)] text-white overflow-hidden">
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-[hsl(var(--primary))]/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-[hsl(var(--accent))]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Newsletter strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }} className="relative z-10 border-b border-white/[0.06]"
      >
        <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">{c.newsletter_heading}</h3>
            <p className="text-sm text-white/50 mt-1">{c.newsletter_subtitle}</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 md:w-[280px] bg-white/[0.06] border border-white/[0.1] rounded-l-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(var(--primary))]/40 transition-colors"
            />
            <button type="submit" disabled={submitting}
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(187,70%,34%)] text-white px-6 py-3 rounded-r-xl text-sm font-semibold transition-colors whitespace-nowrap disabled:opacity-60"
            >
              {submitting ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }} className="lg:col-span-4"
          >
            <div className="flex flex-col gap-0.5 mb-5">
              <span className="text-xl font-extrabold tracking-tight text-white">{site.site_name || "AGSWS"}</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium">Social Welfare Society</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-[260px] mb-6">
              {site.footer_tagline || c.brand_tagline}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3 mb-8">
                {socials.map(s => {
                  const Icon = SOCIAL_ICONS[s.key];
                  return Icon ? <SocialIcon key={s.key} icon={Icon} href={s.url} label={s.key} /> : null;
                })}
              </div>
            )}
            {contactItems.length > 0 && (
              <div className="space-y-3">
                {contactItems.map(item => (
                  <div key={item.text} className="flex items-center gap-3 text-[13px] text-white/50">
                    <item.icon size={14} className="text-white/30 flex-shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Explore */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }} className="lg:col-span-3"
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--accent))] mb-6">Explore</h4>
            <div className="flex flex-col gap-3">
              {c.explore_links!.map(({ label, path }) => (
                <FooterLink key={path + label} to={path}>{label}</FooterLink>
              ))}
            </div>
          </motion.div>

          {/* Get Involved */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }} className="lg:col-span-3"
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--accent))] mb-6">Get Involved</h4>
            <div className="flex flex-col gap-3">
              {c.involved_links!.map(({ label, path }) => (
                <FooterLink key={path + label} to={path}>{label}</FooterLink>
              ))}
            </div>
          </motion.div>

          {/* Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }} className="lg:col-span-2"
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--accent))] mb-6">Impact</h4>
            <div className="space-y-5">
              {c.impact_stats!.map(stat => (
                <div key={stat.label}>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-white/40 flex items-center gap-1.5">
            © {new Date().getFullYear()} {site.site_name || "AGSWS"}. {c.copyright_suffix} <Heart size={10} className="text-red-400" /> in Kolkata.
          </p>
          <div className="flex gap-6">
            {c.legal_links!.map(({ label, path }) => (
              <Link key={path + label} to={path} className="text-[11px] text-white/40 hover:text-white/70 transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
