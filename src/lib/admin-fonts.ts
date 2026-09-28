/**
 * The CMS uses Sora (display) + Manrope (UI). Public pages never render them,
 * so instead of shipping them to every visitor they're injected the first time
 * an admin page mounts. Idempotent — safe to call from every admin entry point.
 */
const HREF =
  "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap";

export function loadAdminFonts() {
  if (typeof document === "undefined") return;
  if (document.querySelector(`link[data-admin-fonts]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = HREF;
  link.setAttribute("data-admin-fonts", "");
  document.head.appendChild(link);
}
