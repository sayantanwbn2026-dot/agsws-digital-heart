import { motion } from "framer-motion";
import { Heart, BookOpen, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../ui/SectionHeader";
import ImagePlaceholder from "../ui/ImagePlaceholder";

const cards = [
  {
    icon: Heart,
    title: "Medical Aid & Hospital Support",
    desc: "Emergency medical care, hospital admissions, medicine support, and health camps for underprivileged families across Kolkata.",
    link: "/initiatives/medical",
    linkText: "Explore",
    chip: "₹500 onwards",
    gradient: "from-[var(--teal)] to-[var(--teal-dark)]",
    lightBg: "bg-[var(--teal-light)]",
    textColor: "text-[var(--teal)]",
    chipBg: "bg-[var(--teal-light)] text-[var(--teal)]",
    imgCategory: "hospital" as const,
    svgElement: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.12] -rotate-6 scale-110" viewBox="0 0 180 180">
        <line x1="90" y1="20" x2="90" y2="160" stroke="white" strokeWidth="14" strokeLinecap="round" />
        <line x1="20" y1="90" x2="160" y2="90" stroke="white" strokeWidth="14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    icon: BookOpen,
    title: "Education Support",
    desc: "Scholarships, school supplies, community libraries, and after-school programs for children from low-income families.",
    link: "/initiatives/education",
    linkText: "Sponsor a Child",
    chip: "From ₹1,500",
    gradient: "from-[var(--purple)] to-[#4A48A0]",
    lightBg: "bg-[var(--purple-light)]",
    textColor: "text-[var(--purple)]",
    chipBg: "bg-[var(--purple-light)] text-[var(--purple)]",
    imgCategory: "classroom" as const,
    featured: true,
  },
  {
    icon: Users,
    title: "Parent Medical Support",
    desc: "Register your elderly parents in Kolkata for emergency medical response. We become their local emergency contact.",
    link: "/register-parent",
    linkText: "Register Now",
    chip: "₹100 Platform Fee",
    gradient: "from-[var(--beige)] to-[var(--teal)]",
    lightBg: "bg-[var(--yellow-light)]",
    textColor: "text-[var(--beige)]",
    chipBg: "bg-[var(--yellow-light)] text-[var(--dark)]",
    imgCategory: "elderly" as const,
  },
];

const InitiativeCards = () => {
  return (
    <section className="bg-[var(--bg)] section">
      <div className="container">
        <SectionHeader
          label="What We Do"
          title="Three Ways We Create Impact"
          subtitle="Every initiative is designed for direct, measurable impact on real lives in Kolkata."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-full"
            >
              <motion.div
                className="group relative bg-white rounded-[20px] overflow-hidden border border-[var(--border-color)] shadow-[var(--shadow-card)] flex flex-col h-full"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Gradient top accent on hover */}
                <div className={`h-[3px] bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {card.featured && (
                  <div className="absolute top-4 right-4 z-10 bg-[var(--yellow)] text-[var(--dark)] text-[10px] font-[700] px-3 py-1 rounded-full -rotate-2 shadow-sm uppercase tracking-[0.04em]">
                    Most Supported
                  </div>
                )}

                {/* Image header */}
                <div className={`relative h-[160px] lg:h-[180px] w-full bg-gradient-to-br ${card.gradient} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                  <ImagePlaceholder category={card.imgCategory} className="absolute inset-0 w-full h-full opacity-[0.2] object-cover mix-blend-overlay" />
                  {card.svgElement}
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/[0.15] backdrop-blur-sm flex items-center justify-center border border-white/[0.2]">
                    <card.icon size={28} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[18px] font-[700] text-[var(--dark)] mb-2 tracking-[-0.01em]">{card.title}</h3>
                  <p className="text-[13px] text-[var(--mid)] mb-5 flex-1 leading-[1.65]">{card.desc}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-color)]">
                    <Link to={card.link} className={`flex items-center gap-1.5 ${card.textColor} font-[700] text-[13px] group-hover:gap-2.5 transition-all`}>
                      {card.linkText} <ArrowRight size={14} />
                    </Link>
                    <span className={`inline-block text-[11px] font-[600] px-3 py-1.5 rounded-full ${card.chipBg}`}>
                      {card.chip}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InitiativeCards;
