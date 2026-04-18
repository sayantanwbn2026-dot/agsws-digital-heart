import { useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import toast from "react-hot-toast";

const SiteSettingsForm = () => {
  const [settings, setSettings] = useState({
    name: "AGSWS — The Ascension Group Social Welfare Society",
    tagline: "Serving families across Kolkata with medical aid, education, and emergency care",
    phone: "+91 98765 43210",
    emergencyHotline: "+91 98765 00000",
    email: "contact@agsws.org",
    address: "123 Park Street, Kolkata, WB 700016",
    facebook: "https://facebook.com/agsws",
    twitter: "https://twitter.com/agsws",
    instagram: "https://instagram.com/agsws",
    linkedin: "https://linkedin.com/company/agsws",
    regNumber: "S/IL/2020/XXXXX",
    pan: "AAATA1234Q",
    showAnnouncement: true,
    announcementText: "New: Parent registration now available for Howrah families",
  });

  const update = (key: string, value: string | boolean) => setSettings((s) => ({ ...s, [key]: value }));

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const inputClass = "w-full h-12 px-4 border border-[var(--border-color)] rounded-lg bg-white outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[rgba(31,154,168,0.15)] text-sm transition-all no-float";

  return (
    <div className="max-w-[700px] space-y-10">
      {/* Contact */}
      <section>
        <h3 className="font-semibold text-[var(--dark)] mb-4">Contact & Basic Info</h3>
        <div className="space-y-4">
          <div><label className="text-xs text-[var(--light)] mb-1 block">NGO Name</label><input value={settings.name} onChange={(e) => update("name", e.target.value)} className={inputClass} /></div>
          <div><label className="text-xs text-[var(--light)] mb-1 block">Tagline</label><input value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} className={inputClass} /></div>
          <div><label className="text-xs text-[var(--light)] mb-1 block">Phone</label><input value={settings.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} /></div>
          <div className="bg-[var(--yellow-light)] border border-[var(--yellow)] rounded-lg p-4">
            <label className="text-xs text-[var(--light)] mb-1 block font-semibold">Emergency Hotline</label>
            <input value={settings.emergencyHotline} onChange={(e) => update("emergencyHotline", e.target.value)} className={inputClass} />
            <p className="text-xs text-[var(--light)] mt-1">This number is shown in registration confirmation emails</p>
          </div>
          <div><label className="text-xs text-[var(--light)] mb-1 block">Email</label><input value={settings.email} onChange={(e) => update("email", e.target.value)} className={inputClass} /></div>
          <div><label className="text-xs text-[var(--light)] mb-1 block">Address</label><textarea value={settings.address} onChange={(e) => update("address", e.target.value)} rows={2} className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg bg-white outline-none focus:border-[var(--teal)] text-sm no-float" /></div>
        </div>
      </section>

      {/* Social */}
      <section>
        <h3 className="font-semibold text-[var(--dark)] mb-4">Social Media</h3>
        <div className="space-y-3">
          {[
            { key: "facebook", icon: Facebook, label: "Facebook" },
            { key: "twitter", icon: Twitter, label: "Twitter" },
            { key: "instagram", icon: Instagram, label: "Instagram" },
            { key: "linkedin", icon: Linkedin, label: "LinkedIn" },
          ].map(({ key, icon: Icon, label }) => (
            <div key={key} className="relative">
              <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--light)] z-10" />
              <input value={(settings as any)[key]} onChange={(e) => update(key, e.target.value)} placeholder={label} className={`${inputClass} !pl-12`} />
            </div>
          ))}
        </div>
      </section>

      {/* Certificates */}
      <section>
        <h3 className="font-semibold text-[var(--dark)] mb-4">NGO Documents & Certificates</h3>
        <div className="space-y-3">
          {[
            { key: "regNumber", label: "NGO Registration Number" },
            { key: "pan", label: "PAN" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs text-[var(--light)] mb-1 block">{label}</label>
              <input value={(settings as any)[key]} onChange={(e) => update(key, e.target.value)} className={inputClass} />
              <p className="text-[11px] text-[var(--light)] mt-0.5">Displayed publicly on website and in receipts</p>
            </div>
          ))}
        </div>
      </section>

      {/* Announcement */}
      <section>
        <h3 className="font-semibold text-[var(--dark)] mb-4">Announcement Bar</h3>
        <label className="flex items-center gap-2 cursor-pointer mb-3">
          <input type="checkbox" checked={settings.showAnnouncement} onChange={(e) => update("showAnnouncement", e.target.checked)} className="w-4 h-4 accent-[var(--teal)]" />
          <span className="text-sm text-[var(--mid)]">Show announcement bar above navbar</span>
        </label>
        <div className="relative">
          <input value={settings.announcementText} onChange={(e) => update("announcementText", e.target.value.slice(0, 120))} className={inputClass} maxLength={120} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[var(--light)]">{settings.announcementText.length}/120</span>
        </div>
      </section>

      <button onClick={handleSave} className="bg-[var(--teal)] text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
        Save Settings
      </button>
    </div>
  );
};

export default SiteSettingsForm;
