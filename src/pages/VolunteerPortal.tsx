import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Award, AlertCircle } from "lucide-react";
import PageHero from "@/components/layout/PageHero";

const mockVolunteers: Record<string, any> = {
  "VOL-2025-0042": {
    name: "Arjun",
    role: "Medical Volunteer",
    since: "2024",
    totalHours: 124,
    categories: { field: 60, medical: 40, education: 16, admin: 8 },
    activities: [
      { date: "12 Mar 2025", desc: "North Kolkata Medical Camp — patient intake", hours: 6 },
      { date: "28 Feb 2025", desc: "Medicine distribution drive — Shyambazar", hours: 4 },
      { date: "14 Feb 2025", desc: "Registration camp coordination — Howrah", hours: 8 },
      { date: "20 Jan 2025", desc: "Volunteer orientation — new batch training", hours: 3 },
    ],
  },
  "VOL-2024-0018": {
    name: "Meera",
    role: "Education Volunteer",
    since: "2023",
    totalHours: 256,
    categories: { field: 40, medical: 10, education: 180, admin: 26 },
    activities: [
      { date: "8 Mar 2025", desc: "After-school tutoring — Math class", hours: 3 },
      { date: "1 Mar 2025", desc: "Book distribution — Behala school", hours: 5 },
    ],
  },
};

const VolunteerPortal = () => {
  useSEO("Volunteer Portal", "Track your AGSWS volunteer hours and request certificates.");
  const [volId, setVolId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const d = mockVolunteers[volId.trim().toUpperCase()];
    if (d) { setResult(d); setError(false); }
    else { setResult(null); setError(true); }
  };

  return (
    <main id="main-content">
      <PageHero title="Volunteer Portal" size="sm" breadcrumb={[{ label: "Home", href: "/" }, { label: "Volunteer Portal" }]} />

      <section className="bg-[var(--bg)] py-16">
        <div className="max-w-[480px] mx-auto px-6">
          <div className="flex gap-2">
            <input value={volId} onChange={(e) => setVolId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="e.g. VOL-2025-0042" className="flex-1 h-[52px] no-float" />
            <button onClick={handleSearch} className="h-[52px] px-6 bg-[var(--teal)] text-white font-semibold rounded-lg flex items-center gap-2">
              <Search size={18} /> View
            </button>
          </div>
          <p className="text-xs text-[var(--light)] mt-2">Try: VOL-2025-0042 or VOL-2024-0018</p>
        </div>

        <AnimatePresence mode="wait">
          {searched && error && (
            <motion.div key="err" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[560px] mx-auto mt-8 px-6">
              <div className="bg-[var(--yellow-light)] border border-[var(--yellow)] rounded-xl p-6 flex gap-3">
                <AlertCircle className="text-[var(--yellow)] flex-shrink-0" size={20} />
                <p className="text-sm text-[var(--mid)]">Volunteer ID not found. Check your welcome email for the correct ID.</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div key="res" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[560px] mx-auto mt-8 px-6">
              <div className="global-card">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-[var(--teal)] flex items-center justify-center text-white font-bold text-2xl">{result.name[0]}</div>
                  <div>
                    <p className="font-bold text-xl text-[var(--dark)]">{result.name}</p>
                    <span className="text-xs font-semibold bg-[var(--teal-light)] text-[var(--teal)] px-2 py-0.5 rounded-full">{result.role}</span>
                    <p className="text-xs text-[var(--light)] mt-1">Member since {result.since} · {volId.toUpperCase()}</p>
                  </div>
                </div>

                <div className="bg-[var(--teal-light)] rounded-xl p-5 mb-6">
                  <p className="text-4xl font-extrabold text-[var(--teal)]">{result.totalHours} <span className="text-lg font-medium">hours</span></p>
                  <p className="text-sm text-[var(--mid)]">contributed to AGSWS</p>
                  <div className="flex h-2 rounded-full overflow-hidden mt-3 gap-0.5">
                    {Object.entries(result.categories).map(([key, val]: any) => {
                      const colors: Record<string, string> = { field: "bg-[var(--teal)]", medical: "bg-[var(--teal-dark)]", education: "bg-[var(--purple)]", admin: "bg-[var(--beige)]" };
                      return <div key={key} className={`${colors[key]} h-full`} style={{ width: `${(val / result.totalHours) * 100}%` }} />;
                    })}
                  </div>
                  <div className="flex gap-4 mt-2">
                    {Object.entries(result.categories).map(([key, val]: any) => {
                      const colors: Record<string, string> = { field: "bg-[var(--teal)]", medical: "bg-[var(--teal-dark)]", education: "bg-[var(--purple)]", admin: "bg-[var(--beige)]" };
                      return (
                        <div key={key} className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${colors[key]}`} />
                          <span className="text-[10px] text-[var(--light)] capitalize">{key} ({val}h)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <h4 className="font-semibold text-sm text-[var(--dark)] mb-3">Recent Activities</h4>
                <div className="space-y-3 mb-6">
                  {result.activities.map((a: any, i: number) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-xs text-[var(--teal)] font-medium w-20 flex-shrink-0">{a.date}</span>
                      <span className="text-[var(--mid)] flex-1">{a.desc}</span>
                      <span className="text-xs text-[var(--light)] flex-shrink-0">{a.hours}h</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[var(--yellow-light)] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={20} className="text-[var(--yellow)]" />
                    <span className="font-semibold text-sm text-[var(--dark)]">Request a Volunteer Certificate</span>
                  </div>
                  <p className="text-xs text-[var(--mid)] mb-3">Download a certificate confirming your volunteer service with AGSWS.</p>
                  <button onClick={() => alert("Certificate generation will be available on launch.")} className="w-full bg-[var(--yellow)] text-[var(--dark)] font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-sm">
                    <Award size={16} /> Request Certificate
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default VolunteerPortal;
