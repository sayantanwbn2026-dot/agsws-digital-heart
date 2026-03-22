import { useSearchParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Check, Printer, Mail, Share2, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const impactStatements: Record<string, Record<string, string>> = {
  medical: {
    "500": "Your ₹500 just provided a child's medicines for an entire month.",
    "1000": "Your ₹1,000 just paid for an emergency consultation and transport for a patient.",
    "5000": "Your ₹5,000 just covered surgery support for someone who had no other option.",
    "10000": "Your ₹10,000 just funded a full treatment cycle for a family in need.",
  },
  education: {
    "1500": "Your ₹1,500 just put a complete set of books in a child's hands.",
    "5000": "Your ₹5,000 just kept a child in school for an entire year.",
    "10000": "Your ₹10,000 just funded two children's complete education for a year.",
  },
};

const ThankYou = () => {
  useSEO("Thank You", "Thank you for your donation to AGSWS.");
  const [params] = useSearchParams();
  const name = params.get("name") || "Friend";
  const amount = params.get("amount") || "0";
  const gateway = params.get("gateway") || "medical";
  const amountNum = parseInt(amount);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  let impact = "general community support";
  if (amountNum >= 10000) impact = "a full treatment cycle for a patient";
  else if (amountNum >= 5000) impact = "surgery support for a critical case";
  else if (amountNum >= 1000) impact = "emergency transport and consultation";
  else if (amountNum >= 500) impact = "medicines for 1 child for 1 month";

  const personalStatement = impactStatements[gateway]?.[amount] ||
    impactStatements.medical[amount] ||
    `Your ₹${amountNum.toLocaleString()} donation will fund ${impact}.`;

  const siteUrl = window.location.origin;
  const whatsappSendText = encodeURIComponent(`Your AGSWS donation receipt:\n\nAmount: ₹${amountNum.toLocaleString()}\nCause: ${gateway}\nDate: ${new Date().toLocaleDateString()}\n\nThank you for supporting children and families in Kolkata.`);
  const whatsappShareText = encodeURIComponent(`I just donated ₹${amountNum.toLocaleString()} to AGSWS — The Ascension Group Social Welfare Society, Kolkata. They provide emergency medical care for elderly parents, school support for children, and hospital aid.\n\nJoin me: ${siteUrl}/donate/${gateway}`);

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-card">
      <div className="text-center max-w-md mx-auto px-6 py-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-teal rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check size={40} className="text-primary-foreground" />
        </motion.div>
        <h2 className="text-3xl font-bold text-teal mb-2">Thank You, {name}!</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-teal text-primary-foreground rounded-xl p-6 mb-6 text-left"
        >
          <p className="text-base leading-relaxed">{personalStatement}</p>
          <p className="text-sm text-primary-foreground/70 mt-3">Your impact update will be in your inbox within 60 seconds.</p>
        </motion.div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-brand-md mb-6">
          <p className="text-sm text-text-light mb-1">Donation Amount</p>
          <p className="text-3xl font-bold text-teal">₹{amountNum.toLocaleString()}</p>
          <p className="text-sm text-text-mid mt-2">Impact: {impact}</p>
        </div>

        <div className="text-sm text-text-mid mb-6">
          {countdown > 0 ? (
            <p className="flex items-center justify-center gap-2">
              <Mail size={14} className="text-teal" />
              Your 80G receipt arrives in: <strong className="text-teal">{Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, "0")}</strong>
            </p>
          ) : (
            <p>Check your inbox → <a href="mailto:" className="text-teal font-medium hover:underline">Didn't get it? Check spam or contact us.</a></p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button onClick={() => window.print()} className="bg-yellow text-text-dark font-semibold px-5 py-3 rounded-full shadow-yellow text-sm flex items-center gap-2">
            <Printer size={16} /> Download 80G Receipt
          </button>
          <a href={`https://wa.me/?text=${whatsappSendText}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-primary-foreground font-semibold px-5 py-3 rounded-full text-sm flex items-center gap-2">
            <MessageCircle size={16} /> Send to WhatsApp
          </a>
          <a href={`https://wa.me/?text=${whatsappShareText}`} target="_blank" rel="noopener noreferrer" className="border border-[#25D366] text-[#25D366] font-semibold px-5 py-3 rounded-full text-sm flex items-center gap-2">
            <Share2 size={16} /> Share on WhatsApp
          </a>
          <Link to="/" className="border border-border text-text-mid font-semibold px-5 py-3 rounded-full text-sm hover:bg-background transition-colors">
            Back to Home
          </Link>
        </div>

        <Link to={`/track-donation?payment_id=pay_ABC123XYZ`} className="text-teal text-sm font-medium hover:underline">
          Track where your donation goes →
        </Link>
      </div>

      <style>{`
        @media print {
          nav, footer, .sticky, button, a, [class*="MobileBottomNav"], [class*="StickyDonation"], [class*="BackToTop"], [class*="CookieConsent"], [class*="LiveTicker"] { display: none !important; }
          main { min-height: auto !important; }
          @page { size: A5; margin: 20mm; }
        }
      `}</style>
    </main>
  );
};

export default ThankYou;
