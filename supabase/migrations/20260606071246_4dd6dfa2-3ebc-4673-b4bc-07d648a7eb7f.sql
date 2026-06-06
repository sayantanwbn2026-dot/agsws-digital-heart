CREATE POLICY "Deny direct client access to donations"
  ON public.donations
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);