import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import NGOSealBadge from "../ui/NGOSealBadge";

const Footer = () => {
  const footerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "end end"] });
  const logoY = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <footer ref={footerRef} className="bg-teal-dark text-primary-foreground">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div style={{ y: logoY }} className="will-change-transform">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-teal inline-block" />
              <span className="font-bold text-xl">AGSWS</span>
            </div>
            <p className="text-sm text-primary-foreground/70 max-w-[240px] leading-relaxed mb-6">
              The Ascension Group Social Welfare Society — serving families across Kolkata with medical aid, education, and emergency care since 2020.
            </p>
            <div className="flex gap-4 mb-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-primary-foreground/70 hover:text-yellow transition-colors duration-200" aria-label="Social media link">
                  <Icon size={20} />
                </a>
              ))}
            </div>
            <NGOSealBadge size={56} />
          </motion.div>

          {/* Quick Links */}
          <div>
            <h4 className="label-text text-yellow mb-6">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {[
                ["Home", "/"], ["About", "/about"], ["Initiatives", "/initiatives"],
                ["Events", "/events"], ["Gallery", "/gallery"], ["Resources", "/resources"],
                ["Blog", "/blog"], ["Contact", "/contact"], ["Impact Report", "/impact"],
                ["Transparency", "/transparency"],
              ].map(([label, path]) => (
                <Link key={path} to={path} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="label-text text-yellow mb-6">Get Involved</h4>
            <div className="flex flex-col gap-3">
              {[
                ["Donate Medical Aid", "/donate/medical"], ["Donate Education", "/donate/education"],
                ["Register Parent", "/register-parent"], ["Track Registration", "/track"],
                ["Track Donation", "/track-donation"], ["Donor Wall", "/donor-wall"],
                ["CSR Partnership", "/csr"], ["Volunteer Portal", "/volunteer-portal"],
                ["Apply for Support", "/apply"], ["Subscribe to Updates", "/updates"],
              ].map(([label, path]) => (
                <Link key={label} to={path} className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="label-text text-yellow mb-6">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <p>123 Park Street,<br />Kolkata, WB 700016</p>
              <p>+91 98765 43210</p>
              <p>contact@agsws.org</p>
            </div>
            <Link to="/donate/medical" className="inline-block mt-6 bg-yellow text-text-dark font-semibold text-sm px-6 py-2.5 rounded-full hover:shadow-yellow transition-shadow">
              Donate Now
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/50">© 2025 AGSWS. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Use", "Refund Policy"].map((text) => (
              <a key={text} href="#" className="text-xs text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors">
                {text}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="h-16 md:hidden" />
    </footer>
  );
};

export default Footer;
