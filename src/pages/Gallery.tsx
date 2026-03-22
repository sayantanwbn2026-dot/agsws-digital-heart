import { useState, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { galleryPhotos, galleryVideos } from "@/data/gallery";
import FadeInUp from "@/components/ui/FadeInUp";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight, X, Play } from "lucide-react";
import { useEffect, useCallback } from "react";

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
      {/* Hero */}
      <section className="h-[280px] bg-gradient-to-br from-teal-dark via-teal to-teal-dark flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/30" />
        <div className="relative z-10 text-center">
          <h1 className="heading-1 text-primary-foreground">Our Work in Pictures</h1>
          <p className="text-base text-primary-foreground/70 mt-3">Every photograph is a story. Every story is a life.</p>
        </div>
      </section>

      {/* Filters */}
      <div className="sticky top-[108px] z-30 bg-card border-b border-border shadow-brand-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === c ? "bg-teal text-primary-foreground" : "bg-background text-text-mid hover:bg-teal-light"}`}>
              {catLabels[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      <section className="bg-background py-16">
        <div className="max-w-[1200px] mx-auto px-6" style={{ columnCount: 3, columnGap: "12px" }}>
          <style>{`@media(max-width:1024px){.gallery-grid{column-count:2!important}}@media(max-width:640px){.gallery-grid{column-count:1!important}}`}</style>
          <div className="gallery-grid" style={{ columnCount: 3, columnGap: "12px" }}>
            {filtered.map((photo, i) => (
              <FadeInUp key={photo.id} delay={(i % 6) * 0.03}>
                <div
                  className="mb-3 break-inside-avoid rounded-lg overflow-hidden relative group cursor-pointer"
                  onClick={() => openLightbox(i)}
                >
                  <ImagePlaceholder category={photo.category} className={`w-full`} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-semibold text-yellow bg-black/40 px-2 py-1 rounded-full uppercase">{photo.category}</span>
                      <ZoomIn size={20} className="text-white" />
                    </div>
                    <p className="text-white text-[13px] line-clamp-2">{photo.caption}</p>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="bg-card py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeInUp>
            <span className="label-text text-teal">From the Field</span>
            <h2 className="heading-2 text-text-dark mt-3 mb-10">Videos</h2>
          </FadeInUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryVideos.map(v => (
              <FadeInUp key={v.id}>
                <div className="relative rounded-xl overflow-hidden group cursor-pointer">
                  <ImagePlaceholder category={v.thumbnailCategory} className="w-full h-[240px]" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-brand-lg group-hover:scale-110 transition-transform">
                      <Play size={20} className="text-teal ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="text-white text-sm font-medium">{v.title}</span>
                    <span className="text-white/70 text-xs">{v.duration}</span>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/92 backdrop-blur-sm flex flex-col items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-[13px]">{lightboxIndex + 1} / {filtered.length}</div>
            <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full" onClick={closeLightbox}><X size={24} /></button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); navigate(-1); }}><ChevronLeft size={24} /></button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); navigate(1); }}><ChevronRight size={24} /></button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              className="max-w-[80vw] max-h-[80vh]"
              onClick={e => e.stopPropagation()}
            >
              <ImagePlaceholder category={filtered[lightboxIndex].category} className="w-[400px] h-[300px] md:w-[600px] md:h-[450px] rounded-lg" />
            </motion.div>
            <p className="text-white text-[15px] mt-4 max-w-lg text-center">{filtered[lightboxIndex].caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Gallery;
