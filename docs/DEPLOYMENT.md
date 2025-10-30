## Deployment (Short)

Preferred host: Vercel. Alternative: Netlify.

What you need
- Supabase project (URL + anon key)
- GitHub repo connected to Vercel/Netlify

Steps
1) In Vercel → Import repo → Framework: Vite; Root: `frontend`; Build: `npm run build`; Output: `dist`.
2) Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
3) Deploy. Enable SPA fallback to `index.html` if needed.

Checks
- Visit site, login to `/login`, create one news, test gallery and files.

Notes
- If Flickr CORS breaks, redeploy to refresh the service worker.

