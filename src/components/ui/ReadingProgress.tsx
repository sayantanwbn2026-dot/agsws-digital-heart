import { motion, useScroll, useSpring } from "framer-motion";

interface ReadingProgressProps {
  /** Optional accent color (HSL string or CSS var). Defaults to primary. */
  color?: string;
}

/**
 * Slim sticky reading-progress bar pinned to the top of the viewport.
 * Use on any long-form page (Blog post, About, Impact Report).
 */
const ReadingProgress = ({ color = "hsl(var(--primary))" }: ReadingProgressProps) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[9999] pointer-events-none"
      style={{ scaleX, backgroundColor: color }}
    />
  );
};

export default ReadingProgress;
