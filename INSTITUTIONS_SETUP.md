# የተቋማት ስርዓት መመሪያ (Institutions System Guide)

## Overview / አጠቃላይ እይታ

This guide explains the new Institutions menu system and admin management interface for managing institutional content.

## Features / ባህሪያት

### 1. Responsive Multi-level Dropdown Menu / ምላሽ ሰጪ የተደራጀ ምናሌ

The navbar now includes a "ተቋማት" (Institutions) menu with:
- **5 Main Pools (ፑሎች):**
  - የዋና ስራ አስፈፃሚ ፑል (Executive Pool)
  - የፐብሊክ ሰርቪስና የሰው ሀባት ልማት ፑል (Public Service Pool)
  - የዲዛይንና ግንባታ ስራዎች ፑል (Design & Construction Pool)
  - ስራ አስኪያጅ ፑል (Operations Pool)
  - ሌሎች ተቋማት (Other Institutions)

- **34 Sub-offices (ፅ/ቤቶች)** organized under each pool

### 2. Admin Content Management / የአስተዳዳሪ ይዘት አስተዳደር

Admins can now manage all institution content through the admin dashboard:
- Add/Edit/Delete institutions
- Upload images/logos for each institution
- Manage all content fields in Amharic

## Database Setup / የመረጃ ቋት ማዋቀር

### Step 1: Create the Institutions Table / ሠንጠረዥ መፍጠር

Run the SQL script in Supabase SQL Editor:

```bash
# Execute the institutions-setup.sql file in Supabase
```

Navigate to: **Supabase Dashboard → SQL Editor → New Query**

Copy and paste the contents of `institutions-setup.sql` and run it.

This will create:
- ✅ `institutions` table with all necessary fields
- ✅ Row Level Security (RLS) policies
- ✅ Default pool data
- ✅ Auto-update triggers

### Step 2: Verify Storage Bucket / የማከማቻ ባልዲ ማረጋገጥ

Ensure the `media` storage bucket exists:

1. Go to: **Supabase Dashboard → Storage**
2. Verify `media` bucket exists
3. If not, create it with public access

## Usage Guide / የአጠቃቀም መመሪያ

### For Website Visitors / ለድህረ ገጽ ጎብኚዎች

1. **Desktop View:**
   - Hover over "ተቋማት" in the navbar
   - Select a pool from the dropdown
   - Hover over a pool to see its offices
   - Click on any office to view its page

2. **Mobile View:**
   - Click the hamburger menu (☰)
   - Click on "ተቋማት"
   - All pools and offices are displayed in an expandable list
   - Click any item to navigate

### For Administrators / ለአስተዳዳሪዎች

#### Accessing the Institution Manager / የተቋማት አስተዳዳሪ መድረስ

1. Login to admin panel: `/admin`
2. Click on "Institutions" (🏛️) in the sidebar
3. You'll see the Institutions Manager interface

#### Adding a New Institution / አዲስ ተቋም መጨመር

1. Click **"አዲስ ተቋም ጨምር"** (Add New Institution)
2. Fill in the form:

   **Required Fields / አስፈላጊ መስኮች:**
   - **Slug**: URL-friendly identifier (e.g., `council-office`)
     - Use lowercase letters
     - Use hyphens instead of spaces
     - Must be unique
   
   - **አይነት (Type)**: Select either:
     - `ፑል (Pool)` for main categories
     - `ፅ/ቤት (Office)` for sub-offices
   
   - **ርዕስ (Title)**: Full name in Amharic (e.g., `ምክር ቤት ፅ/ቤት`)
   
   - **መግቢያ መግለጫ (Description)**: Introductory paragraph about the institution

   **Optional Fields / አማራጭ መስኮች:**
   - **ራዕይ (Vision)**: Institution's vision statement
   - **ተልዕኮ (Mission)**: Institution's mission statement
   - **ዋና ተግባራት (Functions)**: Main functions (one per line)
   - **የአደረጃጀት መዋቅር (Structure)**: Organizational structure description
   - **Contact Information:**
     - ስልክ (Phone)
     - ኢሜል (Email)
     - አድራሻ (Address)
   - **ምስል / ሎጎ (Image/Logo)**: Upload institution logo

3. Click **"ተቋም ጨምር"** (Add Institution) to save

#### Uploading Images / ምስሎችን መጫን

1. In the form, find the "ምስል / ሎጎ" field
2. Click "Choose File"
3. Select an image (JPG, PNG, etc.)
4. Wait for upload confirmation
5. A preview will appear below the file input

**Image Guidelines:**
- Recommended size: 500x500px
- Format: JPG or PNG
- Maximum file size: 2MB
- Square images work best for logos

#### Editing an Institution / ተቋም ማስተካከል

1. Find the institution in the list
2. Click **"አርትዕ"** (Edit) button
3. Modify the fields as needed
4. Click **"ለውጦችን አስቀምጥ"** (Save Changes)

#### Deleting an Institution / ተቋም መሰረዝ

1. Find the institution in the list
2. Click **"ሰርዝ"** (Delete) button
3. Confirm the deletion

⚠️ **Warning:** Deletion is permanent and cannot be undone!

## Content Guidelines / የይዘት መመሪያዎች

### Writing Functions (ዋና ተግባራት)

Enter each function on a new line:

```
የተቋሙን ዋና ተግባራት እና ኃላፊነቶች መወጣት
የማህበረሰቡን ፍላጎት ማሟላት እና አገልግሎት መስጠት
ከሌሎች ተቋማት ጋር በመተባበር የልማት ሥራዎችን ማከናወን
የአመራር እና የቁጥጥር ስርዓቶችን ማጠናከር
```

These will automatically be converted to a bulleted list on the frontend.

### Writing Vision & Mission

Keep these concise and clear:
- **Vision**: 2-3 sentences about the ideal future state
- **Mission**: 2-3 sentences about how you'll achieve the vision

### Contact Information

Always provide complete contact details:
- Include country code for phone: `+251 11 XXX XXXX`
- Use official email addresses
- Provide full physical address

## File Structure / የፋይል አወቃቀር

```
frontend/src/
├── components/Layout/
│   ├── Navbar.jsx              # Updated with dropdown menu
│   └── Navbar.css              # Dropdown styles
├── pages/
│   ├── institutions/
│   │   ├── InstitutionTemplate.jsx    # Main template component
│   │   ├── InstitutionTemplate.css    # Template styles
│   │   ├── ExecutivePool.jsx          # Pool pages
│   │   ├── PublicServicePool.jsx
│   │   ├── DesignConstructionPool.jsx
│   │   ├── OperationsPool.jsx
│   │   ├── OtherInstitutions.jsx
│   │   └── offices/                   # 34 office pages
│   │       ├── CouncilOffice.jsx
│   │       ├── SecurityOffice.jsx
│   │       ├── ...
│   │       └── PlanningDevelopmentOffice.jsx
│   └── admin/
│       ├── InstitutionManager.jsx     # Admin interface
│       └── InstitutionManager.css     # Admin styles
└── App.jsx                            # Updated routes

institutions-setup.sql                 # Database setup
```

## Responsive Design / ምላሽ ሰጭ ዲዛይን

The menu automatically adapts to different screen sizes:

- **Desktop (>960px):** Hover-based multi-level dropdown
- **Tablet/Mobile (≤960px):** Collapsible accordion-style menu
- All menus are left-aligned for consistency
- Submenu overflow is handled with scrolling

## Troubleshooting / ችግር መፍታት

### Menu Not Appearing
1. Check browser console for errors
2. Verify you're logged in for admin features
3. Clear browser cache and refresh

### Images Not Uploading
1. Verify storage bucket permissions in Supabase
2. Check image file size (max 2MB)
3. Ensure `media` bucket exists and is public

### Content Not Displaying
1. Verify database table was created successfully
2. Check RLS policies in Supabase
3. Verify slug matches between page and database

### Dropdown Positioning Issues
1. Check if parent container has `overflow: hidden`
2. Verify z-index values
3. Test in different browsers

## Best Practices / ምርጥ ልምዶች

1. **Always use unique slugs** - No two institutions should have the same slug
2. **Write in Amharic** - All content should be in Amharic for consistency
3. **Upload high-quality images** - Use clear, professional logos
4. **Keep content updated** - Regularly review and update information
5. **Test on mobile** - Always test how content displays on mobile devices
6. **Backup before major changes** - Export data before large updates

## Support / ድጋፍ

For technical support or questions:
- Check this documentation first
- Review the code comments in the files
- Contact the development team

## Future Enhancements / የወደፊት ማሻሻያዎች

Potential improvements:
- [ ] Bilingual support (Amharic/English toggle)
- [ ] Rich text editor for content
- [ ] Multi-image gallery per institution
- [ ] Search functionality
- [ ] Staff directory per institution
- [ ] Document attachments per institution
- [ ] News/announcements per institution

---

## Quick Reference / ፈጣን ማጣቀሻ

### Common Slugs Pattern
- Pools: `executive-pool`, `public-service-pool`, etc.
- Offices: `council-office`, `security-office`, etc.
- Always lowercase, use hyphens

### Admin URLs
- Dashboard: `/admin`
- Institutions Manager: `/admin/institutions`

### Public URLs
- Pool: `/institutions/executive-pool`
- Office: `/institutions/council-office`

---

**Last Updated:** October 26, 2025  
**Version:** 1.0  
**Author:** Development Team

