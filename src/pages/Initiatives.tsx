import { useSEO } from "@/hooks/useSEO";
import { Heart, BookOpen, Users, ArrowRight, Shield, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo } from "react";
import PageHero from "@/components/layout/PageHero";
import { useDonateOverlay } from "@/contexts/DonateOverlayContext";
import { useCMSList } from "@/hooks/useCMSList";

const iconMap: Record<string, any> = { Heart, BookOpen, Users };
const defaultInitiatives = [
  {
    icon: Heart, title: "Medical Aid & Hospital Support",
    desc: "We provide emergency medical care, hospital admissions, surgery support, medicine funding, and health camps for families who cannot afford treatment. Our network of 6 partner hospitals ensures rapid access to quality care.",
    features: ["Emergency hospital admissions", "Medicine & treatment funding", "Free health camps", "Post-operative care support"],
    stats: [{ value: "2,400+", label: "Patients" }, { value: "6", label: "Hospitals" }, { value: "₹18L+", label: "Disbursed" }],
    link: "/donate/medical", detailLink: "/initiatives/medical", linkText: "Donate to Medical Aid",
    gradient: "from-[var(--teal)] to-[var(--teal-dark)]", lightBg: "bg-[var(--teal-light)]", textColor: "text-[var(--teal)]",
  },
  {
    icon: BookOpen, title: "Education Support",
    desc: "From scholarships to community libraries, we ensure children from low-income families have access to quality education.",
    features: ["Full & partial scholarships", "Community libraries", "After-school tutoring", "Digital literacy programs"],
    stats: [{ value: "850+", label: "Students" }, { value: "3", label: "Libraries" }, { value: "₹12L+", label: "Sponsored" }],
    link: "/donate/education", detailLink: "/initiatives/education", linkText: "Sponsor Education",
    gradient: "from-[var(--purple)] to-[#4A48A0]", lightBg: "bg-[var(--purple-light)]", textColor: "text-[var(--purple)]",
  },
  {
    icon: Users, title: "Parent Medical Support Registration",
    desc: "Designed for NRKs whose elderly parents live alone in Kolkata. Register your parent, and we become their local emergency contact.",
    features: ["24/7 emergency helpline", "Hospital admission coordination", "Regular wellness check-ins", "Real-time family updates"],
    stats: [{ value: "120+", label: "Families" }, { value: "24/7", label: "Helpline" }, { value: "2hr", label: "Response" }],
    link: "/register-parent", detailLink: "/register-parent", linkText: "Register a Parent",
    gradient: "from-[var(--beige)] to-[var(--teal)]", lightBg: "bg-[var(--yellow-light)]", textColor: "text-[var(--beige)]",
  },
];

const gradients = [
  "from-[var(--teal)] to-[var(--teal-dark)]",
  "from-[var(--purple)] to-[#4A48A0]",
  "from-[var(--beige)] to-[var(--teal)]",
];

const Initiatives = () => {
  useSEO("Initiatives", "Explore AGSWS initiatives: Medical Aid, Education Support, and Parent Registration.");
  const { openOverlay } = useDonateOverlay();
  const { data: cmsInitiatives } = useCMSList<any>('cms_initiatives', [], { orderBy: { column: 'sort_order', ascending: true } });

  const initiatives = useMemo(() => {
    if (cmsInitiatives.length > 0) {
      return cmsInitiatives.map((item: any, i: number) => ({
        ...defaultInitiatives[i] || defaultInitiatives[0],
        title: item.title,
        desc: item.description,
        icon: iconMap[item.icon] || Heart,
        link: item.link || defaultInitiatives[i]?.link || '/donate/medical',
        detailLink: item.link || defaultInitiatives[i]?.detailLink || '/initiatives/medical',
        gradient: gradients[i % gradients.length],
      }));
    }
    return defaultInitiatives;
  }, [cmsInitiatives]);

  return (
    <main id="main-content">
      <PageHero title="Our Initiatives" label="What We Do" subtitle="Every initiative is designed for direct, measurable impact on real lives across Kolkata." size="md" bgVariant="teal-dark" />
      <section className="bg-[var(--bg)] py-16 lg:py-24">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] space-y-8">
          {initiatives.map((item: any, i: number) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6, delay: i * 0.1 }}>
              <div className="group relative bg-white rounded-[24px] border border-[var(--border-color)] shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-lg)] transition-shadow duration-400">
                <div className={`h-1 bg-gradient-to-r ${item.gradient}`} />
                <div className="p-8 lg:p-10">
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <div className="flex-shrink-0 flex flex-col items-center lg:items-start gap-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.12)]`}>
                        <item.icon size={28} className="text-white" />
                      </div>
                      <div className="flex lg:flex-col gap-4 lg:gap-3">
                        {(item.stats || []).map((s: any) => (
                          <div key={s.label} className="text-center lg:text-left">
                            <p className="text-[20px] font-[800] text-[var(--dark)] leading-none tracking-tight">{s.value}</p>
                            <p className="text-[10px] font-[500] text-[var(--light)] uppercase tracking-[0.06em] mt-0.5">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[22px] lg:text-[26px] font-[800] text-[var(--dark)] tracking-[-0.02em] mb-3">{item.title}</h3>
                      <p className="text-[14px] lg:text-[15px] text-[var(--mid)] leading-[1.75] mb-6 max-w-[600px]">{item.desc}</p>
                      {item.features && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                          {item.features.map((f: string) => (
                            <span key={f} className={`flex items-center gap-2.5 text-[13px] font-[500] ${item.textColor}`}>
                              <span className={`w-5 h-5 rounded-md ${item.lightBg} flex items-center justify-center flex-shrink-0`}><ArrowRight size={10} className={item.textColor} /></span>
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3">
                        <Link to={item.link} className={`inline-flex items-center gap-2 bg-gradient-to-r ${item.gradient} text-white font-[700] text-[13px] px-6 py-3 rounded-full hover:shadow-lg transition-shadow`}>{item.linkText} <ArrowRight size={14} /></Link>
                        <Link to={item.detailLink} className="inline-flex items-center gap-2 text-[13px] font-[600] text-[var(--mid)] hover:text-[var(--teal)] transition-colors px-4 py-3">Learn More →</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="bg-gradient-to-br from-[#0D1B1C] via-[var(--teal-dark)] to-[#0F1F20] py-20">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Sparkles size={28} className="text-[var(--yellow)] mx-auto mb-4" />
            <h2 className="text-[28px] lg:text-[36px] font-[800] text-white tracking-[-0.02em] mb-4">Ready to Make a Difference?</h2>
            <p className="text-[15px] text-white/70 leading-relaxed mb-8">Every rupee counts. Choose a cause that speaks to you and create lasting impact.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={openOverlay} className="px-8 py-4 bg-[var(--yellow)] text-[var(--dark)] font-[700] text-[14px] rounded-full hover:shadow-[var(--shadow-yellow)] hover:scale-[1.03] active:scale-[0.97] transition-all">Donate Now →</button>
              <Link to="/volunteer-portal" className="px-8 py-4 border border-white/20 text-white font-[600] text-[14px] rounded-full hover:bg-white/[0.06] transition-all text-center">Volunteer With Us</Link>
            </div>
            <div className="flex justify-center gap-5 mt-8">
              {["80G Tax Benefit", "100% Transparent", "Registered NGO"].map(text => (
                <span key={text} className="flex items-center gap-1.5 text-[11px] text-white/50 font-[500]"><Shield size={12} className="text-[var(--yellow)]" />{text}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Initiatives;
