# BGP Members Management - Admin Access Guide

## 🔐 Admin Access Links

### Admin Login
**URL:** `http://localhost:3002/admin/login` (Development)
**Production URL:** `https://your-domain.com/admin/login`

**Default Credentials:**
- **Email:** `admin@bgpnc.com`
- **Password:** `Admin123!`

⚠️ **IMPORTANT:** Change the default password before going live!

---

## 📋 Available Routes

### Public Routes (No Login Required)

1. **Home Page**
   - URL: `http://localhost:3002/`
   - Description: Main landing page

2. **Registration Form (With Layout)**
   - URL: `http://localhost:3002/register`
   - Description: Full registration form with header and footer
   - Use: For standalone registration page

3. **Embeddable Registration Form (Clean)**
   - URL: `http://localhost:3002/register/embed`
   - Description: Registration form WITHOUT header/footer
   - Use: For embedding or linking from your live website
   - **👉 USE THIS LINK on your live website!**

4. **Registration Success**
   - URL: `http://localhost:3002/registration-success`
   - Description: Confirmation page after successful registration

---

### Admin Routes (Login Required)

All admin routes require authentication. If not logged in, you'll be redirected to `/admin/login`.

1. **Admin Dashboard**
   - URL: `http://localhost:3002/admin`
   - Description: Main admin dashboard with statistics

2. **Members List**
   - URL: `http://localhost:3002/admin/members`
   - Description: View all registered members

3. **Member Details**
   - URL: `http://localhost:3002/admin/members/:id`
   - Description: View detailed information for a specific member
   - Example: `http://localhost:3002/admin/members/1`

4. **Analytics**
   - URL: `http://localhost:3002/admin/analytics`
   - Description: View analytics and reports

---

## 🚀 Production Setup

### Step 1: Update Admin Password

Before deploying to production, update the admin password:

```sql
-- Connect to your production database
mysql -u your_user -p bgp_members_db

-- Update the admin password (use a strong password!)
UPDATE users
SET password = 'YOUR_NEW_BCRYPT_HASHED_PASSWORD'
WHERE email = 'admin@bgpnc.com';
```

### Step 2: Configure Environment Variables

Update your `.env.local` file with production URLs:

```env
REACT_APP_API_URL=https://your-backend-url.com
```

### Step 3: Share Admin Access

**Admin Login Link:**
```
https://your-domain.com/admin/login
```

**Embeddable Registration Form Link (for live website):**
```
https://your-domain.com/register/embed
```

---

## 🔗 Linking from Your Live Website

### Option 1: Direct Link
Replace your current "Become a Member" or "Join Us" link with:
```html
<a href="https://your-domain.com/register/embed">Become a Member</a>
```

### Option 2: Iframe Embed (if your website supports it)
```html
<iframe
  src="https://your-domain.com/register/embed"
  width="100%"
  height="1200px"
  frameborder="0">
</iframe>
```

### Option 3: Full Page Link
If you prefer the version with header/footer:
```html
<a href="https://your-domain.com/register">Become a Member</a>
```

---

## 📱 Testing Links (Development)

Before going live, test these links:

### Public Access
- ✅ Home: http://localhost:3002/
- ✅ Registration (with layout): http://localhost:3002/register
- ✅ Registration (embedded): http://localhost:3002/register/embed
- ✅ Success page: http://localhost:3002/registration-success

### Admin Access
- ✅ Admin Login: http://localhost:3002/admin/login
- ✅ Admin Dashboard: http://localhost:3002/admin
- ✅ Members List: http://localhost:3002/admin/members
- ✅ Analytics: http://localhost:3002/admin/analytics

---

## 🔒 Security Notes

1. **Change Default Password**
   - The default password `Admin123!` should be changed immediately
   - Use a strong password with uppercase, lowercase, numbers, and symbols

2. **CORS Settings**
   - Ensure your backend CORS settings allow requests from your frontend domain
   - Update `backend/.env` with allowed origins

3. **HTTPS Only**
   - Always use HTTPS in production
   - Never send credentials over HTTP

4. **Restrict Admin Access**
   - Consider IP whitelisting for admin routes
   - Implement 2FA for additional security
   - Set up session timeout

---

## 🎯 Quick Reference

| Purpose | URL | Authentication |
|---------|-----|----------------|
| Public registration (embedded) | `/register/embed` | None |
| Public registration (full) | `/register` | None |
| Admin login | `/admin/login` | None (redirects if logged in) |
| Admin dashboard | `/admin` | Required |
| Members list | `/admin/members` | Required |
| Member details | `/admin/members/:id` | Required |
| Analytics | `/admin/analytics` | Required |

---

## 📞 Support

For technical issues or questions:
- Email: tech@bgpnc.com
- Create a GitHub issue in your repository

---

**Last Updated:** November 6, 2025
