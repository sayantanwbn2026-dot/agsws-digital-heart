import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Plus, Trash2, GripVertical } from 'lucide-react';
import { useCMSApi } from '@/hooks/useCMSApi';
import { notifyCMSContentUpdated } from '@/lib/cms-sync';
import toast from 'react-hot-toast';

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number';
  placeholder?: string;
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
  const { loading } = useCMSApi();
  const [content, setContent] = useState<any>({});
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

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
  }, [sectionKey]);

  useEffect(() => { fetchSection(); }, [fetchSection]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('agsws_admin_token') ?? '';
      // First find the row id
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

  const updateField = (key: string, value: any) => {
    setContent((prev: any) => ({ ...prev, [key]: value }));
  };

  const updateListItem = (index: number, key: string, value: any) => {
    if (!listKey) return;
    const items = [...(content[listKey] || [])];
    items[index] = { ...items[index], [key]: value };
    setContent((prev: any) => ({ ...prev, [listKey]: items }));
  };

  const addListItem = () => {
    if (!listKey || !listFields) return;
    const newItem: any = {};
    listFields.forEach(f => { newItem[f.key] = f.type === 'number' ? 0 : ''; });
    setContent((prev: any) => ({ ...prev, [listKey]: [...(prev[listKey] || []), newItem] }));
  };

  const removeListItem = (index: number) => {
    if (!listKey) return;
    const items = [...(content[listKey] || [])];
    items.splice(index, 1);
    setContent((prev: any) => ({ ...prev, [listKey]: items }));
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>

        {/* Top-level fields */}
        {fields.length > 0 && (
          <div className="p-6 grid gap-5 md:grid-cols-2">
            {fields.map(field => (
              <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-foreground mb-1.5">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={content[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="no-float w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                ) : field.type === 'number' ? (
                  <input
                    type="number"
                    value={content[field.key] ?? 0}
                    onChange={(e) => updateField(field.key, Number(e.target.value))}
                    className="no-float w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                ) : (
                  <input
                    type="text"
                    value={content[field.key] || ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="no-float w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* List items */}
      {listKey && listFields && (
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground capitalize">{listKey.replace(/_/g, ' ')}</h4>
            <button
              onClick={addListItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90"
            >
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
                    <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{field.label}</label>
                      {field.type === 'textarea' ? (
                        <textarea
                          value={item[field.key] || ''}
                          onChange={(e) => updateListItem(index, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="no-float w-full px-3 py-2 rounded-lg border border-border bg-background text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      ) : field.type === 'number' ? (
                        <input
                          type="number"
                          value={item[field.key] ?? 0}
                          onChange={(e) => updateListItem(index, field.key, Number(e.target.value))}
                          className="no-float w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      ) : (
                        <input
                          type="text"
                          value={item[field.key] || ''}
                          onChange={(e) => updateListItem(index, field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className="no-float w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      )}
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
