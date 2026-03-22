import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, BookOpen, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";

const DonateChoiceOverlay = () => {
  const { isOpen, closeOverlay } = useDonateOverlay();
  const navigate = useNavigate();

  const handleChoice = (path: string) => {
    closeOverlay();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[9998] bg-[#0F1F20]/88 backdrop-blur-[3px]"
            onClick={closeOverlay}
          />
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
              className="bg-card rounded-3xl max-w-[560px] w-full p-8 sm:p-10 shadow-[0_24px_64px_rgba(0,0,0,0.25)] relative"
            >
              <button
                onClick={closeOverlay}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-background hover:bg-border flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X size={16} className="text-text-mid" />
              </button>

              <div className="text-center pb-7 border-b border-border">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-teal mb-2 block">Choose a cause</span>
                <h2 className="text-[22px] font-bold text-text-dark leading-[1.3] max-w-[380px] mx-auto">
                  Where would you like your donation to go?
                </h2>
                <p className="text-sm text-text-mid mt-2">100% of your donation reaches the cause directly.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-7">
                {/* Medical */}
                <button
                  onClick={() => handleChoice("/donate/medical")}
                  className="group text-left border border-border rounded-2xl p-6 bg-card hover:border-teal hover:bg-teal-light transition-all duration-220 hover:-translate-y-[3px] active:translate-y-[-1px] active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-3.5">
                    <div className="w-11 h-11 rounded-full bg-teal-light flex items-center justify-center flex-shrink-0">
                      <Heart size={20} className="text-teal" />
                    </div>
                    <div>
                      <p className="font-bold text-base text-text-dark">Medical Aid</p>
                      <p className="text-[13px] text-text-mid mt-0.5">Hospital, surgery & emergency care</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3.5 mb-3.5">
                    <div className="flex flex-wrap gap-3">
                      {["₹500 onwards", "80G benefit", "Instant receipt"].map(t => (
                        <span key={t} className="flex items-center gap-1.5 text-xs font-medium text-text-mid">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-teal flex items-center gap-1">
                    Donate to Medical Aid
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </button>

                {/* Education */}
                <button
                  onClick={() => handleChoice("/donate/education")}
                  className="group text-left border border-border rounded-2xl p-6 bg-card hover:border-purple hover:bg-purple-light transition-all duration-220 hover:-translate-y-[3px] active:translate-y-[-1px] active:scale-[0.99] cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-3.5">
                    <div className="w-11 h-11 rounded-full bg-purple-light flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} className="text-purple" />
                    </div>
                    <div>
                      <p className="font-bold text-base text-text-dark">Education Support</p>
                      <p className="text-[13px] text-text-mid mt-0.5">School fees, books & meals for children</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-3.5 mb-3.5">
                    <div className="flex flex-wrap gap-3">
                      {["₹1,500 onwards", "Sponsor a child", "80G benefit"].map(t => (
                        <span key={t} className="flex items-center gap-1.5 text-xs font-medium text-text-mid">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple" />
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-purple flex items-center gap-1">
                    Donate to Education
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-text-light">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <p className="text-center mt-3">
                <button
                  onClick={() => handleChoice("/register-parent")}
                  className="text-[13px] font-medium text-teal hover:underline cursor-pointer"
                >
                  Register your parent for emergency care →
                </button>
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DonateChoiceOverlay;
