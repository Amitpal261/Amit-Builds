# Amit Portfolio — Next.js + MongoDB

Your static HTML portfolio, rebuilt as a full-stack Next.js (App Router) app with a
MongoDB-backed CMS and a protected `/admin` dashboard. The original editorial design
(Instrument Serif + Manrope, dot-grid background, floating nav, custom cursor) is
preserved pixel-for-pixel in `app/globals.css`.

## Stack

- **Next.js 14 (App Router)** — pages, layouts, API routes, all in one app (no separate Express server)
- **MongoDB + Mongoose** — Projects, Services, Testimonials, Leads (contact form)
- **JWT + bcrypt cookie auth** — single-admin login for `/admin`
- **Zod** — request validation on API routes
- Image uploads are stored as base64 data URIs by default (zero external setup). Swap in
  Vercel Blob / Cloudinary / S3 later by editing `app/api/upload/route.ts` — the rest of the
  app doesn't need to change since it just stores whatever URL that route returns.

## Project structure

```
amit-portfolio/
├── app/
│   ├── page.tsx                 → homepage (hero, projects, services, testimonials, FAQ, CTA)
│   ├── projects/page.tsx        → all projects
│   ├── projects/[slug]/page.tsx → project detail
│   ├── services/page.tsx        → services & pricing
│   ├── contact/page.tsx         → contact / quote form
│   ├── admin/                   → protected dashboard (login, projects, services, testimonials)
│   └── api/                     → projects, services, testimonials, contact, auth, upload
├── components/                  → public site sections + admin/ (forms, sidebar, upload field)
├── lib/                         → mongodb.ts (connection), auth.ts (JWT), data.ts (server fetchers)
├── models/                      → Project.ts, Service.ts, Testimonial.ts, Lead.ts
├── scripts/                     → hash-password.mjs, seed.mjs
└── middleware.ts                → redirects unauthenticated users away from /admin
```

## 1. Install dependencies

```bash
npm install
```

## 2. Set up MongoDB

Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas), then grab your
connection string.

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

- `MONGODB_URI` — your Atlas connection string
- `JWT_SECRET` — any long random string (`openssl rand -hex 32` works well)
- `ADMIN_EMAIL` — the email you'll log in to `/admin` with
- `ADMIN_PASSWORD_HASH` — generate with:

  ```bash
  node scripts/hash-password.mjs "yourStrongPassword"
  ```

  Copy the printed hash into `.env.local`.

- `NEXT_PUBLIC_WHATSAPP_NUMBER` — your WhatsApp number with country code, no `+` (e.g. `918929682324`)

## 4. Seed initial content (optional but recommended)

Populates your three original projects (MediLink, Streaming UI, Snap Grocer) and three
starter services so the site isn't empty on first load:

```bash
npm run seed
```

## 5. Run it

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin/login

## Admin dashboard

Log in with the `ADMIN_EMAIL` / password you hashed in step 3. From there you can:

- **Projects** — add/edit/delete, upload a cover image, set gallery images, tech stack,
  live/GitHub URLs, feature on homepage, control display order
- **Services** — add/edit/delete pricing cards (title, price, delivery time, features, "most popular" flag)
- **Testimonials** — add/edit/delete client quotes, star rating, feature on homepage
- **Dashboard** — quick counts + the latest contact-form leads

Every mutating API route (`POST` / `PUT` / `DELETE`) checks for a valid admin session
cookie server-side, so the dashboard is safe to leave the URL public — only you can
edit content.

## Deploying

Works great on [Vercel](https://vercel.com):

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the same environment variables from `.env.local` in the Vercel project settings.
4. Deploy.

## Notes / next steps

- Image uploads are stored as base64 in MongoDB for simplicity. Fine for a small
  portfolio; if you add many large images, move to Vercel Blob or Cloudinary and just
  change what `app/api/upload/route.ts` returns.
- The contact form saves leads to the `leads` collection — there's no email/WhatsApp
  auto-notification wired up yet. Easiest next step: add a Resend or Nodemailer call
  inside `app/api/contact/route.ts` to email yourself on each new lead.
- Want customer sign-in someday? Right now the only account is you (the admin) — pull
  in NextAuth if you later need customer accounts.
