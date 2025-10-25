# Flickr Albums Integration Guide

## Overview
Your gallery now supports displaying Flickr albums! Admins can paste Flickr album links, and they'll appear beautifully in your public gallery.

## Setup Instructions

### 1. Run the Database Migration

First, you need to create the `flickr_albums` table in your Supabase database:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `flickr-albums-setup.sql`
4. Copy and paste its contents into the SQL Editor
5. Click **Run** to execute the migration

This will create the necessary table with proper security policies.

### 2. How to Add Flickr Albums (Admin)

1. **Login** to your admin panel
2. Navigate to **Gallery** in the admin sidebar
3. Click the **"+ Add Flickr Album"** button (green button)
4. Fill in the form:
   - **Album Title*** (required): Give your album a name
   - **Flickr Album URL*** (required): Paste the full Flickr album link
   - **Description** (optional): Brief description of the album
   - **Thumbnail URL** (optional): Direct image URL for the album cover
   - **Number of Photos** (optional): How many photos are in the album

5. Click **"Add Album"** to save

### 3. Getting the Flickr Information

#### To get the Album URL:
1. Go to your Flickr album
2. Copy the URL from your browser address bar
   - Example: `https://www.flickr.com/photos/username/albums/72177720301234567`

#### To get the Thumbnail URL:
1. Open the Flickr album
2. Right-click on any photo you want as the thumbnail
3. Select **"Copy image address"**
4. Paste this URL into the Thumbnail URL field
   - Example: `https://live.staticflickr.com/65535/12345678901_a1b2c3d4e5_z.jpg`

#### Photo Count:
- Just count the photos in your album or check the album details on Flickr

### 4. Managing Albums

**Edit an Album:**
- Click the **"Edit"** button on any Flickr album card
- Update the information
- Click **"Update Album"**

**Delete an Album:**
- Click the **"Delete"** button on any Flickr album card
- Confirm the deletion

**Reorder Albums:**
- Albums are displayed in the order they were added
- Earlier albums appear first

## How It Appears to Visitors

### In the Public Gallery (`/gallery`)

Visitors will see:
1. **Flickr Albums Section** (if Flickr albums exist)
   - All photos from your Flickr albums displayed directly on your website
   - Each photo shows with a green "Flickr" badge
   - Shows the album name tag below each photo
   - Clicking any photo opens it in a beautiful lightbox modal
   - **No redirect to Flickr** - everything displays on your site!

2. **Uploaded Photos Section** (if uploaded images exist)
   - Your regular uploaded images
   - Can click to view in a lightbox modal

## Features

✅ **Easy Management**: Simply paste Flickr links - no API setup needed
✅ **Automatic Photo Fetching**: Photos from Flickr albums are automatically fetched and displayed on your site
✅ **On-Site Display**: All photos display directly on your website - no redirect to Flickr needed
✅ **Beautiful Lightbox**: Click any photo to view it in a modal popup
✅ **Clear Indication**: Flickr badge shows which content is hosted on Flickr
✅ **Album Organization**: Photos are tagged with their album name
✅ **Mobile Responsive**: Works perfectly on all devices

## Tips

💡 **Use Public Albums**: Make sure your Flickr albums are set to "Public" so the system can fetch the photos

💡 **Keep Titles Clear**: Use descriptive titles like "Summer Festival 2024" instead of just "Photos"

💡 **Organize by Date**: Add newer albums first for the most recent content to appear on top

💡 **Album Names Show**: The album title will appear as a tag under each photo, helping visitors know which event it's from

💡 **No API Key Needed**: This uses Flickr's public RSS feed, so you don't need to sign up for API keys!

## Troubleshooting

**Photos not showing from Flickr album?**
- Check that the Flickr URL is correct and complete
- Ensure the album is set to **Public** on Flickr (very important!)
- The URL should be in format: `https://www.flickr.com/photos/USERNAME/albums/ALBUM_ID`
- Open browser console (F12) to check for any error messages

**Photos load slowly?**
- Flickr photos are fetched in real-time from Flickr's servers
- Large albums may take a few seconds to load
- This is normal and only happens once when the page loads

**Can't edit or delete albums?**
- Ensure you're logged in as an admin
- Check your browser console for any errors

**Flickr images not displaying?**
- Make sure the album is public (not private or friends-only)
- Some Flickr accounts have download restrictions - make sure "Allow others to share your stuff" is enabled in Flickr settings

## Database Structure

The `flickr_albums` table contains:
- `id`: Unique identifier
- `title`: Album name
- `description`: Optional description
- `flickr_url`: Link to Flickr album
- `thumbnail_url`: Optional thumbnail image
- `photo_count`: Number of photos
- `display_order`: Order of appearance
- `created_at` / `updated_at`: Timestamps

## Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify the database migration ran successfully
3. Ensure you're logged in with admin privileges
4. Check that your Flickr albums are public

