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
  <section className="bg-card py-12 overflow-hidden">
    <div className="max-w-[1100px] mx-auto px-6 mb-6">
      <p className="label-text text-text-light text-center text-xs">
        Trusted By & In Partnership With
      </p>
    </div>
    <div className="relative" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
      <div className="flex animate-marquee">
        {[...partners, ...partners].map((name, i) => (
          <div key={i} className="flex-shrink-0 mx-6 px-6 py-3 bg-background rounded-full border border-border">
            <span className="text-[13px] font-medium text-text-light whitespace-nowrap">{name}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PartnerStrip;
