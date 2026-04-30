-- ─── cms_updates: field updates managed by admin ─────────────
CREATE TABLE IF NOT EXISTS public.cms_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  category text NOT NULL DEFAULT 'field',
  update_date date NOT NULL DEFAULT CURRENT_DATE,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_updates"
  ON public.cms_updates FOR SELECT
  TO public USING (is_published = true);

CREATE TRIGGER trg_cms_updates_updated_at
  BEFORE UPDATE ON public.cms_updates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── cms_videos: gallery videos managed by admin ─────────────
CREATE TABLE IF NOT EXISTS public.cms_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  duration text,
  category text DEFAULT 'community',
  thumbnail text,
  video_url text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read cms_videos"
  ON public.cms_videos FOR SELECT
  TO public USING (is_published = true);

CREATE TRIGGER trg_cms_videos_updated_at
  BEFORE UPDATE ON public.cms_videos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─── Seed cms_updates from existing static data ──────────────
INSERT INTO public.cms_updates (title, excerpt, category, update_date, sort_order) VALUES
('3 Emergency Cases Handled This Week', 'Our medical team responded to 3 emergency cases across North and South Kolkata, with all patients now stable.', 'field', '2025-03-15', 1),
('Education Sponsorship Drive Hits 80% Target', 'We''ve matched 96 of our 120 target children with sponsors for the 2025 academic year.', 'campaign', '2025-03-12', 2),
('Free Medical Camp Announced for April', 'Join us on April 12 at Shyambazar Community Hall for free health screenings and specialist consultations.', 'event', '2025-03-10', 3),
('New Partner Hospital Added to Network', 'We''re proud to announce our 7th partner hospital — expanding coverage to Howrah district.', 'announcement', '2025-03-05', 4),
('Parent Registration Now Open in Howrah', 'Families in Howrah can now register elderly parents for emergency medical support.', 'announcement', '2025-02-28', 5),
('February Field Report: 47 Patients Supported', 'In February, AGSWS supported 47 patients across 4 hospitals with a combined fund deployment of ₹3.2 lakhs.', 'field', '2025-02-25', 6),
('Volunteer Training Batch 6 Completed', '12 new volunteers completed their orientation training and are now assigned to field operations.', 'event', '2025-02-18', 7),
('80G Tax Filing Reminder', 'Donors: your 80G receipts for FY 2024–25 are available in your email. File before March 31 for tax benefits.', 'announcement', '2025-02-10', 8);

-- Seed updates_page section content (subscribe cards copy)
INSERT INTO public.cms_sections (section_key, content) VALUES
('updates_page', jsonb_build_object(
  'email_heading', 'Monthly Impact Letter',
  'email_subtitle', 'One email a month. Real stories. Real numbers. Zero spam.',
  'email_perks', jsonb_build_array('Monthly impact summary','New campaign launches','Beneficiary success stories','Volunteer opportunities'),
  'subscribers_label', '500+ subscribers',
  'whatsapp_heading', 'WhatsApp Field Updates',
  'whatsapp_subtitle', 'Short, real updates from the field — 2–3 times a month. No spam, ever.',
  'whatsapp_perks', jsonb_build_array('Field photos and stories','Emergency support alerts','Event announcements'),
  'whatsapp_phone', '+919876543210',
  'recent_label', 'Recent Updates',
  'recent_heading', 'From the Field'
))
ON CONFLICT DO NOTHING;