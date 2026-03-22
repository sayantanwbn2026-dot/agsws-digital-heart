import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { faqs } from "@/data/faqs";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import PageHero from "@/components/layout/PageHero";

const categories = ["Donations & Tax", "Parent Registration", "About AGSWS"];

const FAQ = () => {
  useSEO("FAQ", "Frequently asked questions about AGSWS donations, registration, and services.");
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter((f) => f.category === activeCategory);

  return (
    <main id="main-content">
      <PageHero title="Frequently Asked Questions" size="sm" breadcrumb={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />

      <section className="bg-card py-16">
        <div className="max-w-[800px] mx-auto px-6">
          {/* Category toggle */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat ? "bg-teal text-primary-foreground" : "bg-background text-text-mid border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <FadeInUp key={i} delay={i * 0.05}>
                <div className="border border-border rounded-lg overflow-hidden bg-card">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className={`font-semibold transition-colors ${openIndex === i ? "text-teal" : "text-text-dark"}`}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-text-light transition-transform duration-200 flex-shrink-0 ml-4 ${openIndex === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="px-5 pb-5 text-[15px] text-text-mid leading-[1.75]">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQ;
