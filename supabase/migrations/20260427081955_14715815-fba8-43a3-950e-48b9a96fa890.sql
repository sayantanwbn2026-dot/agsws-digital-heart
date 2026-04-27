
-- 1. Remove public upload policy added previously
DROP POLICY IF EXISTS "Public upload application docs" ON storage.objects;

-- (No public read policy was added for cms-uploads — the bucket itself is public,
--  but signed URLs are still required for downloads in our app flow.)

-- 2. Create cms_impact_zones for the homepage Active Impact Zones map
CREATE TABLE IF NOT EXISTS public.cms_impact_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'medical',
  description text,
  metric text,
  icon text DEFAULT 'MapPin',
  position_x numeric NOT NULL DEFAULT 50,
  position_y numeric NOT NULL DEFAULT 50,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_impact_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cms_impact_zones"
  ON public.cms_impact_zones
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE TRIGGER set_cms_impact_zones_updated_at
  BEFORE UPDATE ON public.cms_impact_zones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with the original five regions (idempotent via ON CONFLICT-by-name not possible
--  without a unique constraint — so guard with a count check).
INSERT INTO public.cms_impact_zones (name, type, description, metric, icon, position_x, position_y, sort_order)
SELECT * FROM (VALUES
  ('Salt Lake', 'medical', 'Weekly Health Camps', '2,500+ Treated', 'Activity', 20, 30, 1),
  ('Park Street District', 'education', 'Scholarship Hub', '450 Students', 'BookOpen', 50, 45, 2),
  ('Howrah', 'community', 'Emergency Response', '24/7 Support', 'Users', 30, 70, 3),
  ('New Town', 'medical', 'Elderly Care Unit', '120 Families', 'Activity', 75, 25, 4),
  ('Ballygunge', 'education', 'Community Library', 'New Facility', 'BookOpen', 65, 65, 5)
) AS v(name, type, description, metric, icon, position_x, position_y, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.cms_impact_zones);
