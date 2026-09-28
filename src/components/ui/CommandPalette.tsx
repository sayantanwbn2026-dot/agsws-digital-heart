import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, CornerDownLeft, Heart, BookOpen, Handshake, Award, Home, Info,
  Image, Calendar, Newspaper, HelpCircle, Mail, Users, UserPlus, FileText,
  BarChart3, ShieldCheck, Sparkles, ArrowUpRight,
} from "lucide-react";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";
import { prefetchRoute } from "@/lib/route-prefetch";

/**
 * Global ⌘K palette. Opens on Cmd/Ctrl+K, on "/" when nothing else is focused,
 * or when any component dispatches `window.dispatchEvent(new Event(OPEN_EVENT))`.
 * Kept event-driven rather than context-based so callers (navbar, footer,
 * bottom nav) can trigger it without threading a provider through the tree.
 */
export const OPEN_COMMAND_PALETTE = "agsws:open-command-palette";

export const openCommandPalette = () =>
  window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE));

type Item = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  keywords?: string;
  path?: string;
  run?: () => void;
  accent?: boolean;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const { openOverlay } = useDonateOverlay();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const items: Item[] = useMemo(
    () => [
      { id: "donate", label: "Donate now", hint: "Support a cause", group: "Actions", icon: Heart, keywords: "give contribute money support pay", run: openOverlay, accent: true },
      { id: "apply", label: "Apply for support", hint: "Request medical or education aid", group: "Actions", icon: FileText, keywords: "help request aid assistance", path: "/apply" },
      { id: "goldenage", label: "GoldenAge Care registration", hint: "Elder care programme", group: "Actions", icon: UserPlus, keywords: "senior parent elderly register old age", path: "/register-parent" },
      { id: "volunteer", label: "Volunteer portal", hint: "Log hours, get certified", group: "Actions", icon: Award, keywords: "join help time certificate", path: "/volunteer-portal" },
      { id: "track", label: "Track a donation", group: "Actions", icon: Search, keywords: "receipt status reference id", path: "/track-donation" },

      { id: "home", label: "Home", group: "Pages", icon: Home, keywords: "start main landing", path: "/" },
      { id: "about", label: "About us", group: "Pages", icon: Info, keywords: "team story mission history", path: "/about" },
      { id: "initiatives", label: "Initiatives", group: "Pages", icon: Sparkles, keywords: "programmes projects work causes", path: "/initiatives" },
      { id: "medical", label: "Medical aid", group: "Pages", icon: Heart, keywords: "hospital treatment emergency health", path: "/initiatives/medical" },
      { id: "education", label: "Education support", group: "Pages", icon: BookOpen, keywords: "school scholarship tuition students", path: "/initiatives/education" },
      { id: "csr", label: "CSR partnership", group: "Pages", icon: Handshake, keywords: "corporate company business partner", path: "/csr" },
      { id: "members", label: "Members", group: "Pages", icon: Users, keywords: "people team trustees", path: "/members" },
      { id: "events", label: "Events", group: "Pages", icon: Calendar, keywords: "camps drives calendar upcoming", path: "/events" },
      { id: "gallery", label: "Gallery", group: "Pages", icon: Image, keywords: "photos pictures album media", path: "/gallery" },
      { id: "blog", label: "Blog", group: "Pages", icon: Newspaper, keywords: "articles stories news writing", path: "/blog" },
      { id: "impact", label: "Impact report", group: "Pages", icon: BarChart3, keywords: "numbers results statistics annual", path: "/impact" },
      { id: "transparency", label: "Transparency", group: "Pages", icon: ShieldCheck, keywords: "finance accounts audit trust 80g", path: "/transparency" },
      { id: "donorwall", label: "Donor wall", group: "Pages", icon: Users, keywords: "supporters contributors thanks", path: "/donor-wall" },
      { id: "faq", label: "FAQ", group: "Pages", icon: HelpCircle, keywords: "questions answers help doubts", path: "/faq" },
      { id: "contact", label: "Contact", group: "Pages", icon: Mail, keywords: "email phone reach address visit", path: "/contact" },
    ],
    [openOverlay]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items
      .map((it) => {
        const label = it.label.toLowerCase();
        const hay = `${label} ${it.hint ?? ""} ${it.keywords ?? ""}`.toLowerCase();
        if (label.startsWith(q)) return { it, score: 0 };
        if (label.includes(q)) return { it, score: 1 };
        if (hay.includes(q)) return { it, score: 2 };
        return null;
      })
      .filter((x): x is { it: Item; score: number } => x !== null)
      .sort((a, b) => a.score - b.score)
      .map((x) => x.it);
  }, [items, query]);

  // A free-text fallback so the palette is never a dead end.
  const searchFallback: Item | null = query.trim()
    ? {
        id: "__search",
        label: `Search the site for “${query.trim()}”`,
        group: "Search",
        icon: Search,
        path: `/search?q=${encodeURIComponent(query.trim())}`,
      }
    : null;

  const flat = useMemo(
    () => (searchFallback ? [...results, searchFallback] : results),
    [results, searchFallback]
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const select = useCallback(
    (item: Item) => {
      close();
      // Let the close animation start before routing so the exit isn't cut off.
      requestAnimationFrame(() => {
        if (item.run) item.run();
        else if (item.path) navigate(item.path);
      });
    },
    [close, navigate]
  );

  // Open triggers: ⌘K / Ctrl+K, "/" outside a field, and the custom event.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "/" && !open) {
        const el = document.activeElement as HTMLElement | null;
        const typing =
          el &&
          (el.tagName === "INPUT" ||
            el.tagName === "TEXTAREA" ||
            el.tagName === "SELECT" ||
            el.isContentEditable);
        if (!typing) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_COMMAND_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_COMMAND_PALETTE, onOpen);
    };
  }, [open]);

  // Lock the page (and Lenis) while the palette owns the screen.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.lenis?.stop?.();
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = prev;
      window.lenis?.start?.();
      clearTimeout(t);
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // Keep the highlighted row inside the scroll viewport, and warm its chunk so
  // pressing Enter navigates without waiting on a download.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    node?.scrollIntoView({ block: "nearest" });
    prefetchRoute(flat[active]?.path);
  }, [active, open, flat]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[active];
      if (item) select(item);
    }
  };

  // Render grouped, but index against the flat list so arrow keys stay linear.
  const groups = useMemo(() => {
    const out: { name: string; items: { item: Item; index: number }[] }[] = [];
    flat.forEach((item, index) => {
      const bucket = out.find((g) => g.name === item.group);
      if (bucket) bucket.items.push({ item, index });
      else out.push({ name: item.group, items: [{ item, index }] });
    });
    return out;
  }, [flat]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="cmdk"
          className="fixed inset-0 z-[10000] flex items-start justify-center px-4 pt-[14vh] sm:pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <div
            className="absolute inset-0 bg-[rgba(10,20,22,0.42)] backdrop-blur-[6px]"
            onClick={close}
            aria-hidden
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={onKeyDown}
            className="relative w-full max-w-[580px] overflow-hidden rounded-[12px] border border-white/60 bg-white/95 shadow-[0_32px_80px_-24px_rgba(10,30,35,0.45)] backdrop-blur-xl"
          >
            {/* Query row */}
            <div className="flex items-center gap-3 border-b border-[var(--border-color)] px-4 sm:px-5">
              <Search size={17} className="shrink-0 text-[var(--light)]" />
              <input
                ref={inputRef}
                data-bare
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, or jump to an action…"
                aria-label="Search pages and actions"
                className="cmdk-input w-full text-[var(--dark)] placeholder:text-[var(--light)]"
              />
              <kbd className="hidden shrink-0 rounded-md border border-[var(--border-color)] bg-[var(--bg)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--light)] sm:block">
                esc
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[52vh] overflow-y-auto overscroll-contain p-2">
              {flat.length === 0 && (
                <p className="px-4 py-10 text-center text-[13px] text-[var(--light)]">
                  Nothing matches “{query}”.
                </p>
              )}

              {groups.map((group) => (
                <div key={group.name} className="mb-1 last:mb-0">
                  <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--light)]">
                    {group.name}
                  </p>
                  {group.items.map(({ item, index }) => {
                    const isActive = index === active;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        data-active={isActive}
                        onMouseMove={() => setActive(index)}
                        onClick={() => select(item)}
                        className={`group flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left transition-colors duration-150 ${
                          isActive ? "bg-[var(--teal-light)]" : "bg-transparent"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] transition-colors duration-150 ${
                            item.accent
                              ? "bg-[var(--yellow)] text-[var(--dark)]"
                              : isActive
                              ? "bg-[var(--teal)] text-white"
                              : "bg-[var(--bg)] text-[var(--teal)]"
                          }`}
                        >
                          <Icon size={15} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13.5px] font-medium leading-tight text-[var(--dark)]">
                            {item.label}
                          </span>
                          {item.hint && (
                            <span className="mt-0.5 block truncate text-[11.5px] leading-tight text-[var(--light)]">
                              {item.hint}
                            </span>
                          )}
                        </span>
                        {isActive ? (
                          <CornerDownLeft size={14} className="shrink-0 text-[var(--teal)]" />
                        ) : (
                          <ArrowUpRight size={14} className="shrink-0 text-transparent" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer legend */}
            <div className="hidden items-center gap-4 border-t border-[var(--border-color)] bg-[var(--bg)] px-5 py-2.5 text-[11px] text-[var(--light)] sm:flex">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-[var(--border-color)] bg-white px-1.5 py-0.5 text-[10px]">↑</kbd>
                <kbd className="rounded border border-[var(--border-color)] bg-white px-1.5 py-0.5 text-[10px]">↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-[var(--border-color)] bg-white px-1.5 py-0.5 text-[10px]">↵</kbd>
                select
              </span>
              <span className="ml-auto flex items-center gap-1.5">
                <kbd className="rounded border border-[var(--border-color)] bg-white px-1.5 py-0.5 text-[10px]">⌘</kbd>
                <kbd className="rounded border border-[var(--border-color)] bg-white px-1.5 py-0.5 text-[10px]">K</kbd>
                anywhere
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
