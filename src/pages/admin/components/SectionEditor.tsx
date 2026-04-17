import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Plus, Trash2, GripVertical, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useCMSApi } from '@/hooks/useCMSApi';
import { notifyCMSContentUpdated } from '@/lib/cms-sync';
import toast from 'react-hot-toast';

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'image' | 'string-list';
  placeholder?: string;
  /** For image fields — folder in cms-uploads bucket */
  imageFolder?: string;
  /** For image fields — recommended resolution hint */
  resolution?: string;
}

interface SectionEditorProps {
  sectionKey: string;
  title: string;
  description: string;
  fields: FieldDef[];
  /** If the content has a list of items under a key, set this */
  listKey?: string;
  listFields?: FieldDef[];
}

const SectionEditor = ({ sectionKey, title, description, fields, listKey, listFields }: SectionEditorProps) => {
  const { uploadImage } = useCMSApi();
  const [content, setContent] = useState<any>({});
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const fetchSection = useCallback(async () => {
    setFetching(true);
    try {
      const token = localStorage.getItem('agsws_admin_token') ?? '';
      const res = await fetch(`${SUPABASE_URL}/functions/v1/cms-api?table=cms_sections`, {
        headers: { 'Authorization': `Bearer ${token}`, 'apikey': ANON_KEY },
      });
      const data = await res.json();
      const row = Array.isArray(data) ? data.find((r: any) => r.section_key === sectionKey) : null;
      if (row) setContent(row.content || {});
    } catch {}
    setFetching(false);
  }, [sectionKey, SUPABASE_URL, ANON_KEY]);

  useEffect(() => { fetchSection(); }, [fetchSection]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('agsws_admin_token') ?? '';
      const res = await fetch(`${SUPABASE_URL}/functions/v1/cms-api?table=cms_sections`, {
        headers: { 'Authorization': `Bearer ${token}`, 'apikey': ANON_KEY },
      });
      const data = await res.json();
      const row = Array.isArray(data) ? data.find((r: any) => r.section_key === sectionKey) : null;

      if (row) {
        await fetch(`${SUPABASE_URL}/functions/v1/cms-api?table=cms_sections&id=${row.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'apikey': ANON_KEY },
          body: JSON.stringify({ content }),
        });
      } else {
        await fetch(`${SUPABASE_URL}/functions/v1/cms-api?table=cms_sections`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'apikey': ANON_KEY },
          body: JSON.stringify({ section_key: sectionKey, content }),
        });
      }
      toast.success('Section saved');
      notifyCMSContentUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    }
    setSaving(false);
  };

  const updateField = (key: string, value: any) => setContent((prev: any) => ({ ...prev, [key]: value }));
  const updateListItem = (index: number, key: string, value: any) => {
    if (!listKey) return;
    const items = [...(content[listKey] || [])];
    items[index] = { ...items[index], [key]: value };
    setContent((prev: any) => ({ ...prev, [listKey]: items }));
  };
  const addListItem = () => {
    if (!listKey || !listFields) return;
    const newItem: any = {};
    listFields.forEach(f => { newItem[f.key] = f.type === 'number' ? 0 : f.type === 'string-list' ? [] : ''; });
    setContent((prev: any) => ({ ...prev, [listKey]: [...(prev[listKey] || []), newItem] }));
  };
  const removeListItem = (index: number) => {
    if (!listKey) return;
    const items = [...(content[listKey] || [])];
    items.splice(index, 1);
    setContent((prev: any) => ({ ...prev, [listKey]: items }));
  };

  const handleImageUpload = async (key: string, file: File, folder: string, listIndex?: number) => {
    setUploadingKey(key + (listIndex ?? ''));
    try {
      const url = await uploadImage(file, folder);
      if (listIndex !== undefined) updateListItem(listIndex, key, url);
      else updateField(key, url);
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    }
    setUploadingKey(null);
  };

  // ── String-list (pills) editor ─────────────────────────────
  const PillsEditor = ({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) => {
    const [draft, setDraft] = useState('');
    const arr = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-lg border border-border bg-background">
          {arr.length === 0 && <span className="text-xs text-muted-foreground py-1.5">No items yet — add below.</span>}
          {arr.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
              {item}
              <button type="button" onClick={() => onChange(arr.filter((_, idx) => idx !== i))} className="hover:bg-primary/20 rounded-full p-0.5">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && draft.trim()) {
                e.preventDefault();
                onChange([...arr, draft.trim()]);
                setDraft('');
              }
            }}
            placeholder="Type and press Enter to add"
            className="no-float flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="button"
            onClick={() => { if (draft.trim()) { onChange([...arr, draft.trim()]); setDraft(''); } }}
            className="px-4 h-10 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90"
          >
            Add
          </button>
        </div>
      </div>
    );
  };

  // ── Image upload field ─────────────────────────────────────
  const ImageField = ({ field, value, listIndex }: { field: FieldDef; value: string; listIndex?: number }) => {
    const isUploading = uploadingKey === field.key + (listIndex ?? '');
    const folder = field.imageFolder || 'sections';
    return (
      <div className="space-y-2">
        {value ? (
          <div className="relative inline-block">
            <img src={value} alt="" className="h-24 w-auto rounded-lg border border-border object-cover" />
            <button
              type="button"
              onClick={() => listIndex !== undefined ? updateListItem(listIndex, field.key, '') : updateField(field.key, '')}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-lg"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg h-24 flex items-center justify-center bg-muted/30">
            <ImageIcon size={20} className="text-muted-foreground" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-xs font-semibold transition-colors">
            {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
            {value ? 'Replace' : 'Upload'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(field.key, f, folder, listIndex); }}
            />
          </label>
          <input
            type="text"
            value={value || ''}
            placeholder="or paste URL"
            onChange={(e) => listIndex !== undefined ? updateListItem(listIndex, field.key, e.target.value) : updateField(field.key, e.target.value)}
            className="no-float flex-1 h-8 px-2 rounded border border-border bg-background text-xs"
          />
        </div>
        {field.resolution && <p className="text-[10px] text-muted-foreground">Recommended: {field.resolution}</p>}
      </div>
    );
  };

  const renderField = (field: FieldDef, value: any, onChange: (v: any) => void, listIndex?: number) => {
    if (field.type === 'image') return <ImageField field={field} value={value || ''} listIndex={listIndex} />;
    if (field.type === 'string-list') return <PillsEditor value={value || []} onChange={onChange} />;
    if (field.type === 'textarea') return (
      <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder}
        className="no-float w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20" />
    );
    if (field.type === 'number') return (
      <input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))}
        className="no-float w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
    );
    return (
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder}
        className="no-float w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
    );
  };

  if (fetching) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" size={24} /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>

        {fields.length > 0 && (
          <div className="p-6 grid gap-5 md:grid-cols-2">
            {fields.map(field => (
              <div key={field.key} className={(field.type === 'textarea' || field.type === 'string-list' || field.type === 'image') ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-foreground mb-1.5">{field.label}</label>
                {renderField(field, content[field.key], (v) => updateField(field.key, v))}
              </div>
            ))}
          </div>
        )}
      </div>

      {listKey && listFields && (
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground capitalize">{listKey.replace(/_/g, ' ')}</h4>
            <button onClick={addListItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90">
              <Plus size={12} /> Add Item
            </button>
          </div>
          <div className="divide-y divide-border">
            {(content[listKey] || []).map((item: any, index: number) => (
              <div key={index} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GripVertical size={14} />
                    <span className="text-xs font-bold">Item {index + 1}</span>
                  </div>
                  <button onClick={() => removeListItem(index)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {listFields.map(field => (
                    <div key={field.key} className={(field.type === 'textarea' || field.type === 'string-list' || field.type === 'image') ? 'md:col-span-2' : ''}>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{field.label}</label>
                      {renderField(field, item[field.key], (v) => updateListItem(index, field.key, v), index)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {(!content[listKey] || content[listKey].length === 0) && (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">No items yet. Click "Add Item" to create one.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionEditor;
