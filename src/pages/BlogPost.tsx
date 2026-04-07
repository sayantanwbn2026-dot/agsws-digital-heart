import { useParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { stories } from "@/data/stories";
import { motion, useScroll, useTransform } from "framer-motion";
import { Twitter, MessageCircle, Linkedin, Copy, ArrowLeft, Heart, Clock, User, TrendingUp, BookOpen } from "lucide-react";
import FadeInUp from "@/components/ui/FadeInUp";
import { useRef } from "react";

const colorMap: Record<string, string> = {
  teal: "var(--teal)",
  purple: "var(--purple)",
  beige: "var(--beige)",
};

const BlogPost = () => {
  const { slug } = useParams();
  const story = stories.find((s) => s.slug === slug);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  useSEO(story?.title || "Story", story?.excerpt || "");

  const relatedStories = stories.filter(s => s.slug !== slug).slice(0, 3);
  const accent = colorMap[story?.color || "teal"] || "var(--teal)";

  if (!story) {
    return <main id="main-content" className="min-h-screen flex items-center justify-center"><p className="text-[var(--mid)]">Story not found.</p></main>;
  }

  return (
    <main id="main-content" ref={containerRef}>
      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-[var(--border-color)] z-[9999]">
        <motion.div className="h-full origin-left" style={{ width: scaleX, backgroundColor: accent }} />
      </div>

      {/* Hero */}
      <motion.section style={{ y: heroY }} className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--dark)] via-[#1A1D2E] to-[var(--teal-dark)] opacity-95" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-[720px] mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-white/50 text-[13px] font-[500] mb-6 hover:text-white/80 transition-colors">
            <ArrowLeft size={14} /> Back to Stories
          </Link>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <span className="inline-block text-[11px] font-[600] uppercase tracking-[0.12em] px-3 py-1 rounded-full mb-4" style={{ backgroundColor: `${accent}20`, color: accent }}>{story.category}</span>
            <h1 className="text-[32px] lg:text-[44px] font-[800] text-white leading-[1.15] tracking-[-0.02em] mb-5">{story.title}</h1>
            <p className="text-white/60 text-[16px] leading-[1.7] mb-8">{story.excerpt}</p>
            <div className="flex items-center gap-5 text-[13px] text-white/40">
              <span className="flex items-center gap-1.5"><User size={13} /> {story.author}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} /> {story.readTime}</span>
              <span>{new Date(story.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Article Body */}
      <section className="bg-[var(--white)] py-16 lg:py-24">
        <div className="max-w-[680px] mx-auto px-6">
          <FadeInUp>
            <div className="prose-custom">
              <p className="text-[18px] leading-[1.9] text-[var(--dark)] mb-8 first-letter:text-[52px] first-letter:font-[800] first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                {story.body}
              </p>
              <p className="text-[16px] leading-[1.85] text-[var(--mid)] mb-8">
                This story represents one of the hundreds of lives AGSWS touches every year. Behind every statistic is a real person, a real family, and a real transformation made possible by the generosity of donors like you.
              </p>

              {/* Inline stat strip */}
              <div className="grid grid-cols-3 gap-4 my-12 py-8 border-y border-[var(--border-color)]">
                {[
                  { icon: Heart, label: "Lives Touched", value: "2,400+" },
                  { icon: TrendingUp, label: "Success Rate", value: "94%" },
                  { icon: BookOpen, label: "Programs Active", value: "12" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <s.icon size={20} className="mx-auto mb-2" style={{ color: accent }} />
                    <p className="text-[22px] font-[800] text-[var(--dark)]">{s.value}</p>
                    <p className="text-[11px] text-[var(--light)] uppercase tracking-[0.08em] font-[500]">{s.label}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-[24px] font-[700] text-[var(--dark)] mt-12 mb-4">Community Reception</h2>
              <blockquote className="relative pl-8 my-10">
                <div className="absolute left-0 top-0 bottom-0 w-[4px] rounded-full" style={{ backgroundColor: accent }} />
                <p className="text-[20px] font-[300] italic text-[var(--mid)] leading-[1.7]">
                  "Every donation, no matter how small, creates ripples that change lives across Kolkata."
                </p>
              </blockquote>
              <p className="text-[16px] leading-[1.85] text-[var(--mid)]">
                If you'd like to support families like this one, consider making a donation today. Every rupee goes directly to those who need it most.
              </p>
            </div>
          </FadeInUp>

          {/* Donate CTA */}
          <FadeInUp delay={0.2}>
            <motion.div whileHover={{ scale: 1.01 }} className="bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] rounded-[24px] p-10 mt-16 text-center shadow-[var(--shadow-lg)] relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
              <div className="relative">
                <h3 className="text-[24px] font-[700] text-white mb-3">Support stories like this one</h3>
                <p className="text-white/60 text-[14px] mb-6">Every rupee directly funds patient care and education programs.</p>
                <Link to="/donate/medical" className="inline-flex items-center gap-2 bg-[var(--yellow)] text-[var(--dark)] px-8 py-3.5 rounded-full font-[700] text-[14px] hover:shadow-[var(--shadow-yellow)] hover:scale-[1.03] transition-all">
                  Donate to this cause →
                </Link>
              </div>
            </motion.div>
          </FadeInUp>

          {/* Share */}
          <div className="flex items-center gap-3 mt-12 pt-8 border-t border-[var(--border-color)]">
            <span className="text-[13px] font-[600] text-[var(--mid)]">Share:</span>
            {[
              { Icon: Twitter, label: "Twitter" },
              { Icon: MessageCircle, label: "WhatsApp" },
              { Icon: Linkedin, label: "LinkedIn" },
              { Icon: Copy, label: "Copy" },
            ].map(({ Icon, label }) => (
              <motion.button key={label} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-10 h-10 rounded-2xl bg-[var(--bg)] flex items-center justify-center hover:bg-[var(--teal-light)] transition-colors text-[var(--mid)] hover:text-[var(--teal)]" aria-label={label}>
                <Icon size={16} />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Related Stories */}
      <section className="bg-[var(--bg)] py-16 lg:py-24">
        <div className="max-w-[var(--container)] mx-auto px-6">
          <h3 className="text-[24px] font-[700] text-[var(--dark)] mb-8">More Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedStories.map((s, i) => (
              <FadeInUp key={s.slug} delay={i * 0.08}>
                <Link to={`/blog/${s.slug}`}>
                  <motion.div whileHover={{ y: -4 }} className="bg-[var(--white)] rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6 h-full transition-all hover:shadow-[var(--shadow-lg)] group">
                    <span className="inline-block text-[10px] font-[600] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full mb-3" style={{ backgroundColor: `${colorMap[s.color]}15`, color: colorMap[s.color] }}>{s.category}</span>
                    <h4 className="text-[16px] font-[700] text-[var(--dark)] mb-2 group-hover:text-[var(--teal)] transition-colors leading-snug">{s.title}</h4>
                    <p className="text-[13px] text-[var(--mid)] leading-[1.6] line-clamp-2">{s.excerpt}</p>
                    <p className="text-[11px] text-[var(--light)] mt-3">{s.readTime}</p>
                  </motion.div>
                </Link>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPost;
