# James & Miller — Web Dashboard (Next.js + Supabase)

A minimal, production‑ready starter to manage clients, jobs, and media uploads for **James & Miller Real Estate Photography | Media**.

## ✅ What's included

- Next.js 14 (App Router) + TypeScript
- Supabase Auth (magic link)
- Server‑side Supabase client (for secure queries)
- Signed upload URLs for **media** bucket (private)
- Public assets via **brand** bucket (public)
- Example pages: `/` (login), `/dashboard` (clients/jobs), `/upload` (upload media)

---

## 1) Configure environment variables

Create a `.env.local` file (or set on Vercel) with:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
```

> The `SERVICE_ROLE_KEY` is **server-only**. Set it in Vercel under **Project → Settings → Environment Variables** with `Encrypted` checked. Do **not** put it on the client.

## 2) Local dev

```bash
npm i
npm run dev
```

Visit http://localhost:3000

## 3) Supabase Auth settings

- **Site URL:** `http://localhost:3000`
- **Redirect URL:** `http://localhost:3000/auth/callback`

## 4) Deploy

- Push the repo to GitHub
- Import the repo in **Vercel**
- Add the 3 env vars above in Vercel → Deploy

## 5) Buckets assumed

- `media` (private)
- `brand` (public)

Policies already created in your Supabase project.

---

## Notes

- The dashboard reads/writes to your tables created earlier (`clients`, `jobs`, etc.).
- The `/api/sign-upload` route issues a short‑lived signed URL so the browser can upload into `media/<user_id>/...` without exposing credentials.
- You can customize UI inside `src/app` and components under `src/components`.
