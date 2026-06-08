CREATE OR REPLACE FUNCTION public.verify_volunteer_password(_volunteer_id text, _password text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.cms_volunteers v
    WHERE upper(v.volunteer_id) = upper(_volunteer_id)
      AND v.is_published = true
      AND v.certificate_password IS NOT NULL
      AND v.certificate_password <> ''
      AND v.certificate_password = extensions.crypt(_password, v.certificate_password)
  );
$$;

REVOKE EXECUTE ON FUNCTION public.verify_volunteer_password(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_volunteer_password(text, text) TO service_role;

-- Helper to hash a new/updated password from the admin flow
CREATE OR REPLACE FUNCTION public.hash_password(_password text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = extensions
AS $$
  SELECT extensions.crypt(_password, extensions.gen_salt('bf', 10));
$$;

REVOKE EXECUTE ON FUNCTION public.hash_password(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.hash_password(text) TO service_role;
