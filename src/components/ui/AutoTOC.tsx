import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { List, X } from "lucide-react";

interface TOCItem { id: string; label: string; }
interface AutoTOCProps {
  /** Pre-built items if you don't want auto-extraction. */
  items?: TOCItem[];
  /** CSS selector to scrape headings from when items are not supplied. */
  selector?: string;
}

/**
 * Floating table-of-contents drawer for long pages.
 * - Auto-discovers headings (default: h2[id], h3[id]) on mount.
 * - Highlights the section currently in view.
 * - Hidden until the user clicks the floating button.
 * - Skip rendering when there are fewer than 2 sections.
 */
const AutoTOC = ({ items: itemsProp, selector = "section[id], h2[id], h3[id]" }: AutoTOCProps) => {
  const [items, setItems] = useState<TOCItem[]>(itemsProp ?? []);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  // Auto-extract headings if items not provided
  useEffect(() => {
    if (itemsProp?.length) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const next = els
      .filter(el => el.id && (el.textContent ?? "").trim().length > 0)
      .map(el => ({ id: el.id, label: (el.dataset.tocLabel ?? el.textContent ?? "").trim() }));
    setItems(next);
  }, [itemsProp, selector]);

  // Track active section
  useEffect(() => {
    if (!items.length) return;
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Open table of contents"
        className="fixed bottom-24 right-4 lg:right-6 z-[9990] w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
      >
        {open ? <X size={18} /> : <List size={18} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-40 right-4 lg:right-6 z-[9989] w-[260px] max-h-[60vh] overflow-y-auto rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-3"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground px-3 pt-2 pb-1.5">On this page</p>
            <ul className="space-y-0.5">
              {items.map(item => {
                const active = item.id === activeId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollTo(item.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-[13px] leading-snug transition-colors ${
                        active
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default AutoTOC;
