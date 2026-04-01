const partners = [
  "Kolkata Medical Trust",
  "Bengal Education Foundation",
  "City Hospital Network",
  "Razorpay",
  "Rotary Club Kolkata",
  "Bengal Chamber of Commerce",
  "Kolkata Municipal Corp.",
  "UNICEF India",
];

const PartnerStrip = () => (
  <section className="bg-[var(--white)] py-12 overflow-hidden border-y border-[var(--border-color)]">
    <div className="max-w-[1200px] mx-auto px-6 mb-6">
      <p className="label text-center mb-0">
        Trusted By & In Partnership With
      </p>
    </div>
    <div className="relative" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
      <div className="flex animate-marquee">
        {[...partners, ...partners].map((name, i) => (
          <div key={i} className="flex-shrink-0 mx-6 px-6 py-3 bg-[var(--bg)] shadow-[var(--shadow-sm)] rounded-full border border-[var(--border-color)]">
            <span className="text-[13px] font-medium text-[var(--mid)] whitespace-nowrap">{name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PartnerStrip;
