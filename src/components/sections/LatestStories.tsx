import { CalendarDays, Clock3, ArrowUpRight, User2 } from "lucide-react";
import { Link } from "react-router-dom";
import { stories as staticStories } from "@/data/stories";
import { SectionHeader } from "../ui/SectionHeader";
import { StaggerContainer } from "../ui/StaggerContainer";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { useCMSList } from "@/hooks/useCMSList";

type StoryCard = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  image: string | null;
};

const formatDate = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const estimateReadTime = (content?: string | null, fallback = "3 min read") => {
  if (!content) return fallback;
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  if (!wordCount) return fallback;
  return `${Math.max(2, Math.round(wordCount / 180))} min read`;
};

const getPlaceholderCategory = (category: string) => {
  const normalized = category.toLowerCase();
  if (normalized.includes("medical")) return "medical" as const;
  if (normalized.includes("education")) return "classroom" as const;
  if (normalized.includes("community")) return "community" as const;
  return "community" as const;
};

const LatestStories = () => {
  const { data: cmsPosts } = useCMSList<any>("cms_blog_posts", [], {
    filter: { column: "is_published", value: true },
    orderBy: { column: "published_at", ascending: false },
    limit: 3,
  });

  const stories: StoryCard[] = cmsPosts.length
    ? cmsPosts.map((post: any) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? "",
        category: "Field Update",
        date: formatDate(post.published_at || post.created_at),
        author: post.author || "AGSWS Team",
        readTime: estimateReadTime(post.content),
        image: post.image || null,
      }))
    : staticStories.map((story) => ({
        slug: story.slug,
        title: story.title,
        excerpt: story.excerpt,
        category: story.category,
        date: formatDate(story.date),
        author: story.author,
        readTime: story.readTime,
        image: null,
      }));

  const latest = stories.slice(0, 3);

  return (
    <section className="bg-background py-20 lg:py-24">
      <div className="container">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            label="From the field"
            title="Latest Stories"
            subtitle="Fresh updates, verified beneficiary journeys, and real dispatches from across Kolkata."
            align="left"
            className="mb-0"
          />

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-transform duration-300 hover:translate-x-0.5"
          >
            Visit the blog
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {latest.map((story, index) => {
            const placeholderCategory = getPlaceholderCategory(story.category);
            const isFeatured = index === 0;

            if (isFeatured) {
              return (
                <div key={story.slug} className="h-full lg:col-span-2">
                  <Link to={`/blog/${story.slug}`} className="group block h-full">
                    <article className="overflow-hidden rounded-[32px] border border-border bg-card shadow-[var(--shadow-card)] transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="grid h-full lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="relative min-h-[280px] lg:min-h-[420px]">
                          {story.image ? (
                            <img src={story.image} alt={story.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <ImagePlaceholder category={placeholderCategory} className="absolute inset-0 h-full w-full object-cover" label={story.category} />
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                          <div className="absolute left-5 top-5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-accent-foreground">
                            {story.category}
                          </div>
                        </div>

                        <div className="flex flex-col justify-between p-7 lg:p-8">
                          <div>
                            <div className="flex flex-wrap gap-3 text-[11px] font-medium text-muted-foreground">
                              <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {story.date}</span>
                              <span className="inline-flex items-center gap-1.5"><User2 size={13} /> {story.author}</span>
                              <span className="inline-flex items-center gap-1.5"><Clock3 size={13} /> {story.readTime}</span>
                            </div>

                            <h3 className="mt-5 max-w-none text-[clamp(1.8rem,3vw,2.6rem)] font-black leading-[1.06] tracking-[-0.04em] text-foreground transition-colors group-hover:text-primary">
                              {story.title}
                            </h3>
                            <p className="mt-4 max-w-none text-[15px] leading-8 text-muted-foreground">{story.excerpt}</p>
                          </div>

                          <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
                            <span className="text-sm font-semibold text-primary">Read story</span>
                            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary transition-transform duration-300 group-hover:translate-x-1">
                              <ArrowUpRight size={18} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                </div>
              );
            }

            return (
              <div key={story.slug} className="h-full">
                <Link to={`/blog/${story.slug}`} className="group block h-full">
                  <article className="flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-[var(--shadow-card)] transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="relative h-[220px] overflow-hidden">
                      {story.image ? (
                        <img src={story.image} alt={story.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <ImagePlaceholder category={placeholderCategory} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" label={story.category} />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground backdrop-blur-xl">
                        {story.category}
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap gap-3 text-[11px] font-medium text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {story.date}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock3 size={13} /> {story.readTime}</span>
                      </div>

                      <h3 className="mt-4 max-w-none text-[1.3rem] font-black leading-[1.08] tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary">
                        {story.title}
                      </h3>
                      <p className="mt-3 max-w-none text-sm leading-7 text-muted-foreground">{story.excerpt}</p>

                      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                        <span className="text-sm font-semibold text-primary">Read story</span>
                        <ArrowUpRight size={17} className="text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default LatestStories;
