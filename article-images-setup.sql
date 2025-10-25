-- ============================================
-- Article Images Table
-- For storing multiple images per article
-- ============================================

-- Create article_images table
CREATE TABLE IF NOT EXISTS article_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_article_images_article ON article_images(article_id);
CREATE INDEX IF NOT EXISTS idx_article_images_order ON article_images(article_id, display_order);

-- Enable Row Level Security
ALTER TABLE article_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for article_images
CREATE POLICY "Anyone can view article images" ON article_images 
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert article images" ON article_images 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update article images" ON article_images 
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete article images" ON article_images 
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

