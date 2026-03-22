import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { useForm } from "react-hook-form";
import { MapPin, Phone, Mail, Clock, Heart, BookOpen, Users, Wrench } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageHero from "@/components/layout/PageHero";

const volunteerRoles = [
  { icon: Heart, title: "Medical Volunteer", desc: "Assist with health camps and hospital coordination." },
  { icon: BookOpen, title: "Education Volunteer", desc: "Teach and tutor at community libraries and schools." },
  { icon: Users, title: "Field Coordinator", desc: "On-ground support for parent registration and emergency response." },
  { icon: Wrench, title: "Admin Support", desc: "Help with data entry, donor relations, and operations." },
];

const Contact = () => {
  useSEO("Contact", "Get in touch with AGSWS — contact us or volunteer.");
  const { register, handleSubmit } = useForm();
  const [volunteerModal, setVolunteerModal] = useState<string | null>(null);

  return (
    <main id="main-content">
      <PageHero title="Get In Touch" label="Contact Us" size="sm" breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <section className="bg-card py-16">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <FadeInUp>
            <h2 className="heading-3 text-text-dark mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit(() => {})} className="space-y-4">
              {[["Name", "name", "text"], ["Email", "email", "email"]].map(([label, name, type]) => (
                <div key={name}>
                  <label className="text-sm font-medium text-text-dark mb-1 block">{label}</label>
                  <input {...register(name)} type={type} className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-all" />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Subject</label>
                <select {...register("subject")} className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal text-text-dark">
                  <option value="">Select a subject</option>
                  <option>Donation Inquiry</option><option>Parent Registration</option><option>Volunteering</option><option>Partnership</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-text-dark mb-1 block">Message</label>
                <textarea {...register("message")} rows={5} className="w-full px-4 py-3 border border-border rounded-lg bg-card outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-all" />
              </div>
              <button type="submit" className="bg-teal text-primary-foreground font-semibold px-8 py-3 rounded-full hover:bg-teal-dark transition-colors">
                Send Message →
              </button>
            </form>
          </FadeInUp>

          {/* Contact Info */}
          <FadeInUp delay={0.15}>
            <div className="bg-teal rounded-xl p-8 text-primary-foreground mb-8">
              <h3 className="heading-3 mb-6">Get in Touch</h3>
              {[
                { icon: MapPin, text: "123 Park Street, Kolkata, West Bengal 700016" },
                { icon: Phone, text: "+91 98765 43210" },
                { icon: Mail, text: "contact@agsws.org" },
                { icon: Clock, text: "Mon–Sat: 9:00 AM – 6:00 PM IST" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 mb-4">
                  <Icon size={20} className="text-yellow mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-primary-foreground/90">{text}</span>
                </div>
              ))}
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
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeInUp className="text-center mb-12">
            <span className="label-text text-teal">Get Involved</span>
            <h2 className="heading-2 text-text-dark mt-3 before:hidden text-center">Volunteer With Us</h2>
          </FadeInUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {volunteerRoles.map((role, i) => (
              <FadeInUp key={role.title} delay={i * 0.1}>
                <div className="bg-card border border-border rounded-xl p-6 text-center shadow-brand-sm hover:shadow-brand-md transition-shadow">
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
                <input placeholder="Your Name" className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal" />
                <input placeholder="Email" className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal" />
                <input placeholder="Phone" className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal" />
                <textarea placeholder="Brief message" rows={3} className="w-full px-4 py-3 border border-border rounded-lg bg-card outline-none focus:border-teal" />
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
