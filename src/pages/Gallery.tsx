import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSEO } from "@/hooks/useSEO";
import { galleryPhotos, galleryVideos } from "@/data/gallery";
import FadeInUp from "@/components/ui/FadeInUp";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight, X, Play, Camera, Film } from "lucide-react";

const categories = ["all", "medical", "education", "community", "elderly", "child", "hospital", "classroom"] as const;
const catLabels: Record<string, string> = {
  all: "All", medical: "Medical Camps", education: "Education Drives",
  community: "Community Events", elderly: "Field Work", child: "Children",
  hospital: "Hospital", classroom: "Classroom",
};

const Gallery = () => {
  useSEO("Photo & Video Gallery", "See AGSWS in action — photos and videos from our medical camps, education drives, and community events.");
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [view, setView] = useState<"photos" | "videos">("photos");
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const filtered = useMemo(() =>
    filter === "all" ? galleryPhotos : galleryPhotos.filter(p => p.category === filter),
    [filter]
  );

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const navigate = useCallback((dir: number) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + dir + filtered.length) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, navigate]);

  return (
    <main id="main-content">
      {/* Parallax Hero */}
      <section ref={heroRef} className="relative h-[380px] overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroY }} className="absolute inset-0 bg-gradient-to-br from-[hsl(187,68%,5%)] via-[hsl(187,68%,12%)] to-[hsl(242,29%,20%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }} />
        <div className="relative z-10 text-center px-6">
          <motion.span initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))] mb-4">
            Visual Stories
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Our Work in Pictures
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-sm text-white/50 mt-4">
            Every photograph is a story. Every story is a life.
          </motion.p>

          {/* Photo/Video toggle */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center gap-1 mt-8 bg-white/[0.06] backdrop-blur-sm rounded-full p-1 w-fit mx-auto border border-white/[0.08]">
            <button onClick={() => setView("photos")} className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${view === "photos" ? "bg-white text-[hsl(var(--foreground))]" : "text-white/60 hover:text-white"}`}>
              <Camera size={14} /> Photos
            </button>
            <button onClick={() => setView("videos")} className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${view === "videos" ? "bg-white text-[hsl(var(--foreground))]" : "text-white/60 hover:text-white"}`}>
              <Film size={14} /> Videos
            </button>
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {view === "photos" ? (
          <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Filters */}
            <div className="sticky top-[64px] z-30 bg-[hsl(var(--card))]/95 backdrop-blur-md border-b border-[hsl(var(--border))]">
              <div className="max-w-[1200px] mx-auto px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar">
                {categories.map(c => (
                  <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all duration-200 ${filter === c ? "bg-[hsl(var(--primary))] text-white shadow-sm" : "bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] border border-[hsl(var(--border))]"}`}>
                    {catLabels[c]}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Grid - Masonry */}
            <section className="bg-[hsl(var(--background))] py-12">
              <div className="max-w-[1200px] mx-auto px-6">
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                  {filtered.map((photo, i) => (
                    <FadeInUp key={photo.id} delay={(i % 6) * 0.03}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="mb-4 break-inside-avoid rounded-xl overflow-hidden relative group cursor-pointer"
                        onClick={() => openLightbox(i)}
                      >
                        <ImagePlaceholder category={photo.category} className="w-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-between p-4">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider">{photo.category}</span>
                            <motion.div whileHover={{ scale: 1.2 }}>
                              <ZoomIn size={18} className="text-white/80" />
                            </motion.div>
                          </div>
                          <p className="text-white text-[13px] font-medium">{photo.caption}</p>
                        </div>
                      </motion.div>
                    </FadeInUp>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div key="videos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <section className="bg-[hsl(var(--background))] py-16">
              <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {galleryVideos.map((v, i) => (
                    <FadeInUp key={v.id} delay={i * 0.1}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative rounded-2xl overflow-hidden group cursor-pointer bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm"
                      >
                        <div className="relative h-[260px] overflow-hidden">
                          <ImagePlaceholder category={v.thumbnailCategory} className="w-full h-full" />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <motion.div
                              whileHover={{ scale: 1.15 }}
                              className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg"
                            >
                              <Play size={22} className="text-[hsl(var(--primary))] ml-1" />
                            </motion.div>
                          </div>
                        </div>
                        <div className="p-5 flex justify-between items-center">
                          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{v.title}</span>
                          <span className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--background))] px-2.5 py-1 rounded-full">{v.duration}</span>
                        </div>
                      </motion.div>
                    </FadeInUp>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/[0.06] px-4 py-1.5 rounded-full text-white/50 text-[12px] font-medium backdrop-blur-sm">
              {lightboxIndex + 1} / {filtered.length}
            </div>
            <button className="absolute top-5 right-5 text-white/70 p-2.5 hover:bg-white/10 rounded-xl transition-colors" onClick={closeLightbox}><X size={22} /></button>
            <button className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/70 hover:bg-white/15 transition-colors backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); navigate(-1); }}><ChevronLeft size={22} /></button>
            <button className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/70 hover:bg-white/15 transition-colors backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); navigate(1); }}><ChevronRight size={22} /></button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="max-w-[85vw] max-h-[75vh]"
              onClick={e => e.stopPropagation()}
            >
              <ImagePlaceholder category={filtered[lightboxIndex].category} className="w-[500px] h-[375px] md:w-[700px] md:h-[500px] rounded-xl" />
            </motion.div>
            <p className="text-white/80 text-[14px] mt-5 max-w-lg text-center font-medium">{filtered[lightboxIndex].caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Gallery;
