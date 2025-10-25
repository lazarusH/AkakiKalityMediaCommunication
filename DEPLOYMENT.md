# Deployment Guide - Akaki Kality News Platform

This guide covers deploying the frontend to Vercel/Netlify and setting up Supabase backend.

## 📋 Prerequisites

- [x] GitHub account
- [x] Supabase account (free tier)
- [x] Vercel or Netlify account (free tier)
- [x] Domain name (optional)

## 🗄️ Part 1: Supabase Backend Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - **Name**: `akaki-kality-news`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users (e.g., `eu-west-1`)
4. Wait for project to be created (~2 minutes)

### Step 2: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-setup.sql`
3. Paste and click "Run"
4. Verify tables were created: **Table Editor** should show `articles`, `media_gallery`, `filesandforms`, `users`

### Step 3: Create Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Create three buckets:

**Bucket 1: news-images**
- Click "New bucket"
- Name: `news-images`
- Public: ✅ Yes
- Click "Create bucket"

**Bucket 2: gallery**
- Name: `gallery`
- Public: ✅ Yes
- Click "Create bucket"

**Bucket 3: documents**
- Name: `documents`
- Public: ✅ Yes
- Click "Create bucket"

### Step 4: Create Admin User

1. Go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Enter:
   - Email: `admin@akakikality.gov.et`
   - Password: Generate strong password
   - Auto Confirm User: ✅ Yes
4. Click "Create user"
5. Copy the user's UUID (you'll need it)

### Step 5: Grant Admin Role

1. Go to **SQL Editor**
2. Run this query (replace `YOUR_USER_UUID` with the UUID from step 4):

```sql
INSERT INTO users (id, name, role) 
VALUES ('YOUR_USER_UUID', 'Admin Name', 'admin');
```

### Step 6: Get API Credentials

1. Go to **Project Settings** > **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Long string starting with `eyJ...`

Save these for the next part!

---

## 🚀 Part 2: Frontend Deployment

### Option A: Deploy to Vercel (Recommended)

#### Step 1: Push to GitHub

```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/akaki-kality-news.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_SUPABASE_URL = your-supabase-url
     VITE_SUPABASE_ANON_KEY = your-supabase-anon-key
     ```

6. Click "Deploy"
7. Wait 2-3 minutes for deployment
8. Your site will be live at `https://your-project.vercel.app`

#### Step 3: Add Custom Domain (Optional)

1. Go to your project in Vercel
2. Click "Settings" > "Domains"
3. Add your domain (e.g., `news.akakikality.gov.et`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

### Option B: Deploy to Netlify

#### Step 1: Push to GitHub

(Same as Vercel Step 1)

#### Step 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" > "Import an existing project"
3. Choose GitHub and select your repository
4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

5. Click "Advanced build settings"
6. Add environment variables:
   ```
   VITE_SUPABASE_URL = your-supabase-url
   VITE_SUPABASE_ANON_KEY = your-supabase-anon-key
   ```

7. Click "Deploy site"
8. Your site will be live at `https://your-site.netlify.app`

#### Step 3: Add Custom Domain (Optional)

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain
4. Follow DNS configuration
5. SSL certificate will be issued automatically

---

## ✅ Part 3: Verification

### Test the Deployment

1. **Visit your site**
   - Homepage should load
   - Navigation should work
   - No articles yet (expected)

2. **Test Admin Login**
   - Go to `/login`
   - Use admin credentials
   - Should redirect to `/admin`

3. **Create Test Article**
   - Click "New Article"
   - Fill in details
   - Upload an image
   - Publish
   - Verify it appears on homepage

4. **Test Gallery**
   - Go to Admin > Gallery
   - Upload an image
   - Check public gallery page

5. **Test Files**
   - Go to Admin > Files
   - Upload a PDF
   - Download from public page

---

## 🔧 Part 4: Configuration

### Update Supabase CORS (if needed)

If you get CORS errors:

1. Go to Supabase **Project Settings** > **API**
2. Under "API URL", add your domain to allowed origins

### Enable Email Confirmations

1. Go to **Authentication** > **Settings**
2. Configure Email Templates
3. Set up SMTP (optional, uses Supabase by default)

### Set up Backup (Recommended)

1. Go to **Project Settings** > **Backups**
2. Enable automatic daily backups
3. Free tier: 7 days retention

---

## 📊 Part 5: Monitoring

### Supabase Dashboard

Monitor:
- **Database** > Check table sizes
- **Storage** > Monitor usage
- **Authentication** > Active users
- **API** > Request logs

### Vercel/Netlify Dashboard

Monitor:
- **Analytics** > Page views
- **Functions** > Edge function logs
- **Bandwidth** > Data transfer

---

## 🆘 Troubleshooting

### Issue: "Site not loading"

**Solution:**
- Check environment variables are set correctly
- Verify Supabase project is active
- Check browser console for errors

### Issue: "Authentication failed"

**Solution:**
- Verify user exists in Supabase Auth
- Check user has admin role in `users` table
- Ensure RLS policies are enabled

### Issue: "Images not uploading"

**Solution:**
- Verify storage buckets exist
- Check buckets are set to public
- Verify storage policies allow admin uploads

### Issue: "Build failed"

**Solution:**
- Check all dependencies are installed
- Verify build command is correct
- Check Node.js version (need 18+)

---

## 🔄 Updating the Site

### Update Content (No code changes)

Just use the admin panel!

### Update Code

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Vercel/Netlify will auto-deploy
```

### Database Changes

1. Write SQL migration
2. Run in Supabase SQL Editor
3. Test thoroughly
4. Document changes

---

## 📧 Support

For issues or questions:
- **Technical**: Contact Alazar Tesema
- **Content**: Admin panel training needed
- **Infrastructure**: Check Supabase/Vercel status pages

---

## 🎉 Success!

Your news platform is now live! 

**Admin Panel**: `your-domain.com/admin`  
**Public Site**: `your-domain.com`

Remember to:
- [ ] Change default admin password
- [ ] Create additional admin users if needed
- [ ] Test all features thoroughly
- [ ] Train content managers on admin panel
- [ ] Set up regular backups
- [ ] Monitor usage and performance

