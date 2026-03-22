import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const messages = [
  "Rohan from Bengaluru just registered his mother in Kolkata",
  "A donor from Delhi just sponsored a child's school year",
  "3 patients supported this week in North Kolkata",
  "New: Parent registration now available for Howrah families",
  "₹18,000 raised this week for education support",
  "2 parent registrations from families in London",
];

const LiveTicker = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % messages.length), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-teal h-9 flex items-center px-4 sm:px-6 z-[60] relative">
      <div className="max-w-[1200px] mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-[11px] font-semibold text-primary-foreground/90 hidden sm:inline">Live</span>
        </div>
        <div className="flex-1 mx-4 overflow-hidden h-5 relative">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 text-[11px] sm:text-xs text-primary-foreground/90 text-center truncate leading-5"
            >
              {messages[index]}
            </motion.span>
          </AnimatePresence>
        </div>
        <Link to="/register-parent" className="text-yellow text-[11px] font-semibold whitespace-nowrap hidden sm:inline">
          Register Parent →
        </Link>
      </div>
    </div>
  );
};

export default LiveTicker;
