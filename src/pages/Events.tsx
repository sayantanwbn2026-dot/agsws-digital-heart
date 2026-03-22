import { useState, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { events, eventTypeLabels, eventTypeColors, type AGSWSEvent } from "@/data/events";
import FadeInUp from "@/components/ui/FadeInUp";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, X, ChevronLeft, ChevronRight } from "lucide-react";

const filterTypes = ["all", "medical", "education", "registration", "awareness", "volunteer"] as const;

const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const EventCard = ({ event, onClick }: { event: AGSWSEvent; onClick: () => void }) => {
  const d = new Date(event.date);
  const spotsLeft = event.capacity - event.registered;
  const pct = (event.registered / event.capacity) * 100;
  const stripColors: Record<string, string> = {
    medical: "bg-teal", education: "bg-purple", registration: "bg-yellow",
    awareness: "bg-beige", volunteer: "bg-teal-dark",
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`bg-card border border-border rounded-xl shadow-brand-sm overflow-hidden flex transition-shadow duration-300 hover:shadow-brand-lg ${event.isPast ? "opacity-75" : ""}`}
    >
      <div className={`w-20 flex-shrink-0 ${stripColors[event.type]} flex flex-col items-center justify-center`}>
        <span className="text-primary-foreground font-extrabold text-[28px] leading-none">{d.getDate()}</span>
        <span className="text-primary-foreground/80 text-[10px] font-semibold uppercase mt-1">{months[d.getMonth()]?.slice(0, 3)}</span>
      </div>
      <div className="flex-1 p-5 relative">
        <span className={`absolute top-4 right-4 text-[10px] font-semibold px-2.5 py-1 rounded-full ${eventTypeColors[event.type]}`}>
          {eventTypeLabels[event.type]}
        </span>
        <h3 className="font-bold text-lg text-text-dark pr-28 mb-2">{event.title}</h3>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 text-[13px] text-text-mid mb-2">
          <span className="flex items-center gap-1.5"><MapPin size={14} className="text-teal" />{event.venue}, {event.location}</span>
          <span className="flex items-center gap-1.5"><Clock size={14} className="text-teal" />{event.time}</span>
        </div>
        <p className="text-sm text-text-mid line-clamp-2 mb-4">{event.description}</p>
        <div className="flex items-center gap-3">
          <button onClick={onClick} className="text-sm font-medium text-teal border border-teal px-4 py-2 rounded-full hover:bg-teal-light transition-colors">
            Learn More
          </button>
          {!event.isPast ? (
            <button className="text-sm font-semibold text-primary-foreground bg-teal px-4 py-2 rounded-full hover:bg-teal-dark transition-colors">
              Register Free →
            </button>
          ) : (
            <span className="text-xs font-semibold text-text-light bg-background px-3 py-1.5 rounded-full">Completed</span>
          )}
        </div>
        {!event.isPast && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] font-medium text-text-mid mb-1">
              <span>{spotsLeft} spots left</span>
              <span>{Math.round(pct)}%</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-teal rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
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
    <div className="bg-card border border-border rounded-xl p-5 shadow-brand-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => onChangeMonth(-1)} className="p-1 hover:bg-background rounded"><ChevronLeft size={16} /></button>
        <span className="font-semibold text-sm text-text-dark">{months[month]} {year}</span>
        <button onClick={() => onChangeMonth(1)} className="p-1 hover:bg-background rounded"><ChevronRight size={16} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <span key={i} className="text-[10px] font-semibold text-text-light py-1">{d}</span>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => <span key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
          const hasEvent = eventDates.has(day);
          return (
            <button key={day} className={`relative w-9 h-9 text-xs rounded-md transition-colors ${isToday ? "bg-teal text-primary-foreground font-bold" : "text-text-dark hover:bg-teal-light"}`}>
              {day}
              {hasEvent && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-teal" />}
            </button>
          );
        })}
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
      {/* Hero */}
      <section className="h-[360px] bg-gradient-to-br from-teal-dark via-teal to-teal-dark flex items-center justify-center relative overflow-hidden">
        <svg className="absolute right-[10%] top-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-[0.08]" viewBox="0 0 300 300">
          <rect x="20" y="40" width="260" height="220" rx="16" fill="none" stroke="hsl(187 52% 93%)" strokeWidth="1.5" />
          <line x1="20" y1="100" x2="280" y2="100" stroke="hsl(187 52% 93%)" strokeWidth="1" />
          {[80,140,200].map(x => [130,160,190,220].map(y => (
            <rect key={`${x}-${y}`} x={x} y={y} width="40" height="20" rx="3" fill="hsl(187 52% 93%)" opacity="0.15" />
          )))}
        </svg>
        <div className="absolute inset-0 bg-[#0D1B1C]/30" />
        <div className="relative z-10 text-center">
          <h1 className="heading-1 text-primary-foreground">Events & Campaigns</h1>
          <p className="text-base text-primary-foreground/70 mt-3 max-w-lg mx-auto">Medical camps, school programmes, and community drives — happening near you in Kolkata.</p>
        </div>
      </section>

      {/* Filter */}
      <div className="sticky top-[108px] z-30 bg-card border-b border-border shadow-brand-sm">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {filterTypes.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f ? "bg-teal text-primary-foreground" : "bg-background text-text-mid hover:bg-teal-light"}`}
            >
              {f === "all" ? "All" : eventTypeLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="bg-background py-16">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
          {/* Left: Events */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative rounded-full h-2 w-2 bg-green-500" /></span>
              <span className="label-text text-teal">Upcoming</span>
            </div>
            <div className="space-y-4">
              {upcoming.map((evt, i) => (
                <FadeInUp key={evt.id} delay={i * 0.05}>
                  <EventCard event={evt} onClick={() => setSelectedEvent(evt)} />
                </FadeInUp>
              ))}
              {upcoming.length === 0 && <p className="text-text-mid text-sm">No upcoming events in this category.</p>}
            </div>

            {past.length > 0 && (
              <div className="mt-12">
                <button onClick={() => setShowPast(!showPast)} className="text-sm font-semibold text-text-light hover:text-teal transition-colors">
                  {showPast ? "Hide" : `Show ${past.length}`} past events →
                </button>
                {showPast && (
                  <div className="space-y-4 mt-4">
                    {past.map((evt, i) => (
                      <FadeInUp key={evt.id} delay={i * 0.05}>
                        <EventCard event={evt} onClick={() => setSelectedEvent(evt)} />
                      </FadeInUp>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Calendar */}
          <div className="hidden lg:block">
            <div className="sticky top-[170px]">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-card rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-brand-lg"
              onClick={e => e.stopPropagation()}
            >
              <ImagePlaceholder category={selectedEvent.type === "education" ? "classroom" : selectedEvent.type === "registration" ? "elderly" : "medical"} className="w-full h-[200px] rounded-t-xl" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="heading-3 text-text-dark pr-8">{selectedEvent.title}</h2>
                  <button onClick={() => setSelectedEvent(null)} className="p-1 text-text-light hover:text-text-dark"><X size={20} /></button>
                </div>
                <div className="space-y-2 text-sm text-text-mid mb-4">
                  <p className="flex items-center gap-2"><Clock size={14} className="text-teal" />{new Date(selectedEvent.date).toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} • {selectedEvent.time}</p>
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-teal" />{selectedEvent.venue}, {selectedEvent.location}</p>
                </div>
                <p className="body-text text-text-mid mb-6">{selectedEvent.description}</p>
                <div className="text-sm text-text-mid mb-6">
                  <p><strong>Organiser:</strong> AGSWS Team</p>
                  <p><strong>Expected attendees:</strong> {selectedEvent.capacity}</p>
                  <p><strong>Free:</strong> Yes</p>
                </div>
                {!selectedEvent.isPast && (
                  <button className="w-full bg-yellow text-text-dark font-bold text-base py-3 rounded-full hover:shadow-yellow transition-shadow">
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
