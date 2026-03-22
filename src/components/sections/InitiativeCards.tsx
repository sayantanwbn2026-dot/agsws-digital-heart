import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, BookOpen, Users } from "lucide-react";
import { Link } from "react-router-dom";
import FadeInUp from "../ui/FadeInUp";
import ImagePlaceholder from "../ui/ImagePlaceholder";
import { useRef } from "react";

const cards = [
  {
    icon: Heart,
    title: "Medical Aid & Hospital Support",
    desc: "Emergency medical care, hospital admissions, medicine support, and health camps for underprivileged families across Kolkata.",
    link: "/initiatives/medical",
    linkText: "Explore →",
    chip: "₹500 onwards",
    chipBg: "bg-teal-light text-teal",
    topBg: "bg-teal",
    hoverBorder: "group-hover:border-t-teal",
    imgCategory: "hospital" as const,
    svgElement: (
      <svg className="absolute inset-0 w-full h-full opacity-[0.15]" viewBox="0 0 180 180">
        <line x1="90" y1="40" x2="90" y2="140" stroke="white" strokeWidth="12" strokeLinecap="round" />
        <line x1="40" y1="90" x2="140" y2="90" stroke="white" strokeWidth="12" strokeLinecap="round" />
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
    chipBg: "bg-purple-light text-purple",
    topBg: "bg-purple",
    hoverBorder: "group-hover:border-t-purple",
    imgCategory: "classroom" as const,
    featured: true,
  },
  {
    icon: Users,
    title: "Parent Medical Support Registration",
    desc: "Register your elderly parents in Kolkata for emergency medical response. We become their local emergency contact.",
    link: "/register-parent",
    linkText: "Register Now →",
    chip: "₹100 Platform Fee",
    chipBg: "bg-yellow-light text-text-dark",
    topBg: "bg-gradient-to-r from-beige to-teal",
    hoverBorder: "group-hover:border-t-yellow",
    imgCategory: "elderly" as const,
  },
];

const parallaxStarts = [40, 60, 40];
const parallaxEnds = [-20, -30, -20];

const InitiativeCards = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  return (
    <section ref={sectionRef} className="bg-teal-light/50 py-24 relative overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">
        <FadeInUp className="text-center max-w-[640px] mx-auto mb-16">
          <motion.span
            className="label-text text-teal block"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileInView={{ clipPath: "inset(0 0% 0 0)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            What We Do
          </motion.span>
          <h2 className="heading-2 text-text-dark mt-3 before:hidden text-center">Three Ways We Create Impact</h2>
          <p className="body-text text-text-mid mt-4">
            Every initiative is designed for direct, measurable impact on real lives in Kolkata.
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => {
            const y = useTransform(scrollYProgress, [0, 1], [parallaxStarts[i], parallaxEnds[i]]);
            return (
              <motion.div key={card.title} style={{ y }} className="will-change-transform">
                <FadeInUp delay={i * 0.15}>
                  <motion.div
                    className={`group relative bg-card rounded-xl border border-border shadow-brand-md overflow-hidden transition-all duration-300 border-t-2 border-t-transparent ${card.hoverBorder}`}
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    {card.featured && (
                      <div className="absolute top-4 right-4 z-10 bg-yellow text-text-dark text-xs font-bold px-3 py-1 rounded-full -rotate-2">
                        Most Supported
                      </div>
                    )}
                    <div className={`relative h-[180px] ${card.topBg} flex items-center justify-center overflow-hidden`}>
                      <ImagePlaceholder category={card.imgCategory} className="absolute inset-0 w-full h-full opacity-40" />
                      {card.svgElement}
                      <card.icon size={40} className="text-primary-foreground relative z-10" />
                    </div>
                    <div className="p-6">
                      <h3 className="heading-4 text-text-dark mb-3">{card.title}</h3>
                      <p className="body-small text-text-mid mb-4">{card.desc}</p>
                      <Link to={card.link} className="text-teal font-semibold text-sm hover:underline">
                        {card.linkText}
                      </Link>
                      <div className="mt-4">
                        <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full ${card.chipBg}`}>
                          {card.chip}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </FadeInUp>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InitiativeCards;
