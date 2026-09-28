import { ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Renders its children into <body> instead of inline.
 *
 * Why this exists: the route wrapper in App.tsx carries
 * `will-change: transform` (for the page-transition animation). Per the CSS
 * spec, that makes it a *containing block* for `position: fixed` descendants —
 * so a `fixed inset-0` modal declared inside a page gets centred relative to
 * the full-height page, not the viewport. The symptom is a dialog that opens
 * off-screen and forces the user to scroll to find it.
 *
 * Portalling the overlay to <body> takes it out of the transformed subtree, so
 * `fixed` once again means "relative to the viewport" and modals open exactly
 * where the user is looking.
 *
 * Wrap the whole <AnimatePresence> block so enter/exit animations are
 * preserved. Scroll-locking stays with the page (it knows when a modal is
 * actually open); this component only relocates the DOM.
 */
const ModalPortal = ({ children }: { children: ReactNode }) => {
  if (typeof document === "undefined") return null;
  return createPortal(children, document.body);
};

export default ModalPortal;
