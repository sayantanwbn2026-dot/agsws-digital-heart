import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Check, Upload, ChevronDown, Shield, Heart, User, FileText, CreditCard } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { PremiumInput, PremiumSelect, PremiumTextarea, PremiumCard, PremiumButton } from "@/components/ui/PremiumFormElements";

const steps = [
  { label: "About You", icon: User },
  { label: "About Parent", icon: Heart },
  { label: "Documents", icon: FileText },
  { label: "Confirm & Pay", icon: CreditCard },
];

const RegisterParent = () => {
  useSEO("GoldenAge Care", "Enroll your elderly parent in Kolkata for emergency medical support through AGSWS GoldenAge Care.");
  const [currentStep, setCurrentStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const { register, getValues } = useForm();

  const nextStep = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  if (success) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[var(--shadow-lg)]"><Check size={40} className="text-white" /></div>
          <h2 className="text-3xl font-bold text-[var(--teal)] mb-2">Registration Complete!</h2>
          <p className="text-lg font-bold text-[var(--teal)] mb-4">REG-2025-{Math.floor(1000 + Math.random() * 9000)}</p>
          <p className="text-[var(--mid)] mb-8">A confirmation has been emailed to you. Our coordinator will contact your parent within 24 hours.</p>
          <PremiumButton className="mx-auto !bg-[var(--yellow)] !text-[var(--dark)]">Download Registration PDF</PremiumButton>
        </motion.div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <PageHero title="Register Your Parent for Emergency Care" subtitle="You're far. We're here. Register your parent today." bgVariant="warm" size="md" breadcrumb={[{ label: "Home", href: "/" }, { label: "Register Parent" }]} />

      {/* Stepper */}
      <div className="bg-[var(--white)] border-b border-[var(--border-color)] py-6">
        <div className="max-w-[700px] mx-auto px-6">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{ scale: i === currentStep ? 1.1 : 1, backgroundColor: i < currentStep ? "var(--teal)" : i === currentStep ? "white" : "var(--bg)" }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      i < currentStep ? "text-white shadow-[var(--shadow-md)]" : i === currentStep ? "border-2 border-[var(--teal)] text-[var(--teal)]" : "text-[var(--light)] border border-[var(--border-color)]"
                    }`}
                  >
                    {i < currentStep ? <Check size={16} /> : <step.icon size={16} />}
                  </motion.div>
                  <span className={`text-[10px] font-[500] mt-2 hidden sm:block ${i <= currentStep ? "text-[var(--teal)]" : "text-[var(--light)]"}`}>{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-[2px] mx-3 rounded-full overflow-hidden bg-[var(--border-color)]">
                    <motion.div className="h-full bg-[var(--teal)]" initial={{ width: "0%" }} animate={{ width: i < currentStep ? "100%" : "0%" }} transition={{ duration: 0.4, ease: "easeOut" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-[var(--bg)] py-16 lg:py-20">
        <div className="max-w-[640px] mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <PremiumCard>
                {currentStep === 0 && (
                  <div className="space-y-6">
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-1">About You</h3>
                    <div className="bg-[var(--yellow-light)] rounded-[14px] p-4 flex items-start gap-3">
                      <Shield size={18} className="text-[var(--yellow)] mt-0.5 flex-shrink-0" />
                      <p className="text-[13px] text-[var(--mid)] leading-[1.6]">We'll send you a Registration ID and keep you updated about your parent's care.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <PremiumInput label="Your Name" required {...register("yourName")} placeholder="Full name" />
                      <PremiumInput label="Your City" required {...register("yourCity")} placeholder="City (outside Kolkata)" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <PremiumInput label="Your Phone" required {...register("yourPhone")} type="tel" placeholder="+91 98765 43210" />
                      <PremiumInput label="Your Email" required {...register("yourEmail")} type="email" placeholder="your@email.com" />
                    </div>
                    <PremiumSelect label="Relation to Parent" required {...register("relation")}>
                      <option value="">Select relationship</option>
                      <option>Son</option><option>Daughter</option><option>Relative</option><option>Other</option>
                    </PremiumSelect>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-1">About Your Parent</h3>
                    <div className="bg-[var(--teal-light)] rounded-[14px] p-4 flex items-start gap-3">
                      <Heart size={18} className="text-[var(--teal)] mt-0.5 flex-shrink-0" />
                      <p className="text-[13px] text-[var(--mid)] leading-[1.6]">This information helps us respond faster in an emergency.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <PremiumInput label="Parent's Full Name" required {...register("parentName")} placeholder="Full name" />
                      <PremiumInput label="Age" required {...register("parentAge")} type="number" placeholder="Age" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <PremiumInput label="Emergency Contact Name" required {...register("emergencyName")} placeholder="Name in Kolkata" />
                      <PremiumInput label="Emergency Contact Phone" required {...register("emergencyPhone")} type="tel" placeholder="Phone number" />
                    </div>
                    <PremiumTextarea label="Address in Kolkata" required {...register("parentAddress")} placeholder="Full address" rows={3} />
                    <PremiumSelect label="Primary Medical Condition" required {...register("medicalCondition")}>
                      <option value="">Select condition</option>
                      <option>Cardiac</option><option>Diabetes</option><option>Respiratory</option><option>Orthopedic</option><option>Other</option>
                    </PremiumSelect>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-1">Upload Documents</h3>
                    <p className="text-[13px] text-[var(--mid)]">Upload identification and medical documents for faster processing.</p>
                    {[["Aadhar / ID Proof", true], ["Recent Medical Report", false], ["Recent Photo", false]].map(([label, required]) => (
                      <motion.div key={label as string} whileHover={{ borderColor: "var(--teal)", scale: 1.01 }} className="border-2 border-dashed border-[var(--border-color)] rounded-[18px] p-6 text-center cursor-pointer transition-all bg-[var(--bg)]/50 hover:bg-[var(--teal-light)]/30">
                        <Upload size={24} className="text-[var(--teal)] mx-auto mb-3" />
                        <p className="text-[14px] font-[600] text-[var(--dark)]">{label as string} {required ? <span className="text-[#DC2626]">*</span> : <span className="text-[var(--light)] font-[400] text-[12px]">(optional)</span>}</p>
                        <p className="text-[11px] text-[var(--light)] mt-1">PDF, JPG, PNG — Max 5MB</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-1">Confirm & Pay ₹100</h3>
                    <div className="bg-[var(--bg)] rounded-[16px] p-6">
                      <h4 className="font-[600] text-[var(--dark)] mb-4 text-[12px] uppercase tracking-[0.08em]">Registration Summary</h4>
                      <div className="space-y-3">
                        {[["Registrant", getValues("yourName") || "—"], ["Parent", getValues("parentName") || "—"], ["City", getValues("yourCity") || "—"], ["Condition", getValues("medicalCondition") || "—"]].map(([l, v]) => (
                          <div key={l} className="flex justify-between text-[13px] border-b border-[var(--border-color)] pb-3">
                            <span className="text-[var(--light)]">{l}</span>
                            <span className="font-[600] text-[var(--dark)]">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <details className="bg-[var(--bg)] rounded-[16px] overflow-hidden">
                      <summary className="flex items-center justify-between p-5 cursor-pointer text-[14px] font-[600] text-[var(--dark)]">Why ₹100? <ChevronDown size={16} className="text-[var(--light)]" /></summary>
                      <p className="px-5 pb-5 text-[13px] text-[var(--mid)] leading-[1.6]">The ₹100 fee covers admin processing, SMS alert setup, coordinator assignment, and registration card printing.</p>
                    </details>
                    <PremiumButton onClick={() => setSuccess(true)} className="w-full !bg-[var(--yellow)] !text-[var(--dark)] shadow-[var(--shadow-yellow)]">
                      Pay ₹100 & Register →
                    </PremiumButton>
                    <p className="text-[11px] text-[var(--light)] text-center">One-time platform maintenance fee. Non-refundable.</p>
                  </div>
                )}
              </PremiumCard>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <PremiumButton variant="secondary" onClick={prevStep}>← Back</PremiumButton>
            )}
            {currentStep < 3 && (
              <PremiumButton onClick={nextStep} className="ml-auto">Continue →</PremiumButton>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterParent;
