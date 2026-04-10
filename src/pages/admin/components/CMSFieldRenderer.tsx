import { ChevronDown } from 'lucide-react';
import CMSImageUpload from './CMSImageUpload';
import { type FieldConfig } from './CMSContentEditor';

interface CMSFieldRendererProps {
  field: FieldConfig;
  item: any;
  onChange: (val: any) => void;
  uploadImage: (file: File, folder?: string) => Promise<string>;
}

const inputClass =
  "no-float w-full rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

const CMSFieldRenderer = ({ field, item, onChange, uploadImage }: CMSFieldRendererProps) => {
  const value = item[field.key];
  const labelEl = (
    <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-wide">
      {field.label} {field.required && <span className="text-destructive">*</span>}
    </label>
  );

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
      <div className="flex items-center gap-3 py-1">
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-primary' : 'bg-muted-foreground/20'}`}
        >
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'left-6' : 'left-1'}`} />
        </button>
        <span className="text-sm font-medium text-foreground">{field.label}</span>
      </div>
    );
  }

  if (field.type === 'select' && field.options) {
    return (
      <div>
        {labelEl}
        <div className="relative">
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`${inputClass} h-10 px-3 pr-9 appearance-none`}
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
      <div>
        {labelEl}
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}…`}
          className={`${inputClass} px-3 py-2.5 resize-none`}
        />
      </div>
    );
  }

  if (field.type === 'date') {
    return (
      <div>
        {labelEl}
        <input
          type="datetime-local"
          value={value ? new Date(value).toISOString().slice(0, 16) : ''}
          onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : null)}
          className={`${inputClass} h-10 px-3`}
        />
      </div>
    );
  }

  return (
    <div>
      {labelEl}
      <input
        type={field.type === 'number' ? 'number' : 'text'}
        value={value ?? ''}
        onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}…`}
        className={`${inputClass} h-10 px-3`}
      />
    </div>
  );
};

export default CMSFieldRenderer;
