import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";

const StickyDonationRibbon = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { openOverlay } = useDonateOverlay();

  useEffect(() => {
    const handleScroll = () => {
      // 30% of scrollable page, or past window.innerHeight
      const scrollThreshold = Math.min(window.innerHeight, document.body.scrollHeight * 0.3);
      if (window.scrollY > scrollThreshold && !dismissed) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dismissed]);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          exit={{ y: 60 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[998] h-[60px] bg-white border-t-[2px] border-t-[var(--teal)] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between px-[20px] md:px-[32px]"
        >
          <div className="flex items-center">
            <span className="font-['Inter'] font-[600] text-[14px] text-[var(--dark)]">
              Your support saves lives.
            </span>
          </div>
          
          <div className="flex items-center gap-[16px]">
            <motion.button
              onClick={openOverlay}
              className="bg-[var(--yellow)] text-[var(--dark)] font-[600] font-['Inter'] text-[14px] h-[40px] px-[20px] rounded-full flex items-center justify-center cursor-pointer border-none"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Donate
            </motion.button>
            <button 
              onClick={() => setDismissed(true)} 
              className="w-[32px] h-[32px] rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors text-[var(--dark)]" 
              aria-label="Dismiss Donation Ribbon"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyDonationRibbon;
