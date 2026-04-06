import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Award, AlertCircle, ArrowRight, User } from "lucide-react";
import PageHero from "@/components/layout/PageHero";

const mockVolunteers: Record<string, any> = {
  "VOL-2025-0042": {
    name: "Arjun", role: "Medical Volunteer", since: "2024", totalHours: 124,
    categories: { field: 60, medical: 40, education: 16, admin: 8 },
    activities: [
      { date: "12 Mar 2025", desc: "North Kolkata Medical Camp — patient intake", hours: 6 },
      { date: "28 Feb 2025", desc: "Medicine distribution drive — Shyambazar", hours: 4 },
      { date: "14 Feb 2025", desc: "Registration camp coordination — Howrah", hours: 8 },
      { date: "20 Jan 2025", desc: "Volunteer orientation — new batch training", hours: 3 },
    ],
  },
  "VOL-2024-0018": {
    name: "Meera", role: "Education Volunteer", since: "2023", totalHours: 256,
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

      <section className="bg-[var(--bg)] py-16 lg:py-20">
        <div className="max-w-[520px] mx-auto px-6">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-[16px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--teal-light)] flex items-center justify-center">
                <User size={18} className="text-[var(--teal)]" />
              </div>
              <div>
                <h3 className="text-[16px] font-[700] text-[var(--dark)] leading-tight">Find Your Profile</h3>
                <p className="text-[11px] text-[var(--light)]">Enter your Volunteer ID from your welcome email</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--light)]" />
                <input
                  value={volId}
                  onChange={(e) => setVolId(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="e.g. VOL-2025-0042"
                  className="w-full h-[48px] pl-11 pr-4 text-[14px] text-[var(--dark)] bg-[var(--bg)] border border-[var(--border-color)] rounded-[12px] outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10 transition-all placeholder:text-[var(--light)]"
                />
              </div>
              <motion.button
                onClick={handleSearch}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="h-[48px] px-6 bg-[var(--teal)] text-white font-[600] rounded-[12px] flex items-center gap-2 text-[13px] hover:bg-[var(--teal-dark)] transition-colors"
              >
                <ArrowRight size={16} /> View
              </motion.button>
            </div>
            <p className="text-[11px] text-[var(--light)] mt-2">Try: VOL-2025-0042 or VOL-2024-0018</p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {searched && error && (
            <motion.div key="err" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[520px] mx-auto mt-6 px-6">
              <div className="bg-[var(--yellow-light)] border border-[var(--yellow)]/40 rounded-[14px] p-5 flex gap-3">
                <AlertCircle className="text-[var(--yellow)] flex-shrink-0" size={20} />
                <p className="text-[13px] text-[var(--mid)]">Volunteer ID not found. Check your welcome email for the correct ID.</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div key="res" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[520px] mx-auto mt-6 px-6">
              <div className="bg-white rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[var(--teal)] to-[var(--teal-dark)] p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-[800] text-[20px]">{result.name[0]}</div>
                  <div>
                    <p className="font-[700] text-[18px] text-white">{result.name}</p>
                    <span className="text-[11px] font-[600] text-white/70">{result.role} · Since {result.since} · {volId.toUpperCase()}</span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Hours */}
                  <div className="bg-[var(--teal-light)] rounded-[14px] p-5 mb-6">
                    <p className="text-[36px] font-[800] text-[var(--teal)] leading-none">{result.totalHours} <span className="text-[16px] font-[500]">hours</span></p>
                    <p className="text-[13px] text-[var(--mid)] mt-1">contributed to AGSWS</p>
                    <div className="flex h-2 rounded-full overflow-hidden mt-3 gap-0.5">
                      {Object.entries(result.categories).map(([key, val]: any) => {
                        const colors: Record<string, string> = { field: "bg-[var(--teal)]", medical: "bg-[var(--teal-dark)]", education: "bg-[var(--purple)]", admin: "bg-[var(--beige)]" };
                        return <div key={key} className={`${colors[key]} h-full rounded-full`} style={{ width: `${(val / result.totalHours) * 100}%` }} />;
                      })}
                    </div>
                    <div className="flex gap-4 mt-3 flex-wrap">
                      {Object.entries(result.categories).map(([key, val]: any) => {
                        const colors: Record<string, string> = { field: "bg-[var(--teal)]", medical: "bg-[var(--teal-dark)]", education: "bg-[var(--purple)]", admin: "bg-[var(--beige)]" };
                        return (
                          <div key={key} className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${colors[key]}`} />
                            <span className="text-[10px] text-[var(--light)] capitalize">{key} ({val}h)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activities */}
                  <h4 className="font-[600] text-[13px] text-[var(--dark)] mb-3 uppercase tracking-[0.06em]">Recent Activities</h4>
                  <div className="space-y-3 mb-6">
                    {result.activities.map((a: any, i: number) => (
                      <div key={i} className="flex gap-3 text-[13px] py-2 border-b border-[var(--border-color)] last:border-0">
                        <span className="text-[11px] text-[var(--teal)] font-[600] w-20 flex-shrink-0">{a.date}</span>
                        <span className="text-[var(--mid)] flex-1">{a.desc}</span>
                        <span className="text-[11px] text-[var(--light)] flex-shrink-0 font-[600]">{a.hours}h</span>
                      </div>
                    ))}
                  </div>

                  {/* Certificate */}
                  <div className="bg-[var(--yellow-light)] rounded-[14px] p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Award size={18} className="text-[var(--yellow)]" />
                      <span className="font-[600] text-[14px] text-[var(--dark)]">Request Certificate</span>
                    </div>
                    <p className="text-[12px] text-[var(--mid)] mb-3">Download a certificate confirming your volunteer service with AGSWS.</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => alert("Certificate generation will be available on launch.")}
                      className="w-full bg-[var(--yellow)] text-[var(--dark)] font-[700] py-3 rounded-full flex items-center justify-center gap-2 text-[13px] shadow-[var(--shadow-yellow)]"
                    >
                      <Award size={14} /> Request Certificate
                    </motion.button>
                  </div>
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
