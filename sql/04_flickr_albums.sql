-- Create table for Flickr albums
CREATE TABLE IF NOT EXISTS flickr_albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  flickr_url TEXT NOT NULL,
  thumbnail_url TEXT,
  photo_count INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable RLS
ALTER TABLE flickr_albums ENABLE ROW LEVEL SECURITY;

-- Allow public to read albums
CREATE POLICY "Allow public read access to flickr albums"
  ON flickr_albums
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users (admins) to insert albums
CREATE POLICY "Allow authenticated users to insert flickr albums"
  ON flickr_albums
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users (admins) to update albums
CREATE POLICY "Allow authenticated users to update flickr albums"
  ON flickr_albums
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admins) to delete albums
CREATE POLICY "Allow authenticated users to delete flickr albums"
  ON flickr_albums
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for better query performance
CREATE INDEX idx_flickr_albums_display_order ON flickr_albums(display_order);
CREATE INDEX idx_flickr_albums_created_at ON flickr_albums(created_at DESC);

COMMENT ON TABLE flickr_albums IS 'Stores Flickr album links and metadata for gallery display';

