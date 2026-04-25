import { useSearchParams, Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Check, ArrowLeft, Share2, Download } from "lucide-react";
import { events as fallbackEvents, type AGSWSEvent } from "@/data/events";
import { useCMSList } from "@/hooks/useCMSList";
import { PremiumInput, PremiumSelect, PremiumCard, PremiumButton } from "@/components/ui/PremiumFormElements";
import { useMemo, useState } from "react";
import FadeInUp from "@/components/ui/FadeInUp";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { isValidEmail, normalizeEmail, isValidIndianPhone } from "@/lib/validation";

const EventRegistration = () => {
  const [params] = useSearchParams();
  const eventId = params.get("event") || "";
  const { data: cmsEvents } = useCMSList<any>("cms_events", [], { orderBy: { column: "event_date", ascending: false } });

  const event: AGSWSEvent | undefined = useMemo(() => {
    // Try CMS by id first
    const cms = cmsEvents.find((e: any) => e.id === eventId);
    if (cms) {
      return {
        id: cms.id,
        title: cms.title,
        type: "medical",
        date: cms.event_date || cms.created_at,
        time: cms.event_date ? new Date(cms.event_date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "",
        venue: cms.location || "",
        location: cms.location || "",
        description: cms.description || "",
        capacity: cms.capacity || 100,
        registered: 0,
        isPast: cms.event_date ? new Date(cms.event_date) < new Date() : false,
      };
    }
    // Fallback: match by id OR by slugified title for legacy links
    return fallbackEvents.find(e => e.id === eventId || e.title.toLowerCase().replace(/\s+/g, "-") === eventId);
  }, [cmsEvents, eventId]);

  const [registered, setRegistered] = useState(false);
  const [waitlisted, setWaitlisted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationRef, setApplicationRef] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", attendees: "1", source: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!event) return;
    if (submitting) return;

    // Client-side validation — surface specific errors instead of letting
    // an opaque DB rejection bubble up.
    const name = form.name.trim();
    const email = normalizeEmail(form.email);
    if (name.length < 2) { toast.error("Please enter your full name."); return; }
    if (!isValidEmail(email)) { toast.error("Please enter a valid email address."); return; }
    if (!isValidIndianPhone(form.phone)) { toast.error("Please enter a valid 10-digit phone number."); return; }

    setSubmitting(true);
    const requestedSeats = Number(form.attendees) || 1;

    // Capacity check: count seats already taken (confirmed only) for this event
    let confirmedSeats = 0;
    try {
      const { data: existing } = await (supabase.from("support_applications" as any) as any)
        .select("form_data,status")
        .eq("type", "event_registration")
        .neq("status", "rejected");
      const sameEvent = (existing || []).filter((r: any) => r?.form_data?.event_id === event.id && r?.status !== "waitlisted");
      confirmedSeats = sameEvent.reduce((sum: number, r: any) => sum + (Number(r?.form_data?.attendees) || 1), 0);
    } catch {
      // If the read is blocked by RLS, fall back to confirmed status
    }
    const remaining = Math.max(0, (event.capacity || 0) - confirmedSeats);
    const willWaitlist = requestedSeats > remaining;
    const finalStatus = willWaitlist ? "waitlisted" : "pending";

    const { data: inserted, error } = await (supabase.from("support_applications" as any) as any).insert({
      type: "event_registration",
      applicant_name: name,
      email,
      phone: form.phone.trim(),
      status: finalStatus,
      form_data: {
        event_id: event.id,
        event_title: event.title,
        event_date: event.date,
        event_location: event.location,
        attendees: requestedSeats,
        source: form.source,
        waitlisted: willWaitlist,
      },
    }).select("application_ref").maybeSingle();

    if (error) {
      setSubmitting(false);
      toast.error("Could not register. Please try again.");
      return;
    }

    // Fire-and-forget confirmation email
    try {
      await supabase.functions.invoke("send-email", {
        body: {
          type: "event-confirmation",
          to: email,
          data: {
            applicant_name: name,
            event_title: event.title,
            event_date: event.date,
            location: event.location,
            attendees: requestedSeats,
            status: finalStatus,
            application_ref: inserted?.application_ref,
          },
        },
      });
    } catch {
      // Email failure should not block confirmation UI
    }

    setSubmitting(false);
    setApplicationRef(inserted?.application_ref || null);
    setWaitlisted(willWaitlist);
    setRegistered(true);
    toast.success(willWaitlist ? "Added to waitlist" : "Registration complete!");
  }

  useSEO("Event Registration", event ? `Register for ${event.title}` : "Register for AGSWS events.");

  if (registered && event) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} className="text-center max-w-lg mx-auto px-6 py-16">
          <div className={`w-20 h-20 ${waitlisted ? "bg-gradient-to-br from-[var(--yellow)] to-[#D89F04]" : "bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)]"} rounded-full flex items-center justify-center mx-auto mb-6 shadow-[var(--shadow-lg)]`}>
            <Check size={40} className="text-white" />
          </div>
          <h2 className={`text-[28px] font-[800] mb-2 ${waitlisted ? "text-[#B8860B]" : "text-[var(--teal)]"}`}>
            {waitlisted ? "You're on the Waitlist" : "You're Registered!"}
          </h2>
          <p className="text-[16px] text-[var(--mid)] mb-6">
            {waitlisted
              ? `This event is full. We'll email you the moment a seat opens for ${event.title}.`
              : `Confirmation sent to your email. See you at ${event.title}.`}
          </p>
          {applicationRef && (
            <p className="text-[11px] text-[var(--light)] uppercase tracking-[0.12em] mb-4">
              Reference: <span className="font-mono text-[var(--dark)]">{applicationRef}</span>
            </p>
          )}
          <PremiumCard className="text-left !p-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3"><Calendar size={16} className="text-[var(--teal)]" /><span className="text-[14px] text-[var(--dark)]">{new Date(event.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span></div>
              <div className="flex items-center gap-3"><Clock size={16} className="text-[var(--teal)]" /><span className="text-[14px] text-[var(--dark)]">{event.time}</span></div>
              <div className="flex items-center gap-3"><MapPin size={16} className="text-[var(--teal)]" /><span className="text-[14px] text-[var(--dark)]">{event.location}</span></div>
            </div>
          </PremiumCard>
          <div className="flex gap-3 justify-center">
            <PremiumButton variant="secondary" icon={<Download size={14} />}>Add to Calendar</PremiumButton>
            <PremiumButton variant="secondary" icon={<Share2 size={14} />}>Share Event</PremiumButton>
          </div>
          <Link to="/events" className="text-[var(--teal)] text-[14px] font-[600] mt-6 inline-block hover:underline">← Back to Events</Link>
        </motion.div>
      </main>
    );
  }

  if (!event) {
    return (
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center px-6">
          <h2 className="text-[24px] font-[700] text-[var(--dark)] mb-4">Event Not Found</h2>
          <Link to="/events" className="text-[var(--teal)] font-[600] hover:underline">← Browse Events</Link>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="bg-[var(--bg)] min-h-screen">
      <div className="max-w-[900px] mx-auto px-6 py-16 lg:py-24">
        <Link to="/events" className="inline-flex items-center gap-2 text-[var(--teal)] text-[13px] font-[600] mb-8 hover:underline">
          <ArrowLeft size={14} /> Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          <FadeInUp>
            <PremiumCard>
              <h2 className="text-[24px] font-[800] text-[var(--dark)] mb-2">Register for Event</h2>
              <p className="text-[14px] text-[var(--mid)] mb-8">{event.title}</p>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <PremiumInput label="Full Name" required placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <PremiumInput label="Email" required type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <PremiumInput label="Phone" required type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  <PremiumSelect label="Attendees" required value={form.attendees} onChange={e => setForm({ ...form, attendees: e.target.value })}>
                    <option value="1">1 Person</option>
                    <option value="2">2 People</option>
                    <option value="3">3 People</option>
                    <option value="4">4+ People</option>
                  </PremiumSelect>
                </div>
                <PremiumSelect label="How did you hear about us?" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
                  <option value="">Select</option>
                  <option>Social Media</option>
                  <option>Friend / Family</option>
                  <option>AGSWS Website</option>
                  <option>WhatsApp</option>
                  <option>Other</option>
                </PremiumSelect>
                <PremiumButton type="submit" className="w-full" disabled={submitting}>{submitting ? "Registering…" : "Register Now →"}</PremiumButton>
              </form>
            </PremiumCard>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <div className="lg:sticky lg:top-24 space-y-5">
              <PremiumCard className="!p-6">
                <h4 className="text-[14px] font-[700] text-[var(--dark)] mb-4">Event Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3"><Calendar size={16} className="text-[var(--teal)]" /><span className="text-[13px] text-[var(--mid)]">{new Date(event.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</span></div>
                  <div className="flex items-center gap-3"><Clock size={16} className="text-[var(--teal)]" /><span className="text-[13px] text-[var(--mid)]">{event.time}</span></div>
                  <div className="flex items-center gap-3"><MapPin size={16} className="text-[var(--teal)]" /><span className="text-[13px] text-[var(--mid)]">{event.location}</span></div>
                </div>
                <div className="mt-5 pt-5 border-t border-[var(--border-color)]">
                  <div className="flex justify-between text-[13px] mb-2">
                    <span className="text-[var(--light)]">Spots filled</span>
                    <span className="font-[600] text-[var(--dark)]">{event.registered}/{event.capacity}</span>
                  </div>
                  <div className="h-2 bg-[var(--border-color)] rounded-full overflow-hidden">
                    <motion.div className="h-full bg-gradient-to-r from-[var(--teal)] to-[var(--teal-dark)] rounded-full" initial={{ width: 0 }} animate={{ width: `${(event.registered / event.capacity) * 100}%` }} transition={{ duration: 1, ease: "easeOut" }} />
                  </div>
                </div>
              </PremiumCard>
              <div className="bg-[var(--teal-light)] rounded-[20px] p-5 text-center">
                <p className="text-[13px] text-[var(--teal)] font-[600]">Free Entry • Open to All</p>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </main>
  );
};

export default EventRegistration;
