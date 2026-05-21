import { useSEO } from "@/hooks/useSEO";
import PageHero from "@/components/layout/PageHero";
import FadeInUp from "@/components/ui/FadeInUp";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
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
  name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AG";

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
    : staticTeam.map((m) => ({
        ...m,
        initials: m.initials || getInitials(m.name),
      }));

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

      <section className="bg-[var(--bg)] py-12 sm:py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-[var(--container-px)]">
          <FadeInUp>
            <div className="flex items-center justify-center gap-2 mb-8 sm:mb-12">
              <span className="w-8 h-[1px] bg-[var(--teal)]/30" />
              <span className="text-[10px] font-[700] uppercase tracking-[0.18em] text-[var(--teal)] flex items-center gap-1.5">
                <Sparkles size={11} /> Meet the team
              </span>
              <span className="w-8 h-[1px] bg-[var(--teal)]/30" />
            </div>
          </FadeInUp>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-7">
            {members.map((m, i) => (
              <FadeInUp key={`${m.name}-${i}`} delay={(i % 6) * 0.05}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  className="group flex flex-col bg-white rounded-[14px] sm:rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] overflow-hidden hover:shadow-[var(--shadow-lg)] transition-shadow duration-300 h-full"
                >
                  {/* Portrait Image Area */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--bg)]">
                    {m.image ? (
                      <img
                        src={m.image}
                        alt={m.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--teal-light)] via-white to-[var(--bg)]">
                        <span className="text-[32px] sm:text-[48px] font-[800] text-[var(--teal)]/20 tracking-tight select-none">
                          {m.initials}
                        </span>
                      </div>
                    )}
                    {/* Subtle top-edge glow on hover */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--teal)] via-[var(--teal-dark)] to-[var(--purple)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col p-3.5 sm:p-6 flex-1">
                    {/* Role Badge */}
                    <span className="self-start inline-flex items-center px-2 sm:px-2.5 py-[3px] sm:py-1 rounded-full text-[9px] sm:text-[10px] font-[700] uppercase tracking-[0.08em] sm:tracking-[0.1em] bg-[var(--teal-light)] text-[var(--teal)] mb-2 sm:mb-3 max-w-full truncate">
                      {m.role}
                    </span>

                    {/* Name */}
                    <h3 className="font-[800] text-[14px] sm:text-[18px] text-[var(--dark)] tracking-[-0.01em] leading-tight mb-1.5 sm:mb-2">
                      {m.name}
                    </h3>

                    {/* Divider */}
                    <div className="w-6 sm:w-8 h-[2px] bg-[var(--teal)]/20 rounded-full mb-2 sm:mb-3" />

                    {/* Bio — 2 lines max */}
                    <p className="text-[11.5px] sm:text-[13px] text-[var(--mid)] leading-[1.55] sm:leading-[1.65] line-clamp-2">
                      {m.bio}
                    </p>
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
