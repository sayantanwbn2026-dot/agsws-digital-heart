import { useSEO } from "@/hooks/useSEO";
import { stories } from "@/data/stories";
import { Link } from "react-router-dom";
import FadeInUp from "@/components/ui/FadeInUp";
import PageHero from "@/components/layout/PageHero";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

type ImgCategory = "medical" | "education" | "elderly" | "community" | "child" | "hospital" | "classroom";
const categoryMap: Record<string, ImgCategory> = {
  Medical: "medical", Education: "education", Community: "community",
  Report: "hospital", Elderly: "elderly",
};
const getCategory = (c: string): ImgCategory => categoryMap[c] ?? "community";

const Blog = () => {
  useSEO("Blog", "AGSWS stories of impact — real stories from the field.");
  const featured = stories[0];
  const rest = stories.slice(1);

  return (
    <main id="main-content">
      <PageHero title="Impact Stories" label="From The Field" breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog" }]} />

      <section className="bg-card py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          {/* Featured */}
          <FadeInUp>
            <Link to={`/blog/${featured.slug}`} className="group block mb-16">
              <div className="global-card grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 hover:">
                <ImagePlaceholder category={getCategory(featured.category)} className="h-[300px] lg:h-auto min-h-[260px] rounded-l-[var(--radius-lg)]" />
                <div className="p-8 flex flex-col justify-center">
                  <span className="bg-yellow text-text-dark text-xs font-bold px-3 py-1 rounded-full self-start mb-4">{featured.category}</span>
                  <p className="text-xs text-text-light mb-2">{featured.date} · {featured.readTime}</p>
                  <h2 className="heading-3 text-text-dark mb-3 group-hover:text-teal transition-colors">{featured.title}</h2>
                  <p className="body-text text-text-mid mb-4">{featured.excerpt}</p>
                  <span className="text-teal font-semibold text-sm">Read Full Story →</span>
                </div>
              </div>
            </Link>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rest.map((story, i) => (
              <FadeInUp key={story.slug} delay={i * 0.1}>
                <Link to={`/blog/${story.slug}`} className="group block">
                  <div className="global-card hover: overflow-hidden">
                    <div className="relative h-[200px]">
                      <ImagePlaceholder category={getCategory(story.category)} className="w-full h-full" />
                      <span className="absolute top-4 left-4 bg-yellow text-text-dark text-xs font-bold px-3 py-1 rounded-full z-10">{story.category}</span>
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-text-light mb-2">{story.date}</p>
                      <h4 className="heading-4 text-text-dark mb-2 line-clamp-2 group-hover:text-teal transition-colors">{story.title}</h4>
                      <p className="body-small text-text-mid line-clamp-3">{story.excerpt}</p>
                      <span className="inline-block mt-4 text-teal font-semibold text-sm">Read Story →</span>
                    </div>
                  </div>
                </Link>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;

