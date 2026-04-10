-- Fix 1: Restrict cms_payment_config - drop public read, block all public access
-- Payment config contains sensitive bank details and should only be accessed via admin edge function (service role)
DROP POLICY IF EXISTS "Public read payment config" ON public.cms_payment_config;

CREATE POLICY "No public read payment config" ON public.cms_payment_config
  FOR SELECT USING (false);

-- Fix 2: Restrict storage write policies to authenticated users only
-- Drop the overly permissive write policies on cms-uploads bucket
DROP POLICY IF EXISTS "Authenticated upload cms" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update cms" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete cms" ON storage.objects;

-- Recreate with authenticated-only access
CREATE POLICY "Authenticated upload cms" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cms-uploads');

CREATE POLICY "Authenticated update cms" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cms-uploads');

CREATE POLICY "Authenticated delete cms" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cms-uploads');