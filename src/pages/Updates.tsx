import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { updates, updateCategoryColors } from "@/data/updates";
import FadeInUp from "@/components/ui/FadeInUp";
import { Mail, Phone, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import PageHero from "@/components/layout/PageHero";

const Updates = () => {
  useSEO("Stay Updated", "Subscribe to AGSWS field updates, impact stories, and campaign news.");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleEmailSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! Check your inbox for a confirmation.");
    setEmail(""); setName("");
  };

  const handleWhatsApp = () => {
    if (!phone) return;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent("Subscribe to AGSWS Updates")}`, "_blank");
  };

  return (
    <main id="main-content">
      <PageHero title="Stay Updated" size="sm" breadcrumb={[{ label: "Home", href: "/" }, { label: "Updates" }]} />

      <section className="bg-[var(--bg)] py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-8">
          {/* Email */}
          <FadeInUp>
            <div className="global-card h-full">
              <Mail size={40} className="text-[var(--teal)] mb-4" />
              <h3 className="heading-3 text-[var(--dark)] mb-2">Monthly Impact Letter</h3>
              <p className="text-sm text-[var(--mid)] mb-4">One email a month. Real stories. Real numbers. Zero spam.</p>
              <ul className="space-y-2 mb-6">
                {["Monthly impact summary", "New campaign launches", "80G filing reminders (March/April)", "Volunteer opportunities"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[var(--mid)]">
                    <CheckCircle size={14} className="text-[var(--teal)] flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
              <form onSubmit={handleEmailSub} className="space-y-3">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="no-float" />
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email address" required className="no-float" />
                <button type="submit" className="w-full bg-[var(--yellow)] text-[var(--dark)] font-semibold py-2.5 rounded-full text-sm hover:shadow-[var(--shadow-yellow)] transition-shadow">Subscribe →</button>
              </form>
              <p className="text-[11px] text-[var(--light)] mt-3 text-center">500+ subscribers</p>
            </div>
          </FadeInUp>

          {/* WhatsApp */}
          <FadeInUp delay={0.1}>
            <div className="global-card h-full">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center mb-4">
                <Phone size={20} className="text-white" />
              </div>
              <h3 className="heading-3 text-[var(--dark)] mb-2">WhatsApp Field Updates</h3>
              <p className="text-sm text-[var(--mid)] mb-4">Short, real updates from the field — 2–3 times a month. No spam, ever.</p>
              <ul className="space-y-2 mb-6">
                {["Field photos and stories", "Emergency support alerts", "Event announcements"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-[var(--mid)]">
                    <CheckCircle size={14} className="text-[#25D366] flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--light)] font-medium z-10">+91</span>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="98765 43210" className="!pl-12 no-float" />
                </div>
                <button onClick={handleWhatsApp} className="w-full bg-[#25D366] text-white font-semibold py-2.5 rounded-full text-sm hover:bg-[#20BA5B] transition-colors">Join on WhatsApp →</button>
              </div>
              <p className="text-[11px] text-[var(--light)] mt-3">We use WhatsApp broadcasts — your number stays private.</p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Recent Updates */}
      <section className="bg-[var(--white)] py-16">
        <div className="max-w-[800px] mx-auto px-6">
          <FadeInUp>
            <span className="label">Recent Updates</span>
            <h2 className="heading-2 text-[var(--dark)] mt-3 mb-8">From the Field</h2>
          </FadeInUp>
          <div className="space-y-4">
            {updates.map((u, i) => (
              <FadeInUp key={u.id} delay={i * 0.04}>
                <div className="global-card">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-[var(--light)]">{new Date(u.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${updateCategoryColors[u.category]}`}>{u.category}</span>
                  </div>
                  <h4 className="font-semibold text-[var(--dark)] mb-1">{u.title}</h4>
                  <p className="text-sm text-[var(--mid)] line-clamp-2">{u.excerpt}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Updates;
