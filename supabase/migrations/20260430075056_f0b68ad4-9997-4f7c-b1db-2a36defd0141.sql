UPDATE public.cms_sections
SET content = content
  || jsonb_build_object(
       'email_perks',
       (SELECT jsonb_agg(jsonb_build_object('value', v))
        FROM jsonb_array_elements_text(content->'email_perks') AS t(v))
     )
WHERE section_key = 'updates_page'
  AND jsonb_typeof(content->'email_perks') = 'array'
  AND jsonb_typeof(content->'email_perks'->0) = 'string';