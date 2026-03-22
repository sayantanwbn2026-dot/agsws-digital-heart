import { MousePointer2, CreditCard, BarChart2 } from "lucide-react";
import FadeInUp from "../ui/FadeInUp";

const steps = [
  { icon: MousePointer2, title: "Choose Your Cause", desc: "Pick from Medical Aid, Education Support, or Parent Registration. Every cause directly serves families in Kolkata." },
  { icon: CreditCard, title: "Make a Secure Donation", desc: "Pay via UPI, card, or netbanking through Razorpay. 256-bit encrypted. 80G receipt generated automatically." },
  { icon: BarChart2, title: "See Real Impact", desc: "Receive updates on how your donation is used. Quarterly impact reports. Zero overhead fluff." },
];

const HowItWorks = () => (
  <section className="bg-card py-24">
    <div className="max-w-[1100px] mx-auto px-6">
      <FadeInUp className="max-w-[540px] mb-16">
        <span className="label-text text-teal">The Process</span>
        <h2 className="heading-2 text-text-dark mt-3">Simple Steps to Make a Difference</h2>
      </FadeInUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
        {/* Connecting line (desktop) */}
        <div className="hidden md:block absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-[2px] border-t-2 border-dashed border-teal/30" />

        {steps.map((step, i) => (
          <FadeInUp key={step.title} delay={i * 0.15} className="text-center">
            <div className="relative inline-flex items-center justify-center w-14 h-14 bg-teal rounded-full mb-6">
              <span className="text-primary-foreground font-bold text-lg">{i + 1}</span>
            </div>
            <h4 className="heading-4 text-text-dark mb-3">{step.title}</h4>
            <p className="body-small text-text-mid">{step.desc}</p>
          </FadeInUp>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
