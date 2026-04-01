import { useState } from "react";
import { MousePointer2, CreditCard, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FadeInUp from "../ui/FadeInUp";

const steps = [
  { id: 'choose', icon: MousePointer2, title: "Choose Your Cause", desc: "Pick from Medical Aid, Education Support, or Parent Registration. Every cause directly serves families in Kolkata." },
  { id: 'donate', icon: CreditCard, title: "Make a Secure Donation", desc: "Pay via UPI, card, or netbanking through Razorpay. 256-bit encrypted. 80G receipt generated automatically." },
  { id: 'impact', icon: BarChart2, title: "See Real Impact", desc: "Receive updates on how your donation is used. Quarterly impact reports. Zero overhead fluff." },
];

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-[var(--bg)] py-[64px] lg:py-[96px]">
      <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
        <FadeInUp className="max-w-[540px] mb-12">
          <span className="label">The Process</span>
          <h2 className="text-[var(--dark)] mt-3">Simple Steps to Make a Difference</h2>
        </FadeInUp>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Tabs */}
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-[12px] pb-4 lg:pb-0 hide-scrollbar w-full lg:w-[320px] flex-shrink-0">
            {steps.map((step, i) => {
              const isActive = i === activeTab;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(i)}
                  className={`flex items-center gap-3 text-left px-[24px] py-[10px] rounded-[var(--radius-full)] font-semibold text-[13px] whitespace-nowrap transition-colors duration-200 border ${
                    isActive
                      ? "bg-[var(--teal)] text-white border-[var(--teal)]"
                      : "bg-white border-[var(--border-color)] text-[var(--mid)] hover:bg-[var(--teal-light)] hover:text-[var(--teal)]"
                  }`}
                >
                  <step.icon size={18} />
                  {step.title}
                </button>
              );
            })}
          </div>

          {/* Content Panel */}
          <div className="global-card relative w-full lg:min-h-[280px] rounded-[var(--radius-2xl)] shadow-[var(--shadow-card)] lg:flex lg:items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full flex justify-center flex-col"
              >
                <div className="w-16 h-16 bg-[var(--teal-light)] text-[var(--teal)] rounded-[var(--radius-lg)] flex items-center justify-center mb-6">
                  {(() => {
                    const Icon = steps[activeTab].icon;
                    return <Icon size={32} />;
                  })()}
                </div>
                <h3 className="text-[22px] font-bold text-[var(--dark)] mb-4">{steps[activeTab].title}</h3>
                <p className="text-[16px] text-[var(--mid)] leading-[1.75] max-w-[500px]">
                  {steps[activeTab].desc}
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
