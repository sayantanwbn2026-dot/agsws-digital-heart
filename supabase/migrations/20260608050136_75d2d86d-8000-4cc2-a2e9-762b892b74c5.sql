DROP POLICY IF EXISTS "No direct client write access" ON public.cms_volunteers;
CREATE POLICY "No direct client write access"
  ON public.cms_volunteers
  AS PERMISSIVE
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

UPDATE public.cms_volunteers
SET certificate_password = extensions.crypt(certificate_password, extensions.gen_salt('bf', 10))
WHERE certificate_password IS NOT NULL
  AND certificate_password <> ''
  AND certificate_password NOT LIKE '$2%';
