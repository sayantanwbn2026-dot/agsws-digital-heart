ALTER TABLE public.cms_hero
  ADD COLUMN IF NOT EXISTS live_activity_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS live_activity_message text DEFAULT 'Anjali from Pune donated ₹1,000 to Medical Aid',
  ADD COLUMN IF NOT EXISTS live_activity_time_label text DEFAULT 'Just now';