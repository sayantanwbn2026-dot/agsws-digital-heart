import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { resources } from "@/data/resources";
import { Download, Search } from "lucide-react";
import PageHero from "@/components/layout/PageHero";

const categories = ["All", "Annual Reports", "Financial Reports", "Medical Articles", "Education Updates", "Research"];
const colorBorder: Record<string, string> = { teal: "border-l-teal", purple: "border-l-purple", yellow: "border-l-yellow", beige: "border-l-beige" };

const Resources = () => {
  useSEO("Resources", "AGSWS resources — reports, articles, and research documents.");
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = resources.filter((r) => {
    const matchCat = activeFilter === "All" || r.category === activeFilter;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main id="main-content">
      <PageHero title="Resources & Reports" label="Transparency" size="sm" breadcrumb={[{ label: "Home", href: "/" }, { label: "Resources" }]} />

      {/* Filter bar */}
      <div className="sticky top-[72px] bg-card border-b border-border py-4 z-30">
        <div className="max-w-[1100px] mx-auto px-6 flex flex-wrap items-center gap-3">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === cat ? "bg-teal text-primary-foreground" : "bg-background text-text-mid border border-border hover:bg-teal-light"}`}>
              {cat}
            </button>
          ))}
          <div className="relative ml-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="h-10 pl-9 pr-4 border border-border rounded-full text-sm bg-card outline-none focus:border-teal transition-all w-48" />
          </div>
        </div>
      </div>

      <section className="bg-background py-16">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res, i) => (
            <FadeInUp key={res.title} delay={i * 0.05}>
              <div className={`bg-card border border-border border-l-4 ${colorBorder[res.color] || "border-l-teal"} rounded-lg p-6 shadow-brand-sm hover:shadow-brand-md transition-shadow`}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-text-dark text-base pr-4">{res.title}</h4>
                  <span className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded flex-shrink-0">{res.type}</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="text-xs bg-teal-light text-teal px-2 py-0.5 rounded-full font-medium">{res.category}</span>
                  <span className="text-xs bg-background text-text-light px-2 py-0.5 rounded-full">{res.year}</span>
                </div>
                <p className="body-small text-text-mid line-clamp-2 mb-4">{res.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-light">{res.fileSize}</span>
                  <button className="flex items-center gap-2 text-teal text-sm font-semibold border border-teal/30 px-4 py-1.5 rounded-full hover:bg-teal-light transition-colors">
                    <Download size={14} /> Download
                  </button>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Resources;
