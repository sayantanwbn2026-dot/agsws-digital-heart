
DROP VIEW IF EXISTS public.donations_wall;

CREATE OR REPLACE FUNCTION public.get_donations_wall(
  cause_filter text DEFAULT NULL,
  row_limit int DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  donor_name text,
  amount_cents integer,
  currency text,
  cause text,
  created_at timestamptz,
  metadata jsonb
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT d.id, d.donor_name, d.amount_cents, d.currency, d.cause, d.created_at, d.metadata
  FROM public.donations d
  WHERE d.status = 'succeeded'
    AND d.show_on_wall = true
    AND (cause_filter IS NULL OR d.cause ILIKE '%' || cause_filter || '%')
  ORDER BY d.created_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(row_limit, 20), 100));
$$;

GRANT EXECUTE ON FUNCTION public.get_donations_wall(text, int) TO anon, authenticated;
