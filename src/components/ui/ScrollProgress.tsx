import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Hairline reading-progress bar pinned to the very top of the viewport,
 * above the announcement bar. Spring-smoothed so it glides rather than
 * tracking the raw scroll value frame-for-frame.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[9998] h-[2px] origin-left bg-gradient-to-r from-[var(--teal)] via-[#3FC2CE] to-[var(--yellow)]"
    />
  );
}
