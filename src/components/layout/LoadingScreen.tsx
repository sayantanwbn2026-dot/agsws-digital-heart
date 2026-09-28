import { motion } from "framer-motion";
import { useState, useEffect } from "react";

/**
 * Brief branded reveal on the first visit of a session.
 *
 * It used to hold a full-screen overlay for a fixed 2.1s behind a fake progress
 * bar — over a page that was usually already rendered. That wait sat directly
 * on Largest Contentful Paint and cost every first-time visitor two seconds.
 *
 * Now it lifts as soon as the page is genuinely ready (web fonts loaded, so
 * text doesn't reflow the moment it's uncovered), with a short floor so it
 * doesn't flash and a hard ceiling so a slow font can't hold the page hostage.
 * Skipped entirely for returning sessions and reduced-motion visitors.
 */
const MIN_MS = 350;
const MAX_MS = 900;
const EXIT_MS = 450;

const shouldShow = () => {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem("agsws-loaded")) return false;
  } catch {
    /* storage blocked — just show it */
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

const markSeen = () => {
  try {
    sessionStorage.setItem("agsws-loaded", "1");
  } catch {
    /* storage blocked — harmless */
  }
};

const LoadingScreen = () => {
  const [show, setShow] = useState(shouldShow);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    if (!show) {
      markSeen();
      return;
    }
    let cancelled = false;
    const start = performance.now();

    const lift = () => {
      if (cancelled) return;
      setAnimateOut(true);
      window.setTimeout(() => {
        if (cancelled) return;
        setShow(false);
        markSeen();
      }, EXIT_MS);
    };

    const ceiling = window.setTimeout(lift, MAX_MS);
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    fontsReady.then(() => {
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      window.setTimeout(() => {
        window.clearTimeout(ceiling);
        lift();
      }, wait);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(ceiling);
    };
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[10001] bg-card flex flex-col items-center justify-center"
      animate={animateOut ? { opacity: 0, y: -16 } : { opacity: 1, y: 0 }}
      transition={{ duration: EXIT_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: animateOut ? "none" : "auto" }}
    >
      <span className="font-bold text-[32px] text-teal tracking-tight">AGSWS</span>
      <div className="w-[200px] h-[2px] bg-border mt-4 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-teal rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: animateOut ? "100%" : "70%" }}
          transition={{ duration: animateOut ? 0.25 : MAX_MS / 1000, ease: "easeOut" }}
        />
      </div>
      <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-mid mt-3">
        Social Welfare Society
      </span>
    </motion.div>
  );
};

export default LoadingScreen;
