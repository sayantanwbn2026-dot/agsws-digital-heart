import { useState, useEffect, useMemo } from "react";
import { Search, Download, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAdminAPI } from "@/hooks/useAdminAPI";
import { exportToCSV, filterByDateRange } from "@/lib/exportCSV";

const statusColors: Record<string, string> = {
  active: "bg-teal-light text-teal",
  pending: "bg-yellow-light text-yellow",
  closed: "bg-background text-text-light",
  emergency: "bg-destructive/10 text-destructive",
  Active: "bg-teal-light text-teal",
  Pending: "bg-yellow-light text-yellow",
  Closed: "bg-background text-text-light",
  Emergency: "bg-destructive/10 text-destructive",
};

const RegistrationsTable = () => {
  const { adminFetch } = useAdminAPI();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [drawerItem, setDrawerItem] = useState<any | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/registrations", "GET")
      .then(data => { if (Array.isArray(data)) setRegistrations(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const dateScoped = filterByDateRange(registrations, dateFrom, dateTo);
    const q = search.toLowerCase();
    return dateScoped.filter((r) => {
      const name = (r.registrant_name ?? r.registrant ?? "").toLowerCase();
      const id = (r.registration_ref ?? r.registration_id ?? r.regId ?? "").toLowerCase();
      const parent = (r.parent_name ?? r.parent ?? "").toLowerCase();
      const status = (r.case_status ?? r.status ?? "").toLowerCase();
      const matchesSearch = !q || name.includes(q) || id.includes(q) || parent.includes(q);
      const matchesStatus = statusFilter === "all" || status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [registrations, search, statusFilter, dateFrom, dateTo]);

  const statusOptions = useMemo(
    () => Array.from(new Set(registrations.map((r) => r.case_status ?? r.status).filter(Boolean))).sort(),
    [registrations],
  );

  const hasActiveFilters = search || statusFilter !== "all" || dateFrom || dateTo;
  const clearFilters = () => {
    setSearch(""); setStatusFilter("all"); setDateFrom(""); setDateTo("");
  };

  const handleDownload = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    const exportRows = filtered.map((r) => ({
      registration_ref: r.registration_ref ?? r.regId ?? "",
      registrant_name: r.registrant_name ?? r.registrant ?? "",
      registrant_email: r.registrant_email ?? "",
      registrant_phone: r.registrant_phone ?? "",
      parent_name: r.parent_name ?? r.parent ?? "",
      parent_age: r.parent_age ?? "",
      city: r.registrant_city ?? r.city ?? "",
      relation: r.relation ?? "",
      emergency_contact_name: r.emergency_contact_name ?? "",
      emergency_contact_phone: r.emergency_contact_phone ?? "",
      medical_condition: r.medical_condition ?? "",
      amount: r.amount_cents ? `₹${Math.round(r.amount_cents / 100)}` : "",
      status: r.case_status ?? r.status ?? "",
      created_at: r.created_at ? new Date(r.created_at).toLocaleString("en-IN") : "",
    }));
    exportToCSV(exportRows, `parent-registrations-${stamp}.csv`);
  };

  return (
    <>
      <div className="global-card">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-text-dark">Parent Registrations</h3>
          <button className="border border-teal text-teal text-xs font-medium px-4 py-2 rounded-full hover:bg-teal-light transition-colors flex items-center gap-1.5">
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="p-4 border-b border-border bg-background">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or ID" className="global-card w-full h-9 pl-9 pr-3 text-sm outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-teal">
                {["Reg ID", "Registrant", "Parent Name", "City", "Date", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase text-text-light tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const regId = r.registration_id ?? r.regId ?? "";
                const registrant = r.registrant_name ?? r.registrant ?? "";
                const parent = r.parent_name ?? r.parent ?? "";
                const city = r.registrant_city ?? r.city ?? "";
                const date = r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : r.date ?? "";
                const status = r.case_status ?? r.status ?? "pending";
                return (
                  <tr key={regId || i} className={`border-b border-border last:border-0 ${i % 2 ? "bg-background" : ""} hover:bg-teal-light/30 transition-colors`}>
                    <td className="px-4 py-3 font-mono text-xs text-teal font-semibold">{regId}</td>
                    <td className="px-4 py-3 font-medium text-text-dark">{registrant}</td>
                    <td className="px-4 py-3 text-text-mid">{parent}</td>
                    <td className="px-4 py-3 text-text-mid">{city}</td>
                    <td className="px-4 py-3 text-text-light text-xs">{date}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[status] ?? ""}`}>{status}</span></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDrawerItem(r)} className="text-xs border border-teal text-teal px-3 py-1 rounded-full hover:bg-teal-light transition-colors">View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {drawerItem && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={() => setDrawerItem(null)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="global-card fixed right-0 top-0 h-full w-[400px] z-50 overflow-auto"
            >
              <button onClick={() => setDrawerItem(null)} className="absolute top-4 right-4 text-text-light hover:text-text-dark"><X size={20} /></button>
              <h3 className="text-xl font-bold text-teal mb-1">{drawerItem.regId}</h3>
              <p className="text-sm text-text-light mb-6">Registration Details</p>

              <div className="space-y-4 text-sm">
                {[
                  ["Registrant", drawerItem.registrant],
                  ["Parent", drawerItem.parent],
                  ["City", drawerItem.city],
                  ["Date", drawerItem.date],
                  ["Status", drawerItem.status],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-border pb-2">
                    <span className="text-text-light">{label}</span>
                    <span className="font-medium text-text-dark">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <label className="text-xs font-semibold uppercase text-text-light tracking-wide mb-2 block">Admin Notes</label>
                <textarea rows={3} placeholder="Add internal notes..." className="global-card w-full outline-none focus: text-sm" />
                <button className="mt-2 bg-teal text-primary-foreground text-xs font-medium px-4 py-2 rounded-full">Save Notes</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default RegistrationsTable;
