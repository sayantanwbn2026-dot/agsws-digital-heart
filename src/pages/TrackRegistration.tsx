import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, User, Heart, Shield, Phone, AlertCircle, Loader2 } from "lucide-react";

const stepIcons = [CheckCircle, User, Heart, Shield];

const STEP_META = [
  { label: "Registration Confirmed", pendingDesc: "Your registration and ₹100 payment received." },
  { label: "Coordinator Assigned", pendingDesc: "A local AGSWS coordinator will be assigned within 24 hours." },
  { label: "First Wellness Check", pendingDesc: "Your parent will be visited and briefed." },
  { label: "Emergency Support Active", pendingDesc: "24/7 emergency response activation pending." },
];

function buildStepsFromStatus(result: any) {
  const caseStatus = result.case_status ?? "pending";
  const completedCount =
    caseStatus === "active" || caseStatus === "emergency" ? 4 :
    caseStatus === "pending" ? 1 : 2;
  return STEP_META.map((meta, i) => ({
    label: meta.label,
    completed: i < completedCount,
    date: i < completedCount ? (i === 0 ? (result.created_at ? new Date(result.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null) : null) : null,
    desc: i < completedCount ? meta.pendingDesc : meta.pendingDesc,
  }));
}

const TrackRegistration = () => {
  useSEO("Track Registration", "Track your parent's AGSWS registration status.");
  const [regId, setRegId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!regId.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setSearched(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/data-api/track-registration?id=${encodeURIComponent(regId.trim())}`;
      const res = await fetch(url, {
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError("Registration ID not found. Please check the ID in your confirmation email.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Connection error. Please try again.");
    }
    setLoading(false);
  };

  const statusColor = result?.status === "Active" ? "bg-green-500" : result?.status === "Emergency" ? "bg-red-500" : "bg-yellow";

  return (
    <main id="main-content">
      <section className="h-[300px] bg-gradient-to-br from-teal-dark via-teal to-teal flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/30" />
        <div className="relative z-10 text-center">
          <h1 className="heading-1 text-primary-foreground">Track Your Parent's Registration</h1>
          <p className="text-sm text-primary-foreground/60 mt-3">Enter your Registration ID to see the live status</p>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="max-w-[480px] mx-auto px-6">
          <div className="flex gap-2">
            <input value={regId} onChange={(e) => setRegId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="e.g. REG-2025-0001" className="global-card flex-1 h-[52px] px-4 text-base font-medium focus:ring-2 focus:ring-teal/15 outline-none" />
            <button onClick={handleSearch} className="h-[52px] px-6 bg-teal text-primary-foreground font-semibold rounded-lg flex items-center gap-2 hover:bg-teal-dark transition-colors">
              <Search size={18} /> Track
            </button>
          </div>
          <p className="text-xs text-text-light mt-2">Try: REG-2025-0001 or REG-2025-0042</p>
        </div>

        <AnimatePresence mode="wait">
          {searched && error && (
            <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[560px] mx-auto mt-8 px-6">
              <div className="bg-yellow-light border border-yellow/30 rounded-xl p-6 flex gap-3">
                <AlertCircle size={20} className="text-yellow flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text-dark text-sm">Registration not found</p>
                  <p className="text-sm text-text-mid mt-1">Please check the ID in your confirmation email or contact us at +91 98765 43210.</p>
                </div>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[560px] mx-auto mt-8 px-6">
              <div className="global-card">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="heading-3 text-teal">Registration for {result.parentName}</h3>
                  <span className={`text-xs font-semibold text-primary-foreground px-3 py-1 rounded-full ${statusColor}`}>{result.status}</span>
                </div>
                <p className="label-text text-teal mb-6">{regId.toUpperCase()}</p>

                <div className="space-y-0">
                  {result.steps.map((step: any, i: number) => {
                    const Icon = stepIcons[i];
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.completed ? "bg-teal text-primary-foreground" : "bg-border text-text-light"}`}>
                            <Icon size={18} />
                          </div>
                          {i < 3 && <div className={`w-0.5 h-12 ${step.completed ? "bg-teal/30" : "bg-border"} border-dashed`} />}
                        </div>
                        <div className="pb-8">
                          <p className="font-semibold text-sm text-text-dark">{step.label}</p>
                          {step.date && <p className="text-xs text-teal font-medium">{step.date}</p>}
                          <p className="text-xs text-text-mid mt-1">{step.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Emergency section */}
                <div className="border-t border-border pt-6 mt-2">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase text-red-600 tracking-wider">Emergency Contact</span>
                    </div>
                    {result.coordinatorName && (
                      <div className="bg-card rounded-lg p-3 mb-3">
                        <p className="text-xs text-text-light">Your assigned coordinator:</p>
                        <p className="font-semibold text-text-dark">{result.coordinatorName}</p>
                        <a href={`tel:${result.coordinatorPhone}`} className="mt-2 w-full bg-red-600 text-primary-foreground font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-red-700 transition-colors">
                          <Phone size={16} /> Call Now
                        </a>
                      </div>
                    )}
                    <div className="bg-teal-light rounded-lg p-3 text-center">
                      <p className="text-xs text-text-mid">AGSWS 24hr Emergency Helpline</p>
                      <p className="font-bold text-lg text-teal">+91 98765 43210</p>
                    </div>
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

export default TrackRegistration;
