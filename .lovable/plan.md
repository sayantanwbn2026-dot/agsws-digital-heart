## Goal

Fix the placeholder/label overlap you screenshotted (₹ + "Enter amount" colliding with the field name) and bring every form on the site up to one polished, structured, elegant standard.

## Root cause of the overlap

`src/index.css` (lines 338–378) ships a **global floating-label system**: any `<div>` containing a bare `<label>` + `<input>` (without the `.no-float` class) automatically gets the label absolutely positioned **inside** the input. That's why on `/donate/medical` the "Or enter custom amount" label sits on top of the ₹ symbol and the "Enter amount" placeholder. The same trap fires on Contact, CSR, Volunteer, Event Registration, Track, Search, Apply, Admin forms, etc., whenever someone wrote a normal label.

## Plan

### 1. Remove the global floating-label system

- Delete the `:has()` floating-label block in `src/index.css` (lines ~338–378) entirely.
- Replace with one consistent rule: labels are always block-level, sit above the field, 11px uppercase tracked, with proper spacing.
- Side effect: no more overlap anywhere, on any form, ever. `no-float` class becomes a no-op (kept for back-compat).

### 2. Upgrade the shared form primitives (`PremiumFormElements.tsx`)

Single source of truth for every form on the site:

- `PremiumInput`, `PremiumTextarea`, `PremiumSelect` — refined:
  - Block label above field, 11px / 600 / uppercase / 0.12em tracking, teal on focus.
  - 52px height inputs, 14px border-radius, 1.5px border, soft inset shadow, 4px teal focus ring.
  - Left-icon slot with correct `pl-11` padding and focus color sync.
  - Required-asterisk, helper-text slot, inline error with shake + icon.
  - Disabled / read-only states.
- New `PremiumAmountInput` for currency fields — currency symbol baked in with correct padding so ₹ never collides with placeholder.
- New `PremiumRadioCard` / `PremiumCheckbox` for the amount-tier and consent rows used on donation pages.
- New `PremiumFieldGroup` (label + helper + children) so non-input controls (date pickers, file uploads, plan pickers) get the same label treatment.

### 3. Fix the donation custom-amount fields

- `DonateMedical.tsx` and `DonateEducation.tsx`: replace the ad-hoc `<label> + <span>₹</span> + <input>` with `<PremiumAmountInput label="Or enter custom amount" currency="₹" placeholder="Enter amount" />`. Removes the overlap you screenshotted.

### 4. Audit and rebuild every form on the site

For each page below: convert raw `<input>`/`<Input>`/`<Textarea>` to the Premium primitives, add proper labels, group fields into clean two-column rows on desktop / single column on mobile, add section dividers + helper copy, normalize spacing (`space-y-5`), unify submit buttons, and add inline validation messages.

Public forms:
- `Contact.tsx`
- `CSRPartnership.tsx`
- `VolunteerPortal.tsx` (signup + log-hours form)
- `EventRegistration.tsx`
- `ApplyForSupport.tsx`
- `MedicalAid.tsx` apply modal
- `EducationSupport.tsx` apply modal
- `RegisterParent.tsx` (4-step wizard — keep wizard, restyle every step)
- `DonateMedical.tsx` + `DonateEducation.tsx` (donor details + custom amount + gift toggle)
- `TrackDonation.tsx`, `TrackRegistration.tsx`
- `Search.tsx` search bar
- `Resources.tsx` filter bar
- `Updates.tsx` newsletter inline form
- `Footer.tsx` newsletter input
- `Navbar.tsx` search input

Admin / CMS forms (already on Paper & Ink theme — only the field rendering needs the new primitives):
- `AdminLogin.tsx`
- `admin/components/SiteSettingsForm.tsx`
- `admin/components/EmailComposer.tsx`
- `admin/components/EventEditor.tsx`
- `admin/components/EventAlbumsManager.tsx`
- `admin/components/ResourcesManager.tsx`
- `admin/components/PaymentsManager.tsx`
- `admin/components/SectionEditor.tsx`
- `admin/components/CMSContentEditor.tsx`
- `admin/components/CMSFieldRenderer.tsx`
- `admin/components/CMSImageUpload.tsx`
- `admin/components/DonationsTable.tsx` / `RegistrationsTable.tsx` filter bars

### 5. Cross-form QA

- Manual sweep at 390px, 430px, 768px, 1280px for every form above.
- Verify: no overlapping label/placeholder, no clipped icons, focus ring visible, error state legible, required-asterisk present, submit button full-width on mobile, keyboard tab order correct.

## Technical notes

- All changes are presentation-layer. No schema, route, or API changes.
- Design tokens stay as-is (Warm Precision: teal `#1F9AA8`, yellow `#F2B705`, paper for CMS).
- Floating-label removal is the one global CSS change; everything else is component-scoped, so risk is contained.
- The `no-float` class stays as a no-op so any third-party Radix/shadcn label combos keep working.

## Out of scope

- Form validation logic, submission endpoints, business rules.
- Any backend / Supabase / edge-function work.
- New form fields or new flows.
