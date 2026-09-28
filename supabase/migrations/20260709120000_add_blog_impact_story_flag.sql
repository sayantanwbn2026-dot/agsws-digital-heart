-- Blog posts now drive BOTH the homepage "Latest Stories" strip (is_featured,
-- already present) and the homepage "Impact Story" spotlight (is_impact_story,
-- added here). Only one post should carry the impact-story flag at a time; the
-- admin UI enforces that, and this partial index keeps the lookup fast.
ALTER TABLE public.cms_blog_posts
  ADD COLUMN IF NOT EXISTS is_impact_story boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS cms_blog_posts_impact_story_idx
  ON public.cms_blog_posts (is_impact_story, published_at DESC)
  WHERE is_published = true;
