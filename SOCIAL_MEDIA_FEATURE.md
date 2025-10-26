# Social Media Links Management Feature

## Overview
This feature allows administrators to manage social media links that are displayed in the website footer. The links are dynamically fetched from the database and displayed with beautiful SVG icons.

## Features

### Admin Dashboard
- **Location**: `/admin/social-media`
- **Access**: Admin users only
- **Icon**: 📱 Social Media

### Supported Platforms
The system supports the following social media platforms:
1. 📘 Facebook
2. 🐦 Twitter (X)
3. 📺 YouTube
4. ✈️ Telegram
5. 📷 Instagram
6. 💼 LinkedIn
7. 🎵 TikTok
8. 💬 WhatsApp
9. 🔗 Other (custom platform)

### Admin Functionality
- ✅ Add new social media links
- ✏️ Edit existing links
- 🗑️ Delete links
- 👁️ Toggle active/inactive status
- 📊 Set display order (lower numbers appear first)
- 🎨 Beautiful card-based interface

### Frontend Display
- Social media links appear in the footer
- Only active links are displayed
- Links are sorted by display order
- Beautiful SVG icons with hover animations
- Opens in new tab with proper security attributes
- Responsive design

## Database Schema

### Table: `social_media_links`
```sql
- id: UUID (Primary Key)
- platform: TEXT (facebook, twitter, youtube, telegram, instagram, linkedin, tiktok, whatsapp, other)
- url: TEXT (Full URL to social media page)
- display_order: INTEGER (Sort order, default: 0)
- is_active: BOOLEAN (Show/hide link, default: true)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### RLS Policies
- ✅ Anyone can view active links (public read)
- 🔒 Only admins can insert, update, and delete links

## Sample Data
The system comes pre-populated with sample social media links:
- Facebook: https://facebook.com/akakikalityadmin
- Telegram: https://t.me/akakikality
- YouTube: https://youtube.com/@akakikality
- Twitter: https://twitter.com/akakikality

## Usage Instructions

### For Admins

#### Adding a New Link
1. Navigate to `/admin/social-media`
2. Click "➕ አዲስ አገናኝ ጨምር" (Add New Link)
3. Select the platform from the dropdown
4. Enter the full URL (e.g., https://facebook.com/your-page)
5. Set display order (lower numbers appear first)
6. Check "ንቁ (Active)" to make it visible
7. Click "አገናኝ ጨምር" (Add Link)

#### Editing a Link
1. Find the link card in the grid
2. Click the "✏️" (Edit) button
3. Modify the fields
4. Click "ለውጦችን አስቀምጥ" (Save Changes)

#### Toggling Active Status
- Click the "👁️" icon to deactivate
- Click the "🚫" icon to reactivate

#### Deleting a Link
1. Click the "🗑️" (Delete) button
2. Confirm the deletion

### For Frontend Users
- Social media links appear automatically in the footer
- Click any icon to visit the social media page
- Links open in a new tab

## Technical Implementation

### Components
1. **SocialMediaManager.jsx** - Admin management interface
2. **SocialMediaManager.css** - Admin styles
3. **Footer.jsx** - Updated to fetch and display links
4. **Footer.css** - Updated with SVG icon styles

### Icons
- All icons are implemented as inline SVG for better performance
- SVGs are from official brand assets
- Hover effects include scaling and color changes

### Security
- Links open with `target="_blank"` and `rel="noopener noreferrer"`
- RLS policies ensure only admins can modify links
- Public read access only for active links

## Files Modified
- ✅ `frontend/src/pages/admin/SocialMediaManager.jsx` (new)
- ✅ `frontend/src/pages/admin/SocialMediaManager.css` (new)
- ✅ `frontend/src/components/Layout/Footer.jsx` (updated)
- ✅ `frontend/src/components/Layout/Footer.css` (updated)
- ✅ `frontend/src/App.jsx` (added route)
- ✅ `frontend/src/pages/admin/AdminDashboard.jsx` (added nav link)
- ✅ Database migration: `create_social_media_links` (new)

## Future Enhancements
- [ ] Add more platform options
- [ ] Custom icon upload
- [ ] Analytics tracking for social media clicks
- [ ] Bulk import/export
- [ ] Platform-specific validation for URLs

