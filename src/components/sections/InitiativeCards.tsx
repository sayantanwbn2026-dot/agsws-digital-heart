import { motion } from "framer-motion";
import { Heart, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeader } from "../ui/SectionHeader";
import { StaggerContainer } from "../ui/StaggerContainer";
import ImagePlaceholder from "../ui/ImagePlaceholder";

const cards = [
  {
    icon: Heart,
    title: "Medical Aid & Hospital Support",
    desc: "Emergency medical care, hospital admissions, medicine support, and health camps for underprivileged families across Kolkata.",
    link: "/initiatives/medical",
    linkText: "Explore →",
    chip: "₹500 onwards",
    chipBg: "bg-[var(--teal-light)] text-[var(--teal)]",
    topBg: "bg-[var(--teal)]",
    hoverBorder: "group-hover:border-t-[var(--teal)]",
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
    linkText: "Sponsor a Child →",
    chip: "From ₹1,500",
    chipBg: "bg-[var(--purple-light)] text-[var(--purple)]",
    topBg: "bg-[var(--purple)]",
    hoverBorder: "group-hover:border-t-[var(--purple)]",
    imgCategory: "classroom" as const,
    featured: true,
  },
  {
    icon: Users,
    title: "Parent Medical Support",
    desc: "Register your elderly parents in Kolkata for emergency medical response. We become their local emergency contact.",
    link: "/register-parent",
    linkText: "Register Now →",
    chip: "₹100 Platform Fee",
    chipBg: "bg-[var(--yellow-light)] text-[var(--dark)]",
    topBg: "bg-gradient-to-r from-[var(--beige)] to-[var(--teal)]",
    hoverBorder: "group-hover:border-t-[var(--yellow)]",
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

        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
          {cards.map((card, i) => (
            <div key={card.title} className="will-change-transform h-full">
              <motion.div
                className={`group relative bg-white rounded-[var(--radius-2xl)] overflow-hidden border border-[var(--border-color)] shadow-[var(--shadow-card)] transition-colors flex flex-col h-full border-t-[3px] border-t-transparent ${card.hoverBorder}`}
                initial={card.featured ? { scale: 1.02 } : { scale: 1 }}
                whileHover={{ y: -8, scale: card.featured ? 1.04 : 1.02, boxShadow: "var(--shadow-lg)" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {card.featured && (
                  <div className="absolute top-4 right-4 z-10 bg-[var(--yellow)] text-[var(--dark)] text-[12px] font-bold px-3 py-1 rounded-[var(--radius-full)] -rotate-2">
                    Most Supported
                  </div>
                )}
                <div className={`relative h-[140px] lg:h-[180px] w-full ${card.topBg} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                  <ImagePlaceholder category={card.imgCategory} className="absolute inset-0 w-full h-full opacity-[0.35] object-cover mix-blend-overlay" />
                  {card.svgElement}
                  <card.icon size={44} className="text-white relative z-10" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-[var(--dark)] mb-3">{card.title}</h3>
                  <p className="text-[14px] text-[var(--mid)] mb-5 flex-1 leading-[1.6]">{card.desc}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <Link to={card.link} className="text-[var(--teal)] font-semibold text-[14px] hover:underline">
                      {card.linkText}
                    </Link>
                    <span className={`inline-block text-[12px] font-semibold px-3 py-1.5 rounded-[var(--radius-full)] ${card.chipBg}`}>
                      {card.chip}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default InitiativeCards;
