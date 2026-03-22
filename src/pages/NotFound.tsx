import { useLocation, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import DonateButton from "@/components/ui/DonateButton";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";

const causes = [
  { title: "Medical Aid & Hospital Support", desc: "Fund emergency care, surgeries, and medicines for patients in Kolkata.", raised: 320000, goal: 500000, to: "/donate/medical", color: "teal" },
  { title: "Education Support", desc: "Sponsor a child's full school year — books, fees, and meals.", raised: 180000, goal: 300000, to: "/donate/education", color: "purple" },
  { title: "Parent Medical Registration", desc: "Enable remote elderly care registration for NRK families.", raised: 45000, goal: 100000, to: "/register-parent", color: "yellow" },
];

const NotFound = () => {
  const location = useLocation();
  const { openOverlay } = useDonateOverlay();
  const randomCause = useMemo(() => causes[Math.floor(Math.random() * causes.length)], []);
  const pct = Math.round((randomCause.raised / randomCause.goal) * 100);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-dark via-teal to-teal-dark relative overflow-hidden">
      {/* Animated SVG circle */}
      <svg className="absolute w-[300px] h-[300px]" viewBox="0 0 300 300">
        <motion.circle
          cx="150" cy="150" r="140"
          stroke="hsl(187 52% 93%)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          strokeDasharray="0 1"
        />
      </svg>
      <div className="relative text-center px-6 z-10 max-w-lg">
        <span className="text-[96px] font-extrabold text-primary-foreground/[0.08] leading-none block mb-[-40px]">404</span>
        <h2 className="text-3xl font-bold text-primary-foreground mb-3">Lost? Let's find you.</h2>
        <p className="text-base text-primary-foreground/70 max-w-sm mx-auto mb-8">
          Even when paths go missing, our mission stays clear.
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Link to="/" className="bg-yellow text-text-dark font-semibold px-8 py-3 rounded-full shadow-yellow hover:scale-[1.02] transition-transform">
            Take Me Home
          </Link>
          <button onClick={openOverlay} className="border border-primary-foreground/40 text-primary-foreground font-semibold px-8 py-3 rounded-full hover:bg-primary-foreground/10 transition-all cursor-pointer">
            Donate Anyway
          </button>
        </div>

        {/* Random cause */}
        <div className="bg-card rounded-xl p-6 text-left shadow-brand-lg">
          <p className="text-xs font-medium text-text-light mb-2">While you're here — a cause that needs support:</p>
          <h3 className="font-bold text-text-dark mb-1">{randomCause.title}</h3>
          <p className="text-sm text-text-mid mb-4">{randomCause.desc}</p>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-text-mid mb-1">
              <span>₹{(randomCause.raised / 100000).toFixed(1)}L raised</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-teal rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <Link to={randomCause.to}>
            <DonateButton className="w-full py-2.5 text-sm mt-3">Donate to This Cause →</DonateButton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
