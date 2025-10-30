# Setup (Short)

Supabase
1) Create project. In SQL editor, run files from sql/ in order:
   - 00_quick_setup.sql (optional seed/roles)
   - 01_core_schema.sql
   - 02_institutions.sql
   - 03_article_images.sql
   - 04_flickr_albums.sql
2) Storage buckets (public): news-images, gallery, documents.
3) Create admin user (Auth → Users), then insert into users with role admin (same UUID).

Frontend
1) cd frontend && npm ci && npm run dev
2) Add .env:
   - VITE_SUPABASE_URL=...
   - VITE_SUPABASE_ANON_KEY=...
3) Open http://localhost:5173 (admin at /login).
