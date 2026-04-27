import { useState, useRef } from "react";
import { MousePointer2, CreditCard, BarChart2 } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import FadeInUp from "../ui/FadeInUp";
import { useCMSSection } from "@/hooks/useCMSSection";

const iconMap: Record<string, any> = { MousePointer2, CreditCard, BarChart2 };

const defaultData = {
  steps: [
    { id: 'choose', icon: 'MousePointer2', title: "Choose Your Cause", desc: "Pick from Medical Aid, Education Support, or GoldenAge Care. Every cause directly serves families in Kolkata." },
    { id: 'donate', icon: 'CreditCard', title: "Make a Secure Donation", desc: "Pay by card, UPI, or netbanking through Stripe. SSL-encrypted. Email receipt arrives instantly." },
    { id: 'impact', icon: 'BarChart2', title: "See Real Impact", desc: "Receive updates on how your donation is used. Quarterly impact reports. Zero overhead fluff." },
  ],
};

const HowItWorks = () => {
  const { data } = useCMSSection<typeof defaultData>('how_it_works', defaultData);
  const steps = data.steps;
  const [activeTab, setActiveTab] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <section ref={ref} className="bg-[hsl(var(--background))] section relative overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-[hsl(var(--primary))]/[0.02] rounded-full blur-[120px]" />
      </motion.div>

      <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] relative z-10">
        <FadeInUp className="max-w-[540px] mb-12">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">The Process</span>
          <h2 className="text-3xl font-bold text-[hsl(var(--foreground))] mt-3">Simple Steps to Make a Difference</h2>
        </FadeInUp>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-3 pb-4 lg:pb-0 w-full lg:w-[300px] flex-shrink-0">
            {steps.map((step, i) => {
              const isActive = i === activeTab;
              const Icon = iconMap[step.icon] || MousePointer2;
              return (
                <motion.button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 text-left px-5 py-3 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? "bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))] shadow-md"
                      : "bg-[hsl(var(--card))] border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--primary))]/30"
                  }`}
                >
                  <Icon size={16} />
                  {step.title}
                </motion.button>
              );
            })}
          </div>

          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-8 lg:p-10 w-full lg:min-h-[260px] flex items-center shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                <div className="w-14 h-14 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] rounded-xl flex items-center justify-center mb-6">
                  {(() => { const Icon = iconMap[steps[activeTab]?.icon] || MousePointer2; return <Icon size={28} />; })()}
                </div>
                <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mb-3">{steps[activeTab]?.title}</h3>
                <p className="text-[15px] text-[hsl(var(--muted-foreground))] leading-relaxed max-w-[480px]">
                  {steps[activeTab]?.desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
