/**
 * Prototype/demo mode.
 *
 * Enabled only when the site is built with VITE_DEMO_MODE="true". It exists so
 * a client can walk the full donation journey — form, thank-you page, receipt —
 * before Stripe is connected, instead of hitting an error at the last step.
 *
 * Deliberately opt-in and build-time only: a production build without that
 * variable can never silently skip taking a payment. Every screen reached this
 * way is labelled so a simulated donation cannot be mistaken for a real one.
 */
export const IS_DEMO = import.meta.env.VITE_DEMO_MODE === "true";

/** Marks a success/cancel URL as coming from a simulated payment. */
export function withDemoFlag(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}demo=1`;
}
