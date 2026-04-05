import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Heart, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const footerLinks = {
  explore: [
    ["Home", "/"], ["About Us", "/about"], ["Initiatives", "/initiatives"],
    ["Events", "/events"], ["Gallery", "/gallery"], ["Blog", "/blog"],
    ["Resources", "/resources"], ["Impact Report", "/impact"],
  ],
  involved: [
    ["Donate Medical Aid", "/donate/medical"], ["Donate Education", "/donate/education"],
    ["Register Parent", "/register-parent"], ["Volunteer Portal", "/volunteer-portal"],
    ["CSR Partnership", "/csr"], ["Donor Wall", "/donor-wall"],
    ["Apply for Support", "/apply"], ["Transparency", "/transparency"],
  ],
};

const SocialIcon = ({ icon: Icon, href, label }: { icon: typeof Facebook; href: string; label: string }) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.15, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className="w-10 h-10 rounded-xl bg-white/[0.07] flex items-center justify-center hover:bg-[hsl(var(--primary))]/20 transition-colors duration-300 border border-white/[0.06]"
    aria-label={label}
  >
    <Icon size={16} className="text-white/80" />
  </motion.a>
);

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="group flex items-center gap-1.5 text-[13px] font-medium text-white/60 hover:text-white transition-colors duration-200"
  >
    <span className="group-hover:translate-x-1 transition-transform duration-200">{children}</span>
    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
  </Link>
);

const Footer = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <footer ref={ref} className="relative bg-[hsl(187,68%,5%)] text-white overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-[hsl(var(--primary))]/[0.04] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-[hsl(var(--accent))]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* Newsletter strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10 border-b border-white/[0.06]"
      >
        <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">Stay Connected</h3>
            <p className="text-sm text-white/50 mt-1">Get quarterly impact reports and field stories.</p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 md:w-[280px] bg-white/[0.06] border border-white/[0.1] rounded-l-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[hsl(var(--primary))]/40 transition-colors"
            />
            <button className="bg-[hsl(var(--primary))] hover:bg-[hsl(187,70%,34%)] text-white px-6 py-3 rounded-r-xl text-sm font-semibold transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main footer grid */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-4"
          >
            <div className="flex flex-col gap-0.5 mb-5">
              <span className="text-xl font-extrabold tracking-tight text-white">AGSWS</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium">Social Welfare Society</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-[260px] mb-6">
              Serving families across Kolkata with medical aid, education, and emergency care since 2020.
            </p>
            <div className="flex gap-3 mb-8">
              <SocialIcon icon={Facebook} href="#" label="Facebook" />
              <SocialIcon icon={Twitter} href="#" label="Twitter" />
              <SocialIcon icon={Instagram} href="#" label="Instagram" />
              <SocialIcon icon={Linkedin} href="#" label="LinkedIn" />
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              {[
                { icon: MapPin, text: "123 Park Street, Kolkata 700016" },
                { icon: Phone, text: "+91 98765 43210" },
                { icon: Mail, text: "contact@agsws.org" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 text-[13px] text-white/50">
                  <item.icon size={14} className="text-white/30 flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Explore links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-3"
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--accent))] mb-6">Explore</h4>
            <div className="flex flex-col gap-3">
              {footerLinks.explore.map(([label, path]) => (
                <FooterLink key={path} to={path}>{label}</FooterLink>
              ))}
            </div>
          </motion.div>

          {/* Get Involved links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="lg:col-span-3"
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--accent))] mb-6">Get Involved</h4>
            <div className="flex flex-col gap-3">
              {footerLinks.involved.map(([label, path]) => (
                <FooterLink key={label} to={path}>{label}</FooterLink>
              ))}
            </div>
          </motion.div>

          {/* Impact snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[hsl(var(--accent))] mb-6">Impact</h4>
            <div className="space-y-5">
              {[
                { value: "2,400+", label: "Patients Aided" },
                { value: "850+", label: "Students Sponsored" },
                { value: "120+", label: "Families Registered" },
                { value: "₹48L+", label: "Funds Deployed" },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/[0.06]">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-white/40 flex items-center gap-1.5">
            © {new Date().getFullYear()} AGSWS. Built with <Heart size={10} className="text-red-400" /> in Kolkata.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use", "Refund Policy"].map(text => (
              <a key={text} href="#" className="text-[11px] text-white/40 hover:text-white/70 transition-colors">
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
