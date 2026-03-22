import { useMemo } from "react";
import { stories } from "@/data/stories";
import { faqs } from "@/data/faqs";
import { events } from "@/data/events";
import { resources } from "@/data/resources";

export interface SearchResults {
  stories: typeof stories;
  faqs: typeof faqs;
  events: typeof events;
  resources: typeof resources;
  total: number;
}

export function useSearch(query: string): SearchResults {
  return useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return { stories: [], faqs: [], events: [], resources: [], total: 0 };

    const matchedStories = stories.filter(s =>
      s.title.toLowerCase().includes(q) || s.excerpt.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
    const matchedFaqs = faqs.filter(f =>
      f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
    const matchedEvents = events.filter(e =>
      e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
    );
    const matchedResources = resources.filter(r =>
      r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    );

    return {
      stories: matchedStories,
      faqs: matchedFaqs,
      events: matchedEvents,
      resources: matchedResources,
      total: matchedStories.length + matchedFaqs.length + matchedEvents.length + matchedResources.length,
    };
  }, [query]);
}
