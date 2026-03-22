import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const LoadingScreen = () => {
  const [show, setShow] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('agsws-loaded')) return false;
    return true;
  });
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => setAnimateOut(true), 1500);
    const remove = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('agsws-loaded', '1');
    }, 2100);
    return () => { clearTimeout(timer); clearTimeout(remove); };
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-card flex flex-col items-center justify-center"
      animate={animateOut ? { y: "-100vh" } : { y: 0 }}
      transition={{ duration: 0.6, ease: "easeIn" }}
    >
      <span className="font-bold text-[32px] text-teal tracking-tight">AGSWS</span>
      <div className="w-[200px] h-[2px] bg-border mt-4 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-teal rounded-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-[11px] font-medium tracking-[0.15em] uppercase text-text-mid mt-3"
      >
        Social Welfare Society
      </motion.span>
    </motion.div>
  );
};

export default LoadingScreen;
