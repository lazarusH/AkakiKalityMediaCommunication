# Akaki Kality Subcity News Platform

A modern, bilingual news platform for Akaki Kality Subcity Administration built with React and Supabase.

## 🚀 Features

### Public Site
- **Home Page**: Featured news and quick links
- **News Section**: Categorized articles (Local, National, Uncategorized)
- **Gallery**: Image grid with lightbox view
- **Files & Forms**: Downloadable PDF, DOCX documents
- **About Us**: Information about the subcity
- **Contact**: Address, phone, email, and office hours
- **Video News**: Embedded YouTube videos in articles

### Admin Panel
- **Secure Authentication**: Email/password login with Supabase Auth
- **Dashboard**: Overview statistics and recent content
- **Article Management**: Create, edit, delete news articles with rich text editor
- **Gallery Management**: Upload and manage images
- **File Management**: Upload and manage downloadable documents
- **Real-time Updates**: Changes instantly visible on public site

### Technical Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Bilingual support (Amharic + English)
- ✅ SEO optimized
- ✅ Secure file uploads via Supabase Storage
- ✅ Row Level Security (RLS) policies
- ✅ Modern UI/UX with smooth animations

## 📦 Tech Stack

- **Frontend**: React 19 + Vite
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router v6
- **Styling**: Custom CSS
- **Rich Text Editor**: React Quill
- **Deployment**: Vercel/Netlify (Frontend), Supabase (Backend)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### 1. Clone and Install

```bash
cd frontend
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. In your Supabase project, go to **SQL Editor** and run this migration:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media_gallery table
CREATE TABLE media_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT NOT NULL,
  image_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create filesandforms table
CREATE TABLE filesandforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE filesandforms ENABLE ROW LEVEL SECURITY;

-- RLS Policies for articles
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

-- RLS Policies for media_gallery
CREATE POLICY "Anyone can view gallery" ON media_gallery FOR SELECT USING (true);
CREATE POLICY "Admins can insert gallery" ON media_gallery FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete gallery" ON media_gallery FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for filesandforms
CREATE POLICY "Anyone can view files" ON filesandforms FOR SELECT USING (true);
CREATE POLICY "Admins can insert files" ON filesandforms FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete files" ON filesandforms FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
```

3. Create Storage Buckets:
   - Go to **Storage** in Supabase
   - Create three public buckets:
     - `news-images`
     - `gallery`
     - `documents`
   - Set all buckets to **Public** access

4. Create Admin User:
   - Go to **Authentication** > **Users**
   - Click "Add User" (manual)
   - Enter email and password
   - After creating, go to **SQL Editor** and run:
   
```sql
INSERT INTO users (id, name, role) 
VALUES ('YOUR_USER_UUID', 'Admin Name', 'admin');
```

### 3. Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from **Project Settings** > **API** in Supabase.

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Frontend (Netlify)
1. Push code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

## 📝 Usage

### Admin Panel
1. Go to `/login`
2. Sign in with admin credentials
3. Access admin dashboard at `/admin`
4. Create/Manage News, gallery images, and files

### Public Site
- Browse news by category
- View article details with images and videos
- Explore photo gallery
- Download public documents

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Admin-only write access
- Public read access for published content
- Secure file uploads to Supabase Storage
- Authentication via Supabase Auth

## 🌍 Bilingual Support

The navigation and key UI elements support both Amharic and English. Toggle language using the button in the navbar.

## 📧 Contact

**Owner**: Alazar Tesema  
**Project**: Akaki Kality Subcity Media Communication Platform

## 📄 License

This project is proprietary software developed for Akaki Kality Subcity Administration.
