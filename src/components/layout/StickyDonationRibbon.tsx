import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";

const StickyDonationRibbon = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [donorCount, setDonorCount] = useState(2847);
  const [flash, setFlash] = useState(false);
  const { openOverlay } = useDonateOverlay();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight && !dismissed) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDonorCount(c => c + 1);
      setFlash(true);
      setTimeout(() => setFlash(false), 400);
    }, 45000 + Math.random() * 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-0 md:bottom-0 w-full h-[60px] bg-card border-t-2 border-teal z-50 hidden md:flex items-center justify-between px-6 shadow-brand-md"
        >
          <p className="text-sm font-medium text-text-dark hidden sm:block">Your support saves lives.</p>
          <div className="flex items-center gap-4 ml-auto">
            <motion.span
              className={`text-[11px] font-medium text-text-mid transition-colors ${flash ? "text-teal" : ""}`}
              animate={flash ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              Join {donorCount.toLocaleString()} donors
            </motion.span>
            <motion.button
              onClick={openOverlay}
              className="inline-block bg-yellow text-text-dark font-semibold text-sm px-6 py-2 rounded-full hover:shadow-yellow transition-shadow cursor-pointer"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Donate Now
            </motion.button>
            <button onClick={() => setDismissed(true)} className="text-text-light hover:text-text-dark transition-colors" aria-label="Dismiss">
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyDonationRibbon;
