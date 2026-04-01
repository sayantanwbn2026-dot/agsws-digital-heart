import { Link } from "react-router-dom";
import { stories as staticStories } from "@/data/stories";
import { SectionHeader } from "../ui/SectionHeader";
import { StaggerContainer } from "../ui/StaggerContainer";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { useCMSList } from "@/hooks/useCMSList";

const LatestStories = () => {
  const { data: cmsPosts } = useCMSList<any>('blog_posts', [], {
    filter: { column: 'is_published', value: true },
    orderBy: { column: 'published_at', ascending: false },
    limit: 3
  });
  const stories = cmsPosts.length
    ? cmsPosts.map((p: any) => ({
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt ?? '',
        category: p.category ?? 'Story',
        date: p.published_at ?? p.date ?? '',
        readTime: p.read_time ?? '',
      }))
    : staticStories;
  const latest = stories.slice(0, 3);

  return (
    <section className="bg-[var(--bg)] py-[64px]">
      <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
        <div className="flex justify-between items-end mb-8">
          <SectionHeader 
            align="left"
            title="Latest Stories" 
            className="mb-0 lg:mb-0" 
          />
          <Link to="/blog" className="text-[var(--teal)] font-semibold text-[14px] hover:underline mb-1">
            View All →
          </Link>
        </div>

        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {latest.map((story, i) => {
            const isFeatured = i === 0;

            if (isFeatured) {
              return (
                <div key={story.slug} className="md:col-span-2 lg:col-span-3 h-full">
                  <Link to={`/blog/${story.slug}`} className="group block h-full">
                    <div className="global-card flex flex-col md:flex-row h-full">
                      
                      <div className="w-full md:w-[40%] relative overflow-hidden h-[200px] md:h-auto flex-shrink-0">
                        <ImagePlaceholder
                          category="community"
                          className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.06]"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                        <span className="absolute bottom-[12px] left-[12px] bg-[var(--yellow)] text-[var(--dark)] text-[11px] font-bold px-3 py-1 rounded-[var(--radius-full)]">
                          {story.category}
                        </span>
                      </div>

                      <div className="w-full md:w-[60%] p-[20px] md:p-[32px] flex flex-col justify-center relative z-10">
                        <p className="text-[12px] text-[var(--light)] mb-3">{story.date}</p>
                        <h4 className="text-[20px] lg:text-[24px] font-semibold text-[var(--dark)] mb-3 line-clamp-2 group-hover:text-[var(--teal)] transition-colors">
                          {story.title}
                        </h4>
                        <p className="text-[14px] text-[var(--mid)] line-clamp-3 md:line-clamp-4 leading-[1.7]">
                          {story.excerpt}
                        </p>
                        <span className="inline-block mt-6 text-[var(--teal)] font-semibold text-[13px]">Read Story →</span>
                      </div>

                    </div>
                  </Link>
                </div>
              );
            }

            return (
              <div key={story.slug} className="h-full">
                <Link to={`/blog/${story.slug}`} className="group block h-full">
                  <div className="global-card flex flex-col h-full rounded-t-[16px]">
                    <div className="h-[200px] overflow-hidden relative rounded-t-[16px] card-image flex-shrink-0">
                      <ImagePlaceholder
                        category={i === 1 ? "medical" : "education"}
                        className="w-full h-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.06]"
                      />
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
                      <span className="inline-block mt-auto text-[var(--teal)] font-semibold text-[13px]">Read Story →</span>
                    </div>
                  </div>
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
