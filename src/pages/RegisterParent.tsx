import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { Check, Upload, ChevronDown, Shield, Heart, User, FileText, CreditCard, Loader2 } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { PremiumInput, PremiumSelect, PremiumTextarea, PremiumCard, PremiumButton } from "@/components/ui/PremiumFormElements";
import { supabase } from "@/integrations/supabase/client";
import { createStripeCheckoutRedirect } from "@/lib/stripeCheckout";
import { useCMSSection } from "@/hooks/useCMSSection";
import toast from "react-hot-toast";

const iconMap: Record<string, any> = { User, Heart, FileText, CreditCard, Shield };

const defaultData = {
  hero_title: "Register Your Parent for Emergency Care",
  hero_subtitle: "You're far. We're here. Register your parent today.",
  steps: [
    { label: "About You", icon: "User" },
    { label: "About Parent", icon: "Heart" },
    { label: "Documents", icon: "FileText" },
    { label: "Confirm & Pay", icon: "CreditCard" },
  ],
  step1_title: "About You",
  step1_trust_badge: "We'll send you a Registration ID and keep you updated about your parent's care.",
  step2_title: "About Your Parent",
  step2_trust_badge: "This information helps us respond faster in an emergency.",
  step3_title: "Upload Documents",
  step3_subtitle: "You can email these to us after registration if you prefer.",
  documents: [
    { label: "Aadhar / ID Proof", required: true },
    { label: "Recent Medical Report", required: false },
    { label: "Recent Photo", required: false },
  ],
  document_hint: "PDF, JPG, PNG — Max 5MB",
  step4_title: "Confirm & Pay ₹100",
  summary_heading: "Registration Summary",
  fee_question: "Why ₹100?",
  fee_explanation: "The ₹100 fee covers admin processing, SMS alert setup, coordinator assignment, and registration card printing.",
  pay_button_label: "Pay ₹100 via Stripe →",
  pay_button_loading: "Redirecting to checkout…",
  fee_amount: 100,
  payment_disclaimer: "Secure Stripe checkout. One-time platform maintenance fee. Non-refundable.",
  back_label: "← Back",
  continue_label: "Continue →",
  validation_error: "Please complete all required fields.",
  checkout_error: "Couldn't start checkout. Please try again.",
};

const RegisterParent = () => {
  useSEO("GoldenAge Care", "Enroll your elderly parent in Kolkata for emergency medical support through AGSWS GoldenAge Care.");
  const { data: cms } = useCMSSection<typeof defaultData>('register_parent', defaultData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, getValues } = useForm();

  const steps = (cms.steps?.length ? cms.steps : defaultData.steps);
  const documents = (cms.documents?.length ? cms.documents : defaultData.documents);

  const nextStep = () => { if (currentStep < 3) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const handlePay = async () => {
    const v = getValues();
    if (!v.yourName || !v.yourEmail || !v.yourPhone || !v.parentName) {
      toast.error(cms.validation_error || defaultData.validation_error);
      return;
    }
    const checkoutRedirect = createStripeCheckoutRedirect();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-donation', {
        body: {
          cause: 'goldenage',
          amount: cms.fee_amount || 100,
          donor_name: v.yourName,
          donor_email: v.yourEmail,
          donor_phone: v.yourPhone,
          registrant_city: v.yourCity,
          relation: v.relation,
          parent_name: v.parentName,
          parent_age: v.parentAge ? Number(v.parentAge) : undefined,
          parent_address: v.parentAddress,
          emergency_contact_name: v.emergencyName,
          emergency_contact_phone: v.emergencyPhone,
          medical_condition: v.medicalCondition,
          success_url: `${window.location.origin}/thank-you?cause=goldenage&amount=${cms.fee_amount || 100}&name=${encodeURIComponent(v.yourName)}`,
          cancel_url: window.location.href,
        },
      });
      if (error) throw error;
      if (!data?.url) throw new Error('Checkout URL missing');
      checkoutRedirect.redirect(data.url);
    } catch (err: any) {
      checkoutRedirect.cancel();
      console.error(err);
      toast.error(err.message || cms.checkout_error || defaultData.checkout_error);
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content">
      <PageHero title={cms.hero_title || defaultData.hero_title} subtitle={cms.hero_subtitle || defaultData.hero_subtitle} bgVariant="warm" size="md" breadcrumb={[{ label: "Home", href: "/" }, { label: "Register Parent" }]} />

      {/* Stepper */}
      <div className="bg-[var(--white)] border-b border-[var(--border-color)] py-6">
        <div className="max-w-[700px] mx-auto px-6">
          <div className="flex items-center justify-between">
            {steps.map((step: any, i: number) => {
              const Icon = iconMap[step.icon] || User;
              return (
                <div key={`${step.label}-${i}`} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ scale: i === currentStep ? 1.1 : 1, backgroundColor: i < currentStep ? "var(--teal)" : i === currentStep ? "white" : "var(--bg)" }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        i < currentStep ? "text-white shadow-[var(--shadow-md)]" : i === currentStep ? "border-2 border-[var(--teal)] text-[var(--teal)]" : "text-[var(--light)] border border-[var(--border-color)]"
                      }`}
                    >
                      {i < currentStep ? <Check size={16} /> : <Icon size={16} />}
                    </motion.div>
                    <span className={`text-[10px] font-[500] mt-2 hidden sm:block ${i <= currentStep ? "text-[var(--teal)]" : "text-[var(--light)]"}`}>{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-[2px] mx-3 rounded-full overflow-hidden bg-[var(--border-color)]">
                      <motion.div className="h-full bg-[var(--teal)]" initial={{ width: "0%" }} animate={{ width: i < currentStep ? "100%" : "0%" }} transition={{ duration: 0.4, ease: "easeOut" }} />
                    </div>
                  )}
                </div>
              );
            })}
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
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-1">{cms.step1_title || defaultData.step1_title}</h3>
                    <div className="bg-[var(--yellow-light)] rounded-[14px] p-4 flex items-start gap-3">
                      <Shield size={18} className="text-[var(--yellow)] mt-0.5 flex-shrink-0" />
                      <p className="text-[13px] text-[var(--mid)] leading-[1.6]">{cms.step1_trust_badge || defaultData.step1_trust_badge}</p>
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
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-1">{cms.step2_title || defaultData.step2_title}</h3>
                    <div className="bg-[var(--teal-light)] rounded-[14px] p-4 flex items-start gap-3">
                      <Heart size={18} className="text-[var(--teal)] mt-0.5 flex-shrink-0" />
                      <p className="text-[13px] text-[var(--mid)] leading-[1.6]">{cms.step2_trust_badge || defaultData.step2_trust_badge}</p>
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
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-1">{cms.step3_title || defaultData.step3_title}</h3>
                    <p className="text-[13px] text-[var(--mid)]">{cms.step3_subtitle || defaultData.step3_subtitle}</p>
                    {documents.map((doc: any, i: number) => (
                      <motion.div key={`${doc.label}-${i}`} whileHover={{ borderColor: "var(--teal)", scale: 1.01 }} className="border-2 border-dashed border-[var(--border-color)] rounded-[18px] p-6 text-center cursor-pointer transition-all bg-[var(--bg)]/50 hover:bg-[var(--teal-light)]/30">
                        <Upload size={24} className="text-[var(--teal)] mx-auto mb-3" />
                        <p className="text-[14px] font-[600] text-[var(--dark)]">{doc.label} {doc.required ? <span className="text-[#DC2626]">*</span> : <span className="text-[var(--light)] font-[400] text-[12px]">(optional)</span>}</p>
                        <p className="text-[11px] text-[var(--light)] mt-1">{cms.document_hint || defaultData.document_hint}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-1">{cms.step4_title || defaultData.step4_title}</h3>
                    <div className="bg-[var(--bg)] rounded-[16px] p-6">
                      <h4 className="font-[600] text-[var(--dark)] mb-4 text-[12px] uppercase tracking-[0.08em]">{cms.summary_heading || defaultData.summary_heading}</h4>
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
                      <summary className="flex items-center justify-between p-5 cursor-pointer text-[14px] font-[600] text-[var(--dark)]">{cms.fee_question || defaultData.fee_question} <ChevronDown size={16} className="text-[var(--light)]" /></summary>
                      <p className="px-5 pb-5 text-[13px] text-[var(--mid)] leading-[1.6]">{cms.fee_explanation || defaultData.fee_explanation}</p>
                    </details>
                    <PremiumButton onClick={handlePay} disabled={isSubmitting} className="w-full !bg-[var(--yellow)] !text-[var(--dark)] shadow-[var(--shadow-yellow)]">
                      {isSubmitting ? (<><Loader2 className="animate-spin mr-2 inline h-4 w-4" />{cms.pay_button_loading || defaultData.pay_button_loading}</>) : (cms.pay_button_label || defaultData.pay_button_label)}
                    </PremiumButton>
                    <p className="text-[11px] text-[var(--light)] text-center">{cms.payment_disclaimer || defaultData.payment_disclaimer}</p>
                  </div>
                )}
              </PremiumCard>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <PremiumButton variant="secondary" onClick={prevStep}>{cms.back_label || defaultData.back_label}</PremiumButton>
            )}
            {currentStep < 3 && (
              <PremiumButton onClick={nextStep} className="ml-auto">{cms.continue_label || defaultData.continue_label}</PremiumButton>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterParent;
