-- Enable realtime on all public CMS tables. Wrap each ADD in DO blocks so
-- repeating the migration is safe even if some tables are already published.
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'cms_hero','cms_sections','cms_stats','cms_initiatives','cms_stories',
    'cms_testimonials','cms_blog_posts','cms_gallery','cms_videos','cms_events',
    'cms_faqs','cms_team','cms_partners','cms_impact_zones','cms_resources',
    'cms_updates','cms_site_settings'
  ])
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXCEPTION
      WHEN duplicate_object THEN NULL;
      WHEN undefined_table THEN NULL;
    END;
  END LOOP;
END$$;

-- Also include donations so the donor wall stays live without polling.
DO $$
BEGIN
  BEGIN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.donations';
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END$$;
