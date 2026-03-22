import { useSEO } from "@/hooks/useSEO";
import FadeInUp from "@/components/ui/FadeInUp";
import { team } from "@/data/team";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FileCheck, Building2, Award, Globe } from "lucide-react";
import PageHero from "@/components/layout/PageHero";

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
        <div className="max-w-[1100px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <FadeInUp>
            <div className="flex">
              <div className="w-1 bg-teal rounded-full mr-6 flex-shrink-0" />
              <blockquote className="text-[28px] font-light text-teal leading-[1.5] italic">
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

      {/* Timeline */}
      <section className="bg-background py-24">
        <div className="max-w-[800px] mx-auto px-6">
          <FadeInUp className="text-center mb-16">
            <span className="label-text text-teal">Our Journey</span>
            <h2 className="heading-2 text-text-dark mt-3 before:hidden text-center">Milestones of Impact</h2>
          </FadeInUp>
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

      {/* Team */}
      <section className="bg-card py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeInUp className="text-center mb-16">
            <span className="label-text text-teal">Our Team</span>
            <h2 className="heading-2 text-text-dark mt-3 before:hidden text-center">The People Behind AGSWS</h2>
          </FadeInUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <FadeInUp key={member.name} delay={i * 0.1}>
                <motion.div
                  className="bg-card border border-border rounded-xl p-6 text-center shadow-brand-sm hover:shadow-brand-md transition-all duration-300"
                  whileHover={{ y: -6 }}
                >
                  <div className={`w-20 h-20 rounded-full ${colorMap[member.color] || "bg-teal"} flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-primary-foreground font-bold text-lg">{member.initials}</span>
                  </div>
                  <h4 className="heading-4 text-text-dark mb-1">{member.name}</h4>
                  <p className="label-text text-teal mb-3">{member.role}</p>
                  <p className="body-small text-text-mid">{member.bio}</p>
                </motion.div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>

      {/* Legal */}
      <section className="bg-background py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <FadeInUp className="text-center mb-16">
            <span className="label-text text-teal">Legal & Compliance</span>
            <h2 className="heading-2 text-text-dark mt-3 before:hidden text-center">Transparency Documents</h2>
          </FadeInUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {docs.map((doc, i) => (
              <FadeInUp key={doc.title} delay={i * 0.1}>
                <div className="bg-card border border-border rounded-lg p-6">
                  <doc.icon size={28} className="text-teal mb-4" />
                  <h4 className="font-semibold text-text-dark mb-1">{doc.title}</h4>
                  <p className="text-sm font-medium text-text-dark">{doc.detail}</p>
                  <p className="text-xs text-text-light mt-1">{doc.sub}</p>
                  <button className="mt-4 text-xs font-semibold text-yellow border border-yellow/40 px-4 py-1.5 rounded-full hover:bg-yellow/10 transition-colors">
                    View Document
                  </button>
                </div>
              </FadeInUp>
            ))}
          </div>
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
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative flex items-center mb-12 ${isLeft ? "md:flex-row-reverse" : ""}`}
    >
      <div className="hidden md:block w-1/2" />
      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 bg-teal rounded-full flex items-center justify-center z-10">
        <span className="text-primary-foreground font-bold text-sm">{item.year}</span>
      </div>
      <div className={`ml-20 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
        <div className="bg-card border border-border border-t-[3px] border-t-teal rounded-lg p-5 shadow-brand-md">
          <p className="body-small text-text-mid">{item.event}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
