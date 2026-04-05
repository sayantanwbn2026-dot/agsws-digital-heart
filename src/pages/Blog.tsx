import { useSEO } from "@/hooks/useSEO";
import { stories } from "@/data/stories";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FadeInUp from "@/components/ui/FadeInUp";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { ArrowRight, Clock, Calendar } from "lucide-react";

type ImgCategory = "medical" | "education" | "elderly" | "community" | "child" | "hospital" | "classroom";
const categoryMap: Record<string, ImgCategory> = {
  Medical: "medical", Education: "education", Community: "community",
  Report: "hospital", Elderly: "elderly",
};
const getCategory = (c: string): ImgCategory => categoryMap[c] ?? "community";

const categoryColors: Record<string, string> = {
  Medical: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]",
  Education: "bg-[hsl(242,29%,50%)]/10 text-[hsl(242,29%,50%)]",
  Community: "bg-[hsl(var(--accent))]/10 text-[hsl(28,22%,40%)]",
  Report: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]",
  Elderly: "bg-[hsl(28,22%,62%)]/10 text-[hsl(28,22%,40%)]",
};

const Blog = () => {
  useSEO("Blog", "AGSWS stories of impact — real stories from the field.");
  const featured = stories[0];
  const rest = stories.slice(1);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <main id="main-content">
      {/* Parallax Hero */}
      <section ref={heroRef} className="relative h-[380px] md:h-[440px] overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroY }} className="absolute inset-0 bg-gradient-to-br from-[hsl(187,68%,5%)] via-[hsl(187,68%,12%)] to-[hsl(187,70%,20%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }} />
        <svg className="absolute right-[5%] top-[15%] w-[400px] h-[400px] opacity-[0.04]" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="180" stroke="white" strokeWidth="0.5" fill="none" />
          <circle cx="200" cy="200" r="120" stroke="white" strokeWidth="0.5" fill="none" />
        </svg>
        <div className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))] mb-4"
          >
            From The Field
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Impact Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-white/50 mt-4 max-w-md mx-auto"
          >
            Real stories of transformation from the streets of Kolkata
          </motion.p>
        </div>
      </section>

      {/* Featured Story */}
      <section className="bg-[hsl(var(--background))] py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeInUp>
            <Link to={`/blog/${featured.slug}`} className="group block">
              <div className="relative rounded-2xl overflow-hidden bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm hover:shadow-lg transition-shadow duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-[280px] lg:h-[420px] overflow-hidden">
                    <ImagePlaceholder category={getCategory(featured.category)} className="w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 lg:to-transparent" />
                    <span className={`absolute top-5 left-5 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${categoryColors[featured.category] || "bg-[hsl(var(--accent))]/10 text-[hsl(var(--foreground))]"}`}>
                      {featured.category}
                    </span>
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--primary))] mb-4">Featured Story</span>
                    <div className="flex items-center gap-4 text-[11px] text-[hsl(var(--muted-foreground))] mb-4">
                      <span className="flex items-center gap-1"><Calendar size={11} /> {featured.date}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {featured.readTime}</span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-[hsl(var(--foreground))] mb-4 group-hover:text-[hsl(var(--primary))] transition-colors duration-300 leading-tight">
                      {featured.title}
                    </h2>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-6 line-clamp-3">
                      {featured.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[hsl(var(--primary))] text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                      Read Full Story <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </FadeInUp>

          {/* Story grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {rest.map((story, i) => (
              <FadeInUp key={story.slug} delay={i * 0.08}>
                <Link to={`/blog/${story.slug}`} className="group block h-full">
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-2xl overflow-hidden bg-[hsl(var(--card))] border border-[hsl(var(--border))] h-full flex flex-col shadow-sm"
                  >
                    <div className="relative h-[200px] overflow-hidden">
                      <ImagePlaceholder category={getCategory(story.category)} className="w-full h-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 ${categoryColors[story.category] || "bg-white/90 text-[hsl(var(--foreground))]"}`}>
                        {story.category}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-[11px] text-[hsl(var(--muted-foreground))] mb-3">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {story.date}</span>
                        {story.readTime && <span className="flex items-center gap-1"><Clock size={10} /> {story.readTime}</span>}
                      </div>
                      <h4 className="text-base font-bold text-[hsl(var(--foreground))] mb-2 line-clamp-2 group-hover:text-[hsl(var(--primary))] transition-colors duration-300">
                        {story.title}
                      </h4>
                      <p className="text-[13px] text-[hsl(var(--muted-foreground))] line-clamp-3 leading-relaxed flex-1">
                        {story.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 mt-5 text-[hsl(var(--primary))] text-[13px] font-semibold group-hover:gap-2.5 transition-all duration-300">
                        Read Story <ArrowRight size={12} />
                      </span>
                    </div>
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

export default Blog;
