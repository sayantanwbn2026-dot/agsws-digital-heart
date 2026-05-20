import { useSEO } from "@/hooks/useSEO";
import PageHero from "@/components/layout/PageHero";
import FadeInUp from "@/components/ui/FadeInUp";
import { motion } from "framer-motion";
import { useCMSList } from "@/hooks/useCMSList";
import { team as staticTeam } from "@/data/team";
import { Users, Sparkles } from "lucide-react";

type Member = {
  name: string;
  role: string;
  bio: string;
  image?: string;
  initials?: string;
};

const getInitials = (name: string) =>
  name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "AG";

const Members = () => {
  useSEO(
    "Members",
    "Meet the people behind AGSWS — the team driving our medical, education, and GoldenAge Care work in Kolkata."
  );

  const { data: cmsTeam } = useCMSList<any>("cms_team", [], {
    orderBy: { column: "sort_order", ascending: true },
  });

  const members: Member[] = cmsTeam.length
    ? cmsTeam.map((m: any) => ({
        name: m.name,
        role: m.role,
        bio: m.bio,
        image: m.image || m.photo || undefined,
        initials: getInitials(m.name || ""),
      }))
    : staticTeam.map((m) => ({ ...m, initials: m.initials || getInitials(m.name) }));

  return (
    <main id="main-content">
      <PageHero
        title="Members"
        label="The Team"
        subtitle="The people behind the AGSWS journey — driving every initiative with care, craft, and conviction."
        size="md"
        bgVariant="teal-dark"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Members" }]}
      />

      <section className="bg-[var(--bg)] py-16 lg:py-24">
        <div className="max-w-[1100px] mx-auto px-[var(--container-px)]">
          <FadeInUp>
            <div className="flex items-center justify-center gap-2 mb-10">
              <span className="w-8 h-[1px] bg-[var(--teal)]/30" />
              <span className="text-[10px] font-[700] uppercase tracking-[0.18em] text-[var(--teal)] flex items-center gap-1.5">
                <Sparkles size={11} /> Meet the team
              </span>
              <span className="w-8 h-[1px] bg-[var(--teal)]/30" />
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
            {members.map((m, i) => (
              <FadeInUp key={`${m.name}-${i}`} delay={(i % 6) * 0.05}>
                <motion.article
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  className="group relative bg-white rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-lg)] transition-shadow duration-300"
                >
                  <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[var(--teal)] via-[var(--teal-dark)] to-[var(--purple)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex gap-5 sm:gap-6 p-5 sm:p-6">
                    <div className="flex-shrink-0">
                      <div className="relative w-[112px] h-[140px] sm:w-[128px] sm:h-[160px] rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--teal-light)] via-white to-[var(--bg)] border border-[var(--border-color)]">
                        {m.image ? (
                          <img
                            src={m.image}
                            alt={m.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-[34px] font-[800] text-[var(--teal)] tracking-tight">
                              {m.initials}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/[0.04] rounded-2xl pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col">
                      <h3 className="font-[800] text-[18px] sm:text-[19px] text-[var(--dark)] tracking-[-0.01em] leading-tight">
                        {m.name}
                      </h3>
                      <p className="mt-1 text-[10.5px] font-[700] uppercase tracking-[0.12em] text-[var(--teal)]">
                        {m.role}
                      </p>
                      <div className="mt-3 h-[2px] w-10 bg-[var(--teal)]/20 rounded-full" />
                      <p className="mt-3 text-[13.5px] text-[var(--mid)] leading-[1.7] line-clamp-5">
                        {m.bio}
                      </p>
                    </div>
                  </div>
                </motion.article>
              </FadeInUp>
            ))}
          </div>

          {members.length === 0 && (
            <div className="text-center py-20 text-[var(--mid)]">
              <Users size={36} className="text-[var(--border-color)] mx-auto mb-3" />
              <p className="text-sm">Team members will appear here soon.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Members;