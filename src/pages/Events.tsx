import { useState, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { events, eventTypeLabels, eventTypeColors, type AGSWSEvent } from "@/data/events";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import PageHero from "@/components/layout/PageHero";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, X, ChevronLeft, ChevronRight, Calendar, Users, ArrowRight, Sparkles } from "lucide-react";

const filterTypes = ["all", "medical", "education", "registration", "awareness", "volunteer"] as const;
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const EventCard = ({ event, onClick, index }: { event: AGSWSEvent; onClick: () => void; index: number }) => {
  const d = new Date(event.date);
  const spotsLeft = event.capacity - event.registered;
  const pct = (event.registered / event.capacity) * 100;

  const typeGradients: Record<string, string> = {
    medical: "from-[var(--teal)] to-[var(--teal-dark)]",
    education: "from-[var(--purple)] to-[#4A48A0]",
    registration: "from-[var(--yellow)] to-[#D9A404]",
    awareness: "from-[var(--beige)] to-[#9A8A6E]",
    volunteer: "from-[var(--teal-dark)] to-[#0D1B1C]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -5 }}
      className={`group relative bg-white rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] overflow-hidden transition-shadow duration-300 hover:shadow-[var(--shadow-lg)] ${event.isPast ? "opacity-60" : ""}`}
    >
      {/* Top gradient accent */}
      <div className={`h-1 bg-gradient-to-r ${typeGradients[event.type]}`} />

      <div className="p-6">
        <div className="flex items-start gap-5">
          {/* Date badge */}
          <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${typeGradients[event.type]} flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]`}>
            <span className="text-white font-[800] text-[22px] leading-none">{d.getDate()}</span>
            <span className="text-white/70 text-[9px] font-[600] uppercase mt-0.5">{months[d.getMonth()]?.slice(0, 3)}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-[600] px-2.5 py-1 rounded-full uppercase tracking-[0.04em] ${eventTypeColors[event.type]}`}>
                {eventTypeLabels[event.type]}
              </span>
              {!event.isPast && spotsLeft < 20 && (
                <span className="text-[10px] font-[600] px-2 py-0.5 rounded-full bg-red-50 text-red-600">
                  {spotsLeft} spots left
                </span>
              )}
            </div>
            <h3 className="font-[700] text-[17px] text-[var(--dark)] mb-2 tracking-[-0.01em] line-clamp-1">{event.title}</h3>
            <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-4 text-[12px] text-[var(--mid)]">
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[var(--teal)]" />{event.venue}, {event.location}</span>
              <span className="flex items-center gap-1.5"><Clock size={12} className="text-[var(--teal)]" />{event.time}</span>
            </div>
          </div>
        </div>

        <p className="text-[13px] text-[var(--mid)] line-clamp-2 mt-4 leading-relaxed">{event.description}</p>

        {/* Progress bar */}
        {!event.isPast && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-[11px] font-[500] text-[var(--light)] mb-1.5">
              <span>{event.registered} registered</span>
              <span>{Math.round(pct)}% full</span>
            </div>
            <div className="h-1.5 bg-[var(--bg)] rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${typeGradients[event.type]}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-5">
          {!event.isPast ? (
            <button className="flex items-center gap-1.5 text-[13px] font-[700] text-white bg-gradient-to-r from-[var(--teal)] to-[var(--teal-dark)] px-5 py-2.5 rounded-full hover:shadow-[0_8px_20px_rgba(31,154,168,0.25)] transition-shadow">
              Register Free <ArrowRight size={14} />
            </button>
          ) : (
            <span className="text-[12px] font-[600] text-[var(--light)] bg-[var(--bg)] px-4 py-2 rounded-full">Completed</span>
          )}
          <button onClick={onClick} className="text-[13px] font-[600] text-[var(--teal)] hover:underline transition-colors">
            Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const MiniCalendar = ({ month, year, events: evts, onChangeMonth }: {
  month: number; year: number; events: AGSWSEvent[]; onChangeMonth: (d: number) => void;
}) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const eventDates = new Set(evts.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).map(e => new Date(e.date).getDate()));

  return (
    <div className="bg-white rounded-[20px] border border-[var(--border-color)] shadow-[var(--shadow-card)] p-6">
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => onChangeMonth(-1)} className="w-8 h-8 rounded-lg hover:bg-[var(--bg)] flex items-center justify-center transition-colors"><ChevronLeft size={16} /></button>
        <span className="font-[700] text-[14px] text-[var(--dark)]">{months[month]} {year}</span>
        <button onClick={() => onChangeMonth(1)} className="w-8 h-8 rounded-lg hover:bg-[var(--bg)] flex items-center justify-center transition-colors"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <span key={i} className="text-[10px] font-[600] text-[var(--light)] py-1.5 uppercase">{d}</span>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <span key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
          const hasEvent = eventDates.has(day);
          return (
            <button key={day} className={`relative w-9 h-9 text-[12px] rounded-xl transition-all duration-200 ${isToday ? "bg-gradient-to-br from-[var(--teal)] to-[var(--teal-dark)] text-white font-[700] shadow-sm" : "text-[var(--dark)] hover:bg-[var(--bg)]"}`}>
              {day}
              {hasEvent && !isToday && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--teal)]" />}
            </button>
          );
        })}
      </div>

      {/* Upcoming event mini list */}
      <div className="mt-6 pt-5 border-t border-[var(--border-color)]">
        <p className="text-[10px] font-[600] uppercase tracking-[0.08em] text-[var(--teal)] mb-3">Next Up</p>
        {evts.filter(e => !e.isPast).slice(0, 2).map(e => (
          <div key={e.id} className="flex items-center gap-3 py-2">
            <div className="w-2 h-2 rounded-full bg-[var(--teal)] flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[12px] font-[600] text-[var(--dark)] truncate">{e.title}</p>
              <p className="text-[11px] text-[var(--light)]">{new Date(e.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Events = () => {
  useSEO("Events & Campaigns", "Medical camps, school programmes, and community drives in Kolkata by AGSWS.");
  const [filter, setFilter] = useState<string>("all");
  const [showPast, setShowPast] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AGSWSEvent | null>(null);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const upcoming = useMemo(() => events.filter(e => !e.isPast && (filter === "all" || e.type === filter)), [filter]);
  const past = useMemo(() => events.filter(e => e.isPast && (filter === "all" || e.type === filter)), [filter]);

  const changeMonth = (dir: number) => {
    let m = calMonth + dir;
    let y = calYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCalMonth(m);
    setCalYear(y);
  };

  return (
    <main id="main-content">
      <PageHero
        title="Events & Campaigns"
        label="Community"
        subtitle="Medical camps, school programmes, and community drives — happening near you in Kolkata."
        size="md"
        bgVariant="teal"
      />

      {/* Stats bar */}
      <div className="bg-white border-b border-[var(--border-color)]">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] py-5 flex flex-wrap justify-center gap-8">
          {[
            { icon: Calendar, value: upcoming.length.toString(), label: "Upcoming" },
            { icon: Users, value: "2,400+", label: "Attendees" },
            { icon: Sparkles, value: past.length.toString(), label: "Completed" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--teal-light)] flex items-center justify-center">
                <Icon size={16} className="text-[var(--teal)]" />
              </div>
              <div>
                <p className="text-[16px] font-[800] text-[var(--dark)] leading-none">{value}</p>
                <p className="text-[11px] text-[var(--light)] font-[500]">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="sticky top-[56px] z-30 bg-white/80 backdrop-blur-lg border-b border-[var(--border-color)]">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {filterTypes.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-[12px] font-[600] whitespace-nowrap transition-all duration-200 ${filter === f ? "bg-[var(--teal)] text-white shadow-[0_4px_12px_rgba(31,154,168,0.25)]" : "bg-[var(--bg)] text-[var(--mid)] border border-[var(--border-color)] hover:border-[var(--teal)] hover:text-[var(--teal)]"}`}
            >
              {f === "all" ? "All Events" : eventTypeLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="bg-[var(--bg)] py-12 lg:py-16">
        <div className="max-w-[var(--container)] mx-auto px-[var(--container-px)] grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Events list */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative rounded-full h-2 w-2 bg-green-500" /></span>
              <span className="text-[11px] font-[600] text-[var(--teal)] uppercase tracking-[0.09em]">Upcoming Events</span>
            </div>

            <div className="space-y-4">
              {upcoming.map((evt, i) => (
                <EventCard key={evt.id} event={evt} onClick={() => setSelectedEvent(evt)} index={i} />
              ))}
              {upcoming.length === 0 && (
                <div className="text-center py-16">
                  <Calendar size={40} className="text-[var(--border-color)] mx-auto mb-4" />
                  <p className="text-[var(--mid)] text-[14px]">No upcoming events in this category.</p>
                </div>
              )}
            </div>

            {past.length > 0 && (
              <div className="mt-10">
                <button onClick={() => setShowPast(!showPast)} className="flex items-center gap-2 text-[13px] font-[600] text-[var(--light)] hover:text-[var(--teal)] transition-colors">
                  {showPast ? "Hide" : `Show ${past.length}`} past events
                  <motion.span animate={{ rotate: showPast ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronLeft size={14} className="-rotate-90" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {showPast && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 mt-4 overflow-hidden"
                    >
                      {past.map((evt, i) => (
                        <EventCard key={evt.id} event={evt} onClick={() => setSelectedEvent(evt)} index={i} />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-[120px] space-y-6">
              <MiniCalendar month={calMonth} year={calYear} events={events} onChangeMonth={changeMonth} />
            </div>
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D1B1C]/70 backdrop-blur-md p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 28, stiffness: 250 }}
              className="bg-white rounded-[24px] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[0_32px_80px_rgba(0,0,0,0.3)]"
              onClick={e => e.stopPropagation()}
            >
              <ImagePlaceholder category={selectedEvent.type === "education" ? "classroom" : selectedEvent.type === "registration" ? "elderly" : "medical"} className="w-full h-[200px] rounded-t-[24px]" />
              <div className="p-7">
                <div className="flex items-start justify-between mb-5">
                  <h2 className="text-[22px] font-[800] text-[var(--dark)] pr-8 tracking-[-0.02em] leading-tight">{selectedEvent.title}</h2>
                  <button onClick={() => setSelectedEvent(null)} className="w-9 h-9 rounded-full bg-[var(--bg)] hover:bg-[var(--border-color)] flex items-center justify-center transition-colors flex-shrink-0">
                    <X size={16} />
                  </button>
                </div>
                <div className="space-y-2.5 text-[13px] text-[var(--mid)] mb-5">
                  <p className="flex items-center gap-2"><Clock size={14} className="text-[var(--teal)]" />{new Date(selectedEvent.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} • {selectedEvent.time}</p>
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-[var(--teal)]" />{selectedEvent.venue}, {selectedEvent.location}</p>
                  <p className="flex items-center gap-2"><Users size={14} className="text-[var(--teal)]" />{selectedEvent.capacity} expected attendees</p>
                </div>
                <p className="text-[14px] text-[var(--mid)] leading-[1.7] mb-6">{selectedEvent.description}</p>
                {!selectedEvent.isPast && (
                  <button className="w-full bg-gradient-to-r from-[var(--teal)] to-[var(--teal-dark)] text-white font-[700] text-[14px] h-[48px] rounded-full hover:shadow-[0_8px_24px_rgba(31,154,168,0.3)] transition-shadow">
                    Register for This Event →
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Events;
