import { useSEO } from "@/hooks/useSEO";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FadeInUp from "@/components/ui/FadeInUp";
import { supabase } from "@/lib/supabase/client";

function getTier(amount: number) {
  if (amount >= 10000) return { label: "Champion", cls: "bg-purple-light text-purple" };
  if (amount >= 5000) return { label: "Gold", cls: "bg-yellow-light text-yellow" };
  if (amount >= 1000) return { label: "Silver", cls: "bg-background text-text-mid" };
  return { label: "Supporter", cls: "bg-teal-light text-teal" };
}

function getColor(gateway: string) {
  if (gateway === "Education" || gateway === "education") return "bg-purple";
  if (gateway === "Registration" || gateway === "registration") return "bg-beige";
  return "bg-teal";
}

const filters = ["All", "Medical Aid", "Education", "Registration"];

const DonorWall = () => {
  useSEO("Donor Wall", "Our wall of donors — every name represents a real act of kindness.");
  const [entries, setEntries] = useState<any[]>([]);
  const [gateway, setGateway] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWall = async (gw: string | null = null) => {
    setLoading(true);
    const url = gw ? `/api/donor-wall?gateway=${encodeURIComponent(gw)}&limit=50` : "/api/donor-wall?limit=50";
    try {
      const data = await fetch(url).then(r => r.json());
      if (Array.isArray(data)) setEntries(data);
    } catch { /* keep existing entries */ }
    setLoading(false);
  };

  useEffect(() => { loadWall(); }, []);

  // Realtime: new medical donors appear instantly
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
          city: "India",
          gateway: "medical",
          amount: payload.new.amount,
          amount_tier: payload.new.amount >= 10000 ? "champion"
            : payload.new.amount >= 5000 ? "gold"
            : payload.new.amount >= 1000 ? "silver" : "supporter",
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
      <section className="h-[250px] bg-gradient-to-br from-teal-dark via-teal to-teal flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/30" />
        <div className="relative z-10 text-center">
          <h1 className="heading-1 text-primary-foreground">Our Donor Wall</h1>
          <p className="text-sm text-primary-foreground/60 mt-3">Every name here represents a real act of kindness</p>
        </div>
      </section>

      <section className="bg-background py-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-6 mb-8 flex-wrap">
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Total Donors", value: "2,847" },
                { label: "This Month", value: "124" },
                { label: "Cities", value: "42" },
              ].map(s => (
                <div key={s.label} className="global-card">
                  <p className="text-xl font-bold text-teal">{s.value}</p>
                  <p className="text-xs text-text-light">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mb-8 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => { const gw = f === "All" ? null : f; setGateway(gw); loadWall(gw); }} className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${(gateway === null && f === "All") || gateway === f ? "bg-teal text-primary-foreground border-teal" : "bg-card text-text-mid border-border hover:border-teal"}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-3 md:gap-4 lg:gap-6">
            {filtered.map((d, i) => {
              const tier = getTier(d.amount);
              const avatarColor = getColor(d.gateway);
              return (
                <motion.div key={`${d.name}-${d.city}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="global-card relative hover:">
                  <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full ${tier.cls}`}>{tier.label}</span>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-primary-foreground font-bold text-sm`}>
                      {d.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text-dark">{d.name} from {d.city}</p>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getColor(d.gateway)}`} />
                        <span className="text-xs text-text-light">{d.gateway}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-light mt-2">{d.time}</p>
                </motion.div>
              );
            })}
          </div>

          <FadeInUp className="text-center mt-12">
            <p className="text-sm text-text-mid">Join <strong className="text-teal">2,847</strong> donors on this wall</p>
          </FadeInUp>
        </div>
      </section>
    </main>
  );
};

export default DonorWall;
