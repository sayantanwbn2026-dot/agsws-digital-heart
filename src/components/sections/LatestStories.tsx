import { Link } from "react-router-dom";
import { stories } from "@/data/stories";
import FadeInUp from "../ui/FadeInUp";
import ImagePlaceholder from "../ui/ImagePlaceholder";

const colorMap: Record<string, string> = {
  teal: "from-teal to-teal-dark",
  purple: "from-purple to-purple/80",
  beige: "from-beige to-teal",
};

const categoryMap: Record<string, 'medical' | 'education' | 'community'> = {
  teal: "medical",
  purple: "education",
  beige: "community",
};

const LatestStories = () => {
  const latest = stories.slice(0, 3);

  return (
    <section className="bg-card py-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <FadeInUp className="flex justify-between items-center mb-12">
          <h2 className="heading-2 text-text-dark">Latest Stories</h2>
          <Link to="/blog" className="text-teal font-semibold text-sm hover:underline">View All →</Link>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latest.map((story, i) => (
            <FadeInUp key={story.slug} delay={i * 0.1}>
              <Link to={`/blog/${story.slug}`} className="group block">
                <div className="bg-card rounded-xl border border-border shadow-brand-sm overflow-hidden transition-all duration-300 group-hover:shadow-brand-md group-hover:-translate-y-1">
                  <div className="h-[200px] overflow-hidden relative">
                    <ImagePlaceholder
                      category={categoryMap[story.color] || "community"}
                      className="w-full h-full transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.08]"
                    />
                    {/* Bottom gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-3 left-4 bg-yellow text-text-dark text-xs font-bold px-3 py-1 rounded-full">
                      {story.category}
                    </span>
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
  );
};

export default LatestStories;
