export interface AGSWSEvent {
  id: string;
  title: string;
  type: 'medical' | 'education' | 'registration' | 'awareness' | 'volunteer';
  date: string;
  time: string;
  venue: string;
  location: string;
  description: string;
  capacity: number;
  registered: number;
  isPast: boolean;
}

export const events: AGSWSEvent[] = [
  { id: "evt-1", title: "Free Medical Camp — North Kolkata", type: "medical", date: "2025-04-12", time: "10:00 AM – 4:00 PM", venue: "Shyambazar Community Hall", location: "North Kolkata", description: "Free health check-ups, blood pressure screening, and consultations with specialist doctors for elderly residents.", capacity: 120, registered: 73, isPast: false },
  { id: "evt-2", title: "School Registration Drive — Shyambazar", type: "education", date: "2025-04-18", time: "9:00 AM – 1:00 PM", venue: "Shyambazar Primary School", location: "Shyambazar, Kolkata", description: "Enrolment drive for underprivileged children. Bring Aadhar/birth certificate. Free school supplies for registered children.", capacity: 80, registered: 42, isPast: false },
  { id: "evt-3", title: "Parent Registration Camp — Howrah", type: "registration", date: "2025-04-25", time: "11:00 AM – 5:00 PM", venue: "Howrah District Library", location: "Howrah", description: "On-the-spot parent registration for NRK families. Bring parent's Aadhar and medical reports. ₹100 registration fee applies.", capacity: 50, registered: 18, isPast: false },
  { id: "evt-4", title: "Volunteer Meetup & Training", type: "volunteer", date: "2025-05-03", time: "3:00 PM – 6:00 PM", venue: "AGSWS Office, Park Street", location: "Central Kolkata", description: "Meet the team, learn about our programs, and receive volunteer orientation training. Open to all skill levels.", capacity: 30, registered: 22, isPast: false },
  { id: "evt-5", title: "Health Awareness Walk — Behala", type: "awareness", date: "2025-05-10", time: "7:00 AM – 9:00 AM", venue: "Behala Chowrasta", location: "South Kolkata", description: "Community awareness walk focusing on elderly health, diabetes prevention, and heart care. Free health kits for participants.", capacity: 200, registered: 67, isPast: false },
  { id: "evt-6", title: "Education Sponsorship Drive 2024", type: "education", date: "2024-12-15", time: "10:00 AM – 3:00 PM", venue: "Salt Lake Community Center", location: "Salt Lake, Kolkata", description: "Annual drive connecting sponsors with children who need educational support. 45 children were matched with sponsors.", capacity: 60, registered: 58, isPast: true },
  { id: "evt-7", title: "Free Eye Check-up Camp", type: "medical", date: "2024-11-22", time: "9:00 AM – 2:00 PM", venue: "Jadavpur University Campus", location: "Jadavpur, Kolkata", description: "Free eye examinations and spectacle distribution for elderly patients in partnership with Susrut Eye Foundation.", capacity: 100, registered: 94, isPast: true },
  { id: "evt-8", title: "Winter Relief Distribution", type: "awareness", date: "2024-12-28", time: "11:00 AM – 4:00 PM", venue: "Multiple locations", location: "Kolkata", description: "Distribution of blankets, warm clothing, and food packets to homeless and elderly residents across 8 locations.", capacity: 300, registered: 280, isPast: true },
];

export const eventTypeLabels: Record<string, string> = {
  medical: "Medical Camps",
  education: "Education Drives",
  registration: "Registration Drives",
  awareness: "Awareness Events",
  volunteer: "Volunteer Meetups",
};

export const eventTypeColors: Record<string, string> = {
  medical: "bg-teal text-primary-foreground",
  education: "bg-purple text-primary-foreground",
  registration: "bg-yellow text-text-dark",
  awareness: "bg-beige text-primary-foreground",
  volunteer: "bg-teal-dark text-primary-foreground",
};
