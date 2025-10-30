# Database (Short)

Tables
- users: id (uuid), name, role (admin)
- articles: news content, category, image_url, video_url, published_at
- article_images: extra images per article
- media_gallery: gallery uploads
- filesandforms: downloadable files
- institutions: offices list

Migrations
- Use sql/*.sql in order. Each file is copy-paste ready for Supabase SQL editor.

Storage
- Buckets (public): news-images, gallery, documents.

Security
- RLS enabled. Only admin can write. Public read for content tables.
