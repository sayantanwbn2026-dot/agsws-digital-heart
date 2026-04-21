import { useSEO } from "@/hooks/useSEO";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FadeInUp from "@/components/ui/FadeInUp";
import PageHero from "@/components/layout/PageHero";
import { supabase } from "@/lib/supabase/client";
import { Heart, BookOpen, Users, TrendingUp } from "lucide-react";

function getTier(amount: number) {
  if (amount >= 10000) return { label: "Champion", cls: "bg-[var(--yellow)]/10 text-[var(--yellow)] border border-[var(--yellow)]/20" };
  if (amount >= 5000) return { label: "Gold", cls: "bg-[var(--teal)]/10 text-[var(--teal)] border border-[var(--teal)]/20" };
  if (amount >= 1000) return { label: "Silver", cls: "bg-[var(--purple)]/10 text-[var(--purple)] border border-[var(--purple)]/20" };
  return { label: "Supporter", cls: "bg-[var(--bg)] text-[var(--light)] border border-[var(--border-color)]" };
}

function getGatewayInfo(gateway: string) {
  const g = (gateway ?? "").toLowerCase();
  if (g.includes("education")) return { icon: BookOpen, color: "var(--purple)", bg: "bg-[var(--purple)]" };
  if (g.includes("registration")) return { icon: Users, color: "var(--beige)", bg: "bg-[var(--beige)]" };
  return { icon: Heart, color: "var(--teal)", bg: "bg-[var(--teal)]" };
}

const filters = ["All", "Medical Aid", "Education", "Registration"];

const summaryStats = [
  { icon: Users, label: "Total Donors", value: "2,847", color: "var(--teal)" },
  { icon: TrendingUp, label: "This Month", value: "124", color: "var(--yellow)" },
  { icon: Heart, label: "Cities", value: "42", color: "var(--purple)" },
];

const DonorWall = () => {
  useSEO("Donor Wall", "Our wall of donors — every name represents a real act of kindness.");
  const [entries, setEntries] = useState<any[]>([]);
  const [gateway, setGateway] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWall = async (gw: string | null = null) => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("data-api/donor-wall", {
        method: "GET" as any,
        body: undefined,
        headers: gw ? { "x-gateway": gw } : undefined,
      } as any);
      // Fallback to direct fetch for query-string params (functions.invoke doesn't pass them cleanly)
      const params = new URLSearchParams({ limit: "50" });
      if (gw) params.set("gateway", gw);
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/data-api/donor-wall?${params}`;
      const res = await fetch(url, {
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      const json = await res.json();
      if (Array.isArray(json)) setEntries(json);
      else if (Array.isArray(data)) setEntries(data);
    } catch (e) {
      console.error("[donor-wall]", e);
    }
    setLoading(false);
  };

  useEffect(() => { loadWall(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel("donor-wall-live")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "medical_donations",
        filter: "show_on_wall=eq.true",
      }, payload => {
        if (payload.new.status !== "captured") return;
        setEntries(prev => [{
          donor_first_name: (payload.new.donor_name ?? "").split(" ")[0],
          name: (payload.new.donor_name ?? "").split(" ")[0],
          city: "India",
          gateway: "medical",
          amount: payload.new.amount,
          time: "Just now",
          created_at: payload.new.created_at,
        }, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = gateway
    ? entries.filter(d => (d.gateway ?? "").toLowerCase().includes(gateway.toLowerCase().split(" ")[0]))
    : entries;

  return (
    <main id="main-content">
      <PageHero title="Our Donor Wall" label="Community" subtitle="Every name here represents a real act of kindness." size="md" bgVariant="teal-dark" breadcrumb={[{ label: "Home", href: "/" }, { label: "Donor Wall" }]} />

      <section className="bg-[var(--bg)] py-[64px] lg:py-[96px]">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)]">
          
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {summaryStats.map((s, i) => (
              <FadeInUp key={s.label} delay={i * 0.08}>
                <div className="bg-white rounded-[var(--radius-xl)] border border-[var(--border-color)] p-5 text-center shadow-[var(--shadow-card)]">
                  <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, ${s.color} 10%, white)` }}>
                    <s.icon size={18} style={{ color: s.color }} />
                  </div>
                  <p className="text-[clamp(22px,3vw,28px)] font-[800] text-[var(--dark)] leading-none">{s.value}</p>
                  <p className="text-[11px] font-[500] text-[var(--light)] uppercase tracking-[0.06em] mt-1">{s.label}</p>
                </div>
              </FadeInUp>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {filters.map(f => {
              const isActive = (gateway === null && f === "All") || gateway === f;
              return (
                <button
                  key={f}
                  onClick={() => { const gw = f === "All" ? null : f; setGateway(gw); loadWall(gw); }}
                  className={`px-5 py-2 rounded-full text-[13px] font-[600] border transition-all duration-200 ${isActive ? "bg-[var(--teal)] text-white border-[var(--teal)]" : "bg-white text-[var(--mid)] border-[var(--border-color)] hover:border-[var(--teal)] hover:text-[var(--teal)]"}`}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Donor grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((d, i) => {
              const tier = getTier(d.amount);
              const gw = getGatewayInfo(d.gateway);
              const displayName = d.name || d.donor_first_name || "Anonymous";
              return (
                <motion.div
                  key={`${displayName}-${d.city}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  className="bg-white rounded-[var(--radius-xl)] border border-[var(--border-color)] p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-md)] transition-shadow relative group"
                >
                  <span className={`absolute top-4 right-4 text-[10px] font-[600] px-2.5 py-0.5 rounded-full ${tier.cls}`}>{tier.label}</span>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${gw.bg} flex items-center justify-center text-white font-[700] text-[13px] flex-shrink-0`}>
                      {displayName[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-[600] text-[14px] text-[var(--dark)] truncate">{displayName} from {d.city}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ backgroundColor: gw.color }} />
                        <span className="text-[12px] text-[var(--light)]">{d.gateway}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--light)] mt-3">{d.time}</p>
                </motion.div>
              );
            })}
          </div>

          <FadeInUp className="text-center mt-14">
            <p className="text-[14px] text-[var(--mid)]">Join <strong className="text-[var(--teal)] font-[700]">2,847</strong> donors on this wall</p>
          </FadeInUp>
        </div>
      </section>
    </main>
  );
};

export default DonorWall;
