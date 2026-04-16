
CREATE TABLE public.cms_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cms_sections"
  ON public.cms_sections
  FOR SELECT
  USING (true);

CREATE TRIGGER update_cms_sections_updated_at
  BEFORE UPDATE ON public.cms_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
