import ImagePlaceholder from "../ui/ImagePlaceholder";

const storyPills = [
  { name: "Kalinda, 8", text: "got school books", category: "education" as const },
  { name: "Ram, 72", text: "got surgery support", category: "elderly" as const },
  { name: "Priya, 34", text: "received health camp care", category: "medical" as const },
  { name: "Amita, 65", text: "registered for emergency", category: "elderly" as const },
  { name: "Suresh, 10", text: "joined tutoring program", category: "child" as const },
  { name: "Meena, 70", text: "hospital admission coordinated", category: "hospital" as const },
];

const ScrollingStoriesStrip = () => (
  <section className="py-8 overflow-hidden relative">
    <div
      className="relative"
      style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
    >
      <div className="flex animate-marquee hover:[animation-play-state:paused]">
        {[...storyPills, ...storyPills].map((pill, i) => (
          <div
            key={i}
            className="flex-shrink-0 mx-3 flex items-center gap-3 bg-card shadow-brand-sm border border-border rounded-full px-5 py-2.5 hover:scale-[1.04] hover:shadow-brand-md transition-all duration-200 cursor-default"
          >
            <ImagePlaceholder category={pill.category} className="w-8 h-8 rounded-full flex-shrink-0" />
            <span className="text-[13px] text-text-mid whitespace-nowrap">
              <span className="font-medium text-text-dark">{pill.name}</span> {pill.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ScrollingStoriesStrip;
