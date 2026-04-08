import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2, GripVertical, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CMSImageUpload from './CMSImageUpload';
import { useCMSApi } from '@/hooks/useCMSApi';
import toast from 'react-hot-toast';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'image' | 'date' | 'select';
  required?: boolean;
  resolution?: string;
  options?: { label: string; value: string }[];
  placeholder?: string;
  imageFolder?: string;
}

interface CMSContentEditorProps {
  table: string;
  title: string;
  fields: FieldConfig[];
  singleRow?: boolean;
}

const CMSContentEditor = ({ table, title, fields, singleRow = false }: CMSContentEditorProps) => {
  const { getAll, create, update, remove, uploadImage, loading } = useCMSApi();
  const [items, setItems] = useState<any[]>([]);
  const [editItem, setEditItem] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchItems = useCallback(async () => {
    setFetching(true);
    try {
      const data = await getAll(table);
      setItems(Array.isArray(data) ? data : [data]);
    } catch {
      setItems([]);
    }
    setFetching(false);
  }, [table, getAll]);

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!editItem) return;
    try {
      if (isNew) {
        await create(table, editItem);
        toast.success('Item created');
      } else {
        await update(table, editItem.id, editItem);
        toast.success('Item updated');
      }
      setEditItem(null);
      setIsNew(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await remove(table, id);
      toast.success('Deleted');
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const openNew = () => {
    const defaults: any = {};
    fields.forEach(f => {
      if (f.type === 'boolean') defaults[f.key] = false;
      else if (f.type === 'number') defaults[f.key] = 0;
      else defaults[f.key] = '';
    });
    defaults.sort_order = items.length;
    setEditItem(defaults);
    setIsNew(true);
  };

  const openEdit = (item: any) => {
    setEditItem({ ...item });
    setIsNew(false);
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  // For single-row tables (site settings, hero), auto-open edit
  if (singleRow) {
    const item = items[0] || {};
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button
            onClick={async () => {
              try {
                if (item.id) {
                  await update(table, item.id, item);
                } else {
                  await create(table, item);
                }
                toast.success('Saved');
                fetchItems();
              } catch (err: any) {
                toast.error(err.message || 'Save failed');
              }
            }}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>
        <div className="p-6 grid gap-5 md:grid-cols-2">
          {fields.map(field => (
            <div key={field.key} className={field.type === 'textarea' || field.type === 'image' ? 'md:col-span-2' : ''}>
              {renderField(field, item, (val) => {
                const updated = { ...item, [field.key]: val };
                setItems([updated]);
              }, uploadImage)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{items.length} items</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={14} /> Add New
        </button>
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        {items.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            layout
            className="flex items-center gap-4 px-6 py-3 hover:bg-muted/30 transition-colors group"
          >
            <GripVertical size={14} className="text-muted-foreground/40" />
            
            {/* Thumbnail */}
            {fields.find(f => f.type === 'image') && (
              <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                {item[fields.find(f => f.type === 'image')!.key] ? (
                  <img src={item[fields.find(f => f.type === 'image')!.key]} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                    <Plus size={14} />
                  </div>
                )}
              </div>
            )}

            {/* Title field - first text field */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item[fields.find(f => f.type === 'text')?.key || 'title'] || 'Untitled'}
              </p>
              {fields.find(f => f.key === 'excerpt' || f.key === 'description' || f.key === 'quote') && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {item[fields.find(f => f.key === 'excerpt' || f.key === 'description' || f.key === 'quote')!.key] || '—'}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(item)}
                className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">No items yet. Click "Add New" to create one.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && (setEditItem(null), setIsNew(false))}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{isNew ? 'New Item' : 'Edit Item'}</h3>
                <button onClick={() => { setEditItem(null); setIsNew(false); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-8rem)] grid gap-5 md:grid-cols-2">
                {fields.map(field => (
                  <div key={field.key} className={field.type === 'textarea' || field.type === 'image' ? 'md:col-span-2' : ''}>
                    {renderField(field, editItem, (val) => setEditItem({ ...editItem, [field.key]: val }), uploadImage)}
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
                <button
                  onClick={() => { setEditItem(null); setIsNew(false); }}
                  className="px-4 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {isNew ? 'Create' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function renderField(
  field: FieldConfig,
  item: any,
  onChange: (val: any) => void,
  uploadImage: (file: File, folder?: string) => Promise<string>
) {
  const value = item[field.key];

  if (field.type === 'image') {
    return (
      <CMSImageUpload
        value={value || ''}
        onChange={(url) => onChange(url)}
        onUpload={(file) => uploadImage(file, field.imageFolder || 'general')}
        label={field.label}
        resolution={field.resolution}
      />
    );
  }

  if (field.type === 'boolean') {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-muted-foreground/20'}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'left-5' : 'left-0.5'}`} />
        </button>
        <span className="text-sm text-foreground">{field.label}</span>
      </div>
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{field.label}</label>
        <div className="relative">
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 px-3 pr-8 rounded-lg border border-border bg-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Select…</option>
            {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {field.label} {field.required && <span className="text-destructive">*</span>}
        </label>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}…`}
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
    );
  }

  if (field.type === 'date') {
    return (
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{field.label}</label>
        <input
          type="datetime-local"
          value={value ? new Date(value).toISOString().slice(0, 16) : ''}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
          className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {field.label} {field.required && <span className="text-destructive">*</span>}
      </label>
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        value={value ?? ''}
        onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}…`}
        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    </div>
  );
}

export default CMSContentEditor;
