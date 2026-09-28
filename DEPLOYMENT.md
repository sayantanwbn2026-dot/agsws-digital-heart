# Deploying the AGSWS prototype

A prototype build lets a client walk the whole site — including a donation from
form to receipt — before Stripe is connected. It is **not** the production
configuration; see "Going live" below.

## Prototype build

Set these environment variables in your host's dashboard:

| Variable | Prototype value | Purpose |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://bvdhqgaupyuqqsuxbtph.supabase.co` | CMS content |
| `VITE_SUPABASE_PROJECT_ID` | `bvdhqgaupyuqqsuxbtph` | CMS content |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | *(the anon key from `.env`)* | CMS content |
| `VITE_DEMO_MODE` | `true` | Skips payment, blocks search indexing |
| `VITE_SITE_URL` | the preview URL | Canonical + share links |

Build settings: **build command** `bun run vite build`, **output directory**
`dist`. Use `bun run vite build`, not `bun run build` — the latter runs a
sitemap step that fails when the project path contains spaces.

`vercel.json` already routes every path to `index.html`, so refreshing a deep
link like `/donate/medical` works instead of 404ing.

### What `VITE_DEMO_MODE=true` changes

- **Donate and GoldenAge registration skip Stripe.** The visitor goes straight
  to the real thank-you page, which shows a yellow "Demo preview — no payment
  was taken" notice. The downloadable PDF receipt carries a `Status: DEMO` row.
- **Search engines are blocked twice over:** `robots.txt` becomes a blanket
  disallow, and every page carries `<meta name="robots" content="noindex, nofollow">`.

Everything else is real. Contact, Apply for Support, CSR, event registration and
the newsletter all write to Supabase, so submissions from the demo appear in the
admin dashboard.

## The `api/` directory is excluded

`.vercelignore` keeps `api/` out of the deployment. Those handlers are legacy:
the frontend rewrites every `/api/*` call to a Supabase Edge Function at runtime
(`src/hooks/useAdminAPI.ts`), so nothing in the browser ever requests them.

Four of them hold `SUPABASE_SERVICE_ROLE_KEY`, so excluding them means that key
never needs to be configured in Vercel. Delete `.vercelignore` if you ever move
back to Vercel-hosted API routes.

## What still needs credentials

These are not blockers for a prototype, but nothing that depends on them will work:

- **Admin login** (`/admin/login`) — needs `CMS_ADMIN_EMAIL`, `CMS_ADMIN_PASSWORD`
  and `CMS_TOKEN_SECRET` set as Supabase edge function secrets.
- **Outgoing email** — receipts and notifications need `RESEND_API_KEY`. Form
  submissions still save; only the email is skipped.
- **Payments** — need the Stripe keys and webhook secret.

## Going live

1. Remove `VITE_DEMO_MODE` (or set it to `false`). Nothing else about the demo
   behaviour persists — it is build-time only.
2. Set `VITE_SITE_URL` to the real domain.
3. Add the Stripe and Resend secrets in Supabase, and set the admin credentials.
4. Deploy the updated `send-email` function. It is the one piece of the monthly
   work not yet live — receipts will not say "Monthly" or explain how to cancel
   until it is deployed:

   ```bash
   bunx supabase login
   bunx supabase functions deploy send-email --project-ref bvdhqgaupyuqqsuxbtph
   ```

5. Create the Stripe webhook pointing at
   `https://bvdhqgaupyuqqsuxbtph.supabase.co/functions/v1/payments-webhook`
   (append `?env=live` for live mode) and subscribe it to:
   `checkout.session.completed`, `checkout.session.expired`,
   `payment_intent.payment_failed`, `invoice.paid`,
   `customer.subscription.updated`, `customer.subscription.deleted`.

6. Test a monthly donation with an Indian test card. Recurring charges on Indian
   cards fall under RBI e-mandate rules, so verify in Stripe's sandbox first.

### Already applied to Supabase (project `bvdhqgaupyuqqsuxbtph`)

- The `monthly_donations` migration: `frequency`, `stripe_subscription_id`,
  `stripe_invoice_id`, `subscription_status` and `parent_donation_id` on
  `donations`, plus a donor-wall function that shows a monthly donor once.
- `create-stripe-donation` and `payments-webhook` (both with `verify_jwt: false`,
  which the webhook requires — Stripe sends no JWT).
