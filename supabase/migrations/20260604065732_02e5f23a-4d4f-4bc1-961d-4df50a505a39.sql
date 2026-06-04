CREATE TABLE public.cms_volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id text NOT NULL UNIQUE,
  name text NOT NULL,
  role text DEFAULT 'Volunteer',
  since text,
  email text,
  phone text,
  total_hours integer NOT NULL DEFAULT 0,
  hours_field integer NOT NULL DEFAULT 0,
  hours_medical integer NOT NULL DEFAULT 0,
  hours_education integer NOT NULL DEFAULT 0,
  hours_admin integer NOT NULL DEFAULT 0,
  activities_json text NOT NULL DEFAULT '[]',
  certificate_password text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX cms_volunteers_volunteer_id_upper_idx
  ON public.cms_volunteers (upper(volunteer_id));

GRANT ALL ON public.cms_volunteers TO service_role;

ALTER TABLE public.cms_volunteers ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated direct access; all reads/writes flow through
-- edge functions (cms-api for admin CRUD, data-api for public lookup).
CREATE POLICY "No direct client access" ON public.cms_volunteers
  FOR SELECT TO anon, authenticated USING (false);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_cms_volunteers_updated_at
  BEFORE UPDATE ON public.cms_volunteers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();