import { useEffect } from "react";

const SITE_URL = "https://agsws.lovable.app";
const JSONLD_ID = "page-jsonld";

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => {
      if (k !== "content") el!.setAttribute(k, v);
    });
    document.head.appendChild(el);
  }
  if (attrs.content !== undefined) el.setAttribute("content", attrs.content);
};

const upsertCanonical = (href: string) => {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
};

export const useSEO = (
  title: string,
  description: string,
  options?: { jsonLd?: object | object[] }
) => {
  useEffect(() => {
    const fullTitle = `${title} | AGSWS`;
    const url = `${SITE_URL}${window.location.pathname}`;
    const desc = (description || "").slice(0, 160);
    const ogTitle = fullTitle.slice(0, 60);

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', { name: "description", content: desc });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: ogTitle });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: desc });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: ogTitle });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: desc });
    upsertCanonical(url);

    // Page-level JSON-LD (replaces previous page script if any)
    const existing = document.getElementById(JSONLD_ID);
    if (existing) existing.remove();
    if (options?.jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = JSONLD_ID;
      script.text = JSON.stringify(options.jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, JSON.stringify(options?.jsonLd ?? null)]);
};
