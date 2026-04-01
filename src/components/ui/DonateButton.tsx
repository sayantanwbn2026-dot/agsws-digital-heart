import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DonateButtonProps {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

const DonateButton = ({ className = "", children, onClick }: DonateButtonProps) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseDown={handleMouseDown}
      className={`relative group rounded-[var(--radius-full)] inline-flex items-center justify-center whitespace-nowrap outline-none select-none border-2 border-[var(--yellow)] ${className}`}
      whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255, 195, 0, 0.45)" }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Inner Button Content */}
      <div className="relative bg-[var(--yellow)] text-[var(--dark)] font-[600] text-[14px] h-[44px] lg:h-[48px] px-[28px] rounded-[var(--radius-full)] flex items-center justify-center overflow-hidden w-full transition-colors">
        <span className="relative z-20 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {/* Ripple */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.3 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute rounded-full pointer-events-none z-10 bg-white"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 100,
                height: 100,
                transformOrigin: "center",
                marginTop: -50,
                marginLeft: -50,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default DonateButton;
