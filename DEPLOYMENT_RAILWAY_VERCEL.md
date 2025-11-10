# BGP Members Management - Deployment Guide
## Railway (Backend) + Vercel (Frontend) + Supabase (Database)

This guide will help you deploy the BGP Members Management System using:
- **Railway** - Backend API (Express.js)
- **Vercel** - Frontend (React)
- **Supabase** - Database (PostgreSQL)

All three have generous free tiers perfect for this project!

---

## Prerequisites

- [ ] GitHub account
- [ ] Railway account (sign up at [railway.app](https://railway.app))
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Supabase account (sign up at [supabase.com](https://supabase.com))
- [ ] Git repository pushed to GitHub

---

## Part 1: Set Up Supabase Database

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"New project"**
3. Fill in:
   - **Name**: BGP Members Management
   - **Database Password**: (Save this securely!)
   - **Region**: Choose closest to your users (e.g., US East)
   - **Plan**: Free

### 2. Run Database Schema

1. Wait for project to finish setting up (2-3 minutes)
2. Go to **SQL Editor** in left sidebar
3. Click **"New query"**
4. Copy the entire contents of `backend/database/schema-postgres.sql`
5. Paste and click **"Run"**
6. You should see "Success. No rows returned"

### 3. Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values (you'll need them later):
   ```
   Project URL: https://xxxxx.supabase.co
   service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   ⚠️ **Use the `service_role` key, NOT the `anon` key!**

---

## Part 2: Deploy Backend to Railway

### 1. Connect GitHub Repository

1. Go to [https://railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your `BGP_Members_Management` repository

### 2. Configure Build Settings

Railway should auto-detect your Node.js backend. If not:

1. Click on your service
2. Go to **Settings** → **Build**
3. Set:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

### 3. Set Environment Variables

Go to **Variables** tab and add these:

```bash
NODE_ENV=production
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Configuration
JWT_SECRET=<generate using: openssl rand -base64 64>
JWT_EXPIRES_IN=2h

# Security
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS (you'll update this after deploying frontend)
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Admin Credentials
ADMIN_USERNAME=bgpadmin
ADMIN_EMAIL=admin@bgpnc.com
ADMIN_PASSWORD=<create a strong password: 12+ chars, upper, lower, numbers, symbols>

# Email (Optional - add when ready)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**To generate JWT_SECRET:**
```bash
openssl rand -base64 64
```

Or use an online generator: https://generate-secret.vercel.app/64

### 4. Get Your Backend URL

1. Once deployed, Railway will give you a URL like:
   ```
   https://bgp-backend-production.up.railway.app
   ```
2. **Copy this URL** - you'll need it for the frontend!

### 5. Test Your Backend

Visit: `https://your-backend-url.railway.app/health`

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-10T...",
  "database": "connected"
}
```

### 6. Create Initial Admin User

```bash
curl -X POST https://your-backend-url.railway.app/api/auth/setup-admin
```

Or visit the URL in your browser.

---

## Part 3: Deploy Frontend to Vercel

### 1. Connect GitHub Repository

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a React app

### 2. Configure Build Settings

1. **Framework Preset**: Create React App (auto-detected)
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `build` (default)

### 3. Set Environment Variables

Click **"Environment Variables"** and add:

```bash
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_ENVIRONMENT=production
```

Replace `your-backend-url.railway.app` with your actual Railway backend URL!

### 4. Deploy!

Click **"Deploy"**

Vercel will:
- Install dependencies
- Build your React app
- Deploy to CDN
- Give you a URL like: `https://bgp-members-xxxxx.vercel.app`

### 5. Update Backend CORS

Now that you have your frontend URL, go back to **Railway**:

1. Go to your backend service
2. Click **Variables**
3. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://bgp-members-xxxxx.vercel.app
   ```
4. Railway will automatically redeploy

---

## Part 4: Final Testing

### 1. Test Public Registration

1. Go to your Vercel frontend URL
2. You should see the registration form
3. Fill out and submit
4. Check Supabase **Table Editor** → **members** to see the new entry

### 2. Test Admin Login

1. Go to: `https://your-frontend-url.vercel.app/login`
2. Login with your admin credentials:
   - Username: `bgpadmin`
   - Password: (the one you set in Railway)
3. You should see the admin dashboard

### 3. Test Bulk Import

1. In admin panel, go to **Members**
2. Click **"Bulk Import"**
3. Download the CSV template
4. Add some test members
5. Upload and verify they appear in Supabase

---

## Part 5: Custom Domain (Optional)

### Frontend (Vercel)

1. Go to your project in Vercel
2. Click **Settings** → **Domains**
3. Add your custom domain (e.g., `members.bgpnc.com`)
4. Update DNS records as instructed
5. Vercel auto-provisions SSL certificate

### Backend (Railway)

1. Go to your service in Railway
2. Click **Settings** → **Networking**
3. Click **"Generate Domain"** or add custom domain
4. Update `CORS_ORIGIN` environment variable with new domain

### Update Frontend Environment

After adding custom domains, update Vercel environment variables:
```bash
REACT_APP_API_URL=https://api.bgpnc.com
```

---

## Troubleshooting

### Backend Issues

**"Database connection failed"**
- Check `SUPABASE_URL` is correct
- Verify you're using `service_role` key, not `anon` key
- Check Supabase project is active

**"CORS error"**
- Verify `CORS_ORIGIN` matches your Vercel URL exactly
- Include `https://` in the URL
- No trailing slash

**"Module not found"**
- Railway didn't install dependencies
- Check build command: `cd backend && npm install`
- Check start command: `cd backend && npm start`

### Frontend Issues

**"API is not responding"**
- Check `REACT_APP_API_URL` is correct
- Must include `https://`
- No `/api` suffix needed
- Rebuild and redeploy after changing env vars

**Blank page on Vercel**
- Check browser console for errors
- Verify build completed successfully
- Check root directory is set to `frontend`

### Database Issues

**"Permission denied"**
- Check Row Level Security policies
- Verify using `service_role` key in backend

**"Table doesn't exist"**
- Run the schema SQL in Supabase SQL Editor
- Check you selected the right project

---

## Monitoring & Maintenance

### Railway Dashboard

Monitor your backend:
- **Deployments**: See build logs
- **Metrics**: CPU, memory usage
- **Logs**: View runtime logs

### Vercel Dashboard

Monitor your frontend:
- **Deployments**: Build history
- **Analytics**: Page views, performance
- **Logs**: Function logs

### Supabase Dashboard

Monitor your database:
- **Table Editor**: View/edit data directly
- **SQL Editor**: Run queries
- **Database**: Size and performance
- **Logs**: Query logs

---

## Cost Breakdown (Free Tier Limits)

### Railway Free Tier
- ✅ $5/month credit
- ✅ ~500 hours/month runtime
- ✅ Perfect for this app

### Vercel Free Tier
- ✅ Unlimited projects
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ More than enough for small churches

### Supabase Free Tier
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB bandwidth/month
- ✅ Unlimited API requests
- ✅ Perfect for hundreds of members

**Total Cost: $0/month** for most small churches! 🎉

---

## Automatic Deployments

### How It Works

Both Railway and Vercel watch your GitHub repository:

1. **Push to main branch** → Production deploys automatically
2. **Push to other branches** → Preview deployments
3. **Open Pull Request** → Preview deployment with unique URL

### Best Practices

1. **Main branch** = Production
2. **Develop branch** = Staging
3. **Feature branches** = Testing

### Workflow

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Railway and Vercel automatically deploy!
```

---

## Security Checklist

After deployment, verify:

- [ ] Changed default admin password
- [ ] JWT_SECRET is strong random value
- [ ] CORS_ORIGIN is set to your domain only
- [ ] Supabase service_role key kept secret
- [ ] HTTPS enabled on all services
- [ ] Environment variables not in code
- [ ] .env files in .gitignore

---

## Support & Resources

### Documentation
- **Railway**: https://docs.railway.app
- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs

### Community
- **Railway Discord**: https://discord.gg/railway
- **Vercel Discord**: https://vercel.com/discord
- **Supabase Discord**: https://discord.supabase.com

### Project Files
- `SUPABASE_SETUP.md` - Supabase detailed setup
- `SECURITY.md` - Security best practices
- `railway.json` - Railway configuration

---

## What's Next?

1. **Set up email notifications** (add EMAIL_* variables)
2. **Add custom domain** for professional look
3. **Enable member photos** using Supabase Storage
4. **Set up automated backups** in Supabase
5. **Monitor usage** in all three dashboards

---

**Deployment Summary:**
- 🗄️ **Database**: Supabase (PostgreSQL)
- 🖥️ **Backend API**: Railway (Node.js/Express)
- 🌐 **Frontend**: Vercel (React)
- 💰 **Total Cost**: FREE (with generous limits)
- 🚀 **Deployment Time**: ~30 minutes
- ⚡ **Auto-deploys**: Enabled on git push

**Last Updated**: November 2025
**Status**: Production Ready ✅
