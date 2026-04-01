import { useParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { stories } from "@/data/stories";
import { useEffect, useState } from "react";
import { Twitter, MessageCircle, Linkedin, Copy } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const BlogPost = () => {
  const { slug } = useParams();
  const story = stories.find((s) => s.slug === slug);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useSEO(story?.title || "Story", story?.excerpt || "");

  if (!story) {
    return <main id="main-content" className="min-h-screen flex items-center justify-center"><p>Story not found.</p></main>;
  }

  return (
    <main id="main-content">
      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--teal-light)] z-[9999]">
        <motion.div className="h-full bg-[var(--teal)] origin-left" style={{ width: scaleX }} />
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

          <div className="prose max-w-none text-[17px] leading-[1.85]">
            <p className="blog-drop-cap text-[var(--dark)] mb-[24px]">{story.body}</p>
            <p className="text-[var(--dark)] mb-[24px]">
              This story represents one of the hundreds of lives AGSWS touches every year. Behind every statistic is a real person, a real family, and a real transformation made possible by the generosity of donors like you.
            </p>
            <h2 className="font-['Inter'] font-[700] text-[22px] text-[var(--dark)] mt-[40px] mb-[16px]">Impact In Numbers</h2>
            <p className="text-[var(--dark)] mb-[24px]">
              Supporting local ecosystems with healthcare interventions. We constantly track these markers.
            </p>
            <h3 className="font-['Inter'] font-[600] text-[18px] mt-[28px] mb-[12px] text-[var(--dark)]">Community Reception</h3>
            <blockquote className="border-l-[4px] border-[var(--teal)] pl-[24px] text-[20px] font-[300] italic text-[var(--mid)] my-[32px]">
              "Every donation, no matter how small, creates ripples that change lives across Kolkata."
            </blockquote>
            <p className="text-[var(--dark)]">
              If you'd like to support families like this one, consider making a donation today. Every rupee goes directly to those who need it most.
            </p>
          </div>

          {/* Donate CTA */}
          <div className="bg-[var(--yellow)] rounded-[var(--radius-xl)] p-[32px] mt-[56px] text-center shadow-[var(--shadow-yellow)]">
            <h3 className="font-['Inter'] font-[700] text-[22px] text-[var(--dark)] mb-[8px]">Support stories like this one</h3>
            <Link to="/donate/medical" className="inline-block bg-[var(--teal)] text-white px-[28px] py-[12px] rounded-full mt-[24px] font-[600] hover:scale-[1.03] transition-transform">
              Donate to this cause →
            </Link>
          </div>

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
