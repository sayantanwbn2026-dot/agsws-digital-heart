import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";

import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Check, Upload, ChevronDown } from "lucide-react";

const steps = ["About You", "About Your Parent", "Documents", "Confirm & Pay"];

const RegisterParent = () => {
  useSEO("Register Parent", "Register your elderly parent in Kolkata for emergency medical support through AGSWS.");
  const [currentStep, setCurrentStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const { register, getValues } = useForm();

  const nextStep = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  if (success) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-card">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-teal rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold text-teal mb-2">Registration Complete!</h2>
          <p className="text-lg font-bold text-teal mb-4">REG-2025-{Math.floor(1000 + Math.random() * 9000)}</p>
          <p className="body-text text-text-mid mb-8">A confirmation has been emailed to you. Our coordinator will contact your parent within 24 hours.</p>
          <button className="bg-yellow text-text-dark font-semibold px-8 py-3 rounded-full shadow-yellow">Download Registration PDF</button>
        </motion.div>
      </main>
    );
  }

  return (
    <main id="main-content">
      <section className="h-[300px] bg-gradient-to-r from-beige to-teal flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/20" />
        <div className="relative z-10 text-center max-w-2xl px-6">
          <h1 className="heading-1 text-primary-foreground">Register Your Parent for Emergency Care</h1>
          <p className="body-text text-primary-foreground/80 mt-3">You're far. We're here. Register your parent today.</p>
        </div>
      </section>

      {/* Stepper */}
      <div className="global-card">
        <div className="max-w-[700px] mx-auto px-6">
          <div className="flex items-center justify-between">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    i < currentStep ? "bg-teal text-primary-foreground" : i === currentStep ? "border-2 border-teal text-teal bg-card" : "bg-border text-text-light"
                  }`}>
                    {i < currentStep ? <Check size={16} /> : i + 1}
                  </div>
                  <span className="text-[11px] font-medium text-text-mid mt-2 hidden sm:block">{label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-2 transition-colors ${i < currentStep ? "bg-teal" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-background py-16">
        <div className="max-w-[600px] mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <div className="space-y-4">
                  <h3 className="heading-3 text-text-dark mb-6">About You</h3>
                  <div className="bg-yellow-light border border-yellow/30 rounded-lg p-4 mb-6">
                    <p className="text-sm text-text-mid">We'll send you a Registration ID and keep you updated about your parent's care.</p>
                  </div>
                  {[["Your Name", "yourName"], ["Your City (outside Kolkata)", "yourCity"], ["Your Phone", "yourPhone"], ["Your Email", "yourEmail"]].map(([label, name]) => (
                    <div key={name}>
                      <label className="text-sm font-medium text-text-dark mb-1 block">{label}</label>
                      <input placeholder=" " {...register(name)} className="global-card w-full h-12 outline-none focus: focus:ring-2 focus:ring-teal/15" />
                    </div>
                  ))}
                  <div>
                    <label className="text-sm font-medium text-text-dark mb-1 block">Relation to Parent</label>
                    <select {...register("relation")} className="global-card w-full h-12 outline-none focus: text-text-dark">
                      <option value="">Select</option>
                      <option>Son</option><option>Daughter</option><option>Relative</option><option>Other</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="heading-3 text-text-dark mb-6">About Your Parent</h3>
                  <div className="bg-teal-light border border-teal/20 rounded-lg p-4 mb-6">
                    <p className="text-sm text-text-mid">This information helps us respond faster in an emergency.</p>
                  </div>
                  {[["Parent's Full Name", "parentName"], ["Age", "parentAge"], ["Emergency Contact in Kolkata (Name)", "emergencyName"], ["Emergency Contact Phone", "emergencyPhone"]].map(([label, name]) => (
                    <div key={name}>
                      <label className="text-sm font-medium text-text-dark mb-1 block">{label}</label>
                      <input placeholder=" " {...register(name)} className="global-card w-full h-12 outline-none focus: focus:ring-2 focus:ring-teal/15" />
                    </div>
                  ))}
                  <div>
                    <label className="text-sm font-medium text-text-dark mb-1 block">Address in Kolkata</label>
                    <textarea placeholder=" " {...register("parentAddress")} rows={3} className="global-card w-full outline-none focus: focus:ring-2 focus:ring-teal/15" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-dark mb-1 block">Primary Medical Condition</label>
                    <select {...register("medicalCondition")} className="global-card w-full h-12 outline-none focus: text-text-dark">
                      <option value="">Select</option>
                      <option>Cardiac</option><option>Diabetes</option><option>Respiratory</option><option>Orthopedic</option><option>Other</option>
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="heading-3 text-text-dark mb-6">Documents</h3>
                  {[["Aadhar / ID Proof", true], ["Recent Medical Report", false], ["Recent Photo", false]].map(([label, required]) => (
                    <div key={label as string} className="border-2 border-dashed border-teal/40 rounded-xl p-8 text-center hover:bg-teal-light/30 transition-colors cursor-pointer">
                      <Upload size={32} className="text-teal mx-auto mb-3" />
                      <p className="text-sm font-medium text-text-dark">{label as string} {required ? <span className="text-destructive">*</span> : <span className="text-text-light">(optional)</span>}</p>
                      <p className="text-xs text-text-light mt-1">PDF, JPG, PNG — Max 5MB</p>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="heading-3 text-text-dark mb-6">Confirm & Pay ₹100</h3>
                  <div className="global-card">
                    <h4 className="font-semibold text-text-dark mb-4">Registration Summary</h4>
                    <div className="space-y-3">
                      {[["Registrant", getValues("yourName") || "—"], ["Parent", getValues("parentName") || "—"], ["City", getValues("yourCity") || "—"], ["Condition", getValues("medicalCondition") || "—"]].map(([l, v]) => (
                        <div key={l} className="flex justify-between text-sm border-b border-border pb-2">
                          <span className="text-text-light">{l}</span>
                          <span className="font-medium text-text-dark">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <details className="global-card">
                    <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-text-dark">
                      Why ₹100? <ChevronDown size={16} />
                    </summary>
                    <p className="px-4 pb-4 text-sm text-text-mid">The ₹100 fee covers admin processing, SMS alert setup, coordinator assignment, and registration card printing.</p>
                  </details>

                  <button
                    onClick={() => setSuccess(true)}
                    className="w-full h-[52px] bg-yellow text-text-dark font-bold text-base rounded-full shadow-yellow hover:scale-[1.01] transition-transform"
                  >
                    Pay ₹100 & Register →
                  </button>
                  <p className="text-xs text-text-light text-center">One-time platform maintenance fee. Non-refundable.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            {currentStep > 0 && (
              <button onClick={prevStep} className="global-card .5 text-sm font-medium text-text-mid hover:">
                ← Back
              </button>
            )}
            {currentStep < 3 && (
              <button onClick={nextStep} className="ml-auto px-6 py-2.5 bg-teal text-primary-foreground rounded-full text-sm font-semibold hover:bg-teal-dark transition-colors">
                Continue →
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterParent;
