# 🏛️ Akaki Kality Subcity News Platform

A modern, bilingual news platform for the Akaki Kality Subcity Administration, built with React and Supabase.

![Project Status](https://img.shields.io/badge/status-ready-success)
![React](https://img.shields.io/badge/react-19.2.0-blue)
![Supabase](https://img.shields.io/badge/supabase-latest-green)

---

## 📋 Quick Links

- **[Project Overview](PROJECT_OVERVIEW.md)** - Detailed project documentation
- **[Deployment Guide](DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[Frontend README](frontend/README.md)** - Technical setup and development
- **[Database Schema](supabase-setup.sql)** - Complete SQL setup script

---

## ✨ Features

### For Citizens (Public Site)
- 📰 Browse categorized news articles (Local, National)
- 🖼️ Photo gallery with event coverage
- 📄 Download public documents and forms
- 🎥 Watch embedded YouTube videos
- 🌍 Bilingual interface (Amharic/English)
- 📱 Fully responsive (mobile, tablet, desktop)

### For Administrators
- 🔐 Secure authentication system
- ✏️ Rich text editor for articles
- 📸 Image upload and management
- 🎬 YouTube video embedding
- 📊 Dashboard with statistics
- 🗂️ File management system

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AkakiKalityMediaCommunication
   ```

2. **Install dependencies**
   ```bash
   npm run setup
   ```

3. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL script: `supabase-setup.sql`
   - Create storage buckets: `news-images`, `gallery`, `documents`
   - Create admin user via Supabase Auth

4. **Configure environment**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Public site: `http://localhost:5173`
   - Admin login: `http://localhost:5173/login`

---

## 📦 Project Structure

```
AkakiKalityMediaCommunication/
├── frontend/                  # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── contexts/         # React contexts (Auth)
│   │   ├── lib/             # Utilities (Supabase client)
│   │   ├── pages/           # All page components
│   │   │   ├── admin/       # Admin panel pages
│   │   │   └── ...          # Public pages
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── vite.config.js
├── supabase-setup.sql        # Database schema
├── DEPLOYMENT.md             # Deployment guide
├── PROJECT_OVERVIEW.md       # Detailed documentation
└── README.md                 # This file
```

---

## 🗄️ Database Tables

- **users** - Admin user profiles and roles
- **articles** - News articles with categories
- **media_gallery** - Photo gallery images
- **filesandforms** - Downloadable documents

**Storage Buckets:**
- `news-images` - Article featured images
- `gallery` - Gallery photos
- `documents` - Downloadable files

---

## 🔐 Security

- ✅ Row Level Security (RLS) on all tables
- ✅ Admin-only write access
- ✅ Public read access for published content
- ✅ Secure file uploads via Supabase Storage
- ✅ JWT-based authentication

---

## 🌐 Deployment

### Frontend Options
- **Vercel** (Recommended) - Zero-config deployment
- **Netlify** - Alternative hosting option

### Backend
- **Supabase Cloud** - Managed PostgreSQL, Auth, Storage

**See [DEPLOYMENT.md](DEPLOYMENT.md) for complete guide.**

---

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🛠️ Development Scripts

```bash
# Install dependencies
npm run setup

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📸 Screenshots

### Public Homepage
![Homepage](https://via.placeholder.com/800x400?text=Homepage+Screenshot)

### Admin Dashboard
![Admin Dashboard](https://via.placeholder.com/800x400?text=Admin+Dashboard+Screenshot)

### Article Editor
![Article Editor](https://via.placeholder.com/800x400?text=Article+Editor+Screenshot)

---

## 🎨 Design

### Color Palette
- **Primary**: Blue (`#3b82f6`) - Government official color
- **Secondary**: Yellow (`#fbbf24`) - Accent color
- **Dark**: Navy (`#1e3a8a`) - Headers and text
- **Light**: Gray (`#f8fafc`) - Backgrounds

### Typography
- **Headings**: Segoe UI, bold
- **Body**: Segoe UI, regular
- **Amharic**: System fonts with good Ethiopic script support

---

## 🌍 Internationalization

The platform supports **Amharic** (አማርኛ) and **English** with:
- Language toggle in navigation
- Translated UI elements
- Content can be in any language

---

## 📈 Performance

- ⚡ Fast page loads with Vite
- 🗜️ Optimized images via Supabase
- 📦 Code splitting for admin routes
- 🚀 CDN delivery for static assets

---

## 🧪 Testing

Currently manual testing. Future additions:
- Unit tests (Vitest)
- E2E tests (Playwright)
- Accessibility tests

---

## 🐛 Known Issues

1. React Quill requires legacy peer deps for React 19
2. Free tier storage limits (1GB)
3. No offline support yet

---

## 🔄 Roadmap

### Phase 1 ✅ (Current)
- Basic news platform
- Admin panel
- Gallery and files

### Phase 2 🔜
- Email notifications
- Social media sharing
- Advanced search
- SEO improvements

### Phase 3 🔮
- Mobile app
- Real-time notifications
- Content scheduling
- Analytics dashboard

---

## 📞 Support

**Project Owner**: Alazar Tesema  
**Organization**: Akaki Kality Subcity Administration

For technical issues:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
2. Review Supabase logs
3. Check browser console
4. Contact project maintainer

---

## 📄 License

Proprietary software developed for Akaki Kality Subcity Administration.  
All rights reserved.

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/) / [Netlify](https://netlify.com/)

---

## 📝 Changelog

### Version 1.0.0 (2025-10-23)
- ✅ Initial release
- ✅ Public news platform
- ✅ Admin dashboard
- ✅ Gallery and file management
- ✅ Bilingual support
- ✅ Responsive design

---

**Made with ❤️ for Akaki Kality Subcity**

