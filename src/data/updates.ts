export interface Update {
  id: string;
  title: string;
  excerpt: string;
  category: 'field' | 'campaign' | 'event' | 'announcement';
  date: string;
}

export const updates: Update[] = [
  { id: "u1", title: "3 Emergency Cases Handled This Week", excerpt: "Our medical team responded to 3 emergency cases across North and South Kolkata, with all patients now stable.", category: "field", date: "2025-03-15" },
  { id: "u2", title: "Education Sponsorship Drive Hits 80% Target", excerpt: "We've matched 96 of our 120 target children with sponsors for the 2025 academic year.", category: "campaign", date: "2025-03-12" },
  { id: "u3", title: "Free Medical Camp Announced for April", excerpt: "Join us on April 12 at Shyambazar Community Hall for free health screenings and specialist consultations.", category: "event", date: "2025-03-10" },
  { id: "u4", title: "New Partner Hospital Added to Network", excerpt: "We're proud to announce our 7th partner hospital — expanding coverage to Howrah district.", category: "announcement", date: "2025-03-05" },
  { id: "u5", title: "Parent Registration Now Open in Howrah", excerpt: "Families in Howrah can now register elderly parents for emergency medical support.", category: "announcement", date: "2025-02-28" },
  { id: "u6", title: "February Field Report: 47 Patients Supported", excerpt: "In February, AGSWS supported 47 patients across 4 hospitals with a combined fund deployment of ₹3.2 lakhs.", category: "field", date: "2025-02-25" },
  { id: "u7", title: "Volunteer Training Batch 6 Completed", excerpt: "12 new volunteers completed their orientation training and are now assigned to field operations.", category: "event", date: "2025-02-18" },
  { id: "u8", title: "80G Tax Filing Reminder", excerpt: "Donors: your 80G receipts for FY 2024–25 are available in your email. File before March 31 for tax benefits.", category: "announcement", date: "2025-02-10" },
];

export const updateCategoryColors: Record<string, string> = {
  field: "bg-teal",
  campaign: "bg-yellow",
  event: "bg-purple",
  announcement: "bg-teal-dark",
};
