import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Heart, BookOpen, Users, HandHeart, FileText, Mail, Settings, LogOut } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DonationsTable from "./components/DonationsTable";
import RegistrationsTable from "./components/RegistrationsTable";
import ResourcesManager from "./components/ResourcesManager";
import EmailComposer from "./components/EmailComposer";
import SiteSettingsForm from "./components/SiteSettingsForm";

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

const chartData = [
  { month: "Oct", Medical: 85000, Education: 42000 },
  { month: "Nov", Medical: 120000, Education: 65000 },
  { month: "Dec", Medical: 98000, Education: 78000 },
  { month: "Jan", Medical: 145000, Education: 52000 },
  { month: "Feb", Medical: 110000, Education: 88000 },
  { month: "Mar", Medical: 132000, Education: 95000 },
];

const summaryCards = [
  { label: "Total Medical Donations", value: "₹6,90,000", count: "147 donations", color: "text-teal" },
  { label: "Total Education Donations", value: "₹4,20,000", count: "98 donations", color: "text-purple" },
  { label: "Parent Registrations", value: "120", count: "89 Active · 31 Pending", color: "text-teal" },
  { label: "Volunteers", value: "42", count: "28 Active", color: "text-yellow" },
];

const mockVolunteers = [
  { name: "Ankit Roy", email: "ankit@email.com", phone: "+91 98765 11111", city: "Kolkata", role: "Field Work", status: "Active", date: "2025-01-10" },
  { name: "Priya Sen", email: "priya@email.com", phone: "+91 98765 22222", city: "Howrah", role: "Medical Camps", status: "New", date: "2025-03-01" },
  { name: "Ramesh Das", email: "ramesh@email.com", phone: "+91 98765 33333", city: "Kolkata", role: "Education", status: "Contacted", date: "2025-02-15" },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("agsws_admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-[240px] bg-card border-r border-border flex flex-col shrink-0 sticky top-0 h-screen">
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
        <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {summaryCards.map((card) => (
                  <div key={card.label} className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <p className="text-xs text-text-light uppercase tracking-wide mb-2">{card.label}</p>
                    <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                    <p className="text-xs text-text-mid mt-1">{card.count}</p>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
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
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
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
                  {mockVolunteers.map((v, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-background transition-colors">
                      <td className="px-4 py-3 font-medium text-text-dark">{v.name}</td>
                      <td className="px-4 py-3 text-text-mid">{v.email}</td>
                      <td className="px-4 py-3 text-text-mid">{v.phone}</td>
                      <td className="px-4 py-3 text-text-mid">{v.city}</td>
                      <td className="px-4 py-3 text-text-mid">{v.role}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${v.status === "Active" ? "bg-teal-light text-teal" : v.status === "New" ? "bg-yellow-light text-yellow" : "bg-purple-light text-purple"}`}>{v.status}</span>
                      </td>
                      <td className="px-4 py-3 text-text-light text-xs">{v.date}</td>
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
