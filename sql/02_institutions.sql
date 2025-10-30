-- Create institutions table for managing institution content
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  vision TEXT,
  mission TEXT,
  functions TEXT,
  structure TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  contact_address TEXT,
  image_url TEXT,
  type TEXT CHECK (type IN ('pool', 'office')) DEFAULT 'office',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read institutions
CREATE POLICY "Anyone can read institutions"
  ON institutions
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated admins to insert institutions
CREATE POLICY "Admins can insert institutions"
  ON institutions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN (
        SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- Allow authenticated admins to update institutions
CREATE POLICY "Admins can update institutions"
  ON institutions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN (
        SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- Allow authenticated admins to delete institutions
CREATE POLICY "Admins can delete institutions"
  ON institutions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email IN (
        SELECT email FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
      )
    )
  );

-- Insert default institutions data
INSERT INTO institutions (slug, title, description, type) VALUES
-- Pools
('executive-pool', 'የዋና ስራ አስፈፃሚ ፑል', 'የዋና ስራ አስፈፃሚ ፑል የአቃቂ ቃሊቲ ክፍለ ከተማ አስተዳደር ዋና የስራ አመራር ክፍል ሲሆን በተለያዩ የስራ መስኮች የተዋቀረ ነው። ይህ ፑል የክፍለ ከተማው ዋና ስራዎችን በማስተባበር እና በማስፈፀም ረገድ ወሳኝ ሚና ይጫወታል።', 'pool'),
('public-service-pool', 'የፐብሊክ ሰርቪስና የሰው ሀባት ልማት ፑል', 'የፐብሊክ ሰርቪስና የሰው ሀባት ልማት ፑል የሰው ሀብት አስተዳደር፣ የህዝብ አገልግሎት እና የልማት ስራዎችን በማስተባበር የክፍለ ከተማውን የማህበራዊ እና ኢኮኖሚያዊ እድገት ለማረጋገጥ ያለመ ነው።', 'pool'),
('design-construction-pool', 'የዲዛይንና ግንባታ ስራዎች ፑል', 'የዲዛይንና ግንባታ ስራዎች ፑል በአቃቂ ቃሊቲ ክፍለ ከተማ የመሠረተ ልማት ግንባታ፣ የዲዛይን ስራዎች እና የእድገት ፕሮጀክቶችን በማስተባበር ረገድ ወሳኝ ሚና የሚጫወት ነው።', 'pool'),
('operations-pool', 'ስራ አስኪያጅ ፑል', 'ስራ አስኪያጅ ፑል የክፍለ ከተማውን ዕለታዊ ስራዎችን በማስተባበር፣ የአስተዳደር ስራዎችን በመምራት እና የተለያዩ የአገልግሎት መስጫ ክፍሎችን በማቀናጀት ረገድ ወሳኝ ሚና ይጫወታል።', 'pool'),
('other-institutions', 'ሌሎች ተቋማት', 'በአቃቂ ቃሊቲ ክፍለ ከተማ ውስጥ የተለያዩ ሌሎች ተቋማት የክፍለ ከተማውን አገልግሎት ለማሻሻል እና ለማሕበረሰቡ የተሻለ አገልግሎት ለመስጠት የተቋቋሙ ናቸው።', 'pool')
ON CONFLICT (slug) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_institutions_updated_at
  BEFORE UPDATE ON institutions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

