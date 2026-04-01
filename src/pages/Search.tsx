import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { useSearch } from "@/hooks/useSearch";
import FadeInUp from "@/components/ui/FadeInUp";
import { Search as SearchIcon } from "lucide-react";

const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-teal/30 rounded-sm px-0.5">{part}</mark> : part
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
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-dark to-teal h-[240px] flex items-end relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/30" />
        <div className="max-w-[800px] mx-auto w-full px-6 pb-8 relative z-10">
          <div className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
            <input placeholder=" "
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search stories, campaigns, events, FAQs..."
              autoFocus
              className="global-card w-full h-14 pl-12 pr-4 text-lg text-text-dark outline-none"
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-background py-12">
        <div className="max-w-[800px] mx-auto px-6">
          {query.trim() && results.total === 0 && (
            <div className="text-center py-16">
              <p className="text-text-mid text-lg mb-4">No results for "<strong>{query}</strong>"</p>
              <p className="text-sm text-text-light mb-4">Try:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="text-sm text-teal font-medium px-3 py-1 bg-teal-light rounded-full hover:bg-teal hover:text-white transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!query.trim() && (
            <div className="text-center py-16">
              <p className="text-text-mid text-lg mb-4">Start typing to search across all AGSWS content.</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map(s => (
                  <button key={s} onClick={() => setQuery(s)} className="text-sm text-teal font-medium px-3 py-1 bg-teal-light rounded-full hover:bg-teal hover:text-white transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.stories.length > 0 && (
            <FadeInUp className="mb-10">
              <h3 className="label-text text-teal mb-4">Stories ({results.stories.length})</h3>
              <div className="space-y-3">
                {results.stories.map(s => (
                  <Link key={s.slug} to={`/blog/${s.slug}`} className="global-card block hover:">
                    <h4 className="font-semibold text-text-dark">{highlightMatch(s.title, query)}</h4>
                    <p className="text-sm text-text-mid mt-1">{highlightMatch(s.excerpt, query)}</p>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          )}

          {results.faqs.length > 0 && (
            <FadeInUp className="mb-10">
              <h3 className="label-text text-teal mb-4">FAQs ({results.faqs.length})</h3>
              <div className="space-y-3">
                {results.faqs.map((f, i) => (
                  <Link key={i} to="/faq" className="global-card block hover:">
                    <h4 className="font-semibold text-text-dark">{highlightMatch(f.question, query)}</h4>
                    <p className="text-sm text-text-mid mt-1 line-clamp-2">{highlightMatch(f.answer, query)}</p>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          )}

          {results.events.length > 0 && (
            <FadeInUp className="mb-10">
              <h3 className="label-text text-teal mb-4">Events ({results.events.length})</h3>
              <div className="space-y-3">
                {results.events.map(e => (
                  <Link key={e.id} to="/events" className="global-card block hover:">
                    <h4 className="font-semibold text-text-dark">{highlightMatch(e.title, query)}</h4>
                    <p className="text-sm text-text-mid mt-1 line-clamp-2">{highlightMatch(e.description, query)}</p>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          )}

          {results.resources.length > 0 && (
            <FadeInUp className="mb-10">
              <h3 className="label-text text-teal mb-4">Resources ({results.resources.length})</h3>
              <div className="space-y-3">
                {results.resources.map((r, i) => (
                  <Link key={i} to="/resources" className="global-card block hover:">
                    <h4 className="font-semibold text-text-dark">{highlightMatch(r.title, query)}</h4>
                    <p className="text-sm text-text-mid mt-1 line-clamp-2">{highlightMatch(r.description, query)}</p>
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
