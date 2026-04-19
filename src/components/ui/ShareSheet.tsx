import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Check, X, Twitter, Facebook, Linkedin, MessageCircle, Mail } from "lucide-react";
import toast from "react-hot-toast";

interface ShareSheetProps {
  url?: string;
  title: string;
  text?: string;
  /** Render style — 'button' shows a labelled pill, 'icon' shows just the icon. */
  variant?: "button" | "icon";
  className?: string;
}

/**
 * Premium share sheet:
 * - Uses native Web Share API on mobile when available.
 * - Falls back to a slick desktop dialog with copy-link + WhatsApp/X/Facebook/LinkedIn/email presets.
 */
const ShareSheet = ({ url, title, text, variant = "button", className = "" }: ShareSheetProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const shareText = text ?? title;
  const enc = encodeURIComponent;

  const handleClick = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ url: shareUrl, title, text: shareText });
        return;
      } catch {
        /* user dismissed → fall through to dialog */
      }
    }
    setOpen(true);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Could not copy");
    }
  };

  const targets = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${enc(`${shareText} ${shareUrl}`)}`, color: "bg-emerald-500" },
    { label: "X", icon: Twitter, href: `https://twitter.com/intent/tweet?url=${enc(shareUrl)}&text=${enc(shareText)}`, color: "bg-foreground" },
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`, color: "bg-blue-600" },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}`, color: "bg-sky-700" },
    { label: "Email", icon: Mail, href: `mailto:?subject=${enc(title)}&body=${enc(`${shareText}\n\n${shareUrl}`)}`, color: "bg-rose-500" },
  ];

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={handleClick}
          aria-label="Share"
          className={`w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors ${className}`}
        >
          <Share2 size={15} />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center gap-2 px-4 h-10 rounded-full border border-border bg-card text-[13px] font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors ${className}`}
        >
          <Share2 size={14} /> Share
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9995] flex items-end sm:items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="bg-card rounded-3xl border border-border shadow-2xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">Share</p>
                  <h3 className="text-base font-bold text-foreground mt-0.5 line-clamp-1">{title}</h3>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground">
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3 mb-5">
                {targets.map(t => (
                  <a
                    key={t.label}
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <span className={`w-12 h-12 rounded-2xl ${t.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                      <t.icon size={18} />
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">{t.label}</span>
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-muted/60 rounded-xl px-3 py-2.5">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent text-[12px] text-muted-foreground outline-none truncate"
                  onFocus={e => e.currentTarget.select()}
                />
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex items-center gap-1.5 px-3 h-8 rounded-lg bg-primary text-primary-foreground text-[11px] font-bold hover:opacity-90"
                >
                  {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareSheet;
