# Akaki Kality Sub‑City News Platform

A bilingual news website for the Akaki Kality Sub‑City Administration. Simple. Fast. Mobile‑friendly.

## What it does
- Publishes news in Amharic and English.
- Shows a clean hero section with categories.
- Lists sub‑city institutions in one place.
- Infos about akaki kality in “About Us”.
- Displays gallery albums and images.
- Shares files and forms.

## For admins
- Secure login with Supabase Auth.
- Write news with image optimization (WebP).
- Upload images in batches for the gallery.
- Manage files in a compact table view.
- Add and edit institutions (offices).
- Edit “About Us” sections from the dashboard.
- Modern toasts and confirmation modals.

## Why it feels good
- Clean light theme with brand colors.
- Fast loads with Vite.
- Thoughtful micro‑interactions (toasts, modals).
- Mobile‑first layouts.

## Tech
- Frontend: React (Vite), CSS
- Backend: Supabase (Postgres, Auth, Storage)

## Content model (short)
- articles (news)
- article_images (extra images per news)
- media_gallery (gallery uploads)
- filesandforms (downloads)
- institutions (offices)
- users (roles)

## Docs and SQL
- Docs: see `docs/` for short guides
  - `SETUP.md` — brief setup notes
  - `DEPLOYMENT.md` — quick deployment tips
  - `DATABASE.md` — table overview
  - `FEATURES.md` — feature list
- SQL: see `sql/` (ordered, copy‑paste ready)
  - `00_quick_setup.sql`
  - `01_core_schema.sql`
  - `02_institutions.sql`
  - `03_article_images.sql`
  - `04_flickr_albums.sql`

## Notes
- Images are optimized before upload (keeps quality, saves space).
- RLS is enabled. Only admins can write. Public content is readable.
- Service worker is configured; re‑deploy if external API caching changes.

—
Made for Akaki Kality Media Communications with focus on clarity.
