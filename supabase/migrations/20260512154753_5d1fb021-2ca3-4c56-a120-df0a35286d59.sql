CREATE TABLE IF NOT EXISTS public.cms_event_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.cms_events(id) ON DELETE CASCADE,
  image TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'community',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_event_albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cms_event_albums"
  ON public.cms_event_albums FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS idx_cms_event_albums_event ON public.cms_event_albums(event_id, sort_order);

CREATE TRIGGER cms_event_albums_updated_at
  BEFORE UPDATE ON public.cms_event_albums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.cms_event_albums;