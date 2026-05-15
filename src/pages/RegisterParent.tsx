import { useMemo, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  Check, Upload, Shield, Heart, User, FileText, CreditCard, Loader2,
  Phone, Droplet, IdCard, Camera, MapPin, Sparkles,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { PremiumInput, PremiumSelect, PremiumTextarea, PremiumCard, PremiumButton } from "@/components/ui/PremiumFormElements";
import { supabase } from "@/integrations/supabase/client";
import { createStripeCheckoutRedirect } from "@/lib/stripeCheckout";
import { useCMSSection } from "@/hooks/useCMSSection";
import toast from "react-hot-toast";
import { isValidEmail, isValidIndianPhone } from "@/lib/validation";

const iconMap: Record<string, any> = { User, Heart, FileText, CreditCard, Shield, IdCard, Camera };

interface Plan { key: string; label: string; amount: number; tagline?: string; highlight?: boolean }

const defaultData = {
  org_name: "The Ascension Group",
  org_tagline: "Social Welfare Society",
  reg_no: "Reg. No. 2578/26",
  hero_title: "GoldenAge Care Registration",
  hero_subtitle: "Pickup → Doctor Visit → Drop. Pickup → Admit for emergencies. We are with your loved ones, always.",
  steps: [
    { label: "Personal", icon: "User" },
    { label: "Documents", icon: "IdCard" },
    { label: "Plan & Pay", icon: "CreditCard" },
  ],
  step1_title: "Personal Details",
  step1_trust_badge: "Your information is kept strictly confidential and used only for emergency response.",
  step2_title: "Upload Documents",
  step2_subtitle: "We need a photo ID and a recent photograph for the registration card.",
  document_hint: "PDF, JPG, PNG — Max 5MB",
  step3_title: "Choose Your Plan",
  step3_subtitle: "Select the membership that suits you best. Secure payment via Stripe.",
  plans: [
    { key: "6m",  label: "6 Months",            amount: 3500, tagline: "Short-term coverage" },
    { key: "1y",  label: "1 Year",              amount: 5000, tagline: "Most popular", highlight: true },
    { key: "2fm", label: "Two Family Members",  amount: 8000, tagline: "Best value for couples" },
  ] as Plan[],
  services_title: "What's included",
  services: [
    { label: "Elderly patients", flow: "Pickup → Doctor Visit → Drop" },
    { label: "Emergency patients", flow: "Pickup → Admit" },
  ],
  contact_label: "24×7 Care Coordinators",
  contact_numbers: ["+91 98765 43210", "+91 98765 43211", "+91 98765 43212", "+91 98765 43213"],
  pay_button_label: "Pay Securely →",
  pay_button_loading: "Redirecting to checkout…",
  payment_disclaimer: "Secure Stripe checkout. One-time membership fee. Non-refundable.",
  back_label: "← Back",
  continue_label: "Continue →",
  validation_error: "Please complete all required fields.",
  checkout_error: "Couldn't start checkout. Please try again.",
};

const bloodGroups = ["A+","A-","B+","B-","AB+","AB-","O+","O-","Don't know"];

const RegisterParent = () => {
  useSEO("GoldenAge Care Registration", "Register for AGSWS GoldenAge Care — pickup, doctor visit & emergency support for elderly in Kolkata.");
  const { data: cms } = useCMSSection<typeof defaultData>('register_parent', defaultData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoIdFile, setPhotoIdFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>("");
  const { register, getValues } = useForm();

  const steps = (cms.steps?.length ? cms.steps : defaultData.steps);
  const plans: Plan[] = (cms.plans?.length ? cms.plans : defaultData.plans);
  const services = (cms.services?.length ? cms.services : defaultData.services);
  const contactNumbers = (cms.contact_numbers?.length ? cms.contact_numbers : defaultData.contact_numbers);

  const selectedPlan = useMemo(
    () => plans.find(p => p.key === selectedPlanKey) || plans.find(p => p.highlight) || plans[0],
    [plans, selectedPlanKey]
  );

  const validateCurrentStep = (): string | null => {
    const v = getValues();
    if (currentStep === 0) {
      if (!v.fullName || String(v.fullName).trim().length < 2) return "Please enter your full name.";
      if (!v.address || String(v.address).trim().length < 5) return "Please enter your address.";
      if (!isValidIndianPhone(v.phone)) return "Please enter a valid 10-digit phone number.";
      if (v.altPhone && !isValidIndianPhone(v.altPhone)) return "Please enter a valid alternative phone.";
      if (!isValidEmail(v.email)) return "Please enter a valid email (for receipt).";
      if (!v.bloodGroup) return "Please select a blood group.";
      return null;
    }
    if (currentStep === 1) {
      if (!photoIdFile) return "Please upload a photo ID proof.";
      if (!photoFile) return "Please upload a recent photograph.";
      return null;
    }
    return null;
  };

  const nextStep = () => {
    if (currentStep >= steps.length - 1) return;
    const err = validateCurrentStep();
    if (err) { toast.error(err); return; }
    setCurrentStep(currentStep + 1);
  };
  const prevStep = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };

  const handlePay = async () => {
    if (!selectedPlan) { toast.error("Please choose a plan."); return; }
    const v = getValues();
    if (!v.fullName || !v.email || !v.phone) {
      toast.error(cms.validation_error || defaultData.validation_error);
      return;
    }
    const checkoutRedirect = createStripeCheckoutRedirect();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-donation', {
        body: {
          cause: 'goldenage',
          amount: selectedPlan.amount,
          donor_name: v.fullName,
          donor_email: v.email,
          donor_phone: v.phone,
          parent_name: v.fullName,
          parent_address: v.address,
          alternative_phone: v.altPhone || undefined,
          blood_group: v.bloodGroup,
          plan_label: selectedPlan.label,
          success_url: `${window.location.origin}/thank-you?cause=goldenage&amount=${selectedPlan.amount}&name=${encodeURIComponent(v.fullName)}`,
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

  const FilePicker = ({
    icon: Icon, label, file, onPick, accept = "image/*,application/pdf",
  }: { icon: any; label: string; file: File | null; onPick: (f: File | null) => void; accept?: string }) => (
    <label className="block border-2 border-dashed border-[var(--border-color)] rounded-[18px] p-6 text-center cursor-pointer transition-all bg-[var(--bg)]/50 hover:bg-[var(--teal-light)]/30 hover:border-[var(--teal)]">
      {file ? (
        <div className="flex items-center justify-center gap-3 text-left">
          <Check size={20} className="text-[var(--teal)] flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[14px] font-[600] text-[var(--dark)] truncate">{file.name}</p>
            <p className="text-[11px] text-[var(--light)]">{(file.size / 1024).toFixed(0)} KB · click to replace</p>
          </div>
        </div>
      ) : (
        <>
          <Icon size={26} className="text-[var(--teal)] mx-auto mb-3" />
          <p className="text-[14px] font-[600] text-[var(--dark)]">{label} <span className="text-[#DC2626]">*</span></p>
          <p className="text-[11px] text-[var(--light)] mt-1">{cms.document_hint || defaultData.document_hint}</p>
        </>
      )}
      <input type="file" accept={accept} className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] || null)} />
    </label>
  );

  return (
    <main id="main-content">
      <PageHero
        title={cms.hero_title || defaultData.hero_title}
        subtitle={cms.hero_subtitle || defaultData.hero_subtitle}
        bgVariant="warm" size="md"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "GoldenAge Care" }]}
      />

      {/* Org strip */}
      <div className="bg-[var(--white)] border-b border-[var(--border-color)]">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[18px] font-[800] text-[var(--dark)] leading-tight">{cms.org_name || defaultData.org_name}</p>
            <p className="text-[12px] italic text-[var(--mid)]">{cms.org_tagline || defaultData.org_tagline}</p>
          </div>
          <span className="text-[11px] uppercase tracking-[0.12em] font-[600] text-[var(--teal)] bg-[var(--teal-light)] px-3 py-1.5 rounded-full">
            {cms.reg_no || defaultData.reg_no}
          </span>
        </div>
      </div>

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
        <div className="max-w-[680px] mx-auto px-6">
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

                    <PremiumInput label="Full Name" required {...register("fullName")} placeholder="As per ID proof" />
                    <PremiumTextarea label="Address" required {...register("address")} placeholder="Full residential address" rows={3} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <PremiumInput label="Phone Number" required {...register("phone")} type="tel" placeholder="+91 98765 43210" />
                      <PremiumInput label="Alternative Phone" {...register("altPhone")} type="tel" placeholder="Optional" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <PremiumInput label="Email (for receipt)" required {...register("email")} type="email" placeholder="your@email.com" />
                      <PremiumSelect label="Blood Group" required {...register("bloodGroup")}>
                        <option value="">Select blood group</option>
                        {bloodGroups.map(b => <option key={b} value={b}>{b}</option>)}
                      </PremiumSelect>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-1">{cms.step2_title || defaultData.step2_title}</h3>
                    <p className="text-[13px] text-[var(--mid)]">{cms.step2_subtitle || defaultData.step2_subtitle}</p>
                    <FilePicker icon={IdCard} label="Photo ID Proof (Aadhaar / PAN / Voter ID)" file={photoIdFile} onPick={setPhotoIdFile} />
                    <FilePicker icon={Camera} label="Recent Photograph" file={photoFile} onPick={setPhotoFile} accept="image/*" />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-1">{cms.step3_title || defaultData.step3_title}</h3>
                    <p className="text-[13px] text-[var(--mid)]">{cms.step3_subtitle || defaultData.step3_subtitle}</p>

                    <div className="space-y-3">
                      {plans.map((p) => {
                        const active = (selectedPlanKey || (selectedPlan?.key)) === p.key;
                        return (
                          <button
                            key={p.key}
                            type="button"
                            onClick={() => setSelectedPlanKey(p.key)}
                            className={`w-full text-left rounded-[18px] border-2 p-5 transition-all flex items-center justify-between gap-4 ${
                              active
                                ? "border-[var(--teal)] bg-[var(--teal-light)]/40 shadow-[var(--shadow-md)]"
                                : "border-[var(--border-color)] bg-[var(--white)] hover:border-[var(--teal)]/50"
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[15px] font-[700] text-[var(--dark)]">{p.label}</span>
                                {p.highlight && (
                                  <span className="text-[10px] uppercase tracking-[0.1em] font-[700] bg-[var(--yellow)] text-[var(--dark)] px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                    <Sparkles size={10} /> Recommended
                                  </span>
                                )}
                              </div>
                              {p.tagline && <p className="text-[12px] text-[var(--mid)] mt-1">{p.tagline}</p>}
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-[20px] font-[800] text-[var(--teal)] leading-none">₹{p.amount.toLocaleString('en-IN')}</p>
                              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--light)] mt-1">one-time</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Services */}
                    <div className="bg-[var(--bg)] rounded-[16px] p-5">
                      <p className="text-[11px] uppercase tracking-[0.12em] font-[700] text-[var(--teal)] mb-3">{cms.services_title || defaultData.services_title}</p>
                      <div className="space-y-2">
                        {services.map((s: any, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <Heart size={14} className="text-[var(--teal)] mt-1 flex-shrink-0" />
                            <p className="text-[13px] text-[var(--mid)]"><span className="font-[600] text-[var(--dark)]">{s.label}:</span> {s.flow}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact numbers */}
                    <div className="bg-[var(--bg)] rounded-[16px] p-5">
                      <p className="text-[11px] uppercase tracking-[0.12em] font-[700] text-[var(--teal)] mb-3">{cms.contact_label || defaultData.contact_label}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {contactNumbers.map((n: string, i: number) => (
                          <a key={i} href={`tel:${n.replace(/\s/g, '')}`} className="flex items-center gap-2 text-[13px] font-[600] text-[var(--dark)] hover:text-[var(--teal)] transition-colors">
                            <Phone size={13} /> {n}
                          </a>
                        ))}
                      </div>
                    </div>

                    <PremiumButton onClick={handlePay} disabled={isSubmitting || !selectedPlan} className="w-full !bg-[var(--yellow)] !text-[var(--dark)] shadow-[var(--shadow-yellow)]">
                      {isSubmitting
                        ? (<><Loader2 className="animate-spin mr-2 inline h-4 w-4" />{cms.pay_button_loading || defaultData.pay_button_loading}</>)
                        : `${cms.pay_button_label || defaultData.pay_button_label}  ₹${selectedPlan?.amount.toLocaleString('en-IN')}`}
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
            {currentStep < steps.length - 1 && (
              <PremiumButton onClick={nextStep} className="ml-auto">{cms.continue_label || defaultData.continue_label}</PremiumButton>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterParent;