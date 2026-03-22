import { useSEO } from "@/hooks/useSEO";
import { Heart, BookOpen, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import FadeInUp from "@/components/ui/FadeInUp";
import { motion } from "framer-motion";

const initiatives = [
  {
    icon: Heart,
    title: "Medical Aid & Hospital Support",
    desc: "We provide emergency medical care, hospital admissions, surgery support, medicine funding, and health camps for families who cannot afford treatment. Our network of 6 partner hospitals ensures rapid access to quality care.",
    features: ["Emergency hospital admissions", "Medicine & treatment funding", "Free health camps", "Post-operative care support"],
    link: "/donate/medical",
    linkText: "Donate Medical Aid",
    color: "teal",
  },
  {
    icon: BookOpen,
    title: "Education Support",
    desc: "From scholarships to community libraries, we ensure children from low-income families have access to quality education. Our programs cover school enrollment, study materials, tutoring, and digital literacy.",
    features: ["Full & partial scholarships", "Community libraries", "After-school tutoring", "Digital literacy programs"],
    link: "/donate/education",
    linkText: "Sponsor Education",
    color: "purple",
  },
  {
    icon: Users,
    title: "Parent Medical Support Registration",
    desc: "Designed for NRKs whose elderly parents live alone in Kolkata. Register your parent, and we become their local emergency contact — coordinating medical care, hospital admissions, and providing wellness check-ins.",
    features: ["24/7 emergency helpline", "Hospital admission coordination", "Regular wellness check-ins", "Real-time family updates"],
    link: "/register-parent",
    linkText: "Register a Parent",
    color: "beige",
  },
];

const colorBg: Record<string, string> = { teal: "bg-teal", purple: "bg-purple", beige: "bg-beige" };
const colorText: Record<string, string> = { teal: "text-teal", purple: "text-purple", beige: "text-beige" };

const Initiatives = () => {
  useSEO("Initiatives", "Explore AGSWS initiatives: Medical Aid, Education Support, and Parent Registration.");

  return (
    <main id="main-content">
      <section className="h-[400px] bg-gradient-to-br from-teal-dark via-teal to-teal-dark flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/30" />
        <div className="relative z-10 text-center">
          <h1 className="heading-1 text-primary-foreground">Our Initiatives</h1>
          <p className="text-sm text-primary-foreground/60 mt-3">Home / Initiatives</p>
        </div>
      </section>

      <section className="bg-card py-24">
        <div className="max-w-[1000px] mx-auto px-6 space-y-16">
          {initiatives.map((item, i) => (
            <FadeInUp key={item.title} delay={i * 0.1}>
              <motion.div
                className="grid grid-cols-1 lg:grid-cols-[120px_1fr] gap-8 bg-card border border-border rounded-xl p-8 shadow-brand-md hover:shadow-brand-lg transition-shadow"
                whileHover={{ y: -4 }}
              >
                <div className={`w-20 h-20 ${colorBg[item.color]} rounded-2xl flex items-center justify-center`}>
                  <item.icon size={36} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="heading-3 text-text-dark mb-3">{item.title}</h3>
                  <p className="body-text text-text-mid mb-6">{item.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                    {item.features.map((f) => (
                      <span key={f} className={`flex items-center gap-2 text-sm ${colorText[item.color]} font-medium`}>
                        <ArrowRight size={14} /> {f}
                      </span>
                    ))}
                  </div>
                  <Link to={item.link} className="inline-block bg-teal text-primary-foreground font-semibold text-sm px-6 py-3 rounded-full hover:bg-teal-dark transition-colors">
                    {item.linkText} →
                  </Link>
                </div>
              </motion.div>
            </FadeInUp>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Initiatives;
