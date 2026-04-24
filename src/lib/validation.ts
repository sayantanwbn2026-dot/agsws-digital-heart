// Lightweight, framework-free validators used across user-facing forms.
// Keep these conservative — we want to flag obvious typos, not gatekeep
// legitimate users with strict locale rules.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string | null | undefined): boolean {
  if (!value) return false;
  return EMAIL_RE.test(value.trim());
}

export function normalizeEmail(value: string | null | undefined): string {
  return (value || "").trim().toLowerCase();
}

/**
 * Indian phone validator. Accepts 10-digit numbers optionally prefixed with
 * +91 / 91 / 0 and ignores spaces / dashes. Returns the normalized 10-digit
 * national number when valid, otherwise null.
 */
export function normalizeIndianPhone(value: string | null | undefined): string | null {
  if (!value) return null;
  const digits = value.replace(/[\s\-()]/g, "").replace(/^\+?91/, "").replace(/^0/, "");
  if (/^[6-9]\d{9}$/.test(digits)) return digits;
  return null;
}

export function isValidIndianPhone(value: string | null | undefined): boolean {
  return normalizeIndianPhone(value) !== null;
}

export function isNonEmpty(value: string | null | undefined): boolean {
  return !!(value && value.trim().length > 0);
}