import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, BookOpen, ArrowRight, Shield, Sparkles, Users } from "lucide-react";
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-[#0D1B1C]/80 backdrop-blur-md"
            onClick={closeOverlay}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-[620px] w-full overflow-hidden"
            >
              {/* Card with gradient border effect */}
              <div className="relative bg-white rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.3),0_0_0_1px_rgba(31,154,168,0.08)]">
                {/* Top accent gradient */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--teal)] via-[var(--yellow)] to-[var(--purple)] rounded-t-[28px]" />

                {/* Close button */}
                <button
                  onClick={closeOverlay}
                  className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[var(--bg)] hover:bg-[var(--border-color)] flex items-center justify-center transition-all duration-200 hover:rotate-90 z-10"
                  aria-label="Close"
                >
                  <X size={16} className="text-[var(--mid)]" />
                </button>

                {/* Content */}
                <div className="px-8 pt-10 pb-8 sm:px-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_rgba(31,154,168,0.3)]"
                    >
                      <Sparkles size={24} className="text-white" />
                    </motion.div>
                    <h2 className="text-[24px] sm:text-[28px] font-[800] text-[var(--dark)] tracking-[-0.03em] leading-[1.15]">
                      Choose Your Impact
                    </h2>
                    <p className="text-[14px] text-[var(--mid)] mt-2.5 max-w-[360px] mx-auto leading-relaxed">
                      100% of your donation directly reaches those who need it most.
                    </p>
                  </div>

                  {/* Choice Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Medical */}
                    <motion.button
                      onClick={() => handleChoice("/donate/medical")}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="group relative bg-gradient-to-br from-white to-[#F0F9FA] rounded-[20px] border-[1.5px] border-[var(--border-color)] p-6 text-left cursor-pointer hover:border-[var(--teal)] hover:shadow-[0_12px_32px_rgba(31,154,168,0.12)] transition-[border-color,box-shadow] duration-300 overflow-hidden"
                    >
                      {/* Background glow */}
                      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-[var(--teal)]/[0.06] blur-2xl group-hover:bg-[var(--teal)]/[0.12] transition-colors duration-500" />

                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(31,154,168,0.25)]">
                          <Heart size={22} className="text-white" />
                        </div>
                        <h3 className="font-[700] text-[17px] text-[var(--dark)] mb-1.5">Medical Aid</h3>
                        <p className="text-[13px] text-[var(--mid)] leading-relaxed mb-5">Hospital, surgery & emergency care for families in need</p>

                        <div className="flex flex-wrap gap-2 mb-5">
                          {["₹500+", "80G", "Instant Receipt"].map(tag => (
                            <span key={tag} className="text-[10px] font-[600] uppercase tracking-[0.05em] text-[var(--teal)] bg-[var(--teal-light)] px-2.5 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <span className="flex items-center gap-1.5 text-[13px] font-[700] text-[var(--teal)]">
                          Donate Now
                          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                        </span>
                      </div>
                    </motion.button>

                    {/* Education */}
                    <motion.button
                      onClick={() => handleChoice("/donate/education")}
                      whileHover={{ y: -4, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="group relative bg-gradient-to-br from-white to-[#F5F4FB] rounded-[20px] border-[1.5px] border-[var(--border-color)] p-6 text-left cursor-pointer hover:border-[var(--purple)] hover:shadow-[0_12px_32px_rgba(92,90,166,0.12)] transition-[border-color,box-shadow] duration-300 overflow-hidden"
                    >
                      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-[var(--purple)]/[0.06] blur-2xl group-hover:bg-[var(--purple)]/[0.12] transition-colors duration-500" />

                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--purple)] to-[#4A48A0] flex items-center justify-center mb-4 shadow-[0_4px_12px_rgba(92,90,166,0.25)]">
                          <BookOpen size={22} className="text-white" />
                        </div>
                        <h3 className="font-[700] text-[17px] text-[var(--dark)] mb-1.5">Education</h3>
                        <p className="text-[13px] text-[var(--mid)] leading-relaxed mb-5">School fees, books & meals for children's futures</p>

                        <div className="flex flex-wrap gap-2 mb-5">
                          {["₹1,500+", "Sponsor", "80G"].map(tag => (
                            <span key={tag} className="text-[10px] font-[600] uppercase tracking-[0.05em] text-[var(--purple)] bg-[var(--purple-light)] px-2.5 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <span className="flex items-center gap-1.5 text-[13px] font-[700] text-[var(--purple)]">
                          Donate Now
                          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                        </span>
                      </div>
                    </motion.button>
                  </div>

                  {/* Separator + GoldenAge Care */}
                  <div className="mt-6 pt-5 border-t border-[var(--border-color)]">
                    <button
                      onClick={() => handleChoice("/register-parent")}
                      className="group w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[var(--bg)] transition-colors duration-200 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--beige)] to-[var(--teal)] flex items-center justify-center flex-shrink-0">
                        <Users size={18} className="text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <p className="text-[14px] font-[600] text-[var(--dark)]">GoldenAge Care — Enroll your parent</p>
                        <p className="text-[12px] text-[var(--mid)]">24/7 helpline & hospital coordination</p>
                      </div>
                      <ArrowRight size={16} className="text-[var(--light)] group-hover:text-[var(--teal)] group-hover:translate-x-1 transition-all" />
                    </button>
                  </div>

                  {/* Trust strip */}
                  <div className="flex justify-center gap-6 mt-5">
                    {[
                      { icon: Shield, text: "SSL Encrypted" },
                      { icon: Heart, text: "Tax Exempt" },
                    ].map(({ icon: Icon, text }) => (
                      <span key={text} className="flex items-center gap-1.5 text-[11px] text-[var(--light)] font-[500]">
                        <Icon size={12} className="text-[var(--teal)]" />
                        {text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DonateChoiceOverlay;
