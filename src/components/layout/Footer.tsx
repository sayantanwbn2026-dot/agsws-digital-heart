import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[var(--teal-dark)] text-white">
      <div className="max-w-[1240px] mx-auto px-6 pt-[80px] pb-[40px]">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[30%_23%_23%_latest] gap-[32px] lg:gap-[48px]" style={{ gridTemplateColumns: '30% 23% 23% 24%' }}>
          
          {/* Column 1 (Brand) */}
          <div>
            <div className="flex flex-col gap-[1px]">
              <span className="font-['Inter'] font-[700] text-[20px] text-white">AGSWS</span>
              <span className="text-[9px] uppercase tracking-widest text-white/65">Social Welfare Society</span>
            </div>
            
            <p className="text-[14px] font-[400] font-['Inter'] text-white/75 mt-[16px] max-w-[240px] leading-[1.7]">
              Serving families across Kolkata with medical aid, education, and emergency care since 2020.
            </p>
            
            <div className="mt-[24px] flex flex-row gap-[12px]">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-[36px] h-[36px] rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors duration-200" 
                  aria-label="Social media link"
                >
                  <Icon size={16} className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 (Quick Links) */}
          <div>
            <h4 className="font-['Inter'] font-[600] text-[10px] uppercase tracking-[0.12em] text-[var(--yellow)] mb-[24px]">Quick Links</h4>
            <div className="flex flex-col gap-[12px]">
              {[
                ["Home", "/"], ["About", "/about"], ["Initiatives", "/initiatives"],
                ["Events", "/events"], ["Gallery", "/gallery"], ["Resources", "/resources"],
                ["Blog", "/blog"], ["Contact", "/contact"], ["Impact Report", "/impact"],
                ["Transparency", "/transparency"],
              ].map(([label, path]) => (
                <Link 
                  key={path} 
                  to={path} 
                  className="font-['Inter'] font-[500] text-[13.5px] text-white/90 hover:text-[var(--yellow)] hover:translate-x-[4px] transition-all duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3 (Get Involved) */}
          <div>
            <h4 className="font-['Inter'] font-[600] text-[10px] uppercase tracking-[0.12em] text-[var(--yellow)] mb-[24px]">Get Involved</h4>
            <div className="flex flex-col gap-[12px]">
              {[
                ["Donate Medical Aid", "/donate/medical"], ["Donate Education", "/donate/education"],
                ["Register Parent", "/register-parent"], ["Track Registration", "/track"],
                ["Track Donation", "/track-donation"], ["Donor Wall", "/donor-wall"],
                ["CSR Partnership", "/csr"], ["Volunteer Portal", "/volunteer-portal"],
                ["Apply for Support", "/apply"], ["Subscribe to Updates", "/updates"],
              ].map(([label, path]) => (
                <Link 
                  key={label} 
                  to={path} 
                  className="font-['Inter'] font-[500] text-[13.5px] text-white/90 hover:text-[var(--yellow)] hover:translate-x-[4px] transition-all duration-200"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4 (Contact) */}
          <div>
            <h4 className="font-['Inter'] font-[600] text-[10px] uppercase tracking-[0.12em] text-[var(--yellow)] mb-[24px]">Contact</h4>
            <div className="flex flex-col gap-[12px] font-['Inter'] font-[500] text-[14px] text-white/95">
              <p className="leading-relaxed">123 Park Street,<br />Kolkata, WB 700016</p>
              <p>+91 98765 43210</p>
              <p>contact@agsws.org</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-[64px] pt-[24px] border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-['Inter'] font-[400] text-[12px] text-white/75">
            © {new Date().getFullYear()} AGSWS. All rights reserved.
          </p>
          <div className="flex flex-row gap-[24px]">
            {["Privacy Policy", "Terms of Use", "Refund Policy"].map((text) => (
              <a 
                key={text} 
                href="#" 
                className="font-['Inter'] font-[400] text-[12px] text-white/75 hover:text-white transition-colors"
              >
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
