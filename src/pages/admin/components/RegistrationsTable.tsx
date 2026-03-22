import { useState } from "react";
import { Search, Download, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const mockRegistrations = [
  { regId: "REG-2025-0001", registrant: "Arjun Mehra", parent: "Kamala Mehra", city: "Bengaluru", date: "2025-03-01", status: "Active" },
  { regId: "REG-2025-0002", registrant: "Priya Sinha", parent: "Ratan Sinha", city: "London", date: "2025-02-20", status: "Pending" },
  { regId: "REG-2025-0003", registrant: "Rohit Das", parent: "Geeta Das", city: "Mumbai", date: "2025-02-15", status: "Active" },
  { regId: "REG-2025-0004", registrant: "Sneha Roy", parent: "Harihar Roy", city: "Delhi", date: "2025-01-10", status: "Emergency" },
];

const statusColors: Record<string, string> = {
  Active: "bg-teal-light text-teal",
  Pending: "bg-yellow-light text-yellow",
  Closed: "bg-background text-text-light",
  Emergency: "bg-destructive/10 text-destructive",
};

const RegistrationsTable = () => {
  const [search, setSearch] = useState("");
  const [drawerItem, setDrawerItem] = useState<typeof mockRegistrations[0] | null>(null);

  const filtered = mockRegistrations.filter((r) =>
    r.registrant.toLowerCase().includes(search.toLowerCase()) || r.regId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-text-dark">Parent Registrations</h3>
          <button className="border border-teal text-teal text-xs font-medium px-4 py-2 rounded-full hover:bg-teal-light transition-colors flex items-center gap-1.5">
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="p-4 border-b border-border bg-background">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or ID" className="w-full h-9 pl-9 pr-3 text-sm border border-border rounded-lg bg-card outline-none focus:border-teal" />
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
              {filtered.map((r, i) => (
                <tr key={r.regId} className={`border-b border-border last:border-0 ${i % 2 ? "bg-background" : ""} hover:bg-teal-light/30 transition-colors`}>
                  <td className="px-4 py-3 font-mono text-xs text-teal font-semibold">{r.regId}</td>
                  <td className="px-4 py-3 font-medium text-text-dark">{r.registrant}</td>
                  <td className="px-4 py-3 text-text-mid">{r.parent}</td>
                  <td className="px-4 py-3 text-text-mid">{r.city}</td>
                  <td className="px-4 py-3 text-text-light text-xs">{r.date}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[r.status]}`}>{r.status}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDrawerItem(r)} className="text-xs border border-teal text-teal px-3 py-1 rounded-full hover:bg-teal-light transition-colors">View</button>
                  </td>
                </tr>
              ))}
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
              className="fixed right-0 top-0 h-full w-[400px] bg-card border-l border-border shadow-lg z-50 overflow-auto p-8"
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
                <textarea rows={3} placeholder="Add internal notes..." className="w-full px-4 py-3 border border-border rounded-lg bg-card outline-none focus:border-teal text-sm" />
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
