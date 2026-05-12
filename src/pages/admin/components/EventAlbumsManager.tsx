import { useEffect, useState, useMemo } from 'react';
import { Calendar, MapPin, ChevronRight, ArrowLeft, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useCMSApi } from '@/hooks/useCMSApi';
import { EventAlbumManager } from './EventEditor';

/**
 * Dedicated CMS surface listing every event with its album cover + photo count
 * so admins can jump straight into the album editor without opening the event
 * record. Shows under Content → Event Albums in the sidebar.
 */
const EventAlbumsManager = () => {
  const { getAll } = useCMSApi();
  const [events, setEvents] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const refresh = async () => {
    setLoading(true);
    try {
      const [evs, ph] = await Promise.all([getAll('cms_events'), getAll('cms_event_albums')]);
      setEvents(Array.isArray(evs) ? evs : [evs]);
      setAlbums(Array.isArray(ph) ? ph : [ph]);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refresh(); }, []);

  const photosByEvent = useMemo(() => {
    const m = new Map<string, any[]>();
    for (const p of albums) {
      const list = m.get(p.event_id) || [];
      list.push(p);
      m.set(p.event_id, list);
    }
    return m;
  }, [albums]);

  const filtered = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      const ad = a.event_date ? new Date(a.event_date).getTime() : 0;
      const bd = b.event_date ? new Date(b.event_date).getTime() : 0;
      return bd - ad;
    });
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(e =>
      [e.title, e.location].some(v => typeof v === 'string' && v.toLowerCase().includes(q))
    );
  }, [events, search]);

  if (activeId) {
    const evt = events.find(e => e.id === activeId);
    return (
      <div className="space-y-4">
        <button
          onClick={() => { setActiveId(null); refresh(); }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft size={14} /> Back to all events
        </button>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3 mb-1">
            <Calendar size={16} className="text-primary" />
            <h3 className="text-base font-semibold text-foreground">{evt?.title || 'Event'}</h3>
          </div>
          {evt?.event_date && (
            <p className="text-xs text-muted-foreground mb-5">
              {new Date(evt.event_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              {evt.location ? ` · ${evt.location}` : ''}
            </p>
          )}
          <EventAlbumManager eventId={activeId} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Event Albums</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Manage gallery photos and pick a cover image for every event.</p>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search events…"
              className="h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={22} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filtered.map(evt => {
              const photos = photosByEvent.get(evt.id) || [];
              const cover = photos.find(p => p.is_cover) || photos[0];
              const d = evt.event_date ? new Date(evt.event_date) : null;
              return (
                <button
                  key={evt.id}
                  onClick={() => setActiveId(evt.id)}
                  className="group text-left bg-background border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="relative aspect-[16/10] bg-muted">
                    {cover?.image ? (
                      <img src={cover.image} alt="" className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                    ) : evt.image ? (
                      <img src={evt.image} alt="" className="w-full h-full object-cover opacity-70" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon size={28} />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider text-white bg-black/55 backdrop-blur-sm px-2 py-1 rounded">
                      {photos.length} photo{photos.length === 1 ? '' : 's'}
                    </span>
                    {cover?.is_cover && (
                      <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-300 px-2 py-1 rounded">Cover set</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground line-clamp-1">{evt.title || 'Untitled event'}</h4>
                      <ChevronRight size={14} className="text-muted-foreground shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                      {d && <span className="inline-flex items-center gap-1"><Calendar size={11} />{d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                      {evt.location && <span className="inline-flex items-center gap-1"><MapPin size={11} />{evt.location}</span>}
                    </div>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
                No events {search ? 'match your search' : 'yet — create one in Events first'}.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAlbumsManager;
