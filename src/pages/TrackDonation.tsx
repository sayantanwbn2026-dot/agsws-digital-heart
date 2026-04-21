import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const TrackDonation = () => {
  useSEO("Track Donation", "Track where your AGSWS donation goes.");
  const [params] = useSearchParams();
  const [paymentId, setPaymentId] = useState(params.get("payment_id") || "");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!paymentId.trim()) return;
    setLoading(true);
    setError(false);
    setResult(null);
    setSearched(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/data-api/track-donation?payment_id=${encodeURIComponent(paymentId.trim())}`;
      const res = await fetch(url, {
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(true);
      } else {
        const stages = data.journey_stages ?? data.stages ?? [];
        setResult({ ...data, stages });
        // Fire confetti if all stages complete
        if (stages.length > 0 && stages.every((s: any) => s.completed)) {
          import("canvas-confetti").then(({ default: confetti }) => {
            confetti({ particleCount: 80, spread: 60, colors: ["#1F9AA8", "#F2B705"] });
          });
        }
      }
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  const completedCount = result?.stages.filter((s: any) => s.completed).length || 0;
  const allComplete = completedCount === 4;

  return (
    <main id="main-content">
      <section className="h-[300px] bg-gradient-to-br from-teal-dark via-teal to-teal flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[#0D1B1C]/30" />
        <div className="relative z-10 text-center">
          <h1 className="heading-1 text-primary-foreground">Track Your Donation</h1>
          <p className="text-sm text-primary-foreground/60 mt-3">See exactly where your money goes</p>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="max-w-[480px] mx-auto px-6">
          <div className="flex gap-2">
            <input value={paymentId} onChange={(e) => setPaymentId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="e.g. pay_XXXXXXXXXX" className="global-card flex-1 h-[52px] px-4 text-base font-medium focus:ring-2 focus:ring-teal/15 outline-none" />
            <button onClick={handleSearch} className="h-[52px] px-6 bg-teal text-primary-foreground font-semibold rounded-lg flex items-center gap-2">
              <Search size={18} /> Track
            </button>
          </div>
          <p className="text-xs text-text-light mt-2">Try: pay_ABC123XYZ or pay_DEF456UVW</p>
        </div>

        <AnimatePresence mode="wait">
          {searched && error && (
            <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[560px] mx-auto mt-8 px-6">
              <div className="bg-yellow-light border border-yellow/30 rounded-xl p-6 flex gap-3">
                <AlertCircle className="text-yellow flex-shrink-0" size={20} />
                <p className="text-sm text-text-mid">Payment ID not found. Check your receipt email for the correct ID.</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[560px] mx-auto mt-8 px-6">
              <div className="global-card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-teal">₹{result.amount.toLocaleString()}</p>
                    <p className="text-sm text-text-light">{result.gateway} • {result.createdAt}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${allComplete ? "bg-green-100 text-green-700" : "bg-teal-light text-teal"}`}>
                    {allComplete ? "Complete" : `${completedCount}/4 stages`}
                  </span>
                </div>

                {/* Pipeline */}
                <div className="flex items-center gap-1 mb-8">
                  {result.stages.map((s: any, i: number) => (
                    <div key={i} className="flex items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${s.completed ? "bg-teal text-primary-foreground" : "bg-border text-text-light"}`}>
                        {s.completed ? <CheckCircle size={18} /> : <span className="text-sm font-bold">{i + 1}</span>}
                      </div>
                      {i < 3 && <div className={`h-0.5 flex-1 ${result.stages[i + 1]?.completed ? "bg-teal" : "bg-border"}`} />}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {result.stages.map((s: any, i: number) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${s.completed ? "bg-teal" : "bg-border"}`} />
                      <div>
                        <p className={`text-sm font-semibold ${s.completed ? "text-text-dark" : "text-text-light"}`}>{s.label}</p>
                        {s.completed && s.date && <p className="text-xs text-teal">{s.date}</p>}
                        <p className="text-xs text-text-mid mt-0.5">{s.completed ? s.note : <em>Pending</em>}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {allComplete && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-6 bg-teal text-primary-foreground rounded-xl p-5 text-center">
                    <p className="font-bold">🎉 Your donation has been fully deployed.</p>
                    <p className="text-sm text-primary-foreground/80 mt-1">Thank you for completing this journey with us.</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
};

export default TrackDonation;
