import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { useSearch } from "@/hooks/useSearch";
import FadeInUp from "@/components/ui/FadeInUp";
import { Search as SearchIcon, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/layout/PageHero";

const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-[var(--yellow-light)] text-[var(--dark)] rounded-sm px-0.5">{part}</mark> : part
  );
};

const SearchPage = () => {
  const [params] = useSearchParams();
  const initialQ = params.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const results = useSearch(query);
  useSEO(`Search: ${query || "..."}`, "Search AGSWS stories, events, FAQs, and resources.");

  const suggestions = ["medical", "education", "elderly", "Kolkata", "donate", "parent registration"];

  return (
    <main id="main-content">
      <PageHero title="Search" size="sm" bgVariant="teal-dark" />

      <section className="bg-[var(--bg)] py-10">
        <div className="max-w-[680px] mx-auto w-full px-6">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative bg-white rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-md)] overflow-hidden"
          >
            <SearchIcon size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--light)]" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search stories, campaigns, events, FAQs..."
              autoFocus
              className="w-full h-[56px] pl-14 pr-5 text-[15px] text-[var(--dark)] outline-none bg-transparent placeholder:text-[var(--light)]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {query.trim() && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[11px] font-[600] text-[var(--light)] bg-[var(--bg)] px-2.5 py-1 rounded-full">
                  {results.total} results
                </motion.span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[var(--bg)] pb-20">
        <div className="max-w-[680px] mx-auto px-6">
          <AnimatePresence mode="wait">
            {query.trim() && results.total === 0 && (
              <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-16">
                <Sparkles size={32} className="text-[var(--light)] mx-auto mb-4" />
                <p className="text-[var(--mid)] text-[16px] mb-4">No results for "<strong>{query}</strong>"</p>
                <p className="text-[13px] text-[var(--light)] mb-4">Try one of these:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map(s => (
                    <button key={s} onClick={() => setQuery(s)} className="text-[12px] text-[var(--teal)] font-[600] px-3.5 py-1.5 bg-[var(--teal-light)] rounded-full hover:bg-[var(--teal)] hover:text-white transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {!query.trim() && (
              <motion.div key="initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <SearchIcon size={32} className="text-[var(--light)] mx-auto mb-4" />
                <p className="text-[var(--mid)] text-[16px] mb-4">Start typing to search across all AGSWS content.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map(s => (
                    <button key={s} onClick={() => setQuery(s)} className="text-[12px] text-[var(--teal)] font-[600] px-3.5 py-1.5 bg-[var(--teal-light)] rounded-full hover:bg-[var(--teal)] hover:text-white transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {results.stories.length > 0 && (
            <FadeInUp className="mb-8">
              <h3 className="text-[11px] font-[600] text-[var(--teal)] uppercase tracking-[0.1em] mb-4">Stories ({results.stories.length})</h3>
              <div className="space-y-3">
                {results.stories.map(s => (
                  <Link key={s.slug} to={`/blog/${s.slug}`} className="block bg-white rounded-[14px] border border-[var(--border-color)] p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all">
                    <h4 className="font-[600] text-[var(--dark)] text-[15px]">{highlightMatch(s.title, query)}</h4>
                    <p className="text-[13px] text-[var(--mid)] mt-1.5 line-clamp-2">{highlightMatch(s.excerpt, query)}</p>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          )}

          {results.faqs.length > 0 && (
            <FadeInUp className="mb-8">
              <h3 className="text-[11px] font-[600] text-[var(--teal)] uppercase tracking-[0.1em] mb-4">FAQs ({results.faqs.length})</h3>
              <div className="space-y-3">
                {results.faqs.map((f, i) => (
                  <Link key={i} to="/faq" className="block bg-white rounded-[14px] border border-[var(--border-color)] p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all">
                    <h4 className="font-[600] text-[var(--dark)] text-[15px]">{highlightMatch(f.question, query)}</h4>
                    <p className="text-[13px] text-[var(--mid)] mt-1.5 line-clamp-2">{highlightMatch(f.answer, query)}</p>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          )}

          {results.events.length > 0 && (
            <FadeInUp className="mb-8">
              <h3 className="text-[11px] font-[600] text-[var(--teal)] uppercase tracking-[0.1em] mb-4">Events ({results.events.length})</h3>
              <div className="space-y-3">
                {results.events.map(e => (
                  <Link key={e.id} to="/events" className="block bg-white rounded-[14px] border border-[var(--border-color)] p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all">
                    <h4 className="font-[600] text-[var(--dark)] text-[15px]">{highlightMatch(e.title, query)}</h4>
                    <p className="text-[13px] text-[var(--mid)] mt-1.5 line-clamp-2">{highlightMatch(e.description, query)}</p>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          )}

          {results.resources.length > 0 && (
            <FadeInUp className="mb-8">
              <h3 className="text-[11px] font-[600] text-[var(--teal)] uppercase tracking-[0.1em] mb-4">Resources ({results.resources.length})</h3>
              <div className="space-y-3">
                {results.resources.map((r, i) => (
                  <Link key={i} to="/resources" className="block bg-white rounded-[14px] border border-[var(--border-color)] p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all">
                    <h4 className="font-[600] text-[var(--dark)] text-[15px]">{highlightMatch(r.title, query)}</h4>
                    <p className="text-[13px] text-[var(--mid)] mt-1.5 line-clamp-2">{highlightMatch(r.description, query)}</p>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          )}
        </div>
      </section>
    </main>
  );
};

export default SearchPage;
