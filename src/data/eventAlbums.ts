import type { AGSWSEvent } from "./events";

export interface AlbumPhoto {
  id: string;
  image?: string;
  category: 'medical' | 'education' | 'community' | 'elderly' | 'child' | 'hospital' | 'classroom';
  caption: string;
  is_cover?: boolean;
}

// Curated 5-photo albums for known past events. Any other past event will get
// an auto-generated album based on its event type (see getEventAlbum below).
const curated: Record<string, AlbumPhoto[]> = {
  "evt-6": [
    { id: "evt-6-1", category: "education", caption: "Sponsors arriving at Salt Lake Community Center" },
    { id: "evt-6-2", category: "child",     caption: "Children meeting their sponsors for the first time" },
    { id: "evt-6-3", category: "classroom", caption: "Sponsorship paperwork and school kits handover" },
    { id: "evt-6-4", category: "community", caption: "Group photo with the 45 matched families" },
    { id: "evt-6-5", category: "child",     caption: "A bright start — first day of sponsored school year" },
  ],
  "evt-7": [
    { id: "evt-7-1", category: "medical",  caption: "Susrut Eye Foundation team setting up at Jadavpur" },
    { id: "evt-7-2", category: "elderly",  caption: "Free eye examinations for elderly patients" },
    { id: "evt-7-3", category: "hospital", caption: "On-site refraction tests in progress" },
    { id: "evt-7-4", category: "community",caption: "Spectacles being distributed to those in need" },
    { id: "evt-7-5", category: "medical",  caption: "94 patients screened and supported in one day" },
  ],
  "evt-8": [
    { id: "evt-8-1", category: "community", caption: "Volunteers loading blankets and warm clothing" },
    { id: "evt-8-2", category: "elderly",   caption: "Distribution to elderly residents in North Kolkata" },
    { id: "evt-8-3", category: "community", caption: "Food packets handed out across 8 locations" },
    { id: "evt-8-4", category: "child",     caption: "Children receiving warm winter wear" },
    { id: "evt-8-5", category: "community", caption: "Wrap-up at the central distribution hub" },
  ],
};

const typeToCategory: Record<string, AlbumPhoto['category']> = {
  medical: 'medical',
  education: 'classroom',
  registration: 'community',
  awareness: 'community',
  volunteer: 'community',
};

export function getEventAlbum(event: AGSWSEvent): AlbumPhoto[] {
  if (curated[event.id]) return curated[event.id];
  const base = typeToCategory[event.type] || 'community';
  // Rotate through related categories so a generated album feels varied.
  const rotation: AlbumPhoto['category'][] = [base, 'community', 'elderly', 'child', base];
  const captions = [
    `Setting up at ${event.venue || event.location}`,
    `On-the-ground moments from ${event.title}`,
    `Volunteers coordinating the day`,
    `Beneficiaries during the programme`,
    `Wrap-up and group photo`,
  ];
  return rotation.map((category, i) => ({
    id: `${event.id}-auto-${i + 1}`,
    category,
    caption: captions[i],
  }));
}

export function buildAlbumsForEvents(events: AGSWSEvent[]) {
  return events
    .filter(e => e.isPast)
    .map(event => ({ event, photos: getEventAlbum(event) }));
}