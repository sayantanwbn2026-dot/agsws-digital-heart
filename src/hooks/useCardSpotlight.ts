import { useEffect } from "react";

/** Cards that opt into the spotlight: the shared card shell, plus anything
 *  tagged `data-spotlight` in its own markup. */
const SELECTOR = ".global-card, [data-spotlight]";

/**
 * Gives every card on the site a cursor-tracking highlight without touching
 * each component: one delegated pointermove listener writes the pointer
 * position onto the hovered card as `--mx` / `--my`, which the matching
 * `::before` gradient in index.css reads.
 *
 * Writes are batched into a single rAF and skipped for touch pointers and
 * reduced-motion visitors, so the cost is one style mutation per frame at most.
 */
export function useCardSpotlight() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let pending: { card: HTMLElement; x: number; y: number } | null = null;
    let lastCard: HTMLElement | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { card, x, y } = pending;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      pending = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const target = e.target as Element | null;
      const card = target?.closest?.(SELECTOR) as HTMLElement | null;

      if (card !== lastCard) {
        lastCard?.style.removeProperty("--spot");
        lastCard = card;
        if (card) card.style.setProperty("--spot", "1");
      }
      if (!card) return;

      const rect = card.getBoundingClientRect();
      pending = { card, x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    const onLeave = () => {
      lastCard?.style.removeProperty("--spot");
      lastCard = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      lastCard?.style.removeProperty("--spot");
    };
  }, []);
}
