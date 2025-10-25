# 🚀 Quick Setup Guide - Akaki Kality News Platform

This is a simplified guide to get you up and running quickly. For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

---

## ⚡ 5-Minute Setup

### Step 1: Get the Code (1 min)

```bash
# Clone the repository (or download ZIP)
git clone <your-repo-url>
cd AkakiKalityMediaCommunication

# Install dependencies
npm run setup
```

### Step 2: Set Up Supabase Backend (2 min)

1. **Create Account**: Go to [supabase.com](https://supabase.com) → Sign up (free)

2. **Create Project**:
   - Click "New Project"
   - Name: `akaki-kality`
   - Password: (generate strong password)
   - Region: Choose closest to Ethiopia
   - Click "Create"

3. **Run Database Setup**:
   - In Supabase dashboard, go to **SQL Editor**
   - Copy everything from `supabase-setup.sql` file
   - Paste and click **Run**

4. **Create Storage Buckets**:
   - Go to **Storage** tab
   - Create 3 buckets (all public):
     - `news-images`
     - `gallery`
     - `documents`

5. **Create Admin User**:
   - Go to **Authentication** → **Users**
   - Click "Add user" → "Create new user"
   - Email: `admin@example.com`
   - Password: (generate strong password)
   - Auto Confirm: ✅
   - Copy the user UUID

6. **Make User Admin**:
   - Go to **SQL Editor**
   - Run:
   ```sql
   INSERT INTO users (id, name, role) 
   VALUES ('YOUR_USER_UUID', 'Admin', 'admin');
   ```

### Step 3: Connect Frontend (1 min)

1. **Get Supabase Credentials**:
   - In Supabase: **Settings** → **API**
   - Copy:
     - Project URL
     - anon public key

2. **Configure Frontend**:
   ```bash
   cd frontend
   cp .env.example .env
   ```

3. **Edit `.env`**:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

### Step 4: Run It! (1 min)

```bash
npm run dev
```

Visit: `http://localhost:5173`

---

## ✅ Test Everything

1. **Homepage** - Should load without errors
2. **Login** - Go to `/login`, use admin credentials
3. **Admin Dashboard** - Should see admin panel
4. **Create Article** - Try creating a test article
5. **View Article** - Check it appears on homepage

---

## 🎉 Success!

Your platform is now running locally!

### Next Steps:

1. **Customize**:
   - Replace logo
   - Update contact information
   - Customize colors

2. **Add Content**:
   - Create real articles
   - Upload gallery images
   - Add downloadable files

3. **Deploy Online**:
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for Vercel/Netlify deployment

---

## 🆘 Common Issues

### Issue: "Cannot connect to Supabase"
**Fix**: Check `.env` file has correct URL and key

### Issue: "Login not working"
**Fix**: 
- Verify user exists in Authentication
- Check user has admin role in `users` table

### Issue: "Images not uploading"
**Fix**: 
- Verify storage buckets exist
- Check buckets are set to public

### Issue: "Build errors"
**Fix**: 
- Delete `node_modules` folder
- Run `npm install` again
- Use Node.js 18 or higher

---

## 📚 More Help

- **Detailed Setup**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Technical Docs**: [frontend/README.md](frontend/README.md)
- **Project Overview**: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)

---

## 🎯 Quick Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Setup
npm run setup        # Install dependencies
```

---

**Need more help?** Contact: Alazar Tesema

**Ready to deploy?** See [DEPLOYMENT.md](DEPLOYMENT.md)

