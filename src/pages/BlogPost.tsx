import { useParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { stories } from "@/data/stories";
import { useEffect, useState } from "react";
import { Twitter, MessageCircle, Linkedin, Copy } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams();
  const story = stories.find((s) => s.slug === slug);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useSEO(story?.title || "Story", story?.excerpt || "");

  if (!story) {
    return <main id="main-content" className="min-h-screen flex items-center justify-center"><p>Story not found.</p></main>;
  }

  return (
    <main id="main-content">
      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-teal/20 z-[60]">
        <div className="h-full bg-teal transition-all duration-100" style={{ width: `${progress}%` }} />
      </div>

      <section className="bg-card pt-32 pb-16">
        <div className="max-w-[720px] mx-auto px-6">
          <span className="label-text text-teal">{story.category}</span>
          <h1 className="heading-1 text-text-dark mt-3 mb-4">{story.title}</h1>
          <div className="flex items-center gap-4 text-sm text-text-light mb-12">
            <span>{story.author}</span>
            <span>·</span>
            <span>{story.date}</span>
            <span>·</span>
            <span>{story.readTime}</span>
          </div>

          <div className="prose max-w-none">
            <p className="drop-cap body-lg text-text-dark leading-[1.85]">{story.body}</p>
            <p className="body-lg text-text-dark leading-[1.85] mt-6">
              This story represents one of the hundreds of lives AGSWS touches every year. Behind every statistic is a real person, a real family, and a real transformation made possible by the generosity of donors like you.
            </p>
            <blockquote className="border-l-4 border-teal pl-6 my-8 italic text-2xl font-light text-text-mid leading-relaxed">
              "Every donation, no matter how small, creates ripples that change lives across Kolkata."
            </blockquote>
            <p className="body-lg text-text-dark leading-[1.85]">
              If you'd like to support families like this one, consider making a donation today. Every rupee goes directly to those who need it most.
            </p>
          </div>

          {/* Donate CTA */}
          <Link to="/donate/medical" className="block mt-12 bg-yellow rounded-xl p-8 text-center shadow-yellow">
            <p className="font-bold text-lg text-text-dark mb-2">Support stories like this one</p>
            <span className="font-semibold text-text-dark">Donate to this cause →</span>
          </Link>

          {/* Share */}
          <div className="flex items-center gap-3 mt-12">
            <span className="text-sm font-medium text-text-mid">Share:</span>
            {[Twitter, MessageCircle, Linkedin, Copy].map((Icon, i) => (
              <button key={i} className="w-8 h-8 bg-background rounded-full flex items-center justify-center hover:bg-teal hover:text-primary-foreground transition-colors text-text-mid" aria-label="Share">
                <Icon size={16} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPost;
