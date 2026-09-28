-- Monthly (recurring) donations via Stripe subscriptions.
--
-- The row created at checkout records the first charge. Each later monthly
-- charge is recorded as its own row, linked back to that first row through
-- parent_donation_id, so totals, receipts and the admin table stay per-payment.

ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS frequency text NOT NULL DEFAULT 'once',
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS stripe_invoice_id text,
  ADD COLUMN IF NOT EXISTS subscription_status text,
  ADD COLUMN IF NOT EXISTS parent_donation_id uuid
    REFERENCES public.donations(id) ON DELETE SET NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'donations_frequency_check'
  ) THEN
    ALTER TABLE public.donations
      ADD CONSTRAINT donations_frequency_check CHECK (frequency IN ('once', 'monthly'));
  END IF;
END $$;

-- One row per Stripe invoice: makes the webhook safe to retry.
CREATE UNIQUE INDEX IF NOT EXISTS donations_stripe_invoice_id_key
  ON public.donations (stripe_invoice_id)
  WHERE stripe_invoice_id IS NOT NULL;

-- Renewals look up their original donation by subscription.
CREATE INDEX IF NOT EXISTS donations_stripe_subscription_id_idx
  ON public.donations (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Donor wall: show a monthly donor once (their first gift), not once a month.
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
    AND d.parent_donation_id IS NULL
    AND (cause_filter IS NULL OR d.cause ILIKE '%' || cause_filter || '%')
  ORDER BY d.created_at DESC
  LIMIT GREATEST(1, LEAST(COALESCE(row_limit, 20), 100));
$$;
