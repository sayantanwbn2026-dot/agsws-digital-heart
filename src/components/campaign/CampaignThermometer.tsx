import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

interface Props {
  goalAmount: number;
  raisedAmount: number;
  deadlineDate: string;
  campaignName: string;
  compact?: boolean;
}

const CampaignThermometer = ({ goalAmount, raisedAmount, deadlineDate, campaignName, compact }: Props) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const pct = Math.min(100, Math.round((raisedAmount / goalAmount) * 100));
  const remaining = goalAmount - raisedAmount;

  const [timeLeft, setTimeLeft] = useState({ days: 0, hrs: 0, min: 0, sec: 0 });
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(deadlineDate).getTime() - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hrs: Math.floor((diff % 86400000) / 3600000),
        min: Math.floor((diff % 3600000) / 60000),
        sec: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [deadlineDate]);

  const fillColor = pct < 50 ? "bg-teal" : pct < 80 ? "bg-gradient-to-r from-teal to-yellow" : "bg-yellow";

  if (compact) {
    return (
      <div ref={ref} className="bg-card border border-border rounded-xl p-4 shadow-brand-sm">
        <p className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2">{campaignName}</p>
        <div className="flex justify-between text-sm mb-1">
          <span className="font-bold text-teal">₹{raisedAmount.toLocaleString()}</span>
          <span className="text-text-light">of ₹{goalAmount.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-border rounded-full overflow-hidden">
          <motion.div className={`h-full rounded-full ${fillColor}`} initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : {}} transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-text-light">{pct}%</span>
          <span className="text-xs text-text-light">{timeLeft.days}d left</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="bg-card border border-border rounded-xl p-6 shadow-brand-sm">
      <p className="text-sm font-semibold text-text-dark mb-4">{campaignName}</p>
      <div className="flex items-end gap-5">
        {/* Thermometer */}
        <div className="relative w-10 h-48 flex-shrink-0">
          <svg viewBox="0 0 40 200" className="w-full h-full">
            <rect x="5" y="5" width="30" height="170" rx="15" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
            <circle cx="20" cy="185" r="12" fill="hsl(var(--teal))" />
            {inView && (
              <motion.rect x="8" width="24" rx="12" fill="hsl(var(--teal))" initial={{ y: 172, height: 3 }} animate={{ y: 175 - (165 * pct) / 100, height: (165 * pct) / 100 }} transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }} />
            )}
            {[25, 50, 75].map((m) => (
              <line key={m} x1="36" y1={175 - (165 * m) / 100} x2="40" y2={175 - (165 * m) / 100} stroke="hsl(var(--border))" strokeWidth="0.5" />
            ))}
          </svg>
        </div>
        {/* Stats */}
        <div className="flex-1">
          <p className="text-2xl font-bold text-teal">₹{raisedAmount.toLocaleString()}</p>
          <p className="text-sm text-text-light">of ₹{goalAmount.toLocaleString()} goal</p>
          <div className="h-[6px] bg-border rounded-full overflow-hidden mt-3">
            <motion.div className={`h-full rounded-full ${fillColor}`} initial={{ width: 0 }} animate={inView ? { width: `${pct}%` } : {}} transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }} />
          </div>
          <p className="text-xs text-text-light mt-1">{pct}% funded</p>
        </div>
      </div>

      {pct >= 90 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-light border border-yellow/30 rounded-lg p-3 mt-4 text-sm font-semibold text-text-dark">
          Almost there! ₹{remaining.toLocaleString()} more to reach the goal.
        </motion.div>
      )}

      {/* Countdown */}
      <div className="border border-border rounded-lg p-3 mt-4">
        <p className="text-xs text-text-light uppercase tracking-wider mb-2">Campaign closes in</p>
        <div className="flex gap-2">
          {[
            [timeLeft.days, "days"],
            [timeLeft.hrs, "hrs"],
            [timeLeft.min, "min"],
            [timeLeft.sec, "sec"],
          ].map(([val, label]) => (
            <div key={String(label)} className="text-center">
              <div className="bg-teal text-primary-foreground font-bold text-lg rounded px-2 py-1 min-w-[36px]">{String(val).padStart(2, "0")}</div>
              <p className="text-[10px] text-text-light mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignThermometer;
