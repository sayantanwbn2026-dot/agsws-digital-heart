import { useEffect, useState } from "react";
import { Eye, X, ExternalLink } from "lucide-react";
import { isPreviewMode, setPreviewMode } from "@/lib/cms-preview";

/**
 * Floating top bar shown ONLY when an admin has activated CMS preview mode.
 * Lets them see drafts/unpublished content live, then exit with one click.
 */
const PreviewBar = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const sync = () => setActive(isPreviewMode());
    sync();
    window.addEventListener("agsws-preview-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("agsws-preview-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!active) return null;

  const exit = () => {
    setPreviewMode(false);
    setActive(false);
  };

  return (
    <>
      {/* Spacer to push page content down */}
      <div aria-hidden className="h-10" />
      <div
        role="status"
        aria-live="polite"
        className="fixed top-0 inset-x-0 z-[100] h-10 flex items-center justify-center gap-3 px-4 text-[12px] font-semibold text-white"
        style={{
          background:
            "linear-gradient(90deg, hsl(187 68% 32%) 0%, hsl(242 35% 42%) 100%)",
          boxShadow: "0 4px 14px -4px rgba(0,0,0,0.25)",
        }}
      >
        <span className="flex items-center gap-2">
          <Eye size={13} />
          <span className="tracking-wide">CMS Preview Mode — drafts & unpublished items are visible</span>
        </span>
        <span className="hidden sm:inline-block w-px h-4 bg-white/30" />
        <a
          href="/admin"
          className="hidden sm:inline-flex items-center gap-1 hover:underline underline-offset-2"
        >
          <ExternalLink size={12} /> Back to admin
        </a>
        <button
          onClick={exit}
          className="ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/15 hover:bg-white/25 transition-colors"
          aria-label="Exit preview mode"
        >
          <X size={12} /> Exit
        </button>
      </div>
    </>
  );
};

export default PreviewBar;
