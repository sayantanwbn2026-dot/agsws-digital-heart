import { useState, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { resources as fallbackResources } from "@/data/resources";
import { useCMSList } from "@/hooks/useCMSList";
import { Download, Search } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { StaggerContainer } from "@/components/ui/StaggerContainer";

const categories = ["All", "Annual Reports", "Financial Reports", "Medical Articles", "Education Updates", "Research"];
const colorBorder: Record<string, string> = { teal: "border-l-teal", purple: "border-l-purple", yellow: "border-l-yellow", beige: "border-l-beige" };

const Resources = () => {
  useSEO("Resources", "AGSWS resources — reports, articles, and research documents.");
  const { data: cmsResources } = useCMSList<any>('cms_resources', [], { orderBy: { column: 'sort_order', ascending: true } });

  const resources = useMemo(() => {
    if (cmsResources.length > 0) {
      return cmsResources.map((r: any) => ({
        title: r.title,
        type: r.file_type || 'PDF',
        year: r.year || '',
        description: r.description || '',
        fileSize: r.file_size || '',
        category: r.category || 'General',
        color: r.color || 'teal',
        fileUrl: r.file_url,
      }));
    }
    return fallbackResources;
  }, [cmsResources]);

  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = resources.filter((r: any) => {
    const matchCat = activeFilter === "All" || r.category === activeFilter;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main id="main-content">
      <PageHero title="Resources & Reports" label="Transparency" size="sm" breadcrumb={[{ label: "Home", href: "/" }, { label: "Resources" }]} />
      <div className="global-card sticky top-[72px] z-30">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap items-center gap-3">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === cat ? "bg-teal text-primary-foreground" : "bg-background text-text-mid border border-border hover:bg-teal-light"}`}>{cat}</button>
          ))}
          <div className="relative ml-auto">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="global-card h-10 pl-9 pr-4 text-sm outline-none focus: w-48" />
          </div>
        </div>
      </div>
      <section className="bg-background py-16">
        <StaggerContainer staggerDelay={0.06} className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {filtered.map((res: any) => (
            <div key={res.title} className={`bg-card border border-border border-l-4 ${colorBorder[res.color] || "border-l-teal"} rounded-lg p-6 shadow-brand-sm hover:shadow-brand-md transition-shadow`}>
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-[var(--dark)] text-base pr-4">{res.title}</h4>
                <span className="text-xs font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded flex-shrink-0">{res.type}</span>
              </div>
              <div className="flex gap-2 mb-3">
                <span className="text-xs bg-teal-light text-[var(--teal)] px-2 py-0.5 rounded-full font-medium">{res.category}</span>
                <span className="text-xs bg-background text-[var(--light)] px-2 py-0.5 rounded-full">{res.year}</span>
              </div>
              <p className="text-[13px] text-[var(--mid)] line-clamp-2 mb-4">{res.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--light)]">{res.fileSize}</span>
                {res.fileUrl ? (
                  <a href={res.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--teal)] text-[13px] font-semibold border border-[var(--teal-light)] px-4 py-1.5 rounded-full hover:bg-[var(--teal-light)] transition-colors">
                    <Download size={14} /> Download
                  </a>
                ) : (
                  <button className="flex items-center gap-2 text-[var(--teal)] text-[13px] font-semibold border border-[var(--teal-light)] px-4 py-1.5 rounded-full hover:bg-[var(--teal-light)] transition-colors">
                    <Download size={14} /> Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </StaggerContainer>
      </section>
    </main>
  );
};

export default Resources;
