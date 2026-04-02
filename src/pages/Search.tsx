import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { useSearch } from "@/hooks/useSearch";
import FadeInUp from "@/components/ui/FadeInUp";
import { Search as SearchIcon } from "lucide-react";
import PageHero from "@/components/layout/PageHero";

const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-[var(--teal-light)] rounded-sm px-0.5">{part}</mark> : part
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

      <section className="bg-[var(--bg)] py-8">
        <div className="max-w-[800px] mx-auto w-full px-6">
          <div className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--light)]" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search stories, campaigns, events, FAQs..."
              autoFocus
              className="w-full h-14 pl-12 pr-4 text-lg text-[var(--dark)] outline-none rounded-[var(--radius-xl)] border-[1.5px] border-[var(--border-color)] focus:border-[var(--teal)] focus:shadow-[0_0_0_3px_rgba(31,154,168,0.12)] transition-all no-float"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg)] py-12">
        <div className="max-w-[800px] mx-auto px-6">
          {query.trim() && results.total === 0 && (
            <div className="text-center py-16">
              <p className="text-[var(--mid)] text-lg mb-4">No results for "<strong>{query}</strong>"</p>
              <p className="text-sm text-[var(--light)] mb-4">Try:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="text-sm text-[var(--teal)] font-medium px-3 py-1 bg-[var(--teal-light)] rounded-full hover:bg-[var(--teal)] hover:text-white transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query.trim() && (
            <div className="text-center py-16">
              <p className="text-[var(--mid)] text-lg mb-4">Start typing to search across all AGSWS content.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="text-sm text-[var(--teal)] font-medium px-3 py-1 bg-[var(--teal-light)] rounded-full hover:bg-[var(--teal)] hover:text-white transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.stories.length > 0 && (
            <FadeInUp className="mb-10">
              <h3 className="label-text text-[var(--teal)] mb-4">Stories ({results.stories.length})</h3>
              <div className="space-y-3">
                {results.stories.map(s => (
                  <Link key={s.slug} to={`/blog/${s.slug}`} className="global-card block">
                    <h4 className="font-semibold text-[var(--dark)]">{highlightMatch(s.title, query)}</h4>
                    <p className="text-sm text-[var(--mid)] mt-1">{highlightMatch(s.excerpt, query)}</p>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          )}

          {results.faqs.length > 0 && (
            <FadeInUp className="mb-10">
              <h3 className="label-text text-[var(--teal)] mb-4">FAQs ({results.faqs.length})</h3>
              <div className="space-y-3">
                {results.faqs.map((f, i) => (
                  <Link key={i} to="/faq" className="global-card block">
                    <h4 className="font-semibold text-[var(--dark)]">{highlightMatch(f.question, query)}</h4>
                    <p className="text-sm text-[var(--mid)] mt-1 line-clamp-2">{highlightMatch(f.answer, query)}</p>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          )}

          {results.events.length > 0 && (
            <FadeInUp className="mb-10">
              <h3 className="label-text text-[var(--teal)] mb-4">Events ({results.events.length})</h3>
              <div className="space-y-3">
                {results.events.map(e => (
                  <Link key={e.id} to="/events" className="global-card block">
                    <h4 className="font-semibold text-[var(--dark)]">{highlightMatch(e.title, query)}</h4>
                    <p className="text-sm text-[var(--mid)] mt-1 line-clamp-2">{highlightMatch(e.description, query)}</p>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          )}

          {results.resources.length > 0 && (
            <FadeInUp className="mb-10">
              <h3 className="label-text text-[var(--teal)] mb-4">Resources ({results.resources.length})</h3>
              <div className="space-y-3">
                {results.resources.map((r, i) => (
                  <Link key={i} to="/resources" className="global-card block">
                    <h4 className="font-semibold text-[var(--dark)]">{highlightMatch(r.title, query)}</h4>
                    <p className="text-sm text-[var(--mid)] mt-1 line-clamp-2">{highlightMatch(r.description, query)}</p>
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
