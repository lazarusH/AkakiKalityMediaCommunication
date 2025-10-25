import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('supabaseUrl and supabaseAnonKey are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket names - Match your Supabase buckets
export const STORAGE_BUCKETS = {
  NEWS_IMAGES: 'news-images',
  GALLERY_IMAGES: 'gallery',      // Matches your bucket name
  FILES_AND_FORMS: 'documents',   // Matches your bucket name
};

// Debug: Log bucket names
console.log('Storage Buckets Configured:', STORAGE_BUCKETS);

// Helper to get public URL for storage files
export const getPublicUrl = (bucket, filePath) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  return data.publicUrl;
};
