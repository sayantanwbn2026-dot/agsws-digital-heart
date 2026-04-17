CREATE TABLE IF NOT EXISTS public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text UNIQUE,
  stripe_payment_intent text,
  cause text NOT NULL CHECK (cause IN ('medical','education','goldenage')),
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  donor_phone text,
  is_gift boolean DEFAULT false,
  gift_recipient_name text,
  gift_recipient_email text,
  gift_message text,
  show_on_wall boolean DEFAULT true,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','succeeded','failed','refunded')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS donations_email_idx ON public.donations(donor_email);
CREATE INDEX IF NOT EXISTS donations_status_idx ON public.donations(status);
CREATE INDEX IF NOT EXISTS donations_created_at_idx ON public.donations(created_at DESC);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read wall donations"
  ON public.donations FOR SELECT
  USING (status = 'succeeded' AND show_on_wall = true);

CREATE TRIGGER donations_updated_at
  BEFORE UPDATE ON public.donations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.goldenage_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_ref text UNIQUE NOT NULL DEFAULT ('REG-' || upper(substr(md5(random()::text), 1, 8))),
  stripe_session_id text UNIQUE,
  stripe_payment_intent text,
  registrant_name text NOT NULL,
  registrant_email text NOT NULL,
  registrant_phone text NOT NULL,
  registrant_city text,
  relation text,
  parent_name text NOT NULL,
  parent_age integer,
  parent_address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  medical_condition text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','active','cancelled')),
  amount_cents integer NOT NULL DEFAULT 10000,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.goldenage_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public read goldenage" ON public.goldenage_registrations FOR SELECT USING (false);

CREATE TRIGGER goldenage_updated_at
  BEFORE UPDATE ON public.goldenage_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();