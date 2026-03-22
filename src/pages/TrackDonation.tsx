import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, AlertCircle } from "lucide-react";

const mockJourneys: Record<string, any> = {
  "pay_ABC123XYZ": {
    amount: 5000, gateway: "Medical Aid", createdAt: "2025-02-10",
    stages: [
      { label: "Donation Received", completed: true, date: "10 Feb 2025", note: "Payment verified via Razorpay." },
      { label: "Funds Allocated", completed: true, date: "14 Feb 2025", note: "Allocated to North Kolkata Medical Camp." },
      { label: "Programme Deployed", completed: true, date: "28 Feb 2025", note: "Medicines purchased and distributed." },
      { label: "Impact Confirmed", completed: false, date: null, note: "" },
    ],
  },
  "pay_DEF456UVW": {
    amount: 12000, gateway: "Education", createdAt: "2024-11-05",
    stages: [
      { label: "Donation Received", completed: true, date: "5 Nov 2024", note: "Payment confirmed." },
      { label: "Funds Allocated", completed: true, date: "8 Nov 2024", note: "Allocated to Shyambazar School." },
      { label: "Programme Deployed", completed: true, date: "15 Nov 2024", note: "Child enrolled and fees paid." },
      { label: "Impact Confirmed", completed: true, date: "15 Mar 2025", note: "Child completed full academic year. Rank: 5th in class." },
    ],
  },
};

const TrackDonation = () => {
  useSEO("Track Donation", "Track where your AGSWS donation goes.");
  const [params] = useSearchParams();
  const [paymentId, setPaymentId] = useState(params.get("payment_id") || "");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const data = mockJourneys[paymentId.trim()];
    if (data) { setResult(data); setError(false); }
    else { setResult(null); setError(true); }
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
            <input value={paymentId} onChange={(e) => setPaymentId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="e.g. pay_ABC123XYZ" className="flex-1 h-[52px] px-4 border border-border rounded-lg text-base font-medium bg-card focus:border-teal focus:ring-2 focus:ring-teal/15 outline-none" />
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
              <div className="bg-card border border-border rounded-xl shadow-brand-lg p-8">
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
