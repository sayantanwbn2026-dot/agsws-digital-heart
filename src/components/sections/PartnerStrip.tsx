import { useCMSList } from "@/hooks/useCMSList";

const staticPartners = [
  "Kolkata Medical Trust", "Bengal Education Foundation", "City Hospital Network",
  "Stripe", "Rotary Club Kolkata", "Bengal Chamber of Commerce",
  "Kolkata Municipal Corp.", "UNICEF India",
];

const PartnerStrip = () => {
  const { data: cmsPartners } = useCMSList<any>('cms_partners', [], {
    orderBy: { column: 'sort_order' }
  });
  const partners = cmsPartners.length ? cmsPartners.map((p: any) => p.name) : staticPartners;

  return (
    <section className="bg-white section-sm overflow-hidden">
      <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] mb-8">
        <p className="label text-center mb-0">Trusted By & In Partnership With</p>
      </div>
      <div className="relative" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
        <div className="flex animate-marquee">
          {[...partners, ...partners].map((name, i) => (
            <div key={i} className="flex-shrink-0 mx-4 px-6 py-3 bg-[var(--bg)] rounded-2xl border border-[var(--border-color)] hover:border-[var(--teal)] hover:shadow-[var(--shadow-sm)] transition-all duration-200">
              <span className="text-[13px] font-[600] text-[var(--mid)] whitespace-nowrap">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerStrip;
