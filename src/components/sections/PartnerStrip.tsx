import { ExternalLink } from "lucide-react";
import { useCMSList } from "@/hooks/useCMSList";

type Partner = {
  name: string;
  logo?: string | null;
  website?: string | null;
};

const staticPartners: Partner[] = [
  { name: "Kolkata Medical Trust" },
  { name: "Bengal Education Foundation" },
  { name: "City Hospital Network" },
  { name: "Razorpay", website: "https://razorpay.com" },
  { name: "Rotary Club Kolkata" },
  { name: "Bengal Chamber of Commerce" },
  { name: "Kolkata Municipal Corp." },
  { name: "UNICEF India", website: "https://unicef.org" },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const getDomainLabel = (website?: string | null) => {
  if (!website) return "Community partner";

  try {
    return new URL(website).hostname.replace(/^www\./, "");
  } catch {
    return website;
  }
};

const PartnerTile = ({ partner }: { partner: Partner }) => {
  const content = (
    <div className="flex min-w-[240px] items-center gap-4 rounded-[24px] border border-border bg-background px-5 py-4 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[var(--shadow-lg)]">
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card">
        {partner.logo ? (
          <img src={partner.logo} alt={`${partner.name} logo`} className="h-full w-full object-contain p-2" loading="lazy" />
        ) : (
          <span className="text-sm font-black uppercase tracking-[0.12em] text-primary">{getInitials(partner.name)}</span>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{partner.name}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{getDomainLabel(partner.website)}</p>
      </div>

      {partner.website && <ExternalLink size={15} className="ml-auto flex-shrink-0 text-primary" />}
    </div>
  );

  if (partner.website) {
    return (
      <a href={partner.website} target="_blank" rel="noreferrer" aria-label={partner.name} className="flex-shrink-0">
        {content}
      </a>
    );
  }

  return <div className="flex-shrink-0">{content}</div>;
};

const PartnerStrip = () => {
  const { data: cmsPartners } = useCMSList<any>("cms_partners", [], {
    orderBy: { column: "sort_order" },
  });

  const partners: Partner[] = cmsPartners.length
    ? cmsPartners.map((partner: any) => ({
        name: partner.name,
        logo: partner.logo || null,
        website: partner.website || null,
      }))
    : staticPartners;

  return (
    <section className="overflow-hidden bg-card py-16 lg:py-20">
      <div className="container mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="label">Partnership network</span>
          <h2 className="max-w-none text-foreground">Trusted by institutions that extend our reach.</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-muted-foreground">
          Hospitals, civic groups, donors, and community partners help AGSWS move faster and serve more families across Kolkata.
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card to-transparent" />

        <div className="flex animate-marquee gap-4 hover:[animation-play-state:paused]">
          {[...partners, ...partners].map((partner, index) => (
            <PartnerTile key={`${partner.name}-${index}`} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerStrip;
