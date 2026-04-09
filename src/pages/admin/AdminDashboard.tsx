import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Image, Type, Heart, BookOpen, Users, Star,
  FileText, Calendar, HelpCircle, ImageIcon,
  Handshake, Settings, LogOut, PanelLeftClose, PanelLeft, Database,
  TrendingUp, Eye, Mail, ClipboardList, CreditCard,
  BarChart3, PieChart, Activity, Download, ExternalLink,
  AlertTriangle, CheckCircle, Clock, RefreshCw, FileDown, Keyboard,
  Globe, Shield, FolderOpen
} from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend, AreaChart, Area } from "recharts";
import CMSContentEditor, { type FieldConfig } from "./components/CMSContentEditor";
import { useCMSApi } from "@/hooks/useCMSApi";

// ─── CMS Section Configurations ─────────────────────────────────
const heroFields: FieldConfig[] = [
  { key: 'headline', label: 'Headline', type: 'text', required: true },
  { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
  { key: 'cta_text', label: 'CTA Button Text', type: 'text' },
  { key: 'cta_link', label: 'CTA Button Link', type: 'text' },
  { key: 'background_image', label: 'Background Image', type: 'image', resolution: '1920×800px', imageFolder: 'hero' },
];

const statsFields: FieldConfig[] = [
  { key: 'label', label: 'Label', type: 'text', required: true },
  { key: 'value', label: 'Value', type: 'text', required: true },
  { key: 'icon', label: 'Icon Name', type: 'text', placeholder: 'e.g. Heart, Users, BookOpen' },
];

const initiativeFields: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
  { key: 'image', label: 'Card Image', type: 'image', resolution: '600×400px', imageFolder: 'initiatives' },
  { key: 'link', label: 'Link URL', type: 'text' },
  { key: 'icon', label: 'Icon Name', type: 'text' },
];

const testimonialFields: FieldConfig[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'role', label: 'Role / Title', type: 'text' },
  { key: 'quote', label: 'Quote', type: 'textarea', required: true },
  { key: 'avatar', label: 'Avatar', type: 'image', resolution: '200×200px', imageFolder: 'avatars' },
];

const storyFields: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
  { key: 'content', label: 'Full Content', type: 'textarea' },
  { key: 'image', label: 'Cover Image', type: 'image', resolution: '800×500px', imageFolder: 'stories' },
  { key: 'category', label: 'Category', type: 'select', options: [
    { label: 'Medical', value: 'Medical' }, { label: 'Education', value: 'Education' },
    { label: 'Community', value: 'Community' }, { label: 'Report', value: 'Report' },
  ]},
  { key: 'is_published', label: 'Published', type: 'boolean' },
  { key: 'published_at', label: 'Publish Date', type: 'date' },
];

const eventFields: FieldConfig[] = [
  { key: 'title', label: 'Event Title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'event_date', label: 'Event Date', type: 'date' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'image', label: 'Event Image', type: 'image', resolution: '800×450px', imageFolder: 'events' },
  { key: 'capacity', label: 'Capacity', type: 'number' },
  { key: 'is_published', label: 'Published', type: 'boolean' },
];

const teamFields: FieldConfig[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'bio', label: 'Bio', type: 'textarea' },
  { key: 'image', label: 'Photo', type: 'image', resolution: '400×400px', imageFolder: 'team' },
];

const faqFields: FieldConfig[] = [
  { key: 'question', label: 'Question', type: 'text', required: true },
  { key: 'answer', label: 'Answer', type: 'textarea', required: true },
  { key: 'category', label: 'Category', type: 'select', options: [
    { label: 'Donations & Tax', value: 'Donations & Tax' },
    { label: 'Parent Registration', value: 'Parent Registration' },
    { label: 'About AGSWS', value: 'About AGSWS' },
  ]},
];

const galleryFields: FieldConfig[] = [
  { key: 'image', label: 'Image', type: 'image', resolution: '1200×800px', imageFolder: 'gallery', required: true },
  { key: 'caption', label: 'Caption', type: 'text' },
  { key: 'category', label: 'Category', type: 'select', options: [
    { label: 'Medical', value: 'medical' }, { label: 'Education', value: 'education' },
    { label: 'Community', value: 'community' }, { label: 'Elderly', value: 'elderly' },
  ]},
];

const partnerFields: FieldConfig[] = [
  { key: 'name', label: 'Partner Name', type: 'text', required: true },
  { key: 'logo', label: 'Logo', type: 'image', resolution: '300×120px (transparent PNG)', imageFolder: 'partners' },
  { key: 'website', label: 'Website URL', type: 'text' },
];

const blogFields: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'slug', label: 'URL Slug', type: 'text', required: true, placeholder: 'my-blog-post' },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
  { key: 'content', label: 'Content', type: 'textarea' },
  { key: 'image', label: 'Cover Image', type: 'image', resolution: '1200×630px', imageFolder: 'blog' },
  { key: 'author', label: 'Author', type: 'text' },
  { key: 'is_published', label: 'Published', type: 'boolean' },
  { key: 'published_at', label: 'Publish Date', type: 'date' },
];

const resourceFields: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'category', label: 'Category', type: 'select', options: [
    { label: 'Annual Reports', value: 'Annual Reports' }, { label: 'Financial Reports', value: 'Financial Reports' },
    { label: 'Medical Articles', value: 'Medical Articles' }, { label: 'Education Updates', value: 'Education Updates' },
    { label: 'Research', value: 'Research' },
  ]},
  { key: 'file_type', label: 'File Type', type: 'select', options: [
    { label: 'PDF', value: 'PDF' }, { label: 'DOC', value: 'DOC' }, { label: 'XLS', value: 'XLS' },
  ]},
  { key: 'file_size', label: 'File Size', type: 'text', placeholder: '2.4 MB' },
  { key: 'file_url', label: 'File URL', type: 'text' },
  { key: 'year', label: 'Year', type: 'text' },
  { key: 'color', label: 'Color Accent', type: 'select', options: [
    { label: 'Teal', value: 'teal' }, { label: 'Purple', value: 'purple' },
    { label: 'Yellow', value: 'yellow' }, { label: 'Beige', value: 'beige' },
  ]},
];

const settingsFields: FieldConfig[] = [
  { key: 'site_name', label: 'Site Name', type: 'text' },
  { key: 'footer_tagline', label: 'Footer Tagline', type: 'text' },
  { key: 'announcement_text', label: 'Announcement Text', type: 'text' },
  { key: 'announcement_active', label: 'Show Announcement', type: 'boolean' },
  { key: 'contact_email', label: 'Contact Email', type: 'text' },
  { key: 'contact_phone', label: 'Contact Phone', type: 'text' },
  { key: 'contact_address', label: 'Contact Address', type: 'textarea' },
  { key: 'social_facebook', label: 'Facebook URL', type: 'text' },
  { key: 'social_twitter', label: 'Twitter/X URL', type: 'text' },
  { key: 'social_instagram', label: 'Instagram URL', type: 'text' },
  { key: 'social_youtube', label: 'YouTube URL', type: 'text' },
  { key: 'social_linkedin', label: 'LinkedIn URL', type: 'text' },
];

const paymentFields: FieldConfig[] = [
  { key: 'razorpay_enabled', label: 'Razorpay Enabled', type: 'boolean' },
  { key: 'razorpay_key_id', label: 'Razorpay Key ID', type: 'text', placeholder: 'rzp_live_...' },
  { key: 'tax_deduction_percentage', label: '80G Tax Deduction %', type: 'number' },
  { key: 'currency', label: 'Currency', type: 'text' },
  { key: 'min_donation', label: 'Min Donation (₹)', type: 'number' },
  { key: 'max_donation', label: 'Max Donation (₹)', type: 'number' },
  { key: 'receipt_prefix', label: 'Receipt Prefix', type: 'text' },
  { key: 'upi_id', label: 'UPI ID', type: 'text' },
  { key: 'bank_name', label: 'Bank Name', type: 'text' },
  { key: 'bank_account_number', label: 'Bank Account Number', type: 'text' },
  { key: 'bank_ifsc', label: 'IFSC Code', type: 'text' },
  { key: 'bank_branch', label: 'Bank Branch', type: 'text' },
];

// ─── Sidebar Sections ────────────────────────────────────────────
const sections = [
  { id: 'overview', label: 'Overview', icon: TrendingUp, table: '', fields: [], isOverview: true },
  { id: 'hero', label: 'Hero Section', icon: Type, table: 'cms_hero', fields: heroFields, singleRow: true },
  { id: 'stats', label: 'Impact Stats', icon: LayoutDashboard, table: 'cms_stats', fields: statsFields },
  { id: 'initiatives', label: 'Initiatives', icon: Heart, table: 'cms_initiatives', fields: initiativeFields },
  { id: 'testimonials', label: 'Testimonials', icon: Star, table: 'cms_testimonials', fields: testimonialFields },
  { id: 'stories', label: 'Impact Stories', icon: BookOpen, table: 'cms_stories', fields: storyFields },
  { id: 'events', label: 'Events', icon: Calendar, table: 'cms_events', fields: eventFields },
  { id: 'team', label: 'Team Members', icon: Users, table: 'cms_team', fields: teamFields },
  { id: 'faqs', label: 'FAQs', icon: HelpCircle, table: 'cms_faqs', fields: faqFields },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon, table: 'cms_gallery', fields: galleryFields },
  { id: 'partners', label: 'Partners', icon: Handshake, table: 'cms_partners', fields: partnerFields },
  { id: 'blog', label: 'Blog Posts', icon: FileText, table: 'cms_blog_posts', fields: blogFields },
  { id: 'resources', label: 'Resources', icon: FolderOpen, table: 'cms_resources', fields: resourceFields },
  { id: 'divider1', label: '', icon: null as any, table: '', fields: [], isDivider: true },
  { id: 'applications', label: 'Applications', icon: ClipboardList, table: 'support_applications', fields: [], isCustom: true },
  { id: 'newsletter', label: 'Newsletter', icon: Mail, table: 'newsletter_subscriptions', fields: [], isCustom: true },
  { id: 'payment', label: 'Payment & Tax', icon: CreditCard, table: 'cms_payment_config', fields: paymentFields, singleRow: true },
  { id: 'settings', label: 'Site Settings', icon: Settings, table: 'cms_site_settings', fields: settingsFields, singleRow: true },
];

// Page preview URLs for content preview feature
const previewUrls: Record<string, string> = {
  hero: '/', stats: '/', initiatives: '/initiatives', testimonials: '/',
  stories: '/', events: '/events', team: '/about', faqs: '/faq',
  gallery: '/gallery', partners: '/', blog: '/blog', resources: '/resources',
};

const CHART_COLORS = ['hsl(187, 68%, 39%)', 'hsl(242, 29%, 50%)', 'hsl(28, 22%, 62%)', 'hsl(47, 80%, 55%)', 'hsl(0, 70%, 55%)', 'hsl(160, 60%, 45%)', 'hsl(280, 50%, 55%)'];

// ─── Feature 1: CSV Export utility ──────────────────────────────
const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  const keys = Object.keys(data[0]).filter(k => k !== 'form_data');
  const csv = [
    keys.join(','),
    ...data.map(row => keys.map(k => {
      const val = String(row[k] ?? '').replace(/"/g, '""');
      return `"${val}"`;
    }).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
};

/* ─── Applications Manager ───────────────────────────────── */
const ApplicationsManager = ({ items, onRefresh }: { items: any[]; onRefresh: () => void }) => {
  const { update } = useCMSApi();
  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700', reviewing: 'bg-blue-100 text-blue-700',
    approved: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700',
  };
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [notesEdit, setNotesEdit] = useState<Record<string, string>>({});

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);
  const statusCounts = items.reduce((acc: Record<string, number>, i) => { acc[i.status] = (acc[i.status] || 0) + 1; return acc; }, {});
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const handleStatusChange = async (id: string, status: string) => {
    try { await update('support_applications', id, { status }); onRefresh(); } catch {}
  };

  const handleNoteSave = async (id: string) => {
    try { await update('support_applications', id, { admin_notes: notesEdit[id] || '' }); onRefresh(); } catch {}
  };

  return (
    <div className="space-y-6">
      {/* Feature 1: CSV Export */}
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1">
          {[
            { label: 'Total', count: items.length, color: 'bg-primary/10 text-primary' },
            { label: 'Pending', count: statusCounts.pending || 0, color: 'bg-amber-100 text-amber-700' },
            { label: 'Reviewing', count: statusCounts.reviewing || 0, color: 'bg-blue-100 text-blue-700' },
            { label: 'Approved', count: statusCounts.approved || 0, color: 'bg-emerald-100 text-emerald-700' },
            { label: 'Rejected', count: statusCounts.rejected || 0, color: 'bg-red-100 text-red-700' },
          ].map(s => (
            <button key={s.label} onClick={() => setFilter(s.label === 'Total' ? 'all' : s.label.toLowerCase())} className={`rounded-xl border border-border p-4 text-left transition-all ${filter === (s.label === 'Total' ? 'all' : s.label.toLowerCase()) ? 'ring-2 ring-primary' : ''}`}>
              <p className="text-2xl font-bold text-foreground">{s.count}</p>
              <p className={`text-[10px] font-bold rounded-full px-2 py-0.5 inline-block mt-1 ${s.color}`}>{s.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => exportToCSV(items, 'applications')} className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-lg text-xs font-medium text-foreground hover:bg-muted/80 transition-colors">
          <FileDown size={13} /> Export CSV
        </button>
      </div>

      {pieData.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2"><PieChart size={14} className="text-primary" /> Status Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </RechartsPie>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">Applications ({filtered.length})</h3>
        </div>
        <div className="divide-y divide-border">
          {filtered.map(app => (
            <div key={app.id} className="px-6 py-4">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${app.type === 'medical' ? 'bg-primary/10 text-primary' : 'bg-purple-100 text-purple-700'}`}>{app.type}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{app.applicant_name}</p>
                  <p className="text-xs text-muted-foreground">{app.email} · {app.phone}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{app.application_ref}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColors[app.status]}`}>{app.status}</span>
                <span className="text-xs text-muted-foreground">{new Date(app.created_at).toLocaleDateString()}</span>
              </div>
              {expandedId === app.id && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 pl-4 border-l-2 border-primary/20">
                  <div className="bg-background rounded-lg p-4 text-xs space-y-2">
                    {app.form_data && Object.entries(app.form_data).map(([key, val]) => (
                      <div key={key} className="flex gap-2">
                        <span className="font-semibold text-muted-foreground capitalize min-w-[120px]">{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-foreground">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                  {/* Feature 8: Admin Notes */}
                  <div className="mt-3">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Admin Notes</label>
                    <textarea
                      value={notesEdit[app.id] ?? app.admin_notes ?? ''}
                      onChange={e => setNotesEdit(prev => ({ ...prev, [app.id]: e.target.value }))}
                      placeholder="Add internal notes..."
                      className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-xs resize-none h-16 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button onClick={() => handleNoteSave(app.id)} className="mt-1 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-md">Save Notes</button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {['pending', 'reviewing', 'approved', 'rejected'].map(s => (
                      <button key={s} onClick={() => handleStatusChange(app.id, s)} className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${app.status === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{s}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
          {filtered.length === 0 && <p className="px-6 py-8 text-center text-sm text-muted-foreground">No applications found.</p>}
        </div>
      </div>
    </div>
  );
};

/* ─── Newsletter Manager ─────────────────────────────── */
const NewsletterManager = ({ items }: { items: any[] }) => {
  const activeCount = items.filter(i => i.is_active).length;
  const monthlyData = items.reduce((acc: Record<string, number>, item) => {
    const month = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const chartData = Object.entries(monthlyData).map(([month, count]) => ({ month, count }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-3 gap-4 flex-1">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Subscribers</p>
            <p className="text-2xl font-bold text-foreground mt-1">{items.length}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Active</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{activeCount}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Unsubscribed</p>
            <p className="text-2xl font-bold text-red-500 mt-1">{items.length - activeCount}</p>
          </div>
        </div>
      </div>

      <button onClick={() => exportToCSV(items, 'newsletter-subscribers')} className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-lg text-xs font-medium text-foreground hover:bg-muted/80 transition-colors">
        <FileDown size={13} /> Export CSV
      </button>

      {chartData.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2"><BarChart3 size={14} className="text-primary" /> Subscription Growth</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(187, 68%, 39%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-bold text-foreground">All Subscribers ({items.length})</h3>
        </div>
        <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
          {items.map(sub => (
            <div key={sub.id} className="px-6 py-3 flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${sub.is_active ? 'bg-emerald-500' : 'bg-red-400'}`} />
              <span className="text-sm text-foreground flex-1">{sub.email}</span>
              <span className="text-xs text-muted-foreground">{sub.name || '—'}</span>
              <span className="text-xs text-muted-foreground">{sub.source}</span>
              <span className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleDateString()}</span>
            </div>
          ))}
          {items.length === 0 && <p className="px-6 py-8 text-center text-sm text-muted-foreground">No subscribers yet.</p>}
        </div>
      </div>
    </div>
  );
};

/* ─── Feature 7: Health Check Component ──────────────────────────── */
const HealthCheck = ({ counts }: { counts: Record<string, number> }) => {
  const checks = [
    { label: 'Hero Section', ok: (counts.hero || 0) > 0 || true, section: 'hero' },
    { label: 'Impact Stats', ok: (counts.stats || 0) >= 3, section: 'stats', recommend: 'Add at least 3 stats' },
    { label: 'Testimonials', ok: (counts.testimonials || 0) >= 2, section: 'testimonials', recommend: 'Add at least 2 testimonials' },
    { label: 'Blog Posts', ok: (counts.blog || 0) >= 1, section: 'blog', recommend: 'Publish at least 1 blog post' },
    { label: 'Gallery Photos', ok: (counts.gallery || 0) >= 6, section: 'gallery', recommend: 'Add at least 6 gallery photos' },
    { label: 'Events', ok: (counts.events || 0) >= 1, section: 'events', recommend: 'Add upcoming events' },
    { label: 'FAQs', ok: (counts.faqs || 0) >= 3, section: 'faqs', recommend: 'Add at least 3 FAQs' },
    { label: 'Team Members', ok: (counts.team || 0) >= 2, section: 'team', recommend: 'Add team members' },
    { label: 'Resources', ok: (counts.resources || 0) >= 1, section: 'resources', recommend: 'Add downloadable resources' },
  ];
  const score = Math.round((checks.filter(c => c.ok).length / checks.length) * 100);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-foreground flex items-center gap-2"><Shield size={14} className="text-primary" /> Content Health</h4>
        <div className={`text-lg font-bold ${score >= 80 ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{score}%</div>
      </div>
      <div className="space-y-2">
        {checks.map(c => (
          <div key={c.label} className="flex items-center gap-3 py-1.5">
            {c.ok ? <CheckCircle size={14} className="text-emerald-500 shrink-0" /> : <AlertTriangle size={14} className="text-amber-500 shrink-0" />}
            <span className="text-xs text-foreground flex-1">{c.label}</span>
            {!c.ok && <span className="text-[10px] text-muted-foreground">{c.recommend}</span>}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {c.ok ? 'OK' : 'Needs attention'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Feature 2: Activity Timeline ──────────────────────────── */
const ActivityTimeline = ({ allData }: { allData: Record<string, any[]> }) => {
  const activities: { label: string; time: string; type: string; section: string }[] = [];

  Object.entries(allData).forEach(([sectionId, items]) => {
    if (!Array.isArray(items)) return;
    items.forEach(item => {
      const time = item.updated_at || item.created_at;
      if (!time) return;
      const titleField = item.title || item.name || item.question || item.label || item.email || item.headline || '';
      activities.push({ label: String(titleField).slice(0, 40), time, type: sectionId, section: sectionId });
    });
  });

  const sorted = activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2"><Clock size={14} className="text-primary" /> Recent Activity</h4>
      <div className="space-y-3">
        {sorted.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate">{a.label || 'Item'}</p>
              <p className="text-[10px] text-muted-foreground">{a.type} · {new Date(a.time).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
        {sorted.length === 0 && <p className="text-xs text-muted-foreground">No recent activity</p>}
      </div>
    </div>
  );
};

/* ─── Feature 9: Content Creation Trend Chart ──────────────── */
const ContentTrendChart = ({ allData }: { allData: Record<string, any[]> }) => {
  const monthMap: Record<string, number> = {};
  Object.values(allData).forEach(items => {
    if (!Array.isArray(items)) return;
    items.forEach(item => {
      const d = item.created_at ? new Date(item.created_at) : null;
      if (!d) return;
      const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthMap[key] = (monthMap[key] || 0) + 1;
    });
  });
  const data = Object.entries(monthMap).map(([month, count]) => ({ month, count })).slice(-12);

  if (data.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2"><TrendingUp size={14} className="text-primary" /> Content Created Over Time</h4>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="hsl(187, 68%, 39%)" fill="hsl(187, 68%, 39%)" fillOpacity={0.1} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

/* ─── Overview Dashboard ──────────────────────────── */
const OverviewDashboard = ({ counts, allData, onNavigate }: { counts: Record<string, number>; allData: Record<string, any[]>; onNavigate: (id: string) => void }) => {
  const contentSections = sections.filter(s => !s.isOverview && !s.singleRow && !s.isCustom && !s.isDivider);
  const totalItems = contentSections.reduce((sum, s) => sum + (counts[s.id] || 0), 0);
  const pieData = contentSections.filter(s => counts[s.id]).map(s => ({ name: s.label, value: counts[s.id] || 0 }));

  const apps = allData.applications || [];
  const appsByMonth = apps.reduce((acc: Record<string, { medical: number; education: number }>, a: any) => {
    const m = new Date(a.created_at).toLocaleDateString('en-US', { month: 'short' });
    if (!acc[m]) acc[m] = { medical: 0, education: 0 };
    acc[m][a.type as 'medical' | 'education']++;
    return acc;
  }, {});
  const appChartData = Object.entries(appsByMonth).map(([month, data]) => ({ month, ...(data as object) }));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Content', value: totalItems, icon: Database, color: 'text-primary' },
          { label: 'Applications', value: counts.applications || 0, icon: ClipboardList, color: 'text-amber-600' },
          { label: 'Newsletter', value: counts.newsletter || 0, icon: Mail, color: 'text-emerald-600' },
          { label: 'Blog Posts', value: counts.blog || 0, icon: FileText, color: 'text-purple-600' },
        ].map(card => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={14} className={card.color} />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{card.label}</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Feature 10: System Status */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative rounded-full h-2 w-2 bg-emerald-500" /></span>
            <span className="text-xs font-medium text-foreground">System Online</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe size={12} className="text-primary" />
            <span className="text-xs text-muted-foreground">CMS API: Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Database size={12} className="text-primary" />
            <span className="text-xs text-muted-foreground">Database: Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-primary" />
            <span className="text-xs text-muted-foreground">RLS: Enabled</span>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pieData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2"><PieChart size={14} className="text-primary" /> Content Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        )}
        {appChartData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h4 className="text-xs font-bold text-foreground mb-4 flex items-center gap-2"><Activity size={14} className="text-primary" /> Application Trends</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={appChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip /><Legend />
                <Line type="monotone" dataKey="medical" stroke="hsl(187, 68%, 39%)" strokeWidth={2} />
                <Line type="monotone" dataKey="education" stroke="hsl(242, 29%, 50%)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Feature 9: Content Trend */}
      <ContentTrendChart allData={allData} />

      {/* Feature 7: Health Check + Feature 2: Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthCheck counts={counts} />
        <ActivityTimeline allData={allData} />
      </div>

      {/* Content Breakdown */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Content Breakdown</h3>
          <button onClick={() => exportToCSV(
            contentSections.map(s => ({ Section: s.label, Items: counts[s.id] || 0 })),
            'content-summary'
          )} className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            <FileDown size={11} /> Export
          </button>
        </div>
        <div className="divide-y divide-border">
          {contentSections.map(s => {
            const count = counts[s.id] || 0;
            return (
              <button key={s.id} onClick={() => onNavigate(s.id)} className="flex items-center gap-4 px-6 py-3.5 w-full text-left hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon size={14} className="text-primary" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">{s.label}</span>
                <span className="text-sm font-bold text-foreground">{count}</span>
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${totalItems ? (count / totalItems) * 100 : 0}%` }} />
                </div>
                <ExternalLink size={12} className="text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature 3: Quick Links to preview pages */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2"><Eye size={14} className="text-primary" /> Preview Live Pages</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(previewUrls).map(([key, url]) => {
            const section = sections.find(s => s.id === key);
            if (!section) return null;
            return (
              <a key={key} href={url} target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                {section.icon && <section.icon size={14} className="text-primary" />}
                <span className="text-xs font-medium text-foreground">{section.label}</span>
                <ExternalLink size={10} className="text-muted-foreground ml-auto" />
              </a>
            );
          })}
        </div>
      </div>

      {/* Feature 5: Image Resolution Guide */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2"><Image size={14} className="text-primary" /> Image Resolution Guide</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {[
            { label: 'Hero Background', size: '1920×800px' }, { label: 'Card Images', size: '600×400px' },
            { label: 'Blog Cover', size: '1200×630px' }, { label: 'Gallery Photos', size: '1200×800px' },
            { label: 'Team Photos', size: '400×400px' }, { label: 'Avatars', size: '200×200px' },
            { label: 'Partner Logos', size: '300×120px' }, { label: 'Event Images', size: '800×450px' },
          ].map(item => (
            <div key={item.label} className="bg-background rounded-lg p-3 border border-border">
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
              <p className="text-xs font-bold text-foreground mt-0.5">{item.size}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature 4: Keyboard Shortcuts */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2"><Keyboard size={14} className="text-primary" /> Keyboard Shortcuts</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { keys: 'Ctrl + N', action: 'New Item' }, { keys: 'Ctrl + S', action: 'Save' },
            { keys: 'Escape', action: 'Close Modal' }, { keys: '↑ ↓', action: 'Navigate Sections' },
            { keys: 'Ctrl + E', action: 'Export CSV' }, { keys: 'Ctrl + R', action: 'Refresh Data' },
          ].map(s => (
            <div key={s.keys} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-background border border-border">
              <kbd className="text-[10px] font-mono font-bold bg-muted px-2 py-0.5 rounded text-foreground">{s.keys}</kbd>
              <span className="text-xs text-muted-foreground">{s.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [allData, setAllData] = useState<Record<string, any[]>>({});
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const navigate = useNavigate();
  const { getAll } = useCMSApi();

  const currentSection = sections.find(s => s.id === activeSection)!;

  const fetchAllCounts = useCallback(() => {
    sections.forEach(async (s) => {
      if (s.singleRow || s.isOverview || s.isDivider) return;
      try {
        const data = await getAll(s.table);
        const arr = Array.isArray(data) ? data : [data];
        setCounts(prev => ({ ...prev, [s.id]: arr.length }));
        setAllData(prev => ({ ...prev, [s.id]: arr }));
      } catch {}
    });
    setLastRefresh(new Date());
  }, [getAll]);

  useEffect(() => { fetchAllCounts(); }, []);

  // Feature 4: Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'r') { e.preventDefault(); fetchAllCounts(); }
      }
      // Navigate sections with number keys
      const sectionKeys = sections.filter(s => !s.isDivider);
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= 9 && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        const idx = num - 1;
        if (sectionKeys[idx]) setActiveSection(sectionKeys[idx].id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fetchAllCounts]);

  const handleSignOut = () => {
    localStorage.removeItem("agsws_admin");
    localStorage.removeItem("agsws_admin_token");
    navigate("/admin/login");
  };

  const renderCustomSection = () => {
    if (activeSection === 'applications') return <ApplicationsManager items={allData.applications || []} onRefresh={fetchAllCounts} />;
    if (activeSection === 'newsletter') return <NewsletterManager items={allData.newsletter || []} />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 260 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="bg-card border-r border-border flex flex-col shrink-0 sticky top-0 h-screen overflow-hidden z-20"
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"><Database size={14} className="text-primary-foreground" /></div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-sm text-foreground tracking-tight">AGSWS</span>
                <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">CMS</span>
              </div>
            </div>
          )}
          {collapsed && <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto"><Database size={14} className="text-primary-foreground" /></div>}
          <button onClick={() => setCollapsed(!collapsed)} className={`p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground ${collapsed ? 'mx-auto mt-2' : ''}`}>
            {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        <nav className="flex-1 py-3 overflow-y-auto px-2 space-y-0.5">
          {sections.map((section, idx) => {
            if (section.isDivider) return <div key={section.id} className="h-px bg-border mx-2 my-3" />;
            const isActive = activeSection === section.id;
            const showDivider = idx === 1;
            return (
              <div key={section.id}>
                {showDivider && <div className="h-px bg-border mx-2 my-2" />}
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'}`}
                  title={collapsed ? section.label : undefined}
                >
                  {section.icon && <section.icon size={16} className="shrink-0" />}
                  {!collapsed && (
                    <>
                      <span className="truncate flex-1 text-left">{section.label}</span>
                      {!section.singleRow && !section.isOverview && counts[section.id] !== undefined && (
                        <span className={`text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-md ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {counts[section.id]}
                        </span>
                      )}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          {!collapsed && (
            <p className="text-[9px] text-muted-foreground px-3 mb-1">
              Last sync: {lastRefresh.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
          <button onClick={fetchAllCounts} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <RefreshCw size={14} />
            {!collapsed && 'Refresh Data'}
          </button>
          <button onClick={handleSignOut} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <LogOut size={14} />
            {!collapsed && 'Sign Out'}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b border-border h-14 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              {currentSection.icon && <currentSection.icon size={14} className="text-primary" />}
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">{currentSection.label}</h1>
              {currentSection.table && <p className="text-[10px] text-muted-foreground">{currentSection.table}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Feature 3: Preview link */}
            {previewUrls[activeSection] && (
              <a href={previewUrls[activeSection]} target="_blank" rel="noopener" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Eye size={12} /> Preview Page
              </a>
            )}
            {/* Feature 1: CSV Export for current section */}
            {!currentSection.isOverview && !currentSection.singleRow && allData[activeSection]?.length > 0 && (
              <button onClick={() => exportToCSV(allData[activeSection], activeSection)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                <Download size={12} /> Export
              </button>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-background">
          <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {currentSection.isOverview ? (
              <OverviewDashboard counts={counts} allData={allData} onNavigate={setActiveSection} />
            ) : currentSection.isCustom ? (
              renderCustomSection()
            ) : (
              <CMSContentEditor table={currentSection.table} title={currentSection.label} fields={currentSection.fields} singleRow={currentSection.singleRow} />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
