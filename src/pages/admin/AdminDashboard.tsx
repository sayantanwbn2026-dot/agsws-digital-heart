import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Heart, BookOpen, Users, HandHeart, FileText, Mail, Settings, LogOut } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DonationsTable from "./components/DonationsTable";
import RegistrationsTable from "./components/RegistrationsTable";
import ResourcesManager from "./components/ResourcesManager";
import EmailComposer from "./components/EmailComposer";
import SiteSettingsForm from "./components/SiteSettingsForm";
import { useAdminAPI } from "@/hooks/useAdminAPI";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "medical", label: "Medical Donations", icon: Heart },
  { id: "education", label: "Education Donations", icon: BookOpen },
  { id: "registrations", label: "Parent Registrations", icon: Users },
  { id: "volunteers", label: "Volunteers", icon: HandHeart },
  { id: "resources", label: "Resources", icon: FileText },
  { id: "email", label: "Email Donors", icon: Mail },
  { id: "settings", label: "Site Settings", icon: Settings },
];

const chartMonths = ["Oct","Nov","Dec","Jan","Feb","Mar"];
const defaultChart = chartMonths.map(m => ({ month: m, Medical: 0, Education: 0 }));
const defaultSummary = [
  { label: "Total Medical Donations", value: "—", count: "Loading…", color: "text-teal" },
  { label: "Total Education Donations", value: "—", count: "Loading…", color: "text-purple" },
  { label: "Parent Registrations", value: "—", count: "Loading…", color: "text-teal" },
  { label: "Volunteers", value: "—", count: "Loading…", color: "text-yellow" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { adminFetch } = useAdminAPI();
  const [summaryCards, setSummaryCards] = useState(defaultSummary);
  const [chartData, setChartData] = useState(defaultChart);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [volLoading, setVolLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/summary", "GET").then(data => {
      if (!data || data.error) return;
      setSummaryCards([
        { label: "Total Medical Donations", value: data.medical_total ? `₹${Number(data.medical_total).toLocaleString("en-IN")}` : "₹0", count: `${data.medical_count ?? 0} donations`, color: "text-teal" },
        { label: "Total Education Donations", value: data.education_total ? `₹${Number(data.education_total).toLocaleString("en-IN")}` : "₹0", count: `${data.education_count ?? 0} donations`, color: "text-purple" },
        { label: "Parent Registrations", value: String(data.registrations_total ?? 0), count: `${data.registrations_active ?? 0} Active · ${data.registrations_pending ?? 0} Pending`, color: "text-teal" },
        { label: "Volunteers", value: String(data.volunteers_total ?? 0), count: `${data.volunteers_active ?? 0} Active`, color: "text-yellow" },
      ]);
      if (Array.isArray(data.monthly_chart)) setChartData(data.monthly_chart);
    }).catch(() => {});

    setVolLoading(true);
    adminFetch("/api/admin/volunteers", "GET")
      .then(data => { if (Array.isArray(data)) setVolunteers(data); })
      .catch(() => {})
      .finally(() => setVolLoading(false));
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("agsws_admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="global-card w-[240px] flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-border">
          <span className="font-bold text-lg text-teal">AGSWS</span>
          <span className="ml-2 text-[11px] bg-teal text-primary-foreground px-2 py-0.5 rounded-full font-medium">Admin</span>
        </div>
        <nav className="flex-1 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all ${activeTab === tab.id ? "bg-teal-light text-teal border-l-[3px] border-teal" : "text-text-mid hover:bg-background border-l-[3px] border-transparent"}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="global-card h-14 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-sm font-semibold text-text-dark">{tabs.find((t) => t.id === activeTab)?.label}</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-light">admin@agsws.org</span>
            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-xs text-text-mid border border-border px-3 py-1.5 rounded-full hover:bg-background transition-colors">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-3 lg:gap-5">
                {summaryCards.map((card) => (
                  <div key={card.label} className="global-card">
                    <p className="text-xs text-text-light uppercase tracking-wide mb-2">{card.label}</p>
                    <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                    <p className="text-xs text-text-mid mt-1">{card.count}</p>
                  </div>
                ))}
              </div>
              <div className="global-card">
                <h3 className="font-semibold text-text-dark mb-4">Donations — Last 6 Months</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 91%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Medical" fill="hsl(187 70% 39%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Education" fill="hsl(242 29% 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "medical" && <DonationsTable gateway="Medical Aid" color="teal" />}
          {activeTab === "education" && <DonationsTable gateway="Education" color="purple" showTier />}
          {activeTab === "registrations" && <RegistrationsTable />}

          {activeTab === "volunteers" && (
            <div className="global-card">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h3 className="font-semibold text-text-dark">Volunteers</h3>
                <button className="border border-teal text-teal text-xs font-medium px-4 py-2 rounded-full hover:bg-teal-light transition-colors">Export CSV</button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Name", "Email", "Phone", "City", "Role Interest", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase text-text-light tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map((v, i) => (
                    <tr key={v.id ?? i} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                      <td className="px-4 py-3 font-medium text-text-dark">{v.name ?? "—"}</td>
                      <td className="px-4 py-3 text-text-mid">{v.email ?? "—"}</td>
                      <td className="px-4 py-3 text-text-mid">{v.phone ?? "—"}</td>
                      <td className="px-4 py-3 text-text-mid">{v.registrant_city ?? v.city ?? "—"}</td>
                      <td className="px-4 py-3 text-text-mid">{v.role_interest ?? v.role ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${(v.status === "Active" || v.status === "active") ? "bg-teal-light text-teal" : (v.status === "New" || v.status === "new") ? "bg-yellow-light text-yellow" : "bg-purple-light text-purple"}`}>{v.status}</span>
                      </td>
                      <td className="px-4 py-3 text-text-light text-xs">{v.created_at ? new Date(v.created_at).toLocaleDateString("en-IN") : v.date ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "resources" && <ResourcesManager />}
          {activeTab === "email" && <EmailComposer />}
          {activeTab === "settings" && <SiteSettingsForm />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
