/**
 * Convert an array of plain objects to a CSV string and trigger a download.
 * - Escapes quotes per RFC 4180
 * - Prepends a UTF-8 BOM so Excel renders ₹ and Bengali correctly
 * - Wraps every cell in quotes so commas/newlines are safe
 */
export function exportToCSV(rows: Record<string, unknown>[], filename: string) {
  if (!rows || rows.length === 0) {
    alert("No rows match the current filters — nothing to export.");
    return;
  }

  const headers = Object.keys(rows[0]);
  const escape = (val: unknown) => `"${String(val ?? "").replace(/"/g, '""')}"`;

  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/** Filter rows by created_at date range (inclusive). Either bound may be empty. */
export function filterByDateRange<T extends { created_at?: string | null }>(
  rows: T[],
  from: string,
  to: string,
): T[] {
  if (!from && !to) return rows;
  const fromTs = from ? new Date(from + "T00:00:00").getTime() : -Infinity;
  const toTs = to ? new Date(to + "T23:59:59").getTime() : Infinity;
  return rows.filter((r) => {
    if (!r.created_at) return false;
    const t = new Date(r.created_at).getTime();
    return t >= fromTs && t <= toTs;
  });
}