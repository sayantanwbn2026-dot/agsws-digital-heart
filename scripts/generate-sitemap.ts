import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://agsws.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/initiatives", changefreq: "monthly", priority: "0.8" },
  { path: "/initiatives/medical", changefreq: "monthly", priority: "0.8" },
  { path: "/initiatives/education", changefreq: "monthly", priority: "0.8" },
  { path: "/donate/medical", changefreq: "weekly", priority: "0.9" },
  { path: "/donate/education", changefreq: "weekly", priority: "0.9" },
  { path: "/register-parent", changefreq: "monthly", priority: "0.7" },
  { path: "/apply", changefreq: "monthly", priority: "0.7" },
  { path: "/csr", changefreq: "monthly", priority: "0.7" },
  { path: "/volunteer-portal", changefreq: "monthly", priority: "0.7" },
  { path: "/donor-wall", changefreq: "weekly", priority: "0.6" },
  { path: "/impact", changefreq: "monthly", priority: "0.7" },
  { path: "/transparency", changefreq: "monthly", priority: "0.6" },
  { path: "/events", changefreq: "weekly", priority: "0.7" },
  { path: "/gallery", changefreq: "weekly", priority: "0.6" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/updates", changefreq: "weekly", priority: "0.6" },
  { path: "/resources", changefreq: "monthly", priority: "0.6" },
  { path: "/faq", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/track-donation", changefreq: "monthly", priority: "0.4" },
  { path: "/track", changefreq: "monthly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/refund", changefreq: "yearly", priority: "0.3" },
];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);