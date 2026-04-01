import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { team } from "@/data/team";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Building2, Award, Globe, FileCheck } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

const timeline = [
  { year: "2020", event: "AGSWS founded in Kolkata with a team of 4 volunteers." },
  { year: "2021", event: "Launched Medical Aid program — 200 patients supported in Year 1." },
  { year: "2022", event: "Education Support launched — first community library opened." },
  { year: "2023", event: "Parent Registration program introduced for NRKs." },
  { year: "2024", event: "Crossed 2,400 patients and 850 children supported." },
  { year: "2025", event: "Expanded to 6 partner hospitals and 12 school partnerships." },
];

const docs = [
  { icon: FileCheck, title: "80G Certificate", detail: "Valid: 2024–2027", sub: "Tax exemption under Section 80G" },
  { icon: Building2, title: "NGO Registration", detail: "Reg. No: WB/SOC/2020/1234", sub: "Societies Registration Act" },
  { icon: Award, title: "12A Certificate", detail: "Income tax exemption", sub: "Under Section 12A" },
  { icon: Globe, title: "FCRA Status", detail: "Application Pending", sub: "Foreign contribution regulation" },
];

const colorMap: Record<string, string> = { teal: "bg-teal", purple: "bg-purple", yellow: "bg-yellow", beige: "bg-beige" };

const About = () => {
  useSEO("About Us", "Learn about AGSWS — our mission, team, and journey of impact in Kolkata.");

  return (
    <main id="main-content">
      <PageHero
        title="About Us"
        label="Our Story"
        subtitle="Learn about AGSWS — our mission, team, and journey of impact in Kolkata."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Mission */}
      <section className="bg-card py-24">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2  gap-5 lg:gap-8">
          <FadeInUp>
            <div className="flex justify-center w-full">
              <blockquote className="text-[clamp(20px,2.5vw,28px)] font-[300] text-[var(--teal)] leading-[1.5] italic border-l-[4px] border-l-[var(--teal)] pl-[24px] max-w-[700px]">
                "We believe every human being — regardless of economic status — deserves dignity, care, and opportunity."
              </blockquote>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.15}>
            <p className="body-text text-text-mid mb-6">
              The Ascension Group Social Welfare Society was born from a simple observation: thousands of elderly parents in Kolkata live alone while their children work in cities across India and the world. When a medical emergency strikes, there's often no one to help.
            </p>
            <p className="body-text text-text-mid mb-6">
              We built AGSWS to bridge that gap — not just for emergencies, but for the everyday dignity of healthcare and education that every family deserves.
            </p>
            <p className="font-semibold text-text-dark">Rajesh Kumar Sharma</p>
            <p className="text-sm text-text-light">Founder & President, AGSWS</p>
          </FadeInUp>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="max-w-[800px] mx-auto px-6">
          <SectionHeader label="Our Journey" title="Milestones of Impact" />
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] border-l-2 border-dashed border-teal/30" />
            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <TimelineItem key={item.year} item={item} index={i} isLeft={isLeft} />
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-card py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader label="Our Team" title="The People Behind AGSWS" />
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-[24px]">
            {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  className="bg-white rounded-[var(--radius-xl)] border border-[var(--border-color)] shadow-[var(--shadow-card)] text-center p-[32px_24px] group"
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className={`w-[100px] h-[100px] rounded-full overflow-hidden mx-auto mb-6 border-4 border-white shadow-md relative`}>
                    <ImagePlaceholder category="community" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    <div className={`absolute inset-0 flex items-center justify-center text-white/90 font-bold text-2xl ${colorMap[member.color] || "bg-[var(--teal)]"} opacity-0 group-hover:opacity-10 transition-opacity`}>
                      {member.initials}
                    </div>
                  </div>
                  <h4 className="font-['Inter'] font-[700] text-[18px] text-[var(--dark)] mb-1">{member.name}</h4>
                  <p className="text-[11px] uppercase tracking-[0.1em] font-bold text-[var(--teal)] mb-4">{member.role}</p>
                  <p className="text-[14px] text-[var(--mid)] leading-relaxed">{member.bio}</p>
                </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader label="Legal & Compliance" title="Transparency Documents" />
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-3 lg:gap-5">
            {docs.map((doc, i) => (
                <div key={doc.title} className="global-card">
                  <doc.icon size={28} className="text-teal mb-4" />
                  <h4 className="font-semibold text-text-dark mb-1">{doc.title}</h4>
                  <p className="text-sm font-medium text-text-dark">{doc.detail}</p>
                  <p className="text-xs text-text-light mt-1">{doc.sub}</p>
                  <button className="mt-4 text-xs font-semibold text-yellow border border-yellow/40 px-4 py-1.5 rounded-full hover:bg-yellow/10 transition-colors">
                    View Document
                  </button>
                </div>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </main>
  );
};

const TimelineItem = ({ item, index, isLeft }: { item: { year: string; event: string }; index: number; isLeft: boolean }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={`relative flex items-center mb-16 last:mb-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      <div className="hidden md:block w-1/2" />
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-[56px] h-[56px] bg-[var(--teal)] rounded-full flex items-center justify-center z-10 border-4 border-white shadow-lg">
        <span className="font-['Inter'] font-[700] text-[13px] text-white">{item.year}</span>
      </div>
      <div className={`ml-20 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-20 md:text-right" : "md:pl-20 md:text-left"}`}>
        <div className="bg-white shadow-[var(--shadow-card)] rounded-[var(--radius-xl)] border border-[var(--border-color)] p-8 border-t-[4px] border-t-[var(--teal)] hover:shadow-brand-lg transition-all duration-300">
          <p className="text-[15px] leading-relaxed text-[var(--mid)] font-medium">{item.event}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
