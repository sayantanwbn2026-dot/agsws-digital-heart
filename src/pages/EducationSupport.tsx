import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { Link } from "react-router-dom";
import { BookOpen, Library, GraduationCap, Monitor, ArrowRight, CheckCircle, Phone } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "@/components/layout/PageHero";

const FormInput = ({ label, required, ...props }: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label className="text-[11px] font-[600] text-[var(--dark)] mb-1.5 block uppercase tracking-[0.08em]">{label} {required && <span className="text-[#DC2626]">*</span>}</label>
    <input {...props} className="w-full h-[48px] px-4 text-[14px] text-[var(--dark)] bg-[var(--bg)] border border-[var(--border-color)] rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10 transition-all placeholder:text-[var(--light)]" />
  </div>
);

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
                <motion.div whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }} className="bg-white rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6 transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-[var(--purple-light)] flex items-center justify-center mb-4">
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
              <button onClick={() => setShowApply(true)} className="bg-[var(--purple)] text-white font-[600] px-6 py-3 rounded-full text-[13px] hover:opacity-90 transition-opacity">Apply for Education Support →</button>
              <a href="tel:+919876543210" className="border border-[var(--purple)] text-[var(--purple)] font-[600] px-6 py-3 rounded-full text-[13px] flex items-center gap-2 hover:bg-[var(--purple)] hover:text-white transition-colors">
                <Phone size={14} /> Call Us
              </a>
            </div>
          </div>
          <div className="bg-white rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6">
            <h4 className="font-[600] text-[var(--dark)] mb-4 text-[14px]">What we cover:</h4>
            {["School fees", "Books & stationery", "School meals", "Uniform", "Exam fees"].map((item) => (
              <div key={item} className="flex items-center gap-2 mb-2.5">
                <CheckCircle size={16} className="text-[var(--purple)] flex-shrink-0" />
                <span className="text-[13px] text-[var(--mid)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApply && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4" onClick={() => setShowApply(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-[520px] rounded-[20px] p-8 shadow-[var(--shadow-lg)] max-h-[90vh] overflow-y-auto">
              <h3 className="text-[18px] font-[700] text-[var(--dark)] mb-6">Apply for Education Support</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowApply(false); }}>
                <FormInput label="Child's Full Name" required placeholder="Full name" />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Child's Age" required type="number" placeholder="Age" />
                  <FormInput label="Class / Grade" required placeholder="e.g. Class 5" />
                </div>
                <FormInput label="School Name & Address" required placeholder="School details" />
                <FormInput label="Parent/Guardian Name" required placeholder="Guardian name" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Phone" required type="tel" placeholder="Phone number" />
                  <FormInput label="Email" required type="email" placeholder="Email address" />
                </div>
                <div>
                  <label className="text-[11px] font-[600] text-[var(--dark)] mb-1.5 block uppercase tracking-[0.08em]">Reason for Applying</label>
                  <textarea rows={3} maxLength={300} placeholder="Brief reason" className="w-full px-4 py-3 text-[14px] text-[var(--dark)] bg-[var(--bg)] border border-[var(--border-color)] rounded-[12px] outline-none focus:border-[var(--purple)] focus:ring-2 focus:ring-[var(--purple)]/10 transition-all resize-none placeholder:text-[var(--light)]" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowApply(false)} className="flex-1 border border-[var(--border-color)] text-[var(--mid)] py-3 rounded-full text-[13px] font-[600] hover:bg-[var(--bg)] transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 bg-[var(--purple)] text-white py-3 rounded-full text-[13px] font-[600] hover:opacity-90 transition-opacity">Submit Application</button>
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
