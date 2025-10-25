# Akaki Kality Media Communication Platform

## 📌 Project Information

**Project Title**: Government Subcity News Platform  
**Owner**: Alazar Tesema  
**Organization**: Akaki Kality Subcity Administration  
**Tech Stack**: React + Supabase  
**Status**: ✅ Ready for Deployment

---

## 🎯 Project Objectives

Create a secure, scalable, and user-friendly news platform for Akaki Kality Subcity where:
- Administrators can manage news articles, images, videos, and documents
- Citizens can browse news, view galleries, and download public forms
- Content is instantly available to the public after admin publication
- Platform supports both Amharic and English languages

---

## 📁 Project Structure

```
AkakiKalityMediaCommunication/
│
├── frontend/                      # React application
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── Layout/          # Navbar, Footer
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.jsx  # Authentication state
│   │   ├── lib/                 # Utilities
│   │   │   └── supabase.js      # Supabase client
│   │   ├── pages/               # Page components
│   │   │   ├── admin/          # Admin pages
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminHome.jsx
│   │   │   │   ├── ArticleList.jsx
│   │   │   │   ├── ArticleForm.jsx
│   │   │   │   ├── GalleryManager.jsx
│   │   │   │   └── FileManager.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── NewsList.jsx
│   │   │   ├── ArticleDetail.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Files.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Login.jsx
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── .env.example             # Environment variables template
│   ├── package.json             # Dependencies
│   └── vite.config.js           # Vite configuration
│
├── supabase-setup.sql           # Database schema & RLS policies
├── DEPLOYMENT.md                # Deployment guide
├── PROJECT_OVERVIEW.md          # This file
└── package.json                 # Root package.json

```

---

## 🗄️ Database Schema

### Tables

#### 1. **users**
```sql
- id (UUID, Primary Key, references auth.users)
- name (TEXT)
- role (TEXT: 'admin' | 'viewer')
- created_at (TIMESTAMP)
```

#### 2. **articles**
```sql
- id (UUID, Primary Key)
- title (TEXT)
- content (TEXT)
- category (TEXT: 'Local' | 'National' | 'Uncategorized')
- image_url (TEXT, nullable)
- video_url (TEXT, nullable)
- published_at (TIMESTAMP)
- author_id (UUID, Foreign Key → users)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### 3. **media_gallery**
```sql
- id (UUID, Primary Key)
- caption (TEXT)
- image_url (TEXT)
- uploaded_at (TIMESTAMP)
```

#### 4. **filesandforms**
```sql
- id (UUID, Primary Key)
- title (TEXT)
- file_url (TEXT)
- type (TEXT: 'PDF' | 'DOCX' | etc.)
- created_at (TIMESTAMP)
```

### Storage Buckets

1. **news-images** - Article featured images
2. **gallery** - Photo gallery images
3. **documents** - Downloadable files/forms

---

## 🔐 Security Implementation

### Row Level Security (RLS)

**Public Access:**
- ✅ Anyone can view articles, gallery, files
- ✅ No authentication required for reading

**Admin Access:**
- ✅ Create, edit, delete articles
- ✅ Upload/delete gallery images
- ✅ Upload/delete files
- ✅ Must be authenticated with `role = 'admin'`

### Authentication
- Email/password via Supabase Auth
- Protected admin routes in React
- Session management with HTTP-only cookies

---

## 🎨 Features Overview

### Public Features

1. **Homepage**
   - Welcome message with hero section
   - Featured news articles (latest 6)
   - Quick access links
   - Responsive design

2. **News Section**
   - Filter by category (Local, National, All)
   - Grid layout with images
   - Click to read full article
   - Embedded YouTube videos

3. **Gallery**
   - Masonry grid layout
   - Lightbox for full-size view
   - Image captions and dates

4. **Files & Forms**
   - Downloadable documents
   - File type icons
   - Direct download links

5. **About & Contact**
   - Static information pages
   - Contact details
   - Office hours

### Admin Features

1. **Dashboard**
   - Overview statistics
   - Recent articles
   - Quick action buttons

2. **Article Management**
   - Rich text editor (React Quill)
   - Image upload
   - YouTube video embedding
   - Category selection
   - Draft/publish workflow

3. **Gallery Management**
   - Bulk image upload
   - Caption editing
   - Delete images

4. **File Management**
   - Multi-format support
   - File type selection
   - Upload progress

---

## 🌐 Technology Stack

### Frontend
- **React 19**: Latest React features
- **Vite**: Fast build tool
- **React Router v6**: Client-side routing
- **React Quill**: Rich text editor
- **Custom CSS**: No framework dependencies

### Backend
- **Supabase**:
  - PostgreSQL database
  - Authentication
  - Storage
  - Row Level Security
  - Real-time subscriptions (future)

### Deployment
- **Frontend**: Vercel or Netlify
- **Backend**: Supabase Cloud
- **CDN**: Automatic via hosting provider

---

## 🚀 Getting Started

### For Developers

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd AkakiKalityMediaCommunication
   ```

2. **Install dependencies**
   ```bash
   npm run setup
   # or
   cd frontend && npm install
   ```

3. **Set up Supabase**
   - Create project on supabase.com
   - Run `supabase-setup.sql`
   - Create storage buckets
   - Get API credentials

4. **Configure environment**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your credentials
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

### For Content Managers

See `DEPLOYMENT.md` for complete setup and usage guide.

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 968px
- **Desktop**: > 968px

All pages are fully responsive and tested on:
- ✅ iPhone (iOS)
- ✅ Android phones
- ✅ iPad
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)

---

## 🌍 Internationalization

### Current Support
- Amharic (አማርኛ) - UI elements
- English - UI elements

### Content Language
- Articles can be written in any language
- Admin can mix languages as needed
- No automatic translation

---

## ⚡ Performance Optimizations

1. **Code Splitting**
   - Route-based splitting
   - Lazy loading admin components

2. **Image Optimization**
   - Supabase automatic optimization
   - Responsive images

3. **Caching**
   - Browser caching for static assets
   - Supabase query caching

4. **SEO**
   - Meta tags
   - Semantic HTML
   - Clean URLs

---

## 🔧 Maintenance

### Regular Tasks

**Daily:**
- Monitor content submissions
- Check for errors in admin panel

**Weekly:**
- Review user feedback
- Check storage usage
- Backup database

**Monthly:**
- Update dependencies
- Review security policies
- Performance audit

### Backup Strategy

1. **Database**: Supabase automatic daily backups
2. **Images**: Supabase Storage retention
3. **Code**: Git repository

---

## 📊 Analytics & Monitoring

### Recommended Tools

1. **Google Analytics** - User behavior
2. **Supabase Dashboard** - Database metrics
3. **Vercel Analytics** - Performance monitoring
4. **Sentry** (optional) - Error tracking

---

## 🐛 Known Limitations

1. **File Size Limits**
   - Images: 50MB (Supabase limit)
   - Documents: 50MB (Supabase limit)

2. **Free Tier Limits**
   - 500MB database storage
   - 1GB file storage
   - 2GB bandwidth/month

3. **Browser Support**
   - Modern browsers only (last 2 versions)
   - No IE11 support

---

## 🔄 Future Enhancements

### Planned Features

1. **Phase 2**
   - Email notifications for new articles
   - Social media sharing
   - Print-friendly views
   - Advanced search

2. **Phase 3**
   - Multi-language article translations
   - User comments (moderated)
   - Newsletter subscription
   - Mobile app (React Native)

3. **Phase 4**
   - Real-time notifications
   - Analytics dashboard for admins
   - Content scheduling
   - Workflow approvals

---

## 📞 Support & Contact

**Technical Support**: Alazar Tesema  
**Documentation**: See `frontend/README.md` and `DEPLOYMENT.md`  
**Issues**: Contact project maintainer

---

## ⚖️ License

This is proprietary software developed for Akaki Kality Subcity Administration.  
All rights reserved.

---

## ✅ Checklist for Go-Live

- [ ] Supabase project created and configured
- [ ] Database schema deployed
- [ ] Storage buckets created
- [ ] Admin user created
- [ ] Environment variables configured
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Test all features in production
- [ ] Create first article
- [ ] Upload sample gallery images
- [ ] Upload sample documents
- [ ] Train content managers
- [ ] Monitor for 24 hours
- [ ] Announce to public

---

**Project Status**: ✅ **READY FOR DEPLOYMENT**

Last Updated: October 23, 2025

