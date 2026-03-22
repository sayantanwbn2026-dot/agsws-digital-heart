import { useState } from "react";
import { Download, Search } from "lucide-react";

interface DonationsTableProps {
  gateway: string;
  color: string;
  showTier?: boolean;
}

const mockDonations = [
  { date: "2025-03-15", name: "Rahul Sharma", email: "rahul@email.com", amount: 5000, frequency: "once", pan: "AAAPZ1234Q", status: "captured", tier: "Full Year" },
  { date: "2025-03-14", name: "Sunita Patel", email: "sunita@email.com", amount: 10000, frequency: "monthly", pan: "BBCPD5678R", status: "captured", tier: "Books" },
  { date: "2025-03-13", name: "Arjun Mehra", email: "arjun@email.com", amount: 1000, frequency: "once", pan: "", status: "pending", tier: "School Fees" },
  { date: "2025-03-12", name: "Neha Gupta", email: "neha@email.com", amount: 500, frequency: "once", pan: "", status: "failed", tier: "Meals" },
  { date: "2025-03-10", name: "Vikram Das", email: "vikram@email.com", amount: 2000, frequency: "monthly", pan: "CCEPF9012S", status: "captured", tier: "Custom" },
];

const statusColors: Record<string, string> = {
  captured: "bg-teal-light text-teal",
  pending: "bg-yellow-light text-yellow",
  failed: "bg-destructive/10 text-destructive",
};

const downloadCSV = (data: any[], filename: string) => {
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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockDonations.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email" className="w-full h-9 pl-9 pr-3 text-sm border border-border rounded-lg bg-card outline-none focus:border-teal" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 text-sm border border-border rounded-lg bg-card outline-none focus:border-teal">
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
              <tr key={i} className={`border-b border-border last:border-0 ${i % 2 ? "bg-background" : ""} hover:bg-teal-light/30 transition-colors`}>
                <td className="px-4 py-3 text-text-light text-xs">{d.date}</td>
                <td className="px-4 py-3 font-medium text-text-dark">{d.name}</td>
                <td className="px-4 py-3 text-text-mid">{d.email}</td>
                <td className="px-4 py-3 font-semibold text-text-dark">₹{d.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-text-mid capitalize">{d.frequency}</td>
                <td className="px-4 py-3 text-text-light font-mono text-xs">{d.pan || "—"}</td>
                {showTier && <td className="px-4 py-3 text-text-mid">{d.tier}</td>}
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[d.status]}`}>{d.status}</span>
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
