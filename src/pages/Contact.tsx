import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Clock, Heart, BookOpen, Users, Wrench, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/layout/PageHero";
import { supabase } from "@/lib/supabase/client";
import toast from "react-hot-toast";

const volunteerRoles = [
  { icon: Heart, title: "Medical Volunteer", desc: "Assist with health camps and hospital coordination." },
  { icon: BookOpen, title: "Education Volunteer", desc: "Teach and tutor at community libraries and schools." },
  { icon: Users, title: "Field Coordinator", desc: "On-ground support for parent registration and emergency response." },
  { icon: Wrench, title: "Admin Support", desc: "Help with data entry, donor relations, and operations." },
];

const Contact = () => {
  useSEO("Contact", "Get in touch with AGSWS — contact us or volunteer.");
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [volunteerModal, setVolunteerModal] = useState<string | null>(null);

  const onContactSubmit = async (formData: any) => {
    const { error } = await supabase.from("volunteers").insert({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      role_interest: "other",
      status: "new",
    });
    if (error) {
      toast.error("Failed to send message. Please try again.");
      return;
    }
    toast.success("Message sent! We'll reply within 24 hours.");
    reset();
  };

  return (
    <main id="main-content">
      <PageHero title="Get In Touch" label="Contact Us" size="sm" breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="bg-card py-16">
        <div className="max-w-[1240px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-[48px]">
          {/* Form */}
          <FadeInUp>
            <h2 className="heading-3 text-text-dark mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-4">
              {[["Name", "name", "text", "Your Full Name"], ["Email", "email", "email", "your@email.com"]].map(([label, name, type, ph]) => (
                <div key={name}>
                  <label className="text-sm font-medium text-text-dark mb-1 block">{label}</label>
                  <input placeholder={ph} {...register(name)} type={type} className="global-card w-full h-12 px-4 outline-none focus:ring-2 focus:ring-teal/15" />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Subject</label>
                <select {...register("subject")} className="global-card w-full h-12 outline-none text-text-dark">
                  <option value="">Select a subject</option>
                  <option>Donation Inquiry</option><option>Parent Registration</option><option>Volunteering</option><option>Partnership</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Message</label>
                <textarea placeholder="Write your message here..." {...register("message")} rows={5} className="global-card w-full px-4 py-3 outline-none focus:ring-2 focus:ring-teal/15" />
              </div>
              <button type="submit" disabled={isSubmitting} className="bg-teal text-primary-foreground font-semibold px-8 py-3 rounded-full hover:bg-teal-dark transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : "Send Message →"}
              </button>
            </form>
          </FadeInUp>

          {/* Contact Info */}
          <FadeInUp delay={0.15}>
            <div className="bg-[var(--teal)] rounded-[var(--radius-2xl)] p-[40px] text-white ms-auto max-w-[500px]">
              <h3 className="heading-3 mb-6 text-white">Get in Touch</h3>
              <div className="flex flex-col gap-6">
                {[
                  { icon: MapPin, label: "Visit Us", text: "123 Park Street, Kolkata, West Bengal 700016" },
                  { icon: Phone, label: "Call Us", text: "+91 98765 43210" },
                  { icon: Mail, label: "Email Us", text: "contact@agsws.org" },
                  { icon: Clock, label: "Office Hours", text: "Mon–Sat: 9:00 AM – 6:00 PM IST" },
                ].map(({ icon: Icon, label, text }) => (
                  <div key={text} className="flex flex-row gap-[16px] items-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-[0.1em] text-white/60 font-[700] font-['Inter'] mb-0.5">{label}</span>
                      <span className="text-[15px] font-[500] font-['Inter'] text-white leading-tight">{text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-background rounded-xl h-48 flex items-center justify-center border border-border">
              <div className="text-center">
                <MapPin size={32} className="text-teal mx-auto mb-2" />
                <p className="text-sm text-text-light">Kolkata, West Bengal</p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Volunteer */}
      <section className="bg-background py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <FadeInUp className="text-center mb-12">
            <span className="label-text text-teal">Get Involved</span>
            <h2 className="heading-2 text-text-dark mt-3 before:hidden text-center">Volunteer With Us</h2>
          </FadeInUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-3 lg:gap-5">
            {volunteerRoles.map((role, i) => (
              <FadeInUp key={role.title} delay={i * 0.1}>
                <div className="global-card text-center hover:">
                  <role.icon size={28} className="text-teal mx-auto mb-3" />
                  <h4 className="font-semibold text-text-dark mb-2">{role.title}</h4>
                  <p className="body-small text-text-mid mb-4">{role.desc}</p>
                  <button onClick={() => setVolunteerModal(role.title)} className="text-teal font-semibold text-sm hover:underline">
                    Express Interest →
                  </button>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer Modal */}
      <AnimatePresence>
        {volunteerModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setVolunteerModal(null)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card w-full sm:max-w-md sm:rounded-xl rounded-t-xl p-8"
            >
              <h3 className="heading-4 text-text-dark mb-4">Volunteer as {volunteerModal}</h3>
              <div className="space-y-3">
                <input placeholder="Your Name" className="global-card w-full h-12 outline-none focus:" />
                <input placeholder="Email" className="global-card w-full h-12 outline-none focus:" />
                <input placeholder="Phone" className="global-card w-full h-12 outline-none focus:" />
                <textarea placeholder="Brief message" rows={3} className="global-card w-full outline-none focus:" />
                <button onClick={() => setVolunteerModal(null)} className="w-full bg-teal text-primary-foreground font-semibold py-3 rounded-full hover:bg-teal-dark transition-colors">
                  Submit Interest
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Contact;
