ALTER TABLE public.support_applications DROP CONSTRAINT IF EXISTS support_applications_type_check;
ALTER TABLE public.support_applications ADD CONSTRAINT support_applications_type_check
  CHECK (type = ANY (ARRAY['medical','education','csr','event_registration','volunteer','general']));

ALTER TABLE public.support_applications DROP CONSTRAINT IF EXISTS support_applications_status_check;
ALTER TABLE public.support_applications ADD CONSTRAINT support_applications_status_check
  CHECK (status = ANY (ARRAY['pending','reviewing','approved','rejected','waitlisted']));