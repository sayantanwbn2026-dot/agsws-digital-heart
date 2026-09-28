import { Link } from "react-router-dom";
import { stories as staticStories } from "@/data/stories";
import { SectionHeader } from "../ui/SectionHeader";
import FadeInUp from "../ui/FadeInUp";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { useCMSList } from "@/hooks/useCMSList";

interface Story {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

const LatestStories = () => {
  // Pull published posts, then surface the ones the admin has flagged as
  // "featured" (max 3, enforced in the CMS). If nothing is flagged yet we
  // gracefully fall back to the 3 most-recent posts so the section is never
  // empty on the homepage.
  const { data: cmsPosts } = useCMSList<any>('cms_blog_posts', [], {
    filter: { column: 'is_published', value: true },
    orderBy: { column: 'published_at', ascending: false },
    limit: 12
  });
  const mapPost = (p: any): Story => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? '',
    image: p.image ?? '',
    category: 'Story',
    date: p.published_at ? new Date(p.published_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
    readTime: '',
  });
  const featured = cmsPosts.filter((p: any) => p.is_featured).map(mapPost);
  const stories: Story[] = featured.length
    ? featured
    : cmsPosts.length
      ? cmsPosts.map(mapPost)
      : (staticStories as any[]).map((s: any) => ({ ...s, image: s.image ?? '' }));
  const latest = stories.slice(0, 3);

  if (latest.length === 0) return null;

  const [hero, ...rest] = latest;

  return (
    <section className="bg-[var(--bg)] py-[64px]">
      <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
        <div className="flex justify-between items-end mb-8">
          <SectionHeader align="left" title="Latest Stories" className="mb-0 lg:mb-0" />
          <Link to="/blog" className="text-link text-[var(--teal)] font-semibold text-[14px] mb-1">
            View All <span className="link-arrow">→</span>
          </Link>
        </div>

        <div className="flex flex-col gap-[24px]">
          {/* Hero story — full-width editorial card */}
          <FadeInUp className="h-full">
            <Link to={`/blog/${hero.slug}`} className="group block h-full">
              <div className="global-card flex flex-col md:flex-row h-full !p-0 overflow-hidden">
                <div className="w-full md:w-[45%] relative overflow-hidden h-[220px] md:h-auto md:min-h-[280px] flex-shrink-0">
                  {hero.image ? (
                    <img src={hero.image} alt={hero.title} loading="lazy" className="w-full h-full object-cover transition-transform [transition-duration:600ms] group-hover:scale-[1.06]" />
                  ) : (
                    <ImagePlaceholder category="community" className="w-full h-full object-cover transition-transform [transition-duration:600ms] group-hover:scale-[1.06]" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-[12px] left-[12px] bg-[var(--yellow)] text-[var(--dark)] text-[11px] font-bold px-3 py-1 rounded-[var(--radius-full)]">
                    {hero.category}
                  </span>
                </div>
                <div className="w-full md:w-[55%] p-[24px] md:p-[40px] flex flex-col justify-center relative z-10">
                  <p className="text-[12px] text-[var(--light)] mb-3">{hero.date}</p>
                  <h4 className="text-[22px] lg:text-[28px] font-semibold text-[var(--dark)] mb-3 line-clamp-2 group-hover:text-[var(--teal)] transition-colors tracking-[-0.01em]">
                    {hero.title}
                  </h4>
                  <p className="text-[14px] text-[var(--mid)] line-clamp-3 md:line-clamp-4 leading-[1.7]">
                    {hero.excerpt}
                  </p>
                  <span className="inline-block mt-6 text-[var(--teal)] font-semibold text-[13px]"><span className="text-link">Read Story <span className="link-arrow">→</span></span></span>
                </div>
              </div>
            </Link>
          </FadeInUp>

          {/* Remaining stories — even 2-up grid so the row is always balanced */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {rest.map((story, i) => (
                <FadeInUp key={story.slug} delay={(i + 1) * 0.08} className="h-full">
                  <Link to={`/blog/${story.slug}`} className="group block h-full">
                    <div className="global-card flex flex-col h-full rounded-t-[10px]">
                      <div className="h-[200px] overflow-hidden relative rounded-t-[10px] card-image flex-shrink-0">
                        {story.image ? (
                          <img src={story.image} alt={story.title} loading="lazy" className="w-full h-full object-cover transition-transform [transition-duration:600ms] group-hover:scale-[1.06]" />
                        ) : (
                          <ImagePlaceholder category={i === 0 ? "medical" : "education"} className="w-full h-full object-cover transition-transform [transition-duration:600ms] group-hover:scale-[1.06]" />
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute bottom-[12px] left-[12px] bg-[var(--yellow)] text-[var(--dark)] text-[11px] font-bold px-3 py-1 rounded-[var(--radius-full)]">
                          {story.category}
                        </span>
                      </div>
                      <div className="p-[20px_24px] flex flex-col flex-1 relative z-10">
                        <p className="text-[11px] text-[var(--light)] mb-2">{story.date}</p>
                        <h4 className="text-[16px] font-semibold text-[var(--dark)] mb-2 line-clamp-2 group-hover:text-[var(--teal)] transition-colors">
                          {story.title}
                        </h4>
                        <p className="text-[13px] text-[var(--mid)] line-clamp-3 leading-[1.6] mb-4">
                          {story.excerpt}
                        </p>
                        <span className="inline-block mt-auto text-[var(--teal)] font-semibold text-[13px]"><span className="text-link">Read Story <span className="link-arrow">→</span></span></span>
                      </div>
                    </div>
                  </Link>
                </FadeInUp>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestStories;
