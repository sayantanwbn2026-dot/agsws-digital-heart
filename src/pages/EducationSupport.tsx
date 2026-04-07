import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { Link } from "react-router-dom";
import { BookOpen, Library, GraduationCap, Monitor, ArrowRight, CheckCircle, Phone } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "@/components/layout/PageHero";
import { PremiumInput, PremiumTextarea, PremiumCard, PremiumButton } from "@/components/ui/PremiumFormElements";

const EducationSupport = () => {
  useSEO("Education Support", "AGSWS Education — scholarships, libraries, and tutoring for underprivileged children.");
  const [showApply, setShowApply] = useState(false);

  return (
    <main id="main-content">
      <PageHero title="Education Support" label="Initiative" bgVariant="purple" breadcrumb={[{ label: "Home", href: "/" }, { label: "Initiatives", href: "/initiatives" }, { label: "Education" }]} />

      <section className="bg-card py-20 lg:py-28">
        <div className="max-w-[900px] mx-auto px-6">
          <FadeInUp>
            <p className="text-[15px] lg:text-[17px] text-[var(--mid)] mb-12 leading-[1.8] max-w-[700px]">
              Education is the most powerful tool for breaking the cycle of poverty. Our programs cover everything from school enrollment to digital literacy, ensuring every child has the opportunity to learn and grow.
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
            {[
              { icon: GraduationCap, title: "Scholarships", desc: "Full and partial scholarships covering tuition, uniform, and books." },
              { icon: Library, title: "Community Libraries", desc: "3 libraries serving 600+ children with books and reading programs." },
              { icon: BookOpen, title: "After-School Tutoring", desc: "Daily tutoring sessions in Math, Science, and English." },
              { icon: Monitor, title: "Digital Literacy", desc: "Computer skills and internet literacy for students aged 10–16." },
            ].map((item, i) => (
              <FadeInUp key={item.title} delay={i * 0.08}>
                <motion.div whileHover={{ y: -4, boxShadow: "var(--shadow-lg)" }} className="bg-[var(--white)] rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--purple-light)] flex items-center justify-center mb-4">
                    <item.icon size={22} className="text-[var(--purple)]" />
                  </div>
                  <h4 className="text-[16px] font-[700] text-[var(--dark)] mb-2">{item.title}</h4>
                  <p className="text-[13px] text-[var(--mid)] leading-[1.7]">{item.desc}</p>
                </motion.div>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp className="text-center">
            <Link to="/donate/education" className="inline-flex items-center gap-2 bg-[var(--yellow)] text-[var(--dark)] font-[700] px-10 py-4 rounded-full shadow-[var(--shadow-yellow)] hover:scale-[1.02] transition-transform text-[14px]">
              Sponsor Education <ArrowRight size={16} />
            </Link>
          </FadeInUp>
        </div>
      </section>

      <section className="bg-[var(--purple-light)] border-t-4 border-[var(--purple)] py-16">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
          <div>
            <span className="text-[11px] font-[600] text-[var(--purple)] uppercase tracking-[0.1em] mb-2 block">For Students in Need</span>
            <h3 className="text-[22px] font-[800] text-[var(--dark)] mb-4 tracking-[-0.01em]">Is Your Child Unable to Continue School?</h3>
            <p className="text-[14px] text-[var(--mid)] leading-relaxed mb-6">
              If you have a child in Kolkata who needs educational support — fees, books, or meals — apply through AGSWS. We assess applications within 3 working days.
            </p>
            <div className="flex flex-wrap gap-3">
              <PremiumButton onClick={() => setShowApply(true)} className="!bg-[var(--purple)] hover:!bg-[var(--purple)]/90">Apply for Education Support →</PremiumButton>
              <a href="tel:+919876543210" className="h-[52px] px-8 border-[1.5px] border-[var(--purple)] text-[var(--purple)] font-[600] rounded-full text-[14px] flex items-center gap-2 hover:bg-[var(--purple)] hover:text-white transition-all">
                <Phone size={14} /> Call Us
              </a>
            </div>
          </div>
          <PremiumCard className="!p-6">
            <h4 className="font-[600] text-[var(--dark)] mb-4 text-[14px]">What we cover:</h4>
            {["School fees", "Books & stationery", "School meals", "Uniform", "Exam fees"].map((item) => (
              <div key={item} className="flex items-center gap-2.5 mb-3">
                <CheckCircle size={16} className="text-[var(--purple)] flex-shrink-0" />
                <span className="text-[13px] text-[var(--mid)]">{item}</span>
              </div>
            ))}
          </PremiumCard>
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApply && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-md p-4" onClick={() => setShowApply(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="bg-[var(--white)] w-full max-w-[520px] rounded-[24px] p-8 shadow-[var(--shadow-lg)] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--purple)] to-[#4A48A0] flex items-center justify-center">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <h3 className="text-[20px] font-[700] text-[var(--dark)]">Apply for Education Support</h3>
              </div>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setShowApply(false); }}>
                <PremiumInput label="Child's Full Name" required placeholder="Full name" />
                <div className="grid grid-cols-2 gap-5">
                  <PremiumInput label="Child's Age" required type="number" placeholder="Age" />
                  <PremiumInput label="Class / Grade" required placeholder="e.g. Class 5" />
                </div>
                <PremiumInput label="School Name & Address" required placeholder="School details" />
                <PremiumInput label="Parent/Guardian Name" required placeholder="Guardian name" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <PremiumInput label="Phone" required type="tel" placeholder="Phone number" />
                  <PremiumInput label="Email" required type="email" placeholder="Email address" />
                </div>
                <PremiumTextarea label="Reason for Applying" rows={3} placeholder="Brief reason" />
                <div className="flex gap-3 pt-2">
                  <PremiumButton variant="secondary" type="button" onClick={() => setShowApply(false)} className="flex-1">Cancel</PremiumButton>
                  <PremiumButton type="submit" className="flex-1 !bg-[var(--purple)]">Submit Application</PremiumButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default EducationSupport;
