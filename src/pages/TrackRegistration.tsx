import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, User, Heart, Shield, Phone, AlertCircle } from "lucide-react";

const mockData: Record<string, any> = {
  "REG-2025-0001": {
    parentName: "Sumitra",
    status: "Active",
    createdAt: "2025-01-15",
    coordinatorName: "Priya D.",
    coordinatorPhone: "+919876543210",
    steps: [
      { label: "Registration Confirmed", completed: true, date: "15 Jan 2025", desc: "Your registration and ₹100 payment received." },
      { label: "Coordinator Assigned", completed: true, date: "16 Jan 2025", desc: "A local AGSWS coordinator has been assigned." },
      { label: "First Wellness Check", completed: true, date: "22 Jan 2025", desc: "Your parent has been visited and briefed." },
      { label: "Emergency Support Active", completed: true, date: "22 Jan 2025", desc: "24/7 emergency response is now active for your parent." },
    ],
  },
  "REG-2025-0042": {
    parentName: "Ramesh",
    status: "Pending",
    createdAt: "2025-03-10",
    coordinatorName: null,
    coordinatorPhone: null,
    steps: [
      { label: "Registration Confirmed", completed: true, date: "10 Mar 2025", desc: "Your registration and ₹100 payment received." },
      { label: "Coordinator Assigned", completed: false, date: null, desc: "A local AGSWS coordinator will be assigned within 24 hours." },
      { label: "First Wellness Check", completed: false, date: null, desc: "Your parent will be visited and briefed." },
      { label: "Emergency Support Active", completed: false, date: null, desc: "24/7 emergency response activation pending." },
    ],
  },
};

const stepIcons = [CheckCircle, User, Heart, Shield];

const TrackRegistration = () => {
  useSEO("Track Registration", "Track your parent's AGSWS registration status.");
  const [regId, setRegId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const data = mockData[regId.trim().toUpperCase()];
    if (data) { setResult(data); setError(false); }
    else { setResult(null); setError(true); }
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
            <input value={regId} onChange={(e) => setRegId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="e.g. REG-2025-0001" className="flex-1 h-[52px] px-4 border border-border rounded-lg text-base font-medium bg-card focus:border-teal focus:ring-2 focus:ring-teal/15 outline-none" />
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
              <div className="bg-card border border-border rounded-xl shadow-brand-lg p-8">
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
