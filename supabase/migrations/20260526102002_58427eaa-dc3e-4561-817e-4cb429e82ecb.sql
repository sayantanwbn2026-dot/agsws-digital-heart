
-- 1) Remove public read access to donations (PII exposure) and replace with a sanitized public view
DROP POLICY IF EXISTS "Public read wall donations" ON public.donations;

CREATE OR REPLACE VIEW public.donations_wall
WITH (security_invoker = false) AS
SELECT
  id,
  donor_name,
  amount_cents,
  currency,
  cause,
  created_at,
  metadata
FROM public.donations
WHERE status = 'succeeded' AND show_on_wall = true;

GRANT SELECT ON public.donations_wall TO anon, authenticated;

-- 2) Remove donations from realtime publication (broadcasts could leak PII)
ALTER PUBLICATION supabase_realtime DROP TABLE public.donations;

-- 3) Tighten storage: drop broad public SELECT on cms-uploads (files remain reachable via public URLs because the bucket is public; this only removes listing/SELECT via the API)
DROP POLICY IF EXISTS "Public read cms uploads" ON storage.objects;
