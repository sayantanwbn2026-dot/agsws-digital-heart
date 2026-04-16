import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2, Copy, Search, Eye, EyeOff, ChevronUp, ChevronDown as ChevronDownIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, verticalListSortingStrategy
} from '@dnd-kit/sortable';

import SortableItem from './SortableItem';
import CMSFieldRenderer from './CMSFieldRenderer';
import { useCMSApi } from '@/hooks/useCMSApi';
import { notifyCMSContentUpdated } from '@/lib/cms-sync';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSearch, setShowSearch] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

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

  // Search filtering
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(item =>
      fields.some(f => {
        const v = item[f.key];
        return typeof v === 'string' && v.toLowerCase().includes(q);
      })
    );
  }, [items, searchQuery, fields]);

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
      notifyCMSContentUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try {
      await remove(table, id);
      toast.success('Deleted');
      setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      fetchItems();
      notifyCMSContentUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} items?`)) return;
    try {
      await Promise.all([...selectedIds].map(id => remove(table, id)));
      toast.success(`${selectedIds.size} items deleted`);
      setSelectedIds(new Set());
      fetchItems();
      notifyCMSContentUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Bulk delete failed');
    }
  };

  const handleDuplicate = async (item: any) => {
    const copy = { ...item };
    delete copy.id;
    delete copy.created_at;
    delete copy.updated_at;
    // Modify title to show it's a copy
    const titleField = fields.find(f => f.key === 'title' || f.key === 'name' || f.key === 'question');
    if (titleField && copy[titleField.key]) {
      copy[titleField.key] = copy[titleField.key] + ' (Copy)';
    }
    if (copy.slug) copy.slug = copy.slug + '-copy';
    copy.sort_order = items.length;
    try {
      await create(table, copy);
      toast.success('Item duplicated');
      fetchItems();
      notifyCMSContentUpdated();
    } catch (err: any) {
      toast.error(err.message || 'Duplicate failed');
    }
  };

  const handleTogglePublish = async (item: any) => {
    const hasPublished = 'is_published' in item;
    if (!hasPublished) return;
    try {
      await update(table, item.id, { is_published: !item.is_published });
      toast.success(item.is_published ? 'Unpublished' : 'Published');
      fetchItems();
      notifyCMSContentUpdated();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    // Persist new sort_order values
    try {
      await Promise.all(
        reordered.map((item, idx) =>
          update(table, item.id, { sort_order: idx })
        )
      );
      toast.success('Order updated');
      notifyCMSContentUpdated();
    } catch (err: any) {
      toast.error('Failed to save order');
      fetchItems(); // Revert
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

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(i => i.id)));
    }
  };

  const getDisplayTitle = (item: any) => {
    const titleField = fields.find(f => f.key === 'title' || f.key === 'name' || f.key === 'question' || f.key === 'label');
    return item[titleField?.key || 'title'] || 'Untitled';
  };

  const getDisplaySubtitle = (item: any) => {
    const subField = fields.find(f => f.key === 'excerpt' || f.key === 'description' || f.key === 'quote' || f.key === 'role' || f.key === 'answer' || f.key === 'value');
    return subField ? item[subField.key] : null;
  };

  const hasPublishField = fields.some(f => f.key === 'is_published');

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={24} />
      </div>
    );
  }

  /* ── Single-row mode (settings / hero) ── */
  if (singleRow) {
    const item = items[0] || {};
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
          <button
            onClick={async () => {
              try {
                if (item.id) await update(table, item.id, item);
                else await create(table, item);
                toast.success('Saved');
                fetchItems();
              } catch (err: any) {
                toast.error(err.message || 'Save failed');
              }
            }}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </button>
        </div>
        <div className="p-6 grid gap-5 md:grid-cols-2">
          {fields.map(field => (
            <div key={field.key} className={field.type === 'textarea' || field.type === 'image' ? 'md:col-span-2' : ''}>
              <CMSFieldRenderer
                field={field}
                item={item}
                onChange={(val) => {
                  const updated = { ...item, [field.key]: val };
                  setItems([updated]);
                }}
                uploadImage={uploadImage}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Multi-row mode ── */
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      {/* Header / Toolbar */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors ${showSearch ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Search size={14} />
            </button>
            <button
              onClick={openNew}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={14} /> Add New
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="relative pb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${title.toLowerCase()}…`}
                  className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk actions bar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 py-2 px-3 bg-primary/5 rounded-lg border border-primary/10">
                <span className="text-xs font-medium text-primary">{selectedIds.size} selected</span>
                <div className="h-4 w-px bg-primary/20" />
                <button
                  onClick={handleBulkDelete}
                  className="text-xs font-medium text-destructive hover:text-destructive/80 transition-colors"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table header */}
      {filteredItems.length > 0 && (
        <div className="px-6 py-2 border-b border-border flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          <div className="w-8 flex justify-center">
            <button onClick={toggleSelectAll} className="w-4 h-4 rounded border border-border flex items-center justify-center hover:border-primary transition-colors">
              {selectedIds.size === filteredItems.length && filteredItems.length > 0 && <Check size={10} className="text-primary" />}
            </button>
          </div>
          <div className="w-5" /> {/* Drag handle spacer */}
          {fields.find(f => f.type === 'image') && <div className="w-10" />}
          <div className="flex-1">Content</div>
          {hasPublishField && <div className="w-16 text-center">Status</div>}
          <div className="w-24 text-right">Actions</div>
        </div>
      )}

      {/* Items list with drag-and-drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={filteredItems.map(i => i.id)} strategy={verticalListSortingStrategy}>
          <div className="divide-y divide-border">
            {filteredItems.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <div className="flex items-center gap-3 px-3 py-3 hover:bg-muted/30 transition-colors group">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleSelect(item.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      selectedIds.has(item.id)
                        ? 'bg-primary border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {selectedIds.has(item.id) && <Check size={10} className="text-primary-foreground" />}
                  </button>

                  {/* Image thumbnail */}
                  {fields.find(f => f.type === 'image') && (
                    <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      {item[fields.find(f => f.type === 'image')!.key] ? (
                        <img src={item[fields.find(f => f.type === 'image')!.key]} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                          <Plus size={14} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{getDisplayTitle(item)}</p>
                    {getDisplaySubtitle(item) && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{getDisplaySubtitle(item)}</p>
                    )}
                  </div>

                  {/* Publish status */}
                  {hasPublishField && (
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${
                        item.is_published
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {item.is_published ? <Eye size={10} /> : <EyeOff size={10} />}
                      {item.is_published ? 'Live' : 'Draft'}
                    </button>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => handleDuplicate(item)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="Duplicate">
                      <Copy size={13} />
                    </button>
                    <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="Edit">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {filteredItems.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {searchQuery ? `No items matching "${searchQuery}"` : 'No items yet. Click "Add New" to create one.'}
          </p>
        </div>
      )}

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
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="bg-card rounded-xl border border-border shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm text-foreground">{isNew ? 'New Item' : 'Edit Item'}</h3>
                <button onClick={() => { setEditItem(null); setIsNew(false); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-8rem)] grid gap-5 md:grid-cols-2">
                {fields.filter(f => f.key !== 'sort_order').map(field => (
                  <div key={field.key} className={field.type === 'textarea' || field.type === 'image' ? 'md:col-span-2' : ''}>
                    <CMSFieldRenderer
                      field={field}
                      item={editItem}
                      onChange={(val) => setEditItem({ ...editItem, [field.key]: val })}
                      uploadImage={uploadImage}
                    />
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
                  className="flex items-center gap-1.5 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
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

export default CMSContentEditor;
