import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Clock, Heart, BookOpen, Users, Wrench, Loader2, Send, ArrowRight, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/layout/PageHero";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

const volunteerRoles = [
  { icon: Heart, title: "Medical Volunteer", desc: "Assist with health camps and hospital coordination.", color: "var(--teal)" },
  { icon: BookOpen, title: "Education Volunteer", desc: "Teach and tutor at community libraries and schools.", color: "var(--purple)" },
  { icon: Users, title: "Field Coordinator", desc: "On-ground support for parent registration and emergency response.", color: "var(--teal-dark)" },
  { icon: Wrench, title: "Admin Support", desc: "Help with data entry, donor relations, and operations.", color: "var(--beige)" },
];

const FormInput = ({ label, error, ...props }: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <label className="text-[11px] font-[600] text-[var(--dark)] mb-1.5 block uppercase tracking-[0.08em]">{label}</label>
    <input {...props} className={`w-full h-[48px] px-4 text-[14px] text-[var(--dark)] bg-[var(--bg)] border ${error ? 'border-[#DC2626]' : 'border-[var(--border-color)]'} rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10 transition-all placeholder:text-[var(--light)]`} />
    {error && <p className="text-[11px] text-[#DC2626] mt-1">{error}</p>}
  </div>
);

const Contact = () => {
  useSEO("Contact", "Get in touch with AGSWS — contact us or volunteer.");
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [volunteerModal, setVolunteerModal] = useState<string | null>(null);

  const onContactSubmit = async (formData: any) => {
    const { error } = await supabase.from("volunteers").insert({
      name: formData.name, email: formData.email, message: formData.message,
      role_interest: "other", status: "new",
    });
    if (error) { toast.error("Failed to send message. Please try again."); return; }
    toast.success("Message sent! We'll reply within 24 hours.");
    reset();
  };

  return (
    <main id="main-content">
      <PageHero title="Get In Touch" label="Contact Us" size="sm" breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="bg-[var(--bg)] py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          <FadeInUp>
            <div className="bg-white rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--teal-light)] flex items-center justify-center">
                  <MessageSquare size={18} className="text-[var(--teal)]" />
                </div>
                <div>
                  <h2 className="text-[20px] font-[700] text-[var(--dark)] leading-tight">Send Us a Message</h2>
                  <p className="text-[12px] text-[var(--light)]">We respond within 24 hours</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Full Name" {...register("name")} placeholder="Your name" />
                  <FormInput label="Email Address" {...register("email")} type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="text-[11px] font-[600] text-[var(--dark)] mb-1.5 block uppercase tracking-[0.08em]">Subject</label>
                  <select {...register("subject")} className="w-full h-[48px] px-4 text-[14px] text-[var(--dark)] bg-[var(--bg)] border border-[var(--border-color)] rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10 transition-all appearance-none">
                    <option value="">Select a subject</option>
                    <option>Donation Inquiry</option>
                    <option>Parent Registration</option>
                    <option>Volunteering</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-[600] text-[var(--dark)] mb-1.5 block uppercase tracking-[0.08em]">Message</label>
                  <textarea {...register("message")} placeholder="Write your message here..." rows={5} className="w-full px-4 py-3 text-[14px] text-[var(--dark)] bg-[var(--bg)] border border-[var(--border-color)] rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10 transition-all resize-none placeholder:text-[var(--light)]" />
                </div>
                <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-[var(--teal)] text-white font-[600] px-8 py-3.5 rounded-full hover:bg-[var(--teal-dark)] transition-colors flex items-center gap-2 disabled:opacity-70 text-[14px]">
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
                </motion.button>
              </form>
            </div>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <div className="space-y-5">
              <div className="bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] rounded-[20px] p-7 text-white">
                <h3 className="text-[18px] font-[700] mb-6">Contact Information</h3>
                <div className="flex flex-col gap-5">
                  {[
                    { icon: MapPin, label: "Visit Us", text: "123 Park Street, Kolkata, WB 700016" },
                    { icon: Phone, label: "Call Us", text: "+91 98765 43210" },
                    { icon: Mail, label: "Email Us", text: "contact@agsws.org" },
                    { icon: Clock, label: "Office Hours", text: "Mon–Sat: 9 AM – 6 PM IST" },
                  ].map(({ icon: Icon, label, text }) => (
                    <div key={text} className="flex gap-3 items-start">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.1] flex items-center justify-center shrink-0">
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
              <div className="bg-white rounded-[16px] border border-[var(--border-color)] h-44 flex items-center justify-center shadow-[var(--shadow-card)]">
                <div className="text-center">
                  <MapPin size={28} className="text-[var(--teal)] mx-auto mb-2" />
                  <p className="text-[13px] text-[var(--light)]">Kolkata, West Bengal</p>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Volunteer */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeInUp className="text-center mb-12">
            <span className="text-[11px] font-[600] text-[var(--teal)] uppercase tracking-[0.1em] block mb-3">Get Involved</span>
            <h2 className="text-[28px] lg:text-[36px] font-[800] text-[var(--dark)] tracking-[-0.02em]">Volunteer With Us</h2>
          </FadeInUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {volunteerRoles.map((role, i) => (
              <FadeInUp key={role.title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -6 }} className="bg-white rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6 text-center cursor-pointer transition-shadow hover:shadow-[var(--shadow-md)] group relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, ${role.color}, transparent)` }} />
                  <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center transition-colors" style={{ backgroundColor: `color-mix(in srgb, ${role.color} 10%, white)` }}>
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center backdrop-blur-sm" onClick={() => setVolunteerModal(null)}>
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="bg-white w-full sm:max-w-md sm:rounded-[20px] rounded-t-[20px] p-8 shadow-[var(--shadow-lg)]">
              <h3 className="text-[18px] font-[700] text-[var(--dark)] mb-6">Volunteer as {volunteerModal}</h3>
              <div className="space-y-4">
                <FormInput label="Name" placeholder="Your name" />
                <FormInput label="Email" placeholder="Email address" type="email" />
                <FormInput label="Phone" placeholder="Phone number" type="tel" />
                <div>
                  <label className="text-[11px] font-[600] text-[var(--dark)] mb-1.5 block uppercase tracking-[0.08em]">Message</label>
                  <textarea placeholder="Brief message" rows={3} className="w-full px-4 py-3 text-[14px] text-[var(--dark)] bg-[var(--bg)] border border-[var(--border-color)] rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10 transition-all resize-none placeholder:text-[var(--light)]" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setVolunteerModal(null)} className="flex-1 border border-[var(--border-color)] text-[var(--mid)] font-[600] py-3 rounded-full text-[14px] hover:bg-[var(--bg)] transition-colors">Cancel</button>
                  <button onClick={() => { setVolunteerModal(null); toast.success("Interest submitted!"); }} className="flex-1 bg-[var(--teal)] text-white font-[600] py-3 rounded-full text-[14px] hover:bg-[var(--teal-dark)] transition-colors">Submit</button>
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
