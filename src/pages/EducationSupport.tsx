import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { Link } from "react-router-dom";
import { BookOpen, Library, GraduationCap, Monitor, ArrowRight, CheckCircle, Phone } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "@/components/layout/PageHero";

const EducationSupport = () => {
  useSEO("Education Support", "AGSWS Education — scholarships, libraries, and tutoring for underprivileged children.");
  const [showApply, setShowApply] = useState(false);

  return (
    <main id="main-content">
      <PageHero
        title="Education Support"
        label="Initiative"
        bgVariant="purple"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Initiatives", href: "/initiatives" }, { label: "Education" }]}
      />

      <section className="bg-card py-24">
        <div className="max-w-[900px] mx-auto px-6">
          <FadeInUp>
            <p className="body-lg text-text-mid mb-12">
              Education is the most powerful tool for breaking the cycle of poverty. Our programs cover everything from school enrollment to digital literacy, ensuring every child has the opportunity to learn and grow.
            </p>
          </FadeInUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {[
              { icon: GraduationCap, title: "Scholarships", desc: "Full and partial scholarships covering tuition, uniform, and books." },
              { icon: Library, title: "Community Libraries", desc: "3 libraries serving 600+ children with books and reading programs." },
              { icon: BookOpen, title: "After-School Tutoring", desc: "Daily tutoring sessions in Math, Science, and English." },
              { icon: Monitor, title: "Digital Literacy", desc: "Computer skills and internet literacy for students aged 10–16." },
            ].map((item, i) => (
              <FadeInUp key={item.title} delay={i * 0.1}>
                <div className="bg-card border border-border rounded-xl p-6 shadow-brand-sm">
                  <item.icon size={28} className="text-purple mb-3" />
                  <h4 className="heading-4 text-text-dark mb-2">{item.title}</h4>
                  <p className="body-small text-text-mid">{item.desc}</p>
                </div>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp className="text-center">
            <Link to="/donate/education" className="inline-flex items-center gap-2 bg-yellow text-text-dark font-semibold px-10 py-4 rounded-full shadow-yellow hover:scale-[1.02] transition-transform">
              Sponsor Education <ArrowRight size={18} />
            </Link>
          </FadeInUp>
        </div>
      </section>

      {/* Need Support Section */}
      <section className="bg-purple-light border-t-4 border-purple py-16">
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          <div>
            <span className="label-text text-purple mb-2 block">For Students in Need</span>
            <h3 className="heading-3 text-text-dark mb-4">Is Your Child Unable to Continue School?</h3>
            <p className="text-sm text-text-mid leading-relaxed mb-6">
              If you have a child in Kolkata who needs educational support — fees, books, or meals — apply through AGSWS. We assess applications within 3 working days.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setShowApply(true)} className="bg-purple text-primary-foreground font-semibold px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity">
                Apply for Education Support →
              </button>
              <a href="tel:+919876543210" className="border border-purple text-purple font-semibold px-6 py-3 rounded-full text-sm flex items-center gap-2 hover:bg-purple hover:text-primary-foreground transition-colors">
                <Phone size={16} /> Call Us
              </a>
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 shadow-brand-sm">
            <h4 className="font-semibold text-text-dark mb-4">What we cover:</h4>
            {["School fees", "Books & stationery", "School meals", "Uniform", "Exam fees"].map((item) => (
              <div key={item} className="flex items-center gap-2 mb-2.5">
                <CheckCircle size={16} className="text-purple flex-shrink-0" />
                <span className="text-sm text-text-mid">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApply && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={() => setShowApply(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto">
              <div className="bg-card rounded-xl shadow-lg border border-border p-8 w-full max-w-[520px] my-8">
                <h3 className="font-semibold text-text-dark mb-6 text-lg">Apply for Education Support</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowApply(false); }}>
                  <input placeholder="Child's Full Name *" required className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-purple text-sm" />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Child's Age *" required type="number" className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-purple text-sm" />
                    <input placeholder="Class / Grade *" required className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-purple text-sm" />
                  </div>
                  <input placeholder="School Name & Address *" required className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-purple text-sm" />
                  <input placeholder="Parent/Guardian Name *" required className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-purple text-sm" />
                  <input placeholder="Parent/Guardian Phone *" required type="tel" className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-purple text-sm" />
                  <input placeholder="Parent/Guardian Email *" required type="email" className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-purple text-sm" />
                  <textarea placeholder="Brief reason for applying" rows={3} maxLength={300} className="w-full px-4 py-3 border border-border rounded-lg bg-card outline-none focus:border-purple text-sm" />
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowApply(false)} className="border border-border text-text-mid px-5 py-2.5 rounded-full text-sm font-medium">Cancel</button>
                    <button type="submit" className="bg-purple text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold flex-1">Submit Application</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
};

export default EducationSupport;
