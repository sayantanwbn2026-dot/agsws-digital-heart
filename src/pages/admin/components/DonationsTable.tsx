import { useState, useEffect } from "react";
import { Download, Search, Loader2 } from "lucide-react";
import { useAdminAPI } from "@/hooks/useAdminAPI";

interface DonationsTableProps {
  gateway: string;
  color: string;
  showTier?: boolean;
}

const statusColors: Record<string, string> = {
  captured: "bg-teal-light text-teal",
  pending: "bg-yellow-light text-yellow",
  failed: "bg-destructive/10 text-destructive",
};

const downloadCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row) => Object.values(row).map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const DonationsTable = ({ gateway, color, showTier }: DonationsTableProps) => {
  const { adminFetch } = useAdminAPI();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const gwKey = gateway.toLowerCase().includes("educat") ? "education" : "medical";
    setLoading(true);
    adminFetch(`/api/admin/donations?gateway=${gwKey}`, "GET")
      .then(data => { if (Array.isArray(data)) setDonations(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [gateway]);

  const filtered = donations.filter((d) => {
    const name = d.donor_name ?? d.name ?? "";
    const email = d.donor_email ?? d.email ?? "";
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || (d.status ?? "") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="global-card">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-text-dark">{gateway} Donations</h3>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full bg-${color}-light text-${color}`}>{filtered.length}</span>
        </div>
        <button onClick={() => downloadCSV(filtered, `${gateway.toLowerCase()}_donations.csv`)} className={`border border-${color} text-${color} text-xs font-medium px-4 py-2 rounded-full hover:bg-${color}-light transition-colors flex items-center gap-1.5`}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="flex items-center gap-3 p-4 border-b border-border bg-background">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email" className="global-card w-full h-9 pl-9 pr-3 text-sm outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="global-card h-9 text-sm outline-none focus:">
          <option value="all">All Status</option>
          <option value="captured">Captured</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-teal">
              {["Date", "Donor Name", "Email", "Amount", "Frequency", "PAN", ...(showTier ? ["Tier"] : []), "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase text-text-light tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.stripe_payment_intent ?? d.id ?? i} className={`border-b border-border last:border-0 ${i % 2 ? "bg-background" : ""} hover:bg-teal-light/30 transition-colors`}>
                <td className="px-4 py-3 text-text-light text-xs">{d.created_at ? new Date(d.created_at).toLocaleDateString("en-IN") : d.date ?? ""}</td>
                <td className="px-4 py-3 font-medium text-text-dark">{d.donor_name ?? d.name ?? ""}</td>
                <td className="px-4 py-3 text-text-mid">{d.donor_email ?? d.email ?? ""}</td>
                <td className="px-4 py-3 font-semibold text-text-dark">₹{((d.amount ?? 0) / 100 > 10000 ? (d.amount ?? 0) / 100 : d.amount ?? 0).toLocaleString("en-IN")}</td>
                <td className="px-4 py-3 text-text-mid capitalize">{d.frequency ?? "once"}</td>
                <td className="px-4 py-3 text-text-light font-mono text-xs">{d.pan_number ?? d.pan ?? "—"}</td>
                {showTier && <td className="px-4 py-3 text-text-mid">{d.tier ?? "—"}</td>}
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[d.status] ?? ""}`}>{d.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationsTable;
