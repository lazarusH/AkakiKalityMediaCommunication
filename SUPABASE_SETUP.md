# 🗄️ Supabase Setup Instructions

Complete step-by-step guide to set up your Supabase backend for the Akaki Kality News Platform.

---

## ⚠️ Important Note

You currently have **reached the limit** of free Supabase projects (2 projects). You need to either:
1. **Delete** an existing project you're not using
2. **Pause** an existing project
3. **Upgrade** an existing project to a paid plan

Once you have space for a new project, follow these instructions.

---

## 📋 Prerequisites

- [ ] Supabase account (sign up at [supabase.com](https://supabase.com))
- [ ] Space for a new project (see note above)
- [ ] 10 minutes of time

---

## Step 1: Create Supabase Project

### 1.1 Go to Supabase Dashboard
- Visit [app.supabase.com](https://app.supabase.com)
- Sign in to your account

### 1.2 Create New Project
1. Click **"New Project"** button
2. Fill in the details:
   - **Name**: `Akaki Kality Media` (or any name you prefer)
   - **Database Password**: Click "Generate password" and **SAVE IT**
   - **Region**: Choose `eu-west-1` (Europe West - Ireland) or closest to Ethiopia
   - **Pricing Plan**: Free tier is fine to start

3. Click **"Create new project"**
4. Wait 2-3 minutes for project to initialize

### 1.3 Note Your Project Details
Once ready, note these from **Settings → API**:
- ✅ **Project URL**: `https://xxxxx.supabase.co`
- ✅ **anon public key**: Starts with `eyJ...` (long string)

**SAVE THESE - You'll need them later!**

---

## Step 2: Set Up Database

### 2.1 Open SQL Editor
- In your Supabase dashboard
- Click **"SQL Editor"** in the left sidebar
- Click **"New query"**

### 2.2 Run the Migration
1. Open the file `supabase-setup.sql` from this project
2. Copy **ALL** the contents
3. Paste into the SQL Editor
4. Click **"Run"** (or press Ctrl/Cmd + Enter)
5. You should see: **"Success. No rows returned"**

### 2.3 Verify Tables
- Go to **"Table Editor"** in the left sidebar
- You should see 4 tables:
  - ✅ `users`
  - ✅ `articles`
  - ✅ `media_gallery`
  - ✅ `filesandforms`

If you see all 4 tables, you're good! ✅

---

## Step 3: Create Storage Buckets

### 3.1 Create First Bucket: news-images
1. Go to **"Storage"** in the left sidebar
2. Click **"New bucket"**
3. Fill in:
   - **Name**: `news-images` (exact spelling, lowercase, with hyphen)
   - **Public bucket**: ✅ **Check this box**
4. Click **"Create bucket"**

### 3.2 Create Second Bucket: gallery
1. Click **"New bucket"** again
2. Fill in:
   - **Name**: `gallery`
   - **Public bucket**: ✅ **Check this box**
3. Click **"Create bucket"**

### 3.3 Create Third Bucket: documents
1. Click **"New bucket"** again
2. Fill in:
   - **Name**: `documents`
   - **Public bucket**: ✅ **Check this box**
3. Click **"Create bucket"**

### 3.4 Verify Buckets
You should now see three buckets:
- ✅ `news-images`
- ✅ `gallery`
- ✅ `documents`

All should be marked as **Public**.

---

## Step 4: Create Admin User

### 4.1 Create User in Authentication
1. Go to **"Authentication"** in the left sidebar
2. Click **"Add user"** dropdown
3. Select **"Create new user"**
4. Fill in:
   - **Email**: `admin@akakikality.gov.et` (or your preferred admin email)
   - **Password**: Generate a strong password (save it!)
   - **Auto Confirm User**: ✅ **Check this box**
5. Click **"Create user"**

### 4.2 Copy User ID
1. After creation, you'll see the user in the list
2. Click on the user to see details
3. **COPY** the **User UUID** (looks like: `d5e6f7g8-h9i0-j1k2-l3m4-n5o6p7q8r9s0`)
4. **SAVE THIS UUID - You need it for the next step!**

### 4.3 Grant Admin Role
1. Go back to **"SQL Editor"**
2. Click **"New query"**
3. Paste this SQL (replace `YOUR_USER_UUID` with the UUID you copied):

```sql
INSERT INTO users (id, name, role) 
VALUES ('YOUR_USER_UUID', 'Admin Name', 'admin');
```

4. Replace:
   - `YOUR_USER_UUID` with the actual UUID
   - `Admin Name` with the admin's real name (e.g., 'Alazar Tesema')

5. Click **"Run"**
6. You should see: **"Success. 1 row inserted."**

### 4.4 Verify Admin User
1. Go to **"Table Editor"**
2. Click on **"users"** table
3. You should see your admin user with `role = 'admin'` ✅

---

## Step 5: Get API Credentials

### 5.1 Navigate to Project Settings
1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu

### 5.2 Copy Required Values

**Project URL:**
```
https://xxxxx.supabase.co
```
Copy this entire URL ✅

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...
```
Copy this entire long string ✅

**service_role key** (Optional - for advanced use):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...
```
Don't need this for now, but save it if you want.

---

## Step 6: Configure Frontend

### 6.1 Create Environment File
1. Open your project folder
2. Go to `frontend/` directory
3. Find the file `.env.example`
4. Create a copy named `.env` (no .example)

### 6.2 Add Your Credentials
Open `.env` and add:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your-actual-key...
```

Replace with your actual values from Step 5.2.

### 6.3 Verify Configuration
- File should be named exactly `.env` (not `.env.txt`)
- No quotes around the values
- No extra spaces
- Save the file

---

## ✅ Verification Checklist

Before proceeding, verify you have:

- [ ] Created Supabase project
- [ ] Run the SQL migration (4 tables created)
- [ ] Created 3 storage buckets (all public)
- [ ] Created admin user in Authentication
- [ ] Inserted admin user into `users` table with role='admin'
- [ ] Copied Project URL and anon key
- [ ] Created `.env` file in `frontend/` directory
- [ ] Added correct credentials to `.env` file

If all checked ✅, you're ready to run the application!

---

## 🚀 Next Steps

### Test Locally
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` and:
1. Homepage should load
2. Go to `/login`
3. Sign in with your admin credentials
4. You should see the admin dashboard

### Deploy Online
Once local testing works, see:
- **[DEPLOYMENT.md](DEPLOYMENT.md)** for Vercel/Netlify deployment

---

## 🆘 Troubleshooting

### Error: "Invalid API credentials"
**Fix**: Double-check your `.env` file:
- URL is correct (no trailing slash)
- Key is complete (very long string)
- No extra spaces or quotes

### Error: "Login failed"
**Fix**: 
1. Go to Supabase → Authentication → Users
2. Verify user exists
3. Go to Table Editor → users table
4. Verify user has `role = 'admin'`

### Error: "Failed to create bucket"
**Fix**:
- Bucket names must be lowercase
- Use hyphens, not spaces or underscores
- Must check "Public bucket"

### Error: "Cannot upload files"
**Fix**:
1. Verify buckets exist
2. Verify buckets are public
3. Check you're logged in as admin

### Error: "Tables not found"
**Fix**:
- Re-run the SQL migration
- Check for any SQL errors
- Ensure all queries executed successfully

---

## 📞 Need More Help?

### Supabase Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Supabase Support](https://supabase.com/support)

### Project Documentation
- Quick Start: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Full Deployment: [DEPLOYMENT.md](DEPLOYMENT.md)
- Technical Details: [frontend/README.md](frontend/README.md)

---

## 🎉 Success!

Once you complete all steps, your backend is fully set up and ready!

Your platform will have:
- ✅ Database with security policies
- ✅ Authentication system
- ✅ File storage
- ✅ Admin user ready to use

**Ready to build something amazing!** 🚀

---

**Last Updated**: October 23, 2025  
**For Project**: Akaki Kality Media Communication Platform

