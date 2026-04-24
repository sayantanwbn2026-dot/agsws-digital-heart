import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Clock, Heart, BookOpen, Users, Wrench, Send, ArrowRight, MessageSquare, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/layout/PageHero";
import { PremiumInput, PremiumTextarea, PremiumSelect, PremiumCard, PremiumButton } from "@/components/ui/PremiumFormElements";
import { supabase } from "@/integrations/supabase/client";
import toast from "react-hot-toast";
import { isValidEmail, normalizeEmail, isValidIndianPhone } from "@/lib/validation";

const volunteerRoles = [
  { icon: Heart, title: "Medical Volunteer", desc: "Assist with health camps and hospital coordination.", color: "var(--teal)" },
  { icon: BookOpen, title: "Education Volunteer", desc: "Teach and tutor at community libraries and schools.", color: "var(--purple)" },
  { icon: Users, title: "Field Coordinator", desc: "On-ground support for parent registration and emergency response.", color: "var(--teal-dark)" },
  { icon: Wrench, title: "Admin Support", desc: "Help with data entry, donor relations, and operations.", color: "var(--beige)" },
];

const Contact = () => {
  useSEO("Contact", "Get in touch with AGSWS — contact us or volunteer.");
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
        : "Message sent! We'll reply within 24 hours."
    );
    reset();
  };

  return (
    <main id="main-content">
      <PageHero title="Get In Touch" label="Contact Us" size="sm" breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="bg-[var(--bg)] py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <FadeInUp>
            <PremiumCard>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] flex items-center justify-center shadow-[var(--shadow-sm)]">
                  <MessageSquare size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-[20px] font-[700] text-[var(--dark)] leading-tight">Send Us a Message</h2>
                  <p className="text-[12px] text-[var(--light)]">We respond within 24 hours</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <PremiumInput label="Full Name" {...register("name")} placeholder="Your name" />
                  <PremiumInput label="Email Address" {...register("email")} type="email" placeholder="your@email.com" icon={<Mail size={15} />} />
                </div>
                <PremiumSelect label="Subject" {...register("subject")}>
                  <option value="">Select a subject</option>
                  <option>Donation Inquiry</option>
                  <option>Parent Registration</option>
                  <option>Volunteering</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </PremiumSelect>
                <PremiumTextarea label="Message" {...register("message")} placeholder="Write your message here..." rows={5} />
                <PremiumButton type="submit" disabled={isSubmitting} loading={isSubmitting} icon={<Send size={16} />}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </PremiumButton>
              </form>
            </PremiumCard>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] rounded-[20px] p-7 text-white shadow-[var(--shadow-lg)]">
                <h3 className="text-[18px] font-[700] mb-6">Contact Information</h3>
                <div className="flex flex-col gap-5">
                  {[
                    { icon: MapPin, label: "Visit Us", text: "123 Park Street, Kolkata, WB 700016" },
                    { icon: Phone, label: "Call Us", text: "+91 98765 43210" },
                    { icon: Mail, label: "Email Us", text: "contact@agsws.org" },
                    { icon: Clock, label: "Office Hours", text: "Mon–Sat: 9 AM – 6 PM IST" },
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
              <Sparkles size={12} /> Get Involved
            </div>
            <h2 className="text-[28px] lg:text-[36px] font-[800] text-[var(--dark)] tracking-[-0.02em]">Volunteer With Us</h2>
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
