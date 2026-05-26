import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { updates, updateCategoryColors } from "@/data/updates";
import FadeInUp from "@/components/ui/FadeInUp";
import { Mail, Phone, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import PageHero from "@/components/layout/PageHero";
import { useCMSList } from "@/hooks/useCMSList";
import { useCMSSection } from "@/hooks/useCMSSection";

interface UpdatesPageContent {
  email_heading: string;
  email_subtitle: string;
  email_perks: string[];
  subscribers_label: string;
  whatsapp_heading: string;
  whatsapp_subtitle: string;
  whatsapp_perks: string[];
  whatsapp_phone: string;
  recent_label: string;
  recent_heading: string;
}

const updatesPageFallback: UpdatesPageContent = {
  email_heading: "Monthly Impact Letter",
  email_subtitle: "One email a month. Real stories. Real numbers. Zero spam.",
  email_perks: ["Monthly impact summary","New campaign launches","Beneficiary success stories","Volunteer opportunities"],
  subscribers_label: "500+ subscribers",
  whatsapp_heading: "WhatsApp Field Updates",
  whatsapp_subtitle: "Short, real updates from the field — 2–3 times a month. No spam, ever.",
  whatsapp_perks: ["Field photos and stories","Emergency support alerts","Event announcements"],
  whatsapp_phone: "+919876543210",
  recent_label: "Recent Updates",
  recent_heading: "From the Field",
};

const Updates = () => {
  useSEO("Stay Updated", "Subscribe to AGSWS field updates, impact stories, and campaign news.");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const { data: copy } = useCMSSection<UpdatesPageContent>("updates_page", updatesPageFallback);
  const normalizePerks = (arr: any[]): string[] =>
    (arr || []).map((p: any) => (typeof p === "string" ? p : p?.value)).filter(Boolean);
  const emailPerks = normalizePerks(copy.email_perks as any);
  const whatsappPerks = normalizePerks(copy.whatsapp_perks as any);
  const { data: cmsUpdates } = useCMSList<any>("cms_updates", [], { orderBy: { column: "update_date", ascending: false } });
  const list = cmsUpdates.length
    ? cmsUpdates.map((u: any) => ({
        id: u.id,
        title: u.title,
        excerpt: u.excerpt || "",
        category: (u.category || "field") as keyof typeof updateCategoryColors,
        date: u.update_date || u.created_at,
      }))
    : updates;

  const [subscribing, setSubscribing] = useState(false);
  const handleEmailSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || subscribing) return;
    setSubscribing(true);
    try {
      const { error } = await (supabase.from('newsletter_subscriptions' as any) as any)
        .insert({ email, name: name || null, source: 'updates-page' });
      if (error && (error as any).code !== '23505') throw error;
      // Fire-and-forget welcome email
      supabase.functions.invoke('send-email', {
        body: { type: 'newsletter-welcome', to: email, data: { name } },
      }).catch(err => console.error('[newsletter welcome]', err));
      toast.success("Subscribed! Check your inbox for a confirmation.");
      setEmail(""); setName("");
    } catch (err: any) {
      toast.error(err?.message || "Subscription failed. Try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const handleWhatsApp = () => {
    if (!phone) return;
    const wa = (copy.whatsapp_phone || "+919876543210").replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent("Subscribe to AGSWS Updates")}`, "_blank");
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
              <h3 className="heading-3 text-[var(--dark)] mb-2">{copy.email_heading}</h3>
              <p className="text-sm text-[var(--mid)] mb-4">{copy.email_subtitle}</p>
              <ul className="space-y-2 mb-6">
                {emailPerks.map(item => (
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
              <p className="text-[11px] text-[var(--light)] mt-3 text-center">{copy.subscribers_label}</p>
            </div>
          </FadeInUp>

          {/* WhatsApp */}
          <FadeInUp delay={0.1}>
            <div className="global-card h-full">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center mb-4">
                <Phone size={20} className="text-white" />
              </div>
              <h3 className="heading-3 text-[var(--dark)] mb-2">{copy.whatsapp_heading}</h3>
              <p className="text-sm text-[var(--mid)] mb-4">{copy.whatsapp_subtitle}</p>
              <ul className="space-y-2 mb-6">
                {whatsappPerks.map(item => (
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
            <span className="label">{copy.recent_label}</span>
            <h2 className="heading-2 text-[var(--dark)] mt-3 mb-8">{copy.recent_heading}</h2>
          </FadeInUp>
          <div className="space-y-4">
            {list.map((u: any, i: number) => (
              <FadeInUp key={u.id} delay={i * 0.04}>
                <div className="global-card">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-[var(--light)]">{new Date(u.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${updateCategoryColors[u.category as keyof typeof updateCategoryColors] || "bg-teal"}`}>{u.category}</span>
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
