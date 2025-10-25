# Supabase Storage Bucket Setup

## Error: "Bucket not found"

This error means the storage buckets haven't been created in Supabase yet. Follow these steps:

---

## 🪣 Create Storage Buckets

### 1. Go to Supabase Dashboard
- Open: https://supabase.com/dashboard
- Select your project: `wiarcdovjmotruksnvaa`

### 2. Navigate to Storage
- Click **Storage** in the left sidebar
- Click **New bucket** button

### 3. Create Three Buckets

#### Bucket 1: news-images
- **Name**: `news-images`
- **Public**: ✅ **YES** (Check "Public bucket")
- **File size limit**: 50 MB (optional)
- **Allowed MIME types**: `image/*`
- Click **Save**

#### Bucket 2: gallery-images
- **Name**: `gallery-images`
- **Public**: ✅ **YES**
- **File size limit**: 50 MB
- **Allowed MIME types**: `image/*`
- Click **Save**

#### Bucket 3: files-and-forms
- **Name**: `files-and-forms`
- **Public**: ✅ **YES**
- **File size limit**: 100 MB
- **Allowed MIME types**: Leave empty (allow all)
- Click **Save**

---

## 🔒 Set Bucket Policies

For each bucket, add these policies:

### 1. Click on the bucket name
### 2. Go to **Policies** tab
### 3. Click **New policy**

#### Policy 1: Public Read Access
```
Name: Public Read Access
Operation: SELECT
Policy definition: (none) - Allow all
```

#### Policy 2: Authenticated Upload
```
Name: Authenticated Upload
Operation: INSERT
Policy definition: auth.role() = 'authenticated'
```

#### Policy 3: Authenticated Update
```
Name: Authenticated Update  
Operation: UPDATE
Policy definition: auth.role() = 'authenticated'
```

#### Policy 4: Authenticated Delete
```
Name: Authenticated Delete
Operation: DELETE
Policy definition: auth.role() = 'authenticated'
```

---

## ✅ Verify Setup

After creating all buckets:

1. Refresh your app
2. Try uploading an image in the article form
3. It should work now!

---

## 🛠️ Alternative: SQL Setup

You can also run this SQL in the SQL Editor:

\`\`\`sql
-- Enable storage
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The buckets are created via UI, but you can verify with:
SELECT * FROM storage.buckets;

-- Add policies (if not added via UI)
-- For news-images bucket
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Authenticated update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-images');

-- Repeat for gallery-images and files-and-forms buckets
\`\`\`

---

## 📝 Current Bucket Names

Your app uses these exact names:
- ✅ `news-images` - For article images
- ✅ `gallery-images` - For gallery photos
- ✅ `files-and-forms` - For downloadable files

**⚠️ Important:** Bucket names must match exactly (including hyphens)!

---

## 🔍 Troubleshooting

### If you still get "Bucket not found":
1. Check bucket names match exactly
2. Verify buckets are set to **Public**
3. Check RLS policies are enabled
4. Try hard refresh (Ctrl+Shift+R)

### If uploads fail with permission error:
1. Verify you're logged in
2. Check RLS policies are correct
3. Make sure buckets have INSERT policy for authenticated users

