import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock3, HeartPulse, MapPin, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";
import { useCMSList } from "@/hooks/useCMSList";
import ImagePlaceholder from "../ui/ImagePlaceholder";

const fallbackStory = {
  title: "How ₹5,000 Changed Ranu's Story",
  excerpt:
    "Ranu Mondal, 67, was alone when she needed emergency cardiac care. Her son registered her through AGSWS six months before.",
  content:
    "Within 2 hours of her collapse, our team had her admitted to a network hospital and kept her family informed until she was stable and recovering.",
  category: "Medical",
  image: null as string | null,
  slug: "ranu-mondal-emergency-care",
  published_at: "2025-01-15T00:00:00+00:00",
};

const timeline = [
  { icon: Clock3, label: "Alert received", detail: "Family activated the local care network" },
  { icon: HeartPulse, label: "Field team dispatched", detail: "Emergency coordination began immediately" },
  { icon: MapPin, label: "Hospital admitted", detail: "Network partner arranged fast intake" },
  { icon: CheckCircle2, label: "Family updated", detail: "Continuous status updates until recovery" },
];

const categoryToPlaceholder: Record<string, "medical" | "education" | "elderly" | "community" | "child" | "hospital" | "classroom"> = {
  Medical: "medical",
  Education: "classroom",
  Community: "community",
  Report: "community",
};

const formatDate = (value?: string | null) => {
  if (!value) return "Verified case study";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const ImpactStory = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { openOverlay } = useDonateOverlay();
  const { data: cmsStories } = useCMSList<any>("cms_stories", [], {
    filter: { column: "is_published", value: true },
    orderBy: { column: "published_at", ascending: false },
    limit: 1,
  });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], [26, -20]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-20, 24]);

  const featuredStory = cmsStories[0]
    ? {
        title: cmsStories[0].title || fallbackStory.title,
        excerpt: cmsStories[0].excerpt || fallbackStory.excerpt,
        content: cmsStories[0].content || fallbackStory.content,
        category: cmsStories[0].category || fallbackStory.category,
        image: cmsStories[0].image || null,
        slug: cmsStories[0].slug || fallbackStory.slug,
        published_at: cmsStories[0].published_at || cmsStories[0].created_at || fallbackStory.published_at,
      }
    : fallbackStory;

  const storyLink = featuredStory.slug ? `/blog/${featuredStory.slug}` : "/blog";
  const placeholderCategory = categoryToPlaceholder[featuredStory.category] || "community";

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 lg:py-28">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 18% 20%, hsl(var(--accent) / 0.12), transparent 24%), radial-gradient(circle at 82% 18%, hsl(var(--primary) / 0.16), transparent 30%), linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--primary) / 0.92), hsl(var(--foreground) / 0.96))`,
        }}
      />

      <div className="container relative z-10">
        <div className="grid items-stretch gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10">
          <motion.article
            style={{ y: leftY }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="overflow-hidden rounded-[32px] border border-background/10 bg-background/10 backdrop-blur-xl shadow-[var(--shadow-lg)]"
          >
            <div className="relative min-h-[360px] md:min-h-[460px]">
              {featuredStory.image ? (
                <img
                  src={featuredStory.image}
                  alt={featuredStory.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <ImagePlaceholder category={placeholderCategory} className="absolute inset-0 h-full w-full object-cover" label={featuredStory.category} />
              )}

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(var(--foreground) / 0.12) 0%, hsl(var(--foreground) / 0.28) 36%, hsl(var(--foreground) / 0.92) 100%)",
                }}
              />

              <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-background/10 bg-background/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-background/75 backdrop-blur-xl">
                {featuredStory.category} · {formatDate(featuredStory.published_at)}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10">
                <h2 className="max-w-none text-[clamp(2rem,4vw,3.3rem)] font-black leading-[1.02] tracking-[-0.04em] text-background">
                  {featuredStory.title}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-background/72">
                  {featuredStory.excerpt || featuredStory.content}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    to={storyLink}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-accent-foreground shadow-[var(--shadow-yellow)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Read full story
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={openOverlay}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-background/10 bg-background/10 px-7 py-3.5 text-sm font-semibold text-background/88 backdrop-blur-xl transition-colors duration-300 hover:bg-background/15"
                  >
                    Support similar care
                  </button>
                </div>
              </div>
            </div>
          </motion.article>

          <motion.aside
            style={{ y: rightY }}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="rounded-[28px] border border-background/10 bg-background/10 p-6 backdrop-blur-2xl shadow-[var(--shadow-lg)] md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-background/58">Case timeline</span>
                <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-background">Verified response flow</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <ShieldCheck size={20} />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.14 + index * 0.08, duration: 0.35 }}
                  className="flex items-start gap-4 rounded-2xl border border-background/10 bg-foreground/20 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-background/10 text-accent">
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-background">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-background/66">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { value: "2 hrs", label: "response" },
                { value: "Live", label: "family updates" },
                { value: "24/7", label: "care line" },
              ].map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-background/10 bg-background/10 p-4 text-center">
                  <p className="text-xl font-black tracking-[-0.03em] text-background">{metric.value}</p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-background/58">{metric.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-background/10 bg-foreground/25 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Why it matters</p>
              <p className="mt-2 text-sm leading-6 text-background/70">
                Every verified story becomes proof that coordinated donations can move from concern to care in a matter of hours.
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

export default ImpactStory;
