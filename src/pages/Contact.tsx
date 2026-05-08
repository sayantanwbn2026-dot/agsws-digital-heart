import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Clock, Heart, BookOpen, Users, Wrench, Send, ArrowRight, MessageSquare, Sparkles, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/layout/PageHero";
import { PremiumInput, PremiumTextarea, PremiumSelect, PremiumCard, PremiumButton } from "@/components/ui/PremiumFormElements";
import { supabase } from "@/integrations/supabase/client";
import toast from "react-hot-toast";
import { isValidEmail, normalizeEmail, isValidIndianPhone } from "@/lib/validation";
import { useCMSSection } from "@/hooks/useCMSSection";

const iconMap: Record<string, any> = { Heart, BookOpen, Users, Wrench };

const defaultContact = {
  hero_label: "Contact Us",
  hero_title: "Get In Touch",
  form_heading: "Send Us a Message",
  form_subtitle: "We respond within 24 hours",
  info_heading: "Contact Information",
  info_address: "123 Park Street, Kolkata, WB 700016",
  info_phone: "+91 98765 43210",
  info_email: "contact@agsws.org",
  info_hours: "Mon–Sat: 9 AM – 6 PM IST",
  volunteer_label: "Get Involved",
  volunteer_heading: "Volunteer With Us",
  volunteer_roles: [
    { icon: "Heart", title: "Medical Volunteer", desc: "Assist with health camps and hospital coordination.", color: "var(--teal)" },
    { icon: "BookOpen", title: "Education Volunteer", desc: "Teach and tutor at community libraries and schools.", color: "var(--purple)" },
    { icon: "Users", title: "Field Coordinator", desc: "On-ground support for parent registration and emergency response.", color: "var(--teal-dark)" },
    { icon: "Wrench", title: "Admin Support", desc: "Help with data entry, donor relations, and operations.", color: "var(--beige)" },
  ],
  subjects: ["Donation Inquiry", "Parent Registration", "Volunteering", "Partnership", "Other"],
  form_name_label: "Full Name",
  form_name_placeholder: "Your name",
  form_email_label: "Email Address",
  form_email_placeholder: "your@email.com",
  form_subject_label: "Subject",
  form_message_label: "Message",
  form_message_placeholder: "Write your message here...",
  form_submit_label: "Send Message",
  success_message: "Message sent! We'll reply within 24 hours.",
  faq_heading: "Frequently Asked Questions",
  faq_items: [
    { q: "How quickly will you respond?", a: "We respond to every message within 24 hours on business days." },
    { q: "Can I visit your office?", a: "Yes — please book ahead by phone or email so a coordinator can host you." },
    { q: "How do I apply for medical or education support?", a: "Use the Apply for Support page or write to us — our team will guide you through eligibility." },
  ],
};

const Contact = () => {
  useSEO("Contact", "Get in touch with AGSWS — contact us or volunteer.");
  const { data: cms } = useCMSSection<typeof defaultContact>('contact_page', defaultContact);
  const volunteerRoles = (cms.volunteer_roles?.length ? cms.volunteer_roles : defaultContact.volunteer_roles)
    .map((r: any) => ({ ...r, icon: iconMap[r.icon] || Heart }));
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [volunteerModal, setVolunteerModal] = useState<string | null>(null);
  const [vol, setVol] = useState({ name: "", email: "", phone: "", message: "" });
  const [volSubmitting, setVolSubmitting] = useState(false);

  const onContactSubmit = async (formData: any) => {
    const name = (formData?.name || "").trim();
    const email = normalizeEmail(formData?.email);
    const message = (formData?.message || "").trim();
    if (name.length < 2) { toast.error("Please enter your full name."); return; }
    if (!isValidEmail(email)) { toast.error("Please enter a valid email address."); return; }
    if (message.length < 5) { toast.error("Please write a short message (min 5 characters)."); return; }

    const { data: row, error } = await (supabase.from("support_applications" as any) as any).insert({
      type: "contact",
      applicant_name: name,
      email,
      phone: formData.phone || "N/A",
      form_data: {
        subject: formData.subject || "General",
        message,
        source: "contact_form",
      },
    }).select("application_ref").maybeSingle();
    if (error) {
      toast.error("Failed to send message. Please try again.");
      return;
    }
    toast.success(
      row?.application_ref
        ? `Message sent! Reference: ${row.application_ref}`
        : (cms.success_message || defaultContact.success_message)
    );
    reset();
  };

  return (
    <main id="main-content">
      <PageHero title={cms.hero_title} label={cms.hero_label} size="sm" breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="bg-[var(--bg)] py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <FadeInUp>
            <PremiumCard>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] flex items-center justify-center shadow-[var(--shadow-sm)]">
                  <MessageSquare size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-[20px] font-[700] text-[var(--dark)] leading-tight">{cms.form_heading}</h2>
                  <p className="text-[12px] text-[var(--light)]">{cms.form_subtitle}</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <PremiumInput label={cms.form_name_label || "Full Name"} {...register("name")} placeholder={cms.form_name_placeholder || "Your name"} />
                  <PremiumInput label={cms.form_email_label || "Email Address"} {...register("email")} type="email" placeholder={cms.form_email_placeholder || "your@email.com"} icon={<Mail size={15} />} />
                </div>
                <PremiumSelect label={cms.form_subject_label || "Subject"} {...register("subject")}>
                  <option value="">Select a subject</option>
                  {(cms.subjects?.length ? cms.subjects : defaultContact.subjects).map((s: string) => (
                    <option key={s}>{s}</option>
                  ))}
                </PremiumSelect>
                <PremiumTextarea label={cms.form_message_label || "Message"} {...register("message")} placeholder={cms.form_message_placeholder || "Write your message here..."} rows={5} />
                <PremiumButton type="submit" disabled={isSubmitting} loading={isSubmitting} icon={<Send size={16} />}>
                  {isSubmitting ? "Sending..." : (cms.form_submit_label || "Send Message")}
                </PremiumButton>
              </form>
            </PremiumCard>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] rounded-[20px] p-7 text-white shadow-[var(--shadow-lg)]">
                <h3 className="text-[18px] font-[700] mb-6">{cms.info_heading}</h3>
                <div className="flex flex-col gap-5">
                  {[
                    { icon: MapPin, label: "Visit Us", text: cms.info_address },
                    { icon: Phone, label: "Call Us", text: cms.info_phone },
                    { icon: Mail, label: "Email Us", text: cms.info_email },
                    { icon: Clock, label: "Office Hours", text: cms.info_hours },
                  ].map(({ icon: Icon, label, text }) => (
                    <div key={text} className="flex gap-3 items-start group">
                      <div className="w-9 h-9 rounded-xl bg-white/[0.1] flex items-center justify-center shrink-0 group-hover:bg-white/[0.15] transition-colors">
                        <Icon size={16} className="text-white" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.1em] text-white/50 font-[600] block">{label}</span>
                        <span className="text-[13px] font-[500] text-white/90 leading-snug">{text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} className="bg-[var(--white)] rounded-[20px] border border-[var(--border-color)] p-6 shadow-[var(--shadow-card)] text-center cursor-pointer group">
                <div className="w-14 h-14 rounded-2xl bg-[var(--teal-light)] flex items-center justify-center mx-auto mb-3 group-hover:shadow-[var(--shadow-md)] transition-shadow">
                  <MapPin size={24} className="text-[var(--teal)]" />
                </div>
                <p className="text-[14px] font-[600] text-[var(--dark)] mb-1">Kolkata, West Bengal</p>
                <p className="text-[12px] text-[var(--light)]">Click to open in Maps</p>
              </motion.div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Volunteer */}
      <section className="bg-[var(--white)] py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeInUp className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[var(--teal-light)] text-[var(--teal)] text-[11px] font-[600] uppercase tracking-[0.1em] px-4 py-1.5 rounded-full mb-4">
              <Sparkles size={12} /> {cms.volunteer_label}
            </div>
            <h2 className="text-[28px] lg:text-[36px] font-[800] text-[var(--dark)] tracking-[-0.02em]">{cms.volunteer_heading}</h2>
          </FadeInUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {volunteerRoles.map((role, i) => (
              <FadeInUp key={role.title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -6, boxShadow: "var(--shadow-lg)" }} className="bg-[var(--white)] rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6 text-center cursor-pointer transition-all group relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `linear-gradient(90deg, ${role.color}, transparent)` }} />
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-all group-hover:shadow-[var(--shadow-md)]" style={{ backgroundColor: `color-mix(in srgb, ${role.color} 10%, white)` }}>
                    <role.icon size={24} style={{ color: role.color }} />
                  </div>
                  <h4 className="font-[600] text-[var(--dark)] mb-2 text-[15px]">{role.title}</h4>
                  <p className="text-[13px] text-[var(--mid)] mb-4 leading-[1.6]">{role.desc}</p>
                  <button onClick={() => setVolunteerModal(role.title)} className="text-[var(--teal)] font-[600] text-[13px] hover:underline flex items-center gap-1 mx-auto">
                    Express Interest <ArrowRight size={12} />
                  </button>
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Modal */}
      <AnimatePresence>
        {/* placeholder */}
      </AnimatePresence>

      {/* FAQ */}
      {(cms.faq_items?.length ?? 0) > 0 && (
        <section className="bg-[var(--bg)] py-16 lg:py-20">
          <div className="max-w-[820px] mx-auto px-6">
            <FadeInUp className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[var(--teal-light)] text-[var(--teal)] text-[11px] font-[600] uppercase tracking-[0.1em] px-4 py-1.5 rounded-full mb-3">
                <HelpCircle size={12} /> Help
              </div>
              <h2 className="text-[24px] lg:text-[30px] font-[800] text-[var(--dark)] tracking-[-0.02em]">{cms.faq_heading || "Frequently Asked Questions"}</h2>
            </FadeInUp>
            <div className="space-y-3">
              {(cms.faq_items || []).map((item: any, i: number) => (
                <FadeInUp key={i} delay={i * 0.05}>
                  <details className="group bg-[var(--white)] rounded-[16px] border border-[var(--border-color)] p-5 shadow-[var(--shadow-card)] open:shadow-[var(--shadow-md)] transition-shadow">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <span className="text-[15px] font-[600] text-[var(--dark)]">{item.q}</span>
                      <ArrowRight size={14} className="text-[var(--teal)] group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-3 text-[13px] text-[var(--mid)] leading-[1.7]">{item.a}</p>
                  </details>
                </FadeInUp>
              ))}
            </div>
          </div>
        </section>
      )}

      <AnimatePresence>
        {volunteerModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center backdrop-blur-md" onClick={() => setVolunteerModal(null)}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="bg-[var(--white)] w-full sm:max-w-md sm:rounded-[24px] rounded-t-[24px] p-8 shadow-[var(--shadow-lg)]">
              <h3 className="text-[20px] font-[700] text-[var(--dark)] mb-6">Volunteer as {volunteerModal}</h3>
              <div className="space-y-5">
                <PremiumInput label="Name" placeholder="Your name" value={vol.name} onChange={(e: any) => setVol(v => ({ ...v, name: e.target.value }))} />
                <PremiumInput label="Email" placeholder="Email address" type="email" value={vol.email} onChange={(e: any) => setVol(v => ({ ...v, email: e.target.value }))} />
                <PremiumInput label="Phone" placeholder="Phone number" type="tel" value={vol.phone} onChange={(e: any) => setVol(v => ({ ...v, phone: e.target.value }))} />
                <PremiumTextarea label="Message" placeholder="Brief message" rows={3} value={vol.message} onChange={(e: any) => setVol(v => ({ ...v, message: e.target.value }))} />
                <div className="flex gap-3 pt-2">
                  <PremiumButton variant="secondary" onClick={() => setVolunteerModal(null)} className="flex-1">Cancel</PremiumButton>
                  <PremiumButton
                    loading={volSubmitting}
                    disabled={volSubmitting}
                    onClick={async () => {
                      if (volSubmitting) return;
                      const name = vol.name.trim();
                      const email = normalizeEmail(vol.email);
                      if (name.length < 2) { toast.error("Please enter your full name."); return; }
                      if (!isValidEmail(email)) { toast.error("Please enter a valid email address."); return; }
                      if (!isValidIndianPhone(vol.phone)) { toast.error("Please enter a valid 10-digit phone number."); return; }
                      setVolSubmitting(true);
                      const { data: row, error } = await (supabase.from("support_applications" as any) as any).insert({
                        type: "volunteer",
                        applicant_name: name,
                        email,
                        phone: vol.phone.trim(),
                        form_data: { role_interest: volunteerModal, message: vol.message, source: "contact_volunteer_modal" },
                      }).select("application_ref").maybeSingle();
                      setVolSubmitting(false);
                      if (error) { toast.error("Submission failed. Please try again."); return; }
                      setVolunteerModal(null);
                      setVol({ name: "", email: "", phone: "", message: "" });
                      toast.success(
                        row?.application_ref
                          ? `Interest submitted! Ref: ${row.application_ref}`
                          : "Interest submitted! We'll be in touch."
                      );
                    }}
                    className="flex-1"
                  >Submit</PremiumButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Contact;
