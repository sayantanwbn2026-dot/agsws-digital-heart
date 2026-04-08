## CMS Dashboard Plan

### 1. Database Schema (migrations)
Create tables for each content section:
- `cms_hero` — title, subtitle, CTA text, background image
- `cms_stats` — label, value, icon
- `cms_initiatives` — title, description, image, link
- `cms_testimonials` — name, role, quote, avatar
- `cms_stories` — title, excerpt, content, image, date
- `cms_events` — title, date, location, description, image
- `cms_team` — name, role, bio, image
- `cms_faqs` — question, answer, category
- `cms_gallery` — image URL, caption, category
- `cms_partners` — name, logo URL
- `cms_site_settings` — site name, footer text, announcement, social links
- `cms_blog_posts` — title, slug, content, excerpt, image, author, date

Storage bucket: `cms-uploads` for image uploads

### 2. Admin Authentication
- Edge function for login with hardcoded email/password check
- JWT token generation for session management
- Middleware to protect CMS API routes

### 3. CMS Dashboard UI (at /admin)
- Sidebar navigation with sections for each content type
- For each section: table view → edit form with:
  - Text inputs for strings
  - Rich text for long content
  - Image upload component (browse files + paste URL)
  - Image resolution guide displayed
- Inline image preview with dimensions shown
- Add/Edit/Delete operations per content item

### 4. Image Upload Component
- Drag & drop zone + browse button
- URL input option
- Resolution recommendations displayed (e.g. "Hero: 1920×800px")
- Preview with dimensions
- Uploads to Supabase Storage `cms-uploads` bucket

### 5. Frontend Integration
- Update existing pages to read from CMS tables (using existing `useCMSData`/`useCMSList` hooks)
- Fallback to current static data if CMS is empty

### 6. Design
- Matches website design system (teal accents, clean cards, rounded corners)
- Framer Motion transitions between sections
- Responsive layout
