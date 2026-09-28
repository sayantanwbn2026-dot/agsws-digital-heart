import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  /** How far the element may drift toward the cursor, in px. */
  strength?: number;
  className?: string;
}

/**
 * Wraps a control so it leans subtly toward the pointer while hovered, then
 * springs home on exit. Pointer-only: skipped on coarse/touch input and when
 * the visitor has asked for reduced motion.
 */
export default function Magnetic({ children, strength = 6, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const handleMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setOffset({
      x: Math.max(-1, Math.min(1, dx)) * strength,
      y: Math.max(-1, Math.min(1, dy)) * strength,
    });
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={handleMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.4 }}
      style={{ display: "inline-flex" }}
    >
      {children}
    </motion.div>
  );
}
