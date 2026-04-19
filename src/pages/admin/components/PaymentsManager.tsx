import { useEffect, useMemo, useState } from "react";
import { CreditCard, Download, Loader2, Search } from "lucide-react";
import { useCMSApi } from "@/hooks/useCMSApi";

type PaymentTab = "donations" | "goldenage";

type DonationRecord = {
  id: string;
  created_at: string;
  amount_cents: number;
  cause: string;
  donor_name: string;
  donor_email: string;
  donor_phone?: string | null;
  status: string;
  stripe_session_id?: string | null;
  stripe_payment_intent?: string | null;
};

type GoldenAgeRecord = {
  id: string;
  created_at: string;
  amount_cents: number;
  registrant_name: string;
  registrant_email: string;
  registrant_phone: string;
  parent_name: string;
  registration_ref: string;
  status: string;
  stripe_session_id?: string | null;
  stripe_payment_intent?: string | null;
};

const statusClasses: Record<string, string> = {
  succeeded: "bg-emerald-100 text-emerald-700",
  paid: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-700",
};

const COMPLETED_STATUSES = new Set(["succeeded", "paid"]);
const FAILED_STATUSES = new Set(["failed", "cancelled"]);

const formatAmount = (amountCents: number) => `₹${Math.round((amountCents || 0) / 100).toLocaleString("en-IN")}`;

const exportCSV = (rows: Record<string, unknown>[], filename: string) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? "").replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const PaymentsManager = () => {
  const { getAll } = useCMSApi();
  const [activeTab, setActiveTab] = useState<PaymentTab>("donations");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [registrations, setRegistrations] = useState<GoldenAgeRecord[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const [donationRows, registrationRows] = await Promise.all([
          getAll("donations"),
          getAll("goldenage_registrations"),
        ]);

        setDonations(Array.isArray(donationRows) ? donationRows : []);
        setRegistrations(Array.isArray(registrationRows) ? registrationRows : []);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [getAll]);

  const rows = activeTab === "donations" ? donations : registrations;

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows.filter((row) => {
      const haystack = activeTab === "donations"
        ? [row.donor_name, row.donor_email, row.cause, row.stripe_payment_intent, row.stripe_session_id]
        : [row.registrant_name, row.registrant_email, row.parent_name, row.registration_ref, row.stripe_payment_intent, row.stripe_session_id];

      const matchesSearch = !query || haystack.some((value) => String(value ?? "").toLowerCase().includes(query));
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [activeTab, rows, search, statusFilter]);

  const statusOptions = useMemo(
    () => Array.from(new Set(rows.map((row) => row.status).filter(Boolean))).sort(),
    [rows],
  );

  const stats = useMemo(() => ({
    total: rows.length,
    completed: rows.filter((row) => COMPLETED_STATUSES.has(row.status)).length,
    pending: rows.filter((row) => row.status === "pending").length,
    failed: rows.filter((row) => FAILED_STATUSES.has(row.status)).length,
  }), [rows]);

  const exportRows = filteredRows.map((row) => activeTab === "donations"
    ? {
        date: new Date(row.created_at).toLocaleString("en-IN"),
        cause: row.cause,
        donor_name: row.donor_name,
        donor_email: row.donor_email,
        donor_phone: row.donor_phone ?? "",
        amount: formatAmount(row.amount_cents),
        status: row.status,
        stripe_payment_intent: row.stripe_payment_intent ?? "",
        stripe_session_id: row.stripe_session_id ?? "",
      }
    : {
        date: new Date(row.created_at).toLocaleString("en-IN"),
        registrant_name: row.registrant_name,
        registrant_email: row.registrant_email,
        registrant_phone: row.registrant_phone,
        parent_name: row.parent_name,
        registration_ref: row.registration_ref,
        amount: formatAmount(row.amount_cents),
        status: row.status,
        stripe_payment_intent: row.stripe_payment_intent ?? "",
        stripe_session_id: row.stripe_session_id ?? "",
      });

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Stripe Payments</h3>
                <p className="text-xs text-muted-foreground">Review every donation and GoldenAge registration charged through checkout.</p>
              </div>
            </div>
            <div className="inline-flex rounded-lg border border-border bg-background p-1">
              {[
                { id: "donations", label: "Donations" },
                { id: "goldenage", label: "GoldenAge Registrations" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as PaymentTab);
                    setStatusFilter("all");
                  }}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => exportCSV(exportRows, activeTab === "donations" ? "stripe-donations.csv" : "goldenage-registrations.csv")}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted/50 transition-colors"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total },
          { label: "Completed", value: stats.completed },
          { label: "Pending", value: stats.pending },
          { label: "Failed", value: stats.failed },
        ].map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-5">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">{card.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={activeTab === "donations" ? "Search donor, cause, or Stripe ID" : "Search registrant, parent, or Stripe ID"}
              className="no-float h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="no-float h-10 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {(activeTab === "donations"
                    ? ["Date", "Cause", "Donor", "Email", "Amount", "Status", "Stripe Payment", "Stripe Session"]
                    : ["Date", "Registrant", "Parent", "Email", "Registration Ref", "Amount", "Status", "Stripe Payment", "Stripe Session"]
                  ).map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString("en-IN")}</td>
                    {activeTab === "donations" ? (
                      <>
                        <td className="px-4 py-3 font-medium text-foreground capitalize">{row.cause}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{row.donor_name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.donor_email}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{formatAmount(row.amount_cents)}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium text-foreground">{row.registrant_name}</td>
                        <td className="px-4 py-3 text-foreground">{row.parent_name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.registrant_email}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.registration_ref}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{formatAmount(row.amount_cents)}</td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusClasses[row.status] || "bg-muted text-muted-foreground"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.stripe_payment_intent || "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.stripe_session_id || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRows.length === 0 && (
              <p className="px-6 py-10 text-center text-sm text-muted-foreground">No matching payments found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsManager;