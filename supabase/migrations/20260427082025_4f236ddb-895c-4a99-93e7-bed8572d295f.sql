
-- Private bucket for support-application documents (separate from cms-uploads
-- which is public for site assets).
INSERT INTO storage.buckets (id, name, public)
VALUES ('application-docs', 'application-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Only service-role (edge functions) can read / write / delete in this bucket.
-- (No `TO public` policies — anon/authenticated have NO access at all.)
CREATE POLICY "Service role manage application-docs"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'application-docs')
  WITH CHECK (bucket_id = 'application-docs');
