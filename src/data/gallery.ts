export interface GalleryPhoto {
  id: string;
  category: 'medical' | 'education' | 'community' | 'elderly' | 'child' | 'hospital' | 'classroom';
  caption: string;
  date: string;
  location: string;
  height: number;
}

export interface GalleryVideo {
  id: string;
  title: string;
  duration: string;
  thumbnailCategory: 'medical' | 'community' | 'education';
  date: string;
}

export const galleryPhotos: GalleryPhoto[] = [
  { id: "p1", category: "medical", caption: "Free health screening at Shyambazar camp", date: "2025-01-15", location: "North Kolkata", height: 280 },
  { id: "p2", category: "child", caption: "Children receiving new school supplies", date: "2025-01-10", location: "Howrah", height: 200 },
  { id: "p3", category: "elderly", caption: "Elder care wellness check-up visit", date: "2024-12-28", location: "Behala", height: 240 },
  { id: "p4", category: "classroom", caption: "After-school tutoring at community library", date: "2024-12-20", location: "South Kolkata", height: 160 },
  { id: "p5", category: "community", caption: "Winter relief distribution drive", date: "2024-12-15", location: "Kolkata", height: 280 },
  { id: "p6", category: "hospital", caption: "Patient support at partner hospital", date: "2024-12-10", location: "North Kolkata", height: 200 },
  { id: "p7", category: "medical", caption: "Eye check-up camp at Jadavpur", date: "2024-11-22", location: "Jadavpur", height: 240 },
  { id: "p8", category: "child", caption: "Annual day celebration at partner school", date: "2024-11-15", location: "Shyambazar", height: 160 },
  { id: "p9", category: "elderly", caption: "Home visit by AGSWS coordinator", date: "2024-11-10", location: "Salt Lake", height: 200 },
  { id: "p10", category: "community", caption: "Volunteer training workshop", date: "2024-10-28", location: "Park Street", height: 280 },
  { id: "p11", category: "classroom", caption: "Reading hour at community library", date: "2024-10-20", location: "South Kolkata", height: 200 },
  { id: "p12", category: "medical", caption: "Blood donation camp at AGSWS office", date: "2024-10-15", location: "Kolkata", height: 240 },
  { id: "p13", category: "hospital", caption: "New medical equipment delivery", date: "2024-10-10", location: "North Kolkata", height: 160 },
  { id: "p14", category: "child", caption: "Students at school scholarship ceremony", date: "2024-09-28", location: "Howrah", height: 280 },
  { id: "p15", category: "elderly", caption: "Group activity session for elderly", date: "2024-09-20", location: "Behala", height: 200 },
  { id: "p16", category: "community", caption: "Community awareness poster campaign", date: "2024-09-15", location: "Kolkata", height: 240 },
  { id: "p17", category: "medical", caption: "Specialist consultation during free camp", date: "2024-09-10", location: "Shyambazar", height: 160 },
  { id: "p18", category: "child", caption: "Art therapy session with children", date: "2024-08-28", location: "South Kolkata", height: 280 },
  { id: "p19", category: "classroom", caption: "Science experiment at community center", date: "2024-08-20", location: "Salt Lake", height: 200 },
  { id: "p20", category: "elderly", caption: "Festival celebration with elderly residents", date: "2024-08-15", location: "North Kolkata", height: 240 },
  { id: "p21", category: "hospital", caption: "Emergency response team in action", date: "2024-08-10", location: "Kolkata", height: 200 },
  { id: "p22", category: "community", caption: "Monthly community meetup at park", date: "2024-07-28", location: "Behala", height: 160 },
  { id: "p23", category: "medical", caption: "Diabetes screening drive results day", date: "2024-07-20", location: "Howrah", height: 280 },
  { id: "p24", category: "child", caption: "First day of school for sponsored children", date: "2024-07-10", location: "Shyambazar", height: 200 },
  { id: "p25", category: "elderly", caption: "Yoga and wellness session for seniors", date: "2024-06-28", location: "Park Street", height: 240 },
  { id: "p26", category: "classroom", caption: "Computer literacy class for students", date: "2024-06-20", location: "South Kolkata", height: 160 },
  { id: "p27", category: "community", caption: "Annual general meeting of AGSWS", date: "2024-06-15", location: "Kolkata", height: 280 },
  { id: "p28", category: "medical", caption: "Physiotherapy camp for elderly", date: "2024-06-10", location: "North Kolkata", height: 200 },
  { id: "p29", category: "hospital", caption: "Hospital partnership signing ceremony", date: "2024-05-28", location: "Kolkata", height: 240 },
  { id: "p30", category: "child", caption: "Children's day celebration and games", date: "2024-05-20", location: "Howrah", height: 160 },
  { id: "p31", category: "elderly", caption: "Morning walk group for registered elders", date: "2024-05-15", location: "Behala", height: 200 },
  { id: "p32", category: "community", caption: "Fundraising event at local restaurant", date: "2024-05-10", location: "Park Street", height: 280 },
  { id: "p33", category: "medical", caption: "Mental health awareness seminar", date: "2024-04-28", location: "Salt Lake", height: 240 },
  { id: "p34", category: "classroom", caption: "Math competition at partner school", date: "2024-04-20", location: "Shyambazar", height: 160 },
  { id: "p35", category: "elderly", caption: "Birthday celebration for registered elder", date: "2024-04-15", location: "North Kolkata", height: 200 },
  { id: "p36", category: "community", caption: "Earth Day tree plantation drive", date: "2024-04-10", location: "Kolkata", height: 280 },
];

export const galleryVideos: GalleryVideo[] = [
  { id: "v1", title: "AGSWS — One Year of Impact (2024)", duration: "4:32", thumbnailCategory: "community", date: "2025-01-01" },
  { id: "v2", title: "A Day in the Life of an AGSWS Coordinator", duration: "6:15", thumbnailCategory: "medical", date: "2024-09-15" },
  { id: "v3", title: "Education Support Program — Stories of Hope", duration: "3:48", thumbnailCategory: "education", date: "2024-07-20" },
];
