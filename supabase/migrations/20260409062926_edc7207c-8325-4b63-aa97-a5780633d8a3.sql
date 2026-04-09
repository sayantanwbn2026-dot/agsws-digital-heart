
-- 1. Add sort_order to cms_blog_posts
ALTER TABLE public.cms_blog_posts ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- 2. Newsletter subscriptions
CREATE TABLE public.newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  is_active boolean NOT NULL DEFAULT true,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz,
  source text DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX idx_newsletter_email ON public.newsletter_subscriptions(email);

-- Anyone can subscribe (insert)
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscriptions
  FOR INSERT WITH CHECK (true);
-- Public can't read
CREATE POLICY "No public read" ON public.newsletter_subscriptions
  FOR SELECT USING (false);

-- 3. Support applications
CREATE TABLE public.support_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_ref text NOT NULL DEFAULT ('APP-' || upper(substr(md5(random()::text), 1, 8))),
  type text NOT NULL CHECK (type IN ('medical', 'education')),
  applicant_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  form_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.support_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can submit application" ON public.support_applications
  FOR INSERT WITH CHECK (true);
-- No public read
CREATE POLICY "No public read applications" ON public.support_applications
  FOR SELECT USING (false);

-- 4. Payment / financial config (single-row settings)
CREATE TABLE public.cms_payment_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_enabled boolean NOT NULL DEFAULT false,
  tax_deduction_percentage numeric(5,2) NOT NULL DEFAULT 50.00,
  currency text NOT NULL DEFAULT 'INR',
  min_donation integer NOT NULL DEFAULT 100,
  max_donation integer NOT NULL DEFAULT 500000,
  receipt_prefix text NOT NULL DEFAULT 'AGSWS',
  upi_id text,
  bank_name text,
  bank_account_number text,
  bank_ifsc text,
  bank_branch text,
  razorpay_key_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.cms_payment_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read payment config" ON public.cms_payment_config
  FOR SELECT USING (true);

-- Seed a default row
INSERT INTO public.cms_payment_config (tax_deduction_percentage, currency, min_donation, max_donation, receipt_prefix)
VALUES (50.00, 'INR', 100, 500000, 'AGSWS');

-- Update existing blog posts sort_order
UPDATE public.cms_blog_posts SET sort_order = 0 WHERE sort_order = 0;
