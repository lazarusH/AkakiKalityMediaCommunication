-- ============================================
-- Akaki Kality Subcity News Platform
-- Database Schema and Security Setup
-- ============================================

-- 1. Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Local', 'National', 'Uncategorized')),
  image_url TEXT,
  video_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create media_gallery table
CREATE TABLE media_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT NOT NULL,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create filesandforms table
CREATE TABLE filesandforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for better performance
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_media_gallery_uploaded ON media_gallery(uploaded_at DESC);
CREATE INDEX idx_files_created ON filesandforms(created_at DESC);

-- 6. Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE filesandforms ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR ARTICLES
-- ============================================

-- Anyone can view published articles
CREATE POLICY "Anyone can view articles" 
ON articles FOR SELECT 
USING (true);

-- Only admins can insert articles
CREATE POLICY "Admins can insert articles" 
ON articles FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only admins can update articles
CREATE POLICY "Admins can update articles" 
ON articles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only admins can delete articles
CREATE POLICY "Admins can delete articles" 
ON articles FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- ============================================
-- RLS POLICIES FOR MEDIA GALLERY
-- ============================================

-- Anyone can view gallery images
CREATE POLICY "Anyone can view gallery" 
ON media_gallery FOR SELECT 
USING (true);

-- Only admins can upload images
CREATE POLICY "Admins can insert gallery" 
ON media_gallery FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only admins can delete images
CREATE POLICY "Admins can delete gallery" 
ON media_gallery FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- ============================================
-- RLS POLICIES FOR FILES AND FORMS
-- ============================================

-- Anyone can view and download files
CREATE POLICY "Anyone can view files" 
ON filesandforms FOR SELECT 
USING (true);

-- Only admins can upload files
CREATE POLICY "Admins can insert files" 
ON filesandforms FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only admins can delete files
CREATE POLICY "Admins can delete files" 
ON filesandforms FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- ============================================
-- RLS POLICIES FOR USERS
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for articles table
CREATE TRIGGER update_articles_updated_at
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKET POLICIES
-- ============================================

-- After creating the storage buckets (news-images, gallery, documents),
-- run these policies:

-- Policy for news-images bucket (allow public read, admin write)
-- Run in Supabase Dashboard > Storage > news-images > Policies

-- SELECT policy
-- CREATE POLICY "Public read access for news images"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'news-images');

-- INSERT policy
-- CREATE POLICY "Admin upload for news images"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'news-images' AND
--   EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
-- );

-- DELETE policy
-- CREATE POLICY "Admin delete for news images"
-- ON storage.objects FOR DELETE
-- USING (
--   bucket_id = 'news-images' AND
--   EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
-- );

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert a sample admin user (replace with actual user ID from auth.users)
-- INSERT INTO users (id, name, role) 
-- VALUES ('YOUR-AUTH-USER-UUID', 'Admin Name', 'admin');

-- ============================================
-- NOTES
-- ============================================

-- 1. Create storage buckets manually in Supabase Dashboard:
--    - news-images (public)
--    - gallery (public)
--    - documents (public)

-- 2. Create admin user via Supabase Auth:
--    - Go to Authentication > Users > Add User
--    - Then insert into users table with role='admin'

-- 3. Get your Supabase credentials:
--    - Project URL: Settings > API > Project URL
--    - Anon Key: Settings > API > Project API keys > anon public

-- ============================================
-- END OF SETUP
-- ============================================

