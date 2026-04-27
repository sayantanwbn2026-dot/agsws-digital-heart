import { motion } from "framer-motion";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { useCMSSection } from "@/hooks/useCMSSection";

const defaultData = {
  pills: [
    { name: "Kalinda, 8", text: "got school books", category: "education" },
    { name: "Ram, 72", text: "got surgery support", category: "elderly" },
    { name: "Priya, 34", text: "received health camp care", category: "medical" },
    { name: "Amita, 65", text: "registered for emergency", category: "elderly" },
    { name: "Suresh, 10", text: "joined tutoring program", category: "child" },
    { name: "Meena, 70", text: "hospital admission coordinated", category: "hospital" },
  ],
};

const ScrollingStoriesStrip = () => {
  const { data } = useCMSSection<typeof defaultData>('scrolling_stories', defaultData);
  const pills = data.pills;

  return (
    <section className="py-8 lg:py-10 overflow-hidden relative bg-[hsl(var(--background))]">
      <div style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
        <motion.div
          className="flex"
          animate={{ x: [0, -50 * pills.length * 5] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: 4 }).flatMap((_, j) =>
            pills.map((pill: any, i: number) => (
              <div
                key={`${j}-${i}`}
                className="flex-shrink-0 mx-2 flex items-center gap-3 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-full px-4 py-2.5 hover:border-[hsl(var(--primary))]/30 transition-colors cursor-default"
              >
                <ImagePlaceholder category={pill.category as any} className="w-7 h-7 rounded-full flex-shrink-0" />
                <span className="text-[12px] text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                  <span className="font-semibold text-[hsl(var(--foreground))]">{pill.name}</span> {pill.text}
                </span>
              </div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollingStoriesStrip;
