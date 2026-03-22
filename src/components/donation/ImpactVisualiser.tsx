import { motion, AnimatePresence } from "framer-motion";

const medicalIcons = {
  pill: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="6" y="2" width="12" height="20" rx="6" className="text-teal" />
      <line x1="6" y1="12" x2="18" y2="12" className="text-teal" />
    </svg>
  ),
  ambulance: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="1" y="6" width="15" height="12" rx="2" className="text-teal" />
      <path d="M16 10h4l3 4v4h-7V10z" className="text-teal" />
      <circle cx="7" cy="20" r="1.5" className="text-teal" />
      <circle cx="19" cy="20" r="1.5" className="text-teal" />
      <path d="M8 10v4M6 12h4" className="text-teal" />
    </svg>
  ),
  surgery: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" className="text-teal" />
      <path d="M12 8v8M8 12h8" className="text-teal" strokeLinecap="round" />
    </svg>
  ),
  stethoscope: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 12a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v1a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-1z" className="text-teal" />
      <circle cx="18" cy="10" r="2" className="text-teal" />
      <path d="M18 12v2a4 4 0 0 1-4 4h-2" className="text-teal" />
    </svg>
  ),
};

const educationIcons = {
  book: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M2 4l10 2 10-2v16l-10 2-10-2V4z" className="text-purple" />
      <line x1="12" y1="6" x2="12" y2="22" className="text-purple" />
    </svg>
  ),
  graduation: (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" className="text-purple" />
      <path d="M20 7v7M6 9.5V17l6 3 6-3V9.5" className="text-purple" />
    </svg>
  ),
  meal: (
    <span className="w-3 h-3 rounded-full bg-yellow inline-block" />
  ),
};

function getMedicalImpact(amount: number) {
  if (amount < 500) return null;
  if (amount < 1000) return { icons: ["pill"], text: "Medicines for 1 child, 1 month" };
  if (amount < 2000) return { icons: ["ambulance"], text: "Emergency transport + consultation" };
  if (amount < 5000) return { icons: ["pill", "pill", "stethoscope"], text: "2 children's medicines + specialist visit" };
  if (amount < 10000) return { icons: ["surgery"], text: "Surgery support for 1 patient" };
  return { icons: ["surgery", "pill", "pill", "ambulance"], text: "Full treatment cycle — surgery, medicines, transport, follow-up" };
}

function getEducationImpact(amount: number) {
  if (amount < 1500) return null;
  if (amount < 2500) return { icons: ["book", "book", "book"], text: "School books for 1 child, full year" };
  if (amount < 5000) return { icons: ["meal", "meal", "meal", "meal", "meal"], text: "90 school meals for 1 child (one term)" };
  if (amount < 12000) return { icons: ["graduation"], text: "Full year school fees for 1 child" };
  return { icons: ["graduation", "book", "book", "book", "meal", "meal"], text: "Complete school sponsorship — fees, books, meals" };
}

const ImpactVisualiser = ({ amount, gateway }: { amount: number; gateway: "medical" | "education" }) => {
  const impact = gateway === "medical" ? getMedicalImpact(amount) : getEducationImpact(amount);
  if (!impact) return null;

  const iconMap = gateway === "medical" ? medicalIcons : educationIcons;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="border-2 border-dashed border-teal/40 rounded-xl p-4 mb-6"
    >
      <p className="text-xs text-text-light uppercase tracking-wider mb-3 font-semibold">Your impact</p>
      <div className="flex flex-wrap gap-3 mb-3">
        <AnimatePresence mode="popLayout">
          {impact.icons.map((key, i) => (
            <motion.span
              key={`${key}-${i}-${amount}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {(iconMap as any)[key]}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <p className="text-sm font-medium text-text-dark">{impact.text}</p>
    </motion.div>
  );
};

export default ImpactVisualiser;
