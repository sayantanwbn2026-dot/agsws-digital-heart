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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase text-text-light tracking-wide mb-2 block">Recipient Group</label>
            <select value={group} onChange={(e) => setGroup(e.target.value)} className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal text-sm">
              {Object.keys(recipientGroups).map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <p className="text-xs text-text-light mt-1">{recipientGroups[group]} recipients will receive this email</p>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-text-light tracking-wide mb-2 block">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal" placeholder="Email subject line" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-text-light tracking-wide mb-2 block">From Name</label>
            <input defaultValue="AGSWS Team" className="w-full h-12 px-4 border border-border rounded-lg bg-card outline-none focus:border-teal text-sm" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase text-text-light tracking-wide mb-2 block">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={8} className="w-full px-4 py-3 border border-border rounded-lg bg-card outline-none focus:border-teal text-sm resize-y" placeholder="Write your message..." />
          </div>

          <button
            disabled={!subject || !message}
            onClick={() => setShowConfirm(true)}
            className="w-full h-12 bg-yellow text-text-dark font-bold rounded-full shadow-yellow disabled:opacity-40 disabled:shadow-none transition-opacity"
          >
            Send Email
          </button>
        </div>

        {/* Preview */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-teal p-4">
            <span className="font-bold text-primary-foreground text-lg">AGSWS</span>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-text-dark mb-3">{subject || "Email subject will appear here"}</h3>
            <p className="text-sm text-text-mid whitespace-pre-wrap leading-relaxed">{message || "Your message content will be previewed here as you type..."}</p>
          </div>
          <div className="border-t border-border p-4 text-center">
            <p className="text-xs text-text-light">AGSWS — The Ascension Group Social Welfare Society</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={() => setShowConfirm(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-card rounded-xl shadow-lg border border-border p-8 w-full max-w-[440px] text-center">
                <p className="text-base font-semibold text-text-dark mb-2">Confirm Send</p>
                <p className="text-sm text-text-mid mb-6">You are about to send this email to {recipientGroups[group]} recipients. This cannot be undone.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setShowConfirm(false)} className="border border-border text-text-mid px-6 py-2.5 rounded-full text-sm font-medium hover:bg-background transition-colors">Cancel</button>
                  <button onClick={() => setShowConfirm(false)} className="bg-teal text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold">Confirm Send</button>
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
