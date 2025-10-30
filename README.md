# Akaki Kality News Platform

A clean, bilingual news site with an admin panel. Built with React + Supabase.

Quick links
- Setup: docs/SETUP.md
- Deployment: docs/DEPLOYMENT.md
- Database: docs/DATABASE.md
- Features: docs/FEATURES.md
- SQL: sql/

Run locally
1) cd frontend && npm ci && npm run dev
2) Add .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
3) Open http://localhost:5173 (admin at /login)

Notes
- Images are optimized on upload (WebP)
- RLS enabled; only admins can write
- Mobile-first, light theme

