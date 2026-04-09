import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Image, Type, Heart, BookOpen, Users, Star,
  FileText, Calendar, HelpCircle, ImageIcon,
  Handshake, Settings, LogOut, PanelLeftClose, PanelLeft, Database
} from "lucide-react";
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
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

const initiativeFields: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea', required: true },
  { key: 'image', label: 'Card Image', type: 'image', resolution: '600×400px', imageFolder: 'initiatives' },
  { key: 'link', label: 'Link URL', type: 'text' },
  { key: 'icon', label: 'Icon Name', type: 'text' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

const testimonialFields: FieldConfig[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'role', label: 'Role / Title', type: 'text' },
  { key: 'quote', label: 'Quote', type: 'textarea', required: true },
  { key: 'avatar', label: 'Avatar', type: 'image', resolution: '200×200px', imageFolder: 'avatars' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

const storyFields: FieldConfig[] = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
  { key: 'content', label: 'Full Content', type: 'textarea' },
  { key: 'image', label: 'Cover Image', type: 'image', resolution: '800×500px', imageFolder: 'stories' },
  { key: 'category', label: 'Category', type: 'select', options: [
    { label: 'Medical', value: 'Medical' },
    { label: 'Education', value: 'Education' },
    { label: 'Community', value: 'Community' },
    { label: 'Report', value: 'Report' },
  ]},
  { key: 'is_published', label: 'Published', type: 'boolean' },
  { key: 'published_at', label: 'Publish Date', type: 'date' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

const eventFields: FieldConfig[] = [
  { key: 'title', label: 'Event Title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'event_date', label: 'Event Date', type: 'date' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'image', label: 'Event Image', type: 'image', resolution: '800×450px', imageFolder: 'events' },
  { key: 'capacity', label: 'Capacity', type: 'number' },
  { key: 'is_published', label: 'Published', type: 'boolean' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

const teamFields: FieldConfig[] = [
  { key: 'name', label: 'Name', type: 'text', required: true },
  { key: 'role', label: 'Role', type: 'text' },
  { key: 'bio', label: 'Bio', type: 'textarea' },
  { key: 'image', label: 'Photo', type: 'image', resolution: '400×400px', imageFolder: 'team' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

const faqFields: FieldConfig[] = [
  { key: 'question', label: 'Question', type: 'text', required: true },
  { key: 'answer', label: 'Answer', type: 'textarea', required: true },
  { key: 'category', label: 'Category', type: 'select', options: [
    { label: 'Donations & Tax', value: 'Donations & Tax' },
    { label: 'Parent Registration', value: 'Parent Registration' },
    { label: 'About AGSWS', value: 'About AGSWS' },
  ]},
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

const galleryFields: FieldConfig[] = [
  { key: 'image', label: 'Image', type: 'image', resolution: '1200×800px', imageFolder: 'gallery', required: true },
  { key: 'caption', label: 'Caption', type: 'text' },
  { key: 'category', label: 'Category', type: 'select', options: [
    { label: 'Medical', value: 'medical' },
    { label: 'Education', value: 'education' },
    { label: 'Community', value: 'community' },
    { label: 'Elderly', value: 'elderly' },
  ]},
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
];

const partnerFields: FieldConfig[] = [
  { key: 'name', label: 'Partner Name', type: 'text', required: true },
  { key: 'logo', label: 'Logo', type: 'image', resolution: '300×120px (transparent PNG)', imageFolder: 'partners' },
  { key: 'website', label: 'Website URL', type: 'text' },
  { key: 'sort_order', label: 'Sort Order', type: 'number' },
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

// ─── Sidebar Sections ────────────────────────────────────────────
const sections = [
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
  { id: 'settings', label: 'Site Settings', icon: Settings, table: 'cms_site_settings', fields: settingsFields, singleRow: true },
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const { getAll } = useCMSApi();

  const currentSection = sections.find(s => s.id === activeSection)!;

  useEffect(() => {
    // Fetch counts for sidebar badges
    sections.forEach(async (s) => {
      if (s.singleRow) return;
      try {
        const data = await getAll(s.table);
        setCounts(prev => ({ ...prev, [s.id]: Array.isArray(data) ? data.length : 0 }));
      } catch {}
    });
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("agsws_admin");
    localStorage.removeItem("agsws_admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 68 : 260 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="bg-card border-r border-border flex flex-col shrink-0 sticky top-0 h-screen overflow-hidden z-20"
      >
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Database size={14} className="text-primary-foreground" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-sm text-foreground tracking-tight">AGSWS</span>
                <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">CMS</span>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <Database size={14} className="text-primary-foreground" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground ${collapsed ? 'mx-auto mt-2' : ''}`}
          >
            {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto px-2 space-y-0.5">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
                title={collapsed ? section.label : undefined}
              >
                <section.icon size={16} className="shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate flex-1 text-left">{section.label}</span>
                    {!section.singleRow && counts[section.id] !== undefined && (
                      <span className={`text-[10px] font-bold min-w-[20px] h-5 flex items-center justify-center rounded-md ${isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {counts[section.id]}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-border">
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
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
              <currentSection.icon size={14} className="text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">{currentSection.label}</h1>
              <p className="text-[10px] text-muted-foreground">
                {currentSection.table}
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-background">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CMSContentEditor
              table={currentSection.table}
              title={currentSection.label}
              fields={currentSection.fields}
              singleRow={currentSection.singleRow}
            />
          </motion.div>

          {/* Resolution Guide */}
          <div className="mt-8 bg-card border border-border rounded-xl p-6">
            <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
              <Image size={14} className="text-primary" />
              Image Resolution Guide
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {[
                { label: 'Hero Background', size: '1920×800px' },
                { label: 'Card Images', size: '600×400px' },
                { label: 'Blog Cover', size: '1200×630px' },
                { label: 'Gallery Photos', size: '1200×800px' },
                { label: 'Team Photos', size: '400×400px' },
                { label: 'Avatars', size: '200×200px' },
                { label: 'Partner Logos', size: '300×120px' },
                { label: 'Event Images', size: '800×450px' },
              ].map(item => (
                <div key={item.label} className="bg-background rounded-lg p-3 border border-border">
                  <p className="text-[10px] text-muted-foreground">{item.label}</p>
                  <p className="text-xs font-bold text-foreground mt-0.5">{item.size}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
