import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("agsws_cookies")) {
        const timer = setTimeout(() => setVisible(true), 2000);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handle = (value: string) => {
    try { localStorage.setItem("agsws_cookies", value); } catch {}
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[70] bg-card border-t-2 border-teal shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
        >
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Cookie size={20} className="text-text-mid flex-shrink-0" />
              <p className="text-[13px] text-text-mid">
                We use cookies to improve your experience and understand how you use our site.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => handle("accepted")}
                className="bg-teal text-primary-foreground text-sm font-medium px-5 py-2 rounded-full hover:bg-teal-dark transition-colors"
              >
                Accept
              </button>
              <button
                onClick={() => handle("rejected")}
                className="border border-teal text-teal text-sm font-medium px-5 py-2 rounded-full hover:bg-teal-light transition-colors"
              >
                Reject Non-essential
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
