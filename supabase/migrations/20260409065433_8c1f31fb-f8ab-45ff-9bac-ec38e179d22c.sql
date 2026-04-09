
CREATE TABLE public.cms_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text DEFAULT 'General',
  file_type text DEFAULT 'PDF',
  file_size text,
  file_url text,
  year text,
  color text DEFAULT 'teal',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cms_resources" ON public.cms_resources
  FOR SELECT USING (true);

CREATE TRIGGER update_cms_resources_updated_at
  BEFORE UPDATE ON public.cms_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
