import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Eye, EyeOff, Calendar, MapPin, Users, ArrowRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCMSApi } from '@/hooks/useCMSApi';
import { notifyCMSContentUpdated } from '@/lib/cms-sync';
import CMSImageUpload from './CMSImageUpload';
import toast from 'react-hot-toast';

/**
 * EventEditor — dedicated CMS surface for `cms_events`.
 *
 * Why a separate editor (not the generic CMSContentEditor):
 *   • Events have a date+time (compound) which is simpler with a native
 *     `datetime-local` input than two split fields.
 *   • A live preview pane mirrors the public Events card so the admin can
 *     see exactly what the audience will see while editing.
 *   • Items are always sorted by `event_date` DESC client-side too, so the
 *     CMS list stays consistent with the public page even if the API ever
 *     returns rows in a different order.
 */
const EventEditor = () => {
  const { getAll, create, update, remove, uploadImage, loading } = useCMSApi();
  const [items, setItems] = useState<any[]>([]);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState('');

  const fetchItems = useCallback(async () => {
    setFetching(true);
    try {
      const data = await getAll('cms_events');
      const arr = Array.isArray(data) ? data : [data];
      // Belt-and-braces ordering — same rules the backend enforces, applied
      // here too so re-renders never reshuffle the list.
      arr.sort((a: any, b: any) => {
        const ad = a.event_date ? new Date(a.event_date).getTime() : 0;
        const bd = b.event_date ? new Date(b.event_date).getTime() : 0;
        if (bd !== ad) return bd - ad;
        const ac = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bc = b.created_at ? new Date(b.created_at).getTime() : 0;
        if (bc !== ac) return bc - ac;
        return String(a.id).localeCompare(String(b.id));
      });
      setItems(arr);
    } catch {
      setItems([]);
    }
    setFetching(false);
  }, [getAll]);

  useEffect(() => { fetchItems(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(i =>
      [i.title, i.location, i.description].some(v => typeof v === 'string' && v.toLowerCase().includes(q))
    );
  }, [items, search]);

  const openNew = () => {
    setEditItem({
      title: '',
      description: '',
      event_date: '',
      location: '',
      image: '',
      capacity: 100,
      is_published: true,
      sort_order: items.length,
    });
    setIsNew(true);
  };

  const handleSave = async () => {
    if (!editItem) return;
    if (!editItem.title?.trim()) { toast.error('Title is required'); return; }
    try {
      // Normalise the datetime-local value to an ISO string so Postgres
      // stores it consistently regardless of the editor's locale.
      const payload = {
        ...editItem,
        event_date: editItem.event_date ? new Date(editItem.event_date).toISOString() : null,
        capacity: Number(editItem.capacity) || null,
      };
      if (isNew) {
        await create('cms_events', payload);
        toast.success('Event created');
      } else {
        await update('cms_events', editItem.id, payload);
        toast.success('Event updated');
      }
      setEditItem(null);
      setIsNew(false);
      fetchItems();
      notifyCMSContentUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      await remove('cms_events', id);
      toast.success('Deleted');
      fetchItems();
      notifyCMSContentUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const togglePublish = async (item: any) => {
    try {
      await update('cms_events', item.id, { is_published: !item.is_published });
      fetchItems();
      notifyCMSContentUpdated();
    } catch {}
  };

  // datetime-local needs YYYY-MM-DDTHH:mm without seconds/zone
  const toLocalInput = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-card rounded-xl border border-border">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Events</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{items.length} total · sorted by date</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events…"
                className="h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button onClick={openNew} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold">
              <Plus size={14} /> New Event
            </button>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
          {filtered.map(item => {
            const d = item.event_date ? new Date(item.event_date) : null;
            const isPast = d ? d.getTime() < Date.now() : false;
            return (
              <div key={item.id} className="px-6 py-3 flex items-center gap-4 group hover:bg-muted/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-muted flex flex-col items-center justify-center shrink-0">
                  {d ? (
                    <>
                      <span className="text-base font-bold text-foreground leading-none">{d.getDate()}</span>
                      <span className="text-[9px] font-semibold uppercase text-muted-foreground mt-0.5">{d.toLocaleString('en', { month: 'short' })}</span>
                    </>
                  ) : <Calendar size={16} className="text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{item.title || 'Untitled event'}</p>
                    {isPast && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">PAST</span>}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {item.location || '—'} {d && `· ${d.toLocaleString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                </div>
                <button onClick={() => togglePublish(item)} className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${item.is_published ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                  {item.is_published ? <Eye size={10} /> : <EyeOff size={10} />}
                  {item.is_published ? 'Live' : 'Draft'}
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditItem({ ...item, event_date: toLocalInput(item.event_date) }); setIsNew(false); }} className="p-2 rounded-lg hover:bg-primary/10 text-primary"><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={13} /></button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">No events {search && 'match your search'}</div>
          )}
        </div>
      </div>

      {/* Edit Drawer with Live Preview */}
      <AnimatePresence>
        {editItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-stretch justify-end"
            onClick={() => setEditItem(null)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="bg-background w-full max-w-[1100px] h-full overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Toolbar */}
              <div className="px-6 h-14 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    {isNew ? 'New Event' : 'Edit Event'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditItem(null)} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={loading} className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold disabled:opacity-50">
                    {loading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    {isNew ? 'Create' : 'Save'}
                  </button>
                  <button onClick={() => setEditItem(null)} className="ml-1 p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Two-pane: editor / preview */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
                {/* Editor */}
                <div className="overflow-y-auto p-6 space-y-5 border-r border-border bg-card">
                  <Field label="Event Title" required>
                    <input
                      value={editItem.title || ''}
                      onChange={e => setEditItem({ ...editItem, title: e.target.value })}
                      placeholder="e.g. Free Medical Camp — North Kolkata"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </Field>

                  <Field label="Date & Time">
                    <input
                      type="datetime-local"
                      value={editItem.event_date || ''}
                      onChange={e => setEditItem({ ...editItem, event_date: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-[10px] text-muted-foreground mt-1">Tip: includes both date and time. Past dates are shown under “Past Events” on the website.</p>
                  </Field>

                  <Field label="Location">
                    <input
                      value={editItem.location || ''}
                      onChange={e => setEditItem({ ...editItem, location: e.target.value })}
                      placeholder="e.g. Shyambazar Community Hall"
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Capacity">
                      <input
                        type="number"
                        min={0}
                        value={editItem.capacity ?? ''}
                        onChange={e => setEditItem({ ...editItem, capacity: e.target.value })}
                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </Field>
                    <Field label="Status">
                      <button
                        type="button"
                        onClick={() => setEditItem({ ...editItem, is_published: !editItem.is_published })}
                        className={`h-10 w-full rounded-lg border text-xs font-semibold transition-colors ${editItem.is_published ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700' : 'bg-muted border-border text-muted-foreground'}`}
                      >
                        {editItem.is_published ? '● Published' : '○ Draft'}
                      </button>
                    </Field>
                  </div>

                  <Field label="Description">
                    <textarea
                      value={editItem.description || ''}
                      onChange={e => setEditItem({ ...editItem, description: e.target.value })}
                      rows={5}
                      placeholder="What will attendees experience? Who is it for?"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </Field>

                  <Field label="Cover Image">
                    <CMSImageUpload
                      value={editItem.image || ''}
                      onChange={(url) => setEditItem({ ...editItem, image: url })}
                      onUpload={(file) => uploadImage(file, 'events')}
                      label="Cover Image"
                      resolution="800×450px"
                    />
                  </Field>
                </div>

                {/* Live Preview */}
                <div className="overflow-y-auto bg-muted/30 p-8">
                  <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground mb-3">Live Preview</div>
                  <EventPreviewCard event={editItem} />

                  <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-muted-foreground mt-8 mb-3">Detail Modal</div>
                  <EventPreviewModal event={editItem} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Form helpers ─── */
const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    {children}
  </div>
);

/* ─── Live preview — mirrors src/pages/Events.tsx EventCard ─── */
const EventPreviewCard = ({ event }: { event: any }) => {
  const d = event.event_date ? new Date(event.event_date) : null;
  const isPast = d ? d.getTime() < Date.now() : false;
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return (
    <div className={`bg-white rounded-[20px] border border-border overflow-hidden shadow-sm transition-opacity ${isPast ? 'opacity-60' : ''}`}>
      <div className="h-1 bg-gradient-to-r from-[#1F9AA8] to-[#156B75]" />
      {event.image && (
        <img src={event.image} alt="" className="w-full h-40 object-cover" />
      )}
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#1F9AA8] to-[#156B75] flex flex-col items-center justify-center text-white">
            <span className="text-lg font-bold leading-none">{d ? d.getDate() : '—'}</span>
            <span className="text-[9px] font-semibold uppercase mt-0.5 opacity-80">{d ? months[d.getMonth()] : ''}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E6F4F6] text-[#156B75] uppercase tracking-wider">Medical</span>
              {isPast && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">Past</span>}
            </div>
            <h3 className="font-bold text-[16px] text-zinc-900 truncate">{event.title || 'Untitled event'}</h3>
            <div className="flex flex-col gap-1 mt-1.5 text-[12px] text-zinc-600">
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#1F9AA8]" />{event.location || 'Add a location'}</span>
              {d && <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#1F9AA8]" />{d.toLocaleString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
            </div>
          </div>
        </div>
        <p className="text-[13px] text-zinc-600 line-clamp-3 mt-3 leading-relaxed">
          {event.description || 'Add a description to tell attendees what to expect.'}
        </p>
        <div className="flex items-center gap-3 mt-4">
          <span className="flex items-center gap-1 text-[12px] font-bold text-white bg-[#1F9AA8] px-4 py-2 rounded-full">
            Register Free <ArrowRight size={12} />
          </span>
          <span className="text-[11px] text-zinc-500"><Users size={11} className="inline mr-1" />{event.capacity || 0} capacity</span>
        </div>
      </div>
    </div>
  );
};

const EventPreviewModal = ({ event }: { event: any }) => {
  const d = event.event_date ? new Date(event.event_date) : null;
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
      {event.image ? (
        <img src={event.image} alt="" className="w-full h-32 object-cover" />
      ) : (
        <div className="w-full h-32 bg-gradient-to-br from-[#E6F4F6] to-[#FEF6DC]" />
      )}
      <div className="p-5">
        <h2 className="text-[18px] font-bold text-zinc-900 leading-tight">{event.title || 'Untitled event'}</h2>
        <div className="text-[12px] text-zinc-600 mt-2 space-y-1">
          {d && <p>📅 {d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
          {d && <p>🕐 {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>}
          {event.location && <p>📍 {event.location}</p>}
          {event.capacity ? <p>👥 {event.capacity} expected attendees</p> : null}
        </div>
        <p className="text-[12px] text-zinc-700 mt-3 leading-relaxed">{event.description || ''}</p>
      </div>
    </div>
  );
};

export default EventEditor;