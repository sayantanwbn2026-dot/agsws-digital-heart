import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { motion } from "framer-motion";
import FadeInUp from "@/components/ui/FadeInUp";

const donors = [
  { name: "Rahul", city: "Mumbai", gateway: "Medical Aid", amount: 10000, time: "2 weeks ago" },
  { name: "Priya", city: "Delhi", gateway: "Education", amount: 5000, time: "3 weeks ago" },
  { name: "Amit", city: "Bengaluru", gateway: "Medical Aid", amount: 1000, time: "1 month ago" },
  { name: "Sneha", city: "Chennai", gateway: "Education", amount: 12000, time: "1 month ago" },
  { name: "Vikram", city: "Pune", gateway: "Medical Aid", amount: 500, time: "2 months ago" },
  { name: "Ananya", city: "Kolkata", gateway: "Registration", amount: 100, time: "2 months ago" },
  { name: "Ravi", city: "Hyderabad", gateway: "Medical Aid", amount: 5000, time: "3 months ago" },
  { name: "Meera", city: "London", gateway: "Education", amount: 25000, time: "3 months ago" },
  { name: "Sanjay", city: "Singapore", gateway: "Registration", amount: 100, time: "4 months ago" },
  { name: "Kavita", city: "Dubai", gateway: "Medical Aid", amount: 10000, time: "4 months ago" },
  { name: "Arjun", city: "Mumbai", gateway: "Education", amount: 3000, time: "5 months ago" },
  { name: "Deepa", city: "Kolkata", gateway: "Medical Aid", amount: 2000, time: "6 months ago" },
];

function getTier(amount: number) {
  if (amount >= 10000) return { label: "Champion", cls: "bg-purple-light text-purple" };
  if (amount >= 5000) return { label: "Gold", cls: "bg-yellow-light text-yellow" };
  if (amount >= 1000) return { label: "Silver", cls: "bg-background text-text-mid" };
  return { label: "Supporter", cls: "bg-teal-light text-teal" };
}

function getColor(gateway: string) {
  if (gateway === "Education") return "bg-purple";
  if (gateway === "Registration") return "bg-beige";
  return "bg-teal";
}

const filters = ["All", "Medical Aid", "Education", "Registration"];

const DonorWall = () => {
  useSEO("Donor Wall", "Our wall of donors — every name represents a real act of kindness.");
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? donors : donors.filter(d => d.gateway === filter);

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
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex items-center gap-6 mb-8 flex-wrap">
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Total Donors", value: "2,847" },
                { label: "This Month", value: "124" },
                { label: "Cities", value: "42" },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-xl px-5 py-3 shadow-brand-sm">
                  <p className="text-xl font-bold text-teal">{s.value}</p>
                  <p className="text-xs text-text-light">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mb-8 flex-wrap">
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${filter === f ? "bg-teal text-primary-foreground border-teal" : "bg-card text-text-mid border-border hover:border-teal"}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((d, i) => {
              const tier = getTier(d.amount);
              const avatarColor = getColor(d.gateway);
              return (
                <motion.div key={`${d.name}-${d.city}-${i}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="bg-card border border-border rounded-xl p-5 shadow-brand-sm relative hover:-translate-y-1 hover:shadow-brand-lg transition-all duration-300">
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
