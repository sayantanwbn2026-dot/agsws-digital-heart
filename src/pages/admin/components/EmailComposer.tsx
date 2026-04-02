import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const recipientGroups: Record<string, number> = {
  "All Medical Donors": 147,
  "All Education Donors": 98,
  "All Registrants": 120,
  "All Volunteers": 42,
};

const EmailComposer = () => {
  const [group, setGroup] = useState("All Medical Donors");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
        <div className="global-card space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase text-[var(--light)] tracking-wide mb-2 block">Recipient Group</label>
            <select value={group} onChange={(e) => setGroup(e.target.value)} className="w-full h-12 no-float">
              {Object.keys(recipientGroups).map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <p className="text-xs text-[var(--light)] mt-1">{recipientGroups[group]} recipients will receive this email</p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-[var(--light)] tracking-wide mb-2 block">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject line" className="w-full h-12 no-float" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-[var(--light)] tracking-wide mb-2 block">From Name</label>
            <input defaultValue="AGSWS Team" className="w-full h-12 no-float" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-[var(--light)] tracking-wide mb-2 block">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={8} placeholder="Write your message..." className="w-full no-float" />
          </div>

          <button
            disabled={!subject || !message}
            onClick={() => setShowConfirm(true)}
            className="w-full h-12 bg-[var(--yellow)] text-[var(--dark)] font-bold rounded-full shadow-[var(--shadow-yellow)] disabled:opacity-40 disabled:shadow-none transition-opacity"
          >
            Send Email
          </button>
        </div>

        {/* Preview */}
        <div className="global-card">
          <div className="bg-[var(--teal)] p-4">
            <span className="font-bold text-white text-lg">AGSWS</span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[var(--dark)] mb-3">{subject || "Email subject will appear here"}</h3>
            <p className="text-sm text-[var(--mid)] whitespace-pre-wrap leading-relaxed">{message || "Your message content will be previewed here as you type..."}</p>
          </div>
          <div className="border-t border-[var(--border-color)] p-4 text-center">
            <p className="text-xs text-[var(--light)]">AGSWS — The Ascension Group Social Welfare Society</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={() => setShowConfirm(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="global-card w-full max-w-[440px] text-center">
                <p className="text-base font-semibold text-[var(--dark)] mb-2">Confirm Send</p>
                <p className="text-sm text-[var(--mid)] mb-6">You are about to send this email to {recipientGroups[group]} recipients. This cannot be undone.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setShowConfirm(false)} className="border border-[var(--border-color)] text-[var(--mid)] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--bg)] transition-colors">Cancel</button>
                  <button onClick={() => setShowConfirm(false)} className="bg-[var(--teal)] text-white px-6 py-2.5 rounded-full text-sm font-semibold">Confirm Send</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmailComposer;
