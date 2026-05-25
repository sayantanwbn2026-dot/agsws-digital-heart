// Helpers for INR donation amount inputs.
// - Accepts only digits, strips negatives/decimals/spaces.
// - Enforces a sane min/max so checkout never receives invalid values.
// - Formats with the Indian numbering system (1,00,000) for display.

export const INR_MIN = 1;
export const INR_MAX = 1_000_000; // ₹10 Lakh — Stripe / KYC sensible upper bound

export function sanitizeINRInput(raw: string): string {
  // Keep digits only, trim leading zeros, cap at MAX.
  const digits = (raw || "").replace(/[^\d]/g, "").replace(/^0+/, "");
  if (!digits) return "";
  const n = Math.min(parseInt(digits, 10), INR_MAX);
  return String(n);
}

export function formatINR(value: number | string): string {
  const n = typeof value === "number" ? value : parseInt(value || "0", 10);
  if (!n || Number.isNaN(n)) return "";
  return n.toLocaleString("en-IN");
}

export function validateINRAmount(value: number): { ok: boolean; message?: string } {
  if (!value || Number.isNaN(value)) return { ok: false, message: "Please enter an amount" };
  if (value < INR_MIN) return { ok: false, message: `Minimum donation is ₹${INR_MIN}` };
  if (value > INR_MAX) return { ok: false, message: `Maximum donation is ₹${formatINR(INR_MAX)}` };
  return { ok: true };
}