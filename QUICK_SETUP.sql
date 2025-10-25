-- ============================================
-- QUICK SETUP FOR AKAKI KALITY NEWS PLATFORM
-- Run this in your Supabase SQL Editor
-- ============================================

-- Create tables
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Local', 'National', 'Uncategorized')),
  image_url TEXT,
  video_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT NOT NULL,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS filesandforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_author ON articles(author_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE filesandforms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view articles" ON articles;
DROP POLICY IF EXISTS "Admins can insert articles" ON articles;
DROP POLICY IF EXISTS "Admins can update articles" ON articles;
DROP POLICY IF EXISTS "Admins can delete articles" ON articles;
DROP POLICY IF EXISTS "Anyone can view gallery" ON media_gallery;
DROP POLICY IF EXISTS "Admins can insert gallery" ON media_gallery;
DROP POLICY IF EXISTS "Admins can delete gallery" ON media_gallery;
DROP POLICY IF EXISTS "Anyone can view files" ON filesandforms;
DROP POLICY IF EXISTS "Admins can insert files" ON filesandforms;
DROP POLICY IF EXISTS "Admins can delete files" ON filesandforms;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;

-- Create policies
CREATE POLICY "Anyone can view articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Admins can insert articles" ON articles FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update articles" ON articles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete articles" ON articles FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone can view gallery" ON media_gallery FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery" ON media_gallery FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete gallery" ON media_gallery FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Anyone can view files" ON filesandforms FOR SELECT USING (true);
CREATE POLICY "Admins can insert files" ON filesandforms FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete files" ON filesandforms FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup complete! Now:';
  RAISE NOTICE '1. Create storage buckets: news-images, gallery, documents (all public)';
  RAISE NOTICE '2. Create an admin user in Authentication';
  RAISE NOTICE '3. Run: INSERT INTO users (id, name, role) VALUES (''YOUR-USER-UUID'', ''Admin'', ''admin'');';
END $$;

