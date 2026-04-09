import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { team as staticTeam } from "@/data/team";
import { useCMSList } from "@/hooks/useCMSList";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Building2, Award, Globe, FileCheck, Heart, Target, Eye, ArrowRight, Quote } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { useRef } from "react";

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

const values = [
  { icon: Heart, title: "Compassion First", desc: "Every decision starts with empathy for those we serve." },
  { icon: Target, title: "Direct Impact", desc: "100% of donations reach beneficiaries. Zero overhead waste." },
  { icon: Eye, title: "Full Transparency", desc: "Real-time tracking, quarterly reports, and open financials." },
];

const About = () => {
  useSEO("About Us", "Learn about AGSWS — our mission, team, and journey of impact in Kolkata.");
  const parallaxRef = useRef(null);
  const { data: cmsTeam } = useCMSList<any>('cms_team', [], { orderBy: { column: 'sort_order' } });
  const team = cmsTeam.length ? cmsTeam.map((m: any) => ({
    name: m.name, role: m.role, bio: m.bio, initials: m.name?.split(' ').map((w: string) => w[0]).join('').slice(0, 2) ?? '', color: 'teal'
  })) : staticTeam;
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-40, 40]);

  return (
    <main id="main-content">
      <PageHero
        title="About Us"
        label="Our Story"
        subtitle="Learn about AGSWS — our mission, team, and journey of impact in Kolkata."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Mission + Values */}
      <section className="bg-card py-20 lg:py-28 overflow-hidden" ref={parallaxRef}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <FadeInUp>
              <motion.div style={{ y: parallaxY }}>
                <span className="text-[11px] font-[600] text-[var(--teal)] uppercase tracking-[0.1em] mb-4 block">Our Mission</span>
                <blockquote className="text-[clamp(20px,2.5vw,28px)] font-[300] text-[var(--teal)] leading-[1.5] italic relative pl-6">
                  <Quote size={24} className="text-[var(--teal)]/20 absolute -left-1 -top-2" />
                  "We believe every human being — regardless of economic status — deserves dignity, care, and opportunity."
                </blockquote>
              </motion.div>
            </FadeInUp>
            <FadeInUp delay={0.15}>
              <p className="text-[15px] text-[var(--mid)] leading-[1.8] mb-6">
                The Ascension Group Social Welfare Society was born from a simple observation: thousands of elderly parents in Kolkata live alone while their children work in cities across India and the world. When a medical emergency strikes, there's often no one to help.
              </p>
              <p className="text-[15px] text-[var(--mid)] leading-[1.8] mb-6">
                We built AGSWS to bridge that gap — not just for emergencies, but for the everyday dignity of healthcare and education that every family deserves.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] flex items-center justify-center text-white font-[700] text-[16px]">R</div>
                <div>
                  <p className="font-[700] text-[var(--dark)] text-[15px]">Rajesh Kumar Sharma</p>
                  <p className="text-[12px] text-[var(--light)]">Founder & President, AGSWS</p>
                </div>
              </div>
            </FadeInUp>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <FadeInUp key={v.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "var(--shadow-lg)" }}
                  className="bg-white rounded-[20px] border border-[var(--border-color)] p-8 shadow-[var(--shadow-card)] transition-shadow"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] flex items-center justify-center mb-5 shadow-[0_8px_20px_rgba(31,154,168,0.2)]">
                    <v.icon size={24} className="text-white" />
                  </div>
                  <h4 className="text-[18px] font-[700] text-[var(--dark)] mb-2">{v.title}</h4>
                  <p className="text-[14px] text-[var(--mid)] leading-[1.7]">{v.desc}</p>
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Counter Band */}
      <section className="bg-gradient-to-r from-[var(--teal-dark)] to-[var(--teal)] py-16">
        <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "5+", label: "Years Active" },
            { value: "2,400+", label: "Patients Aided" },
            { value: "850+", label: "Students Supported" },
            { value: "120+", label: "Families Registered" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <p className="text-[clamp(28px,4vw,40px)] font-[800] text-white leading-none">{s.value}</p>
              <p className="text-[11px] font-[500] text-white/60 uppercase tracking-[0.08em] mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[var(--bg)] py-20 lg:py-28">
        <div className="max-w-[800px] mx-auto px-6">
          <SectionHeader label="Our Journey" title="Milestones of Impact" />
          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] border-l-2 border-dashed border-[var(--teal)]/30" />
            {timeline.map((item, i) => (
              <TimelineItem key={item.year} item={item} index={i} isLeft={i % 2 === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-card py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader label="Our Team" title="The People Behind AGSWS" />
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <motion.div
                key={member.name}
                className="bg-white rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] text-center p-8 group relative overflow-hidden"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--teal)] to-[var(--teal-dark)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-[90px] h-[90px] rounded-full overflow-hidden mx-auto mb-5 border-4 border-white shadow-md relative">
                  <ImagePlaceholder category="community" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h4 className="font-[700] text-[17px] text-[var(--dark)] mb-1">{member.name}</h4>
                <p className="text-[10px] uppercase tracking-[0.1em] font-[700] text-[var(--teal)] mb-3">{member.role}</p>
                <p className="text-[13px] text-[var(--mid)] leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Legal */}
      <section className="bg-[var(--bg)] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <SectionHeader label="Legal & Compliance" title="Transparency Documents" />
          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {docs.map((doc) => (
              <motion.div
                key={doc.title}
                whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }}
                className="bg-white rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6 transition-shadow"
              >
                <doc.icon size={28} className="text-[var(--teal)] mb-4" />
                <h4 className="font-[700] text-[var(--dark)] mb-1 text-[15px]">{doc.title}</h4>
                <p className="text-[13px] font-[600] text-[var(--dark)]">{doc.detail}</p>
                <p className="text-[11px] text-[var(--light)] mt-1">{doc.sub}</p>
                <button className="mt-4 text-[12px] font-[600] text-[var(--teal)] border border-[var(--teal)]/30 px-4 py-1.5 rounded-full hover:bg-[var(--teal-light)] transition-colors">
                  View Document
                </button>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-[#0D1B1C] via-[var(--teal-dark)] to-[#0F1F20] py-20">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-[28px] lg:text-[36px] font-[800] text-white tracking-[-0.02em] mb-4">Join Our Mission</h2>
            <p className="text-[15px] text-white/70 leading-relaxed mb-8">Whether you volunteer, donate, or spread awareness — you can make a difference.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/contact" className="px-8 py-4 bg-[var(--yellow)] text-[var(--dark)] font-[700] text-[14px] rounded-full hover:shadow-[var(--shadow-yellow)] transition-all flex items-center justify-center gap-2">
                Get In Touch <ArrowRight size={16} />
              </a>
              <a href="/volunteer-portal" className="px-8 py-4 border border-white/20 text-white font-[600] text-[14px] rounded-full hover:bg-white/[0.06] transition-all text-center">
                Volunteer Portal
              </a>
            </div>
          </motion.div>
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
        <span className="font-[700] text-[13px] text-white">{item.year}</span>
      </div>
      <div className={`ml-20 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-20 md:text-right" : "md:pl-20 md:text-left"}`}>
        <motion.div
          whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }}
          className="bg-white shadow-[var(--shadow-card)] rounded-[16px] border border-[var(--border-color)] p-7 border-t-[3px] border-t-[var(--teal)] transition-all duration-300"
        >
          <p className="text-[14px] leading-relaxed text-[var(--mid)] font-[500]">{item.event}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default About;
