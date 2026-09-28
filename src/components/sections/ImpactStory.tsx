import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, CheckCircle, Quote } from "lucide-react";
import FadeInUp from "../ui/FadeInUp";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";
import { useCMSSection } from "@/hooks/useCMSSection";
import { useCMSList } from "@/hooks/useCMSList";

// Fallback content, shown only when no blog post is flagged as the impact
// story yet. Kept editable through the cms_sections.impact_story row.
const defaultData = {
  badge: "Impact Story",
  headline: "How ₹5,000 Changed Ranu's Story",
  description:
    "Ranu Mondal, 67, from North Kolkata, was alone when she needed emergency cardiac care. Her son in Bengaluru had registered her through AGSWS six months before. Within 2 hours of her collapse, our team had her admitted at a network hospital — and she made a full recovery.",
  verified_date: "15 Jan 2025",
};

const ImpactStory = () => {
  const sectionRef = useRef(null);
  const { openOverlay } = useDonateOverlay();
  const { data } = useCMSSection<typeof defaultData>("impact_story", defaultData);

  // The homepage spotlight is now driven by whichever blog post the admin
  // flags as the Impact Story (max 1). If none is flagged — or the column
  // isn't present yet — useCMSList resolves to [] and we fall back to the
  // editable cms_section content above, so the section never renders empty.
  const { data: impactBlogs } = useCMSList<any>("cms_blog_posts", [], {
    filter: { column: "is_impact_story", value: true },
    limit: 1,
  });
  const blog = impactBlogs[0];

  const story = blog
    ? {
        headline: blog.title as string,
        description: (blog.excerpt as string) || "",
        image: (blog.image as string) || "",
        href: `/blog/${blog.slug}`,
        meta: blog.published_at
          ? new Date(blog.published_at).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "AGSWS Verified",
      }
    : {
        headline: data.headline,
        description: data.description,
        image: "",
        href: "/blog",
        meta: `AGSWS Verified · ${data.verified_date}`,
      };

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const leftY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const rightY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="bg-gradient-to-br from-[#0D1B1C] via-[var(--teal-dark)] to-[#0F1F20] relative">
        <svg className="absolute right-[-5%] top-[-10%] w-[500px] h-[500px] opacity-[0.04] pointer-events-none" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="200" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="250" cy="250" r="140" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>

        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] py-[80px] lg:py-[120px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text column */}
            <motion.div style={{ y: leftY }} className="will-change-transform order-2 lg:order-1">
              <FadeInUp>
                <span className="inline-flex items-center gap-2 bg-white/[0.08] text-white/80 text-[11px] font-[600] uppercase tracking-[0.1em] px-4 py-1.5 rounded-full border border-white/[0.1] mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--yellow)]" /> Impact Story
                </span>
                <h2 className="text-[clamp(28px,4vw,40px)] font-[800] text-white leading-[1.12] tracking-[-0.02em] mb-6 max-w-[540px]">
                  {story.headline}
                </h2>
                <p className="text-[16px] text-white/70 leading-[1.8] mb-8 max-w-[500px] line-clamp-5">
                  {story.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={story.href}
                    className="bg-[var(--yellow)] text-[var(--dark)] px-7 py-3 rounded-full font-[700] text-[14px] hover:shadow-[var(--shadow-yellow)] hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center gap-2"
                  >
                    Read Full Story <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={openOverlay}
                    className="border border-white/20 text-white px-7 py-3 rounded-full font-[600] text-[14px] hover:bg-white/[0.06] transition-all"
                  >
                    Donate Now
                  </button>
                </div>
              </FadeInUp>
            </motion.div>

            {/* Visual column */}
            <motion.div style={{ y: rightY }} className="will-change-transform order-1 lg:order-2">
              <FadeInUp delay={0.15}>
                <Link to={story.href} className="group block relative">
                  <div className="relative rounded-[var(--radius-2xl)] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.35)] bg-white/5">
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      {story.image ? (
                        <img
                          src={story.image}
                          alt={story.headline}
                          className="w-full h-full object-cover transition-transform [transition-duration:700ms] group-hover:scale-[1.05]"
                          loading="lazy"
                        />
                      ) : (
                        <ImagePlaceholder category="community" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                      {/* Quote flourish */}
                      <div className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/12 backdrop-blur-sm flex items-center justify-center border border-white/15">
                        <Quote size={18} className="text-white" />
                      </div>

                      {/* Verified footer chip */}
                      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur px-3.5 py-2 rounded-full text-[11px] font-[700] text-[var(--dark)] shadow-lg">
                          <CheckCircle size={13} className="text-[var(--teal)]" /> {story.meta}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-[700] text-white opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all">
                          Read <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeInUp>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStory;
