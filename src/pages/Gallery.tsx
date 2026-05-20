import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { galleryPhotos, galleryVideos } from "@/data/gallery";
import { events as fallbackEvents, type AGSWSEvent } from "@/data/events";
import { getEventAlbum, type AlbumPhoto } from "@/data/eventAlbums";
import { useCMSList } from "@/hooks/useCMSList";
import FadeInUp from "@/components/ui/FadeInUp";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ZoomIn, ChevronLeft, ChevronRight, X, Play, Camera, Film, FolderOpen, Calendar, MapPin } from "lucide-react";

const categories = ["all", "medical", "education", "community", "elderly", "child", "hospital", "classroom"] as const;
const catLabels: Record<string, string> = {
  all: "All", medical: "Medical Camps", education: "Education Drives",
  community: "Community Events", elderly: "Field Work", child: "Children",
  hospital: "Hospital", classroom: "Classroom",
};

const Gallery = () => {
  useSEO("Photo & Video Gallery", "See AGSWS in action — photos and videos from our medical camps, education drives, and community events.");

  const { data: cmsGallery } = useCMSList<any>('cms_gallery', [], { orderBy: { column: 'sort_order', ascending: true } });
  const { data: cmsVideos } = useCMSList<any>('cms_videos', [], { orderBy: { column: 'sort_order', ascending: true } });
  const { data: cmsEvents } = useCMSList<any>('cms_events', [], { orderBy: { column: 'event_date', ascending: false } });
  const { data: cmsAlbumPhotos } = useCMSList<any>('cms_event_albums', [], { orderBy: { column: 'sort_order', ascending: true } });
  const [searchParams, setSearchParams] = useSearchParams();

  const videos: any[] = useMemo(() => {
    if (cmsVideos.length > 0) {
      return cmsVideos.map((v: any) => ({
        id: v.id,
        title: v.title,
        duration: v.duration || '',
        thumbnail: v.thumbnail || '',
        thumbnailCategory: v.category || 'community',
        videoUrl: v.video_url || '',
      }));
    }
    return galleryVideos.map((v: any) => ({ ...v, thumbnail: '', videoUrl: '' }));
  }, [cmsVideos]);

  const photos: any[] = useMemo(() => {
    if (cmsGallery.length > 0) {
      return cmsGallery.map((g: any) => ({
        id: g.id,
        category: g.category || 'community',
        caption: g.caption || '',
        image: g.image,
      }));
    }
    return galleryPhotos.map(p => ({ ...p, image: '' }));
  }, [cmsGallery]);

  const pastEvents: AGSWSEvent[] = useMemo(() => {
    const source: AGSWSEvent[] = cmsEvents.length > 0
      ? cmsEvents
          .filter((e: any) => e.is_published !== false)
          .map((e: any) => ({
            id: e.id,
            title: e.title,
            type: 'medical' as const,
            date: e.event_date || e.created_at,
            time: '',
            venue: e.location || '',
            location: e.location || '',
            description: e.description || '',
            capacity: e.capacity || 0,
            registered: 0,
            isPast: e.event_date ? new Date(e.event_date) < new Date() : false,
          }))
      : fallbackEvents;
    return source
      .filter(e => e.isPast)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [cmsEvents]);

  const initialAlbumParam = searchParams.get('album');
  const [filter, setFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [view, setView] = useState<"photos" | "albums" | "videos">(
    initialAlbumParam ? "albums" : "photos"
  );
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(initialAlbumParam);
  const [albumIndex, setAlbumIndex] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const filtered = useMemo(() =>
    filter === "all" ? photos : photos.filter((p: any) => p.category === filter),
    [filter, photos]
  );

  // Build a map of event_id -> uploaded album photos (CMS-managed). When an
  // event has uploads, we use them; otherwise we fall back to the placeholder
  // album so we never render an empty folder.
  const albumByEvent = useMemo(() => {
    const map = new Map<string, AlbumPhoto[]>();
    for (const row of cmsAlbumPhotos as any[]) {
      const list = map.get(row.event_id) || [];
      list.push({
        id: row.id,
        image: row.image,
        category: (row.category || 'community') as AlbumPhoto['category'],
        caption: row.caption || '',
        is_cover: !!row.is_cover,
      });
      map.set(row.event_id, list);
    }
    return map;
  }, [cmsAlbumPhotos]);

  const photosForEvent = useCallback((evt: AGSWSEvent): AlbumPhoto[] => {
    const uploaded = albumByEvent.get(evt.id);
    return uploaded && uploaded.length > 0 ? uploaded : getEventAlbum(evt);
  }, [albumByEvent]);

  const activeAlbum = useMemo(() => {
    if (!activeAlbumId) return null;
    const event = pastEvents.find(e => e.id === activeAlbumId);
    if (!event) return null;
    return { event, photos: photosForEvent(event) };
  }, [activeAlbumId, pastEvents, photosForEvent]);

  // Deep-link from Events page: /gallery?album=<eventId>
  useEffect(() => {
    const albumParam = searchParams.get('album');
    if (albumParam && pastEvents.some(e => e.id === albumParam)) {
      setView('albums');
      setActiveAlbumId(albumParam);
      setAlbumIndex(0);
    }
  }, [searchParams, pastEvents]);

  const closeAlbum = () => {
    setActiveAlbumId(null);
    if (searchParams.get('album')) {
      searchParams.delete('album');
      setSearchParams(searchParams, { replace: true });
    }
  };
  const navigateAlbum = useCallback((dir: number) => {
    if (!activeAlbum) return;
    setAlbumIndex(i => (i + dir + activeAlbum.photos.length) % activeAlbum.photos.length);
  }, [activeAlbum]);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);
  const navigate = useCallback((dir: number) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + dir + filtered.length) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeAlbum) {
        if (e.key === "Escape") closeAlbum();
        if (e.key === "ArrowLeft") navigateAlbum(-1);
        if (e.key === "ArrowRight") navigateAlbum(1);
        return;
      }
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigate(-1);
      if (e.key === "ArrowRight") navigate(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, navigate, activeAlbum, navigateAlbum]);

  return (
    <main id="main-content">
      <section ref={heroRef} className="relative h-[380px] overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroY }} className="absolute inset-0 bg-gradient-to-br from-[hsl(187,68%,5%)] via-[hsl(187,68%,12%)] to-[hsl(242,29%,20%)]" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }} />
        <div className="relative z-10 text-center px-6">
          <motion.span initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--accent))] mb-4">Visual Stories</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Our Work in Pictures</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-sm text-white/50 mt-4">Every photograph is a story. Every story is a life.</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center gap-1 mt-8 bg-white/[0.06] backdrop-blur-sm rounded-full p-1 w-fit mx-auto border border-white/[0.08]">
            <button onClick={() => setView("photos")} className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${view === "photos" ? "bg-white text-[hsl(var(--foreground))]" : "text-white/60 hover:text-white"}`}><Camera size={14} /> Photos</button>
            <button onClick={() => setView("albums")} className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${view === "albums" ? "bg-white text-[hsl(var(--foreground))]" : "text-white/60 hover:text-white"}`}><FolderOpen size={14} /> Albums</button>
            <button onClick={() => setView("videos")} className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all ${view === "videos" ? "bg-white text-[hsl(var(--foreground))]" : "text-white/60 hover:text-white"}`}><Film size={14} /> Videos</button>
          </motion.div>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {view === "photos" ? (
          <motion.div key="photos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="sticky top-[64px] z-30 bg-[hsl(var(--card))]/95 backdrop-blur-md border-b border-[hsl(var(--border))]">
              <div className="max-w-[1200px] mx-auto px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar">
                {categories.map(c => (
                  <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all duration-200 ${filter === c ? "bg-[hsl(var(--primary))] text-white shadow-sm" : "bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--secondary))] border border-[hsl(var(--border))]"}`}>
                    {catLabels[c]}
                  </button>
                ))}
              </div>
            </div>
            <section className="bg-[hsl(var(--background))] py-12">
              <div className="max-w-[1200px] mx-auto px-6">
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                  {filtered.map((photo: any, i: number) => (
                    <FadeInUp key={photo.id} delay={(i % 6) * 0.03}>
                      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="mb-4 break-inside-avoid rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => openLightbox(i)}>
                        {photo.image && !photo.image.startsWith('placeholder') ? (
                          <img src={photo.image} alt={photo.caption} className="w-full rounded-xl" />
                        ) : (
                          <ImagePlaceholder category={photo.category} className="w-full" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-between p-4">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider">{photo.category}</span>
                            <motion.div whileHover={{ scale: 1.2 }}><ZoomIn size={18} className="text-white/80" /></motion.div>
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
        ) : view === "albums" ? (
          <motion.div key="albums" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <section className="bg-[hsl(var(--background))] py-16">
              <div className="max-w-[1200px] mx-auto px-6">
                <div className="mb-10 text-center">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--primary))] mb-3">Past Event Albums</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">Browse photos from every past event</h2>
                  <p className="text-sm text-[hsl(var(--muted-foreground))] mt-3 max-w-lg mx-auto">Each folder holds the full visual story from a camp, drive, or community programme.</p>
                </div>
                {pastEvents.length === 0 ? (
                  <div className="text-center py-16 text-[hsl(var(--muted-foreground))] text-sm">No past event albums yet.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastEvents.map((evt, i) => {
                      const album = photosForEvent(evt);
                      const cover = album.find((p: any) => p.is_cover) || album[0];
                      const date = new Date(evt.date);
                      return (
                        <FadeInUp key={evt.id} delay={(i % 6) * 0.04}>
                          <motion.button
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 280, damping: 22 }}
                            onClick={() => { setActiveAlbumId(evt.id); setAlbumIndex(0); }}
                            className="group text-left w-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                          >
                            <div className="relative h-[200px] overflow-hidden">
                              {/* Stacked-folder effect */}
                              <div className="absolute inset-x-3 top-0 h-3 rounded-t-xl bg-[hsl(var(--muted))]/60" />
                              <div className="absolute inset-x-1.5 top-1.5 h-3 rounded-t-xl bg-[hsl(var(--muted))]/80" />
                              <div className="absolute inset-0 top-3 overflow-hidden rounded-t-xl">
                                {cover.image ? (
                                  <img src={cover.image} alt={cover.caption} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
                                ) : (
                                  <ImagePlaceholder category={cover.category} className="w-full h-full" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-white/95 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                    <FolderOpen size={11} /> {album.length} photos
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="p-5">
                              <h3 className="text-[15px] font-bold text-[hsl(var(--foreground))] tracking-tight line-clamp-1">{evt.title}</h3>
                              <div className="flex items-center gap-3 mt-2 text-[11px] text-[hsl(var(--muted-foreground))] font-medium">
                                <span className="inline-flex items-center gap-1"><Calendar size={11} />{date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                {evt.location && <span className="inline-flex items-center gap-1"><MapPin size={11} />{evt.location}</span>}
                              </div>
                            </div>
                          </motion.button>
                        </FadeInUp>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </motion.div>
        ) : (
          <motion.div key="videos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <section className="bg-[hsl(var(--background))] py-16">
              <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((v: any, i: number) => (
                    <FadeInUp key={v.id} delay={i * 0.1}>
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        onClick={() => v.videoUrl && window.open(v.videoUrl, '_blank', 'noopener')}
                        className="relative rounded-2xl overflow-hidden group cursor-pointer bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-sm"
                      >
                        <div className="relative h-[260px] overflow-hidden">
                          {v.thumbnail
                            ? <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" loading="lazy" />
                            : <ImagePlaceholder category={v.thumbnailCategory} className="w-full h-full" />}
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <motion.div whileHover={{ scale: 1.15 }} className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
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

      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6" onClick={closeLightbox}>
            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/[0.06] px-4 py-1.5 rounded-full text-white/50 text-[12px] font-medium backdrop-blur-sm">{lightboxIndex + 1} / {filtered.length}</div>
            <button className="absolute top-5 right-5 text-white/70 p-2.5 hover:bg-white/10 rounded-xl transition-colors z-10" onClick={closeLightbox}><X size={22} /></button>
            <button className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/70 hover:bg-white/15 transition-colors backdrop-blur-sm z-10" onClick={(e) => { e.stopPropagation(); navigate(-1); }}><ChevronLeft size={22} /></button>
            <button className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/70 hover:bg-white/15 transition-colors backdrop-blur-sm z-10" onClick={(e) => { e.stopPropagation(); navigate(1); }}><ChevronRight size={22} /></button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center gap-5 max-w-[90vw] max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              {filtered[lightboxIndex].image && !filtered[lightboxIndex].image.startsWith('placeholder') ? (
                <img src={filtered[lightboxIndex].image} alt={filtered[lightboxIndex].caption} className="max-w-[85vw] max-h-[70vh] rounded-xl object-contain" />
              ) : (
                <ImagePlaceholder category={filtered[lightboxIndex].category} className="w-[500px] h-[375px] md:w-[700px] md:h-[500px] rounded-xl" />
              )}
              <p className="text-white/80 text-[14px] max-w-lg text-center font-medium">{filtered[lightboxIndex].caption}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeAlbum && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
            onClick={closeAlbum}
          >
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <p className="text-white text-[13px] font-bold tracking-tight">{activeAlbum.event.title}</p>
              <p className="text-white/50 text-[11px] font-medium mt-0.5">{albumIndex + 1} / {activeAlbum.photos.length}</p>
            </div>
            <button className="absolute top-5 right-5 text-white/70 p-2.5 hover:bg-white/10 rounded-xl transition-colors z-10" onClick={closeAlbum}><X size={22} /></button>
            <button aria-label="Previous photo" className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/70 hover:bg-white/15 transition-colors backdrop-blur-sm z-10" onClick={(e) => { e.stopPropagation(); navigateAlbum(-1); }}><ChevronLeft size={22} /></button>
            <button aria-label="Next photo" className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/70 hover:bg-white/15 transition-colors backdrop-blur-sm z-10" onClick={(e) => { e.stopPropagation(); navigateAlbum(1); }}><ChevronRight size={22} /></button>
            <motion.div
              key={albumIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center justify-center gap-5 max-w-[90vw] max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              {activeAlbum.photos[albumIndex].image ? (
                <img src={activeAlbum.photos[albumIndex].image} alt={activeAlbum.photos[albumIndex].caption} className="max-w-[85vw] max-h-[68vh] rounded-xl object-contain shadow-2xl" />
              ) : (
                <ImagePlaceholder category={activeAlbum.photos[albumIndex].category} className="w-[500px] h-[375px] md:w-[720px] md:h-[480px] rounded-xl" />
              )}
              <p className="text-white/85 text-[14px] max-w-xl text-center font-medium">{activeAlbum.photos[albumIndex].caption}</p>
              <div className="flex items-center gap-2 mt-1">
                {activeAlbum.photos.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={(e) => { e.stopPropagation(); setAlbumIndex(i); }}
                    aria-label={`Go to photo ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${i === albumIndex ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Gallery;
