
-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- CMS Hero
CREATE TABLE public.cms_hero (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE DEFAULT 'main',
  headline TEXT NOT NULL DEFAULT 'Every Life Deserves Compassion',
  subtitle TEXT NOT NULL DEFAULT 'Providing medical aid, education support, and hope to underserved communities across Kolkata.',
  cta_text TEXT NOT NULL DEFAULT 'Donate Now',
  cta_link TEXT NOT NULL DEFAULT '/donate',
  background_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_hero ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_hero" ON public.cms_hero FOR SELECT USING (true);
CREATE TRIGGER update_cms_hero_ts BEFORE UPDATE ON public.cms_hero FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS Stats
CREATE TABLE public.cms_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_stats" ON public.cms_stats FOR SELECT USING (true);
CREATE TRIGGER update_cms_stats_ts BEFORE UPDATE ON public.cms_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS Initiatives
CREATE TABLE public.cms_initiatives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  link TEXT,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_initiatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_initiatives" ON public.cms_initiatives FOR SELECT USING (true);
CREATE TRIGGER update_cms_initiatives_ts BEFORE UPDATE ON public.cms_initiatives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS Testimonials
CREATE TABLE public.cms_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  quote TEXT NOT NULL,
  avatar TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_testimonials" ON public.cms_testimonials FOR SELECT USING (true);
CREATE TRIGGER update_cms_testimonials_ts BEFORE UPDATE ON public.cms_testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS Stories
CREATE TABLE public.cms_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  category TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_stories" ON public.cms_stories FOR SELECT USING (is_published = true);
CREATE TRIGGER update_cms_stories_ts BEFORE UPDATE ON public.cms_stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS Events
CREATE TABLE public.cms_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ,
  location TEXT,
  image TEXT,
  capacity INT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_events" ON public.cms_events FOR SELECT USING (is_published = true);
CREATE TRIGGER update_cms_events_ts BEFORE UPDATE ON public.cms_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS Team
CREATE TABLE public.cms_team (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  image TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_team ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_team" ON public.cms_team FOR SELECT USING (true);
CREATE TRIGGER update_cms_team_ts BEFORE UPDATE ON public.cms_team FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS FAQs
CREATE TABLE public.cms_faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_faqs" ON public.cms_faqs FOR SELECT USING (true);
CREATE TRIGGER update_cms_faqs_ts BEFORE UPDATE ON public.cms_faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS Gallery
CREATE TABLE public.cms_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image TEXT NOT NULL,
  caption TEXT,
  category TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_gallery" ON public.cms_gallery FOR SELECT USING (true);
CREATE TRIGGER update_cms_gallery_ts BEFORE UPDATE ON public.cms_gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS Partners
CREATE TABLE public.cms_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  website TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_partners" ON public.cms_partners FOR SELECT USING (true);
CREATE TRIGGER update_cms_partners_ts BEFORE UPDATE ON public.cms_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS Blog Posts
CREATE TABLE public.cms_blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  author TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_blog_posts" ON public.cms_blog_posts FOR SELECT USING (is_published = true);
CREATE TRIGGER update_cms_blog_posts_ts BEFORE UPDATE ON public.cms_blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CMS Site Settings (single row)
CREATE TABLE public.cms_site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_name TEXT NOT NULL DEFAULT 'AGSWS',
  footer_tagline TEXT DEFAULT 'Every life deserves compassion',
  announcement_text TEXT,
  announcement_active BOOLEAN NOT NULL DEFAULT false,
  social_facebook TEXT,
  social_twitter TEXT,
  social_instagram TEXT,
  social_youtube TEXT,
  social_linkedin TEXT,
  contact_email TEXT DEFAULT 'info@agsws.org',
  contact_phone TEXT,
  contact_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_site_settings" ON public.cms_site_settings FOR SELECT USING (true);
CREATE TRIGGER update_cms_site_settings_ts BEFORE UPDATE ON public.cms_site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings row
INSERT INTO public.cms_site_settings (site_name) VALUES ('AGSWS');

-- Storage bucket for CMS uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-uploads', 'cms-uploads', true);

-- Storage policies
CREATE POLICY "Public read cms uploads" ON storage.objects FOR SELECT USING (bucket_id = 'cms-uploads');
CREATE POLICY "Authenticated upload cms" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms-uploads');
CREATE POLICY "Authenticated update cms" ON storage.objects FOR UPDATE USING (bucket_id = 'cms-uploads');
CREATE POLICY "Authenticated delete cms" ON storage.objects FOR DELETE USING (bucket_id = 'cms-uploads');
