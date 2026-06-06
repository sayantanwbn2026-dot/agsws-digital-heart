REVOKE EXECUTE ON FUNCTION public.get_donations_wall(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_donations_wall(text, integer) TO service_role;