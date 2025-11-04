# BGP Members Management - Deployment Guide

Complete deployment instructions for PlanetScale, Vercel, and Railway.

## 📋 Prerequisites

- [x] GitHub account
- [x] PlanetScale account (free tier)
- [x] Vercel account (free tier)
- [x] Railway account (free trial)
- [x] Domain: bgpnc.com (optional, can use Vercel subdomains)

## 🗄️ Step 1: Set Up PlanetScale Database

### 1.1 Install PlanetScale CLI

```bash
# macOS
brew install planetscale/tap/pscale

# Windows
scoop install pscale

# Linux
curl -sL https://get.planetscale.com/install.sh | sh
```

### 1.2 Authenticate & Create Database

```bash
# Login
pscale auth login

# Create database in your preferred region
pscale database create bgp-members --region us-east

# Create development branch
pscale branch create bgp-members dev
```

### 1.3 Import Database Schema

```bash
# Connect to dev branch
pscale connect bgp-members dev --port 3309

# In a new terminal, import schema
mysql -h 127.0.0.1 -P 3309 -u root < database/schema.sql
```

### 1.4 Create Production Password

```bash
# Deploy dev branch to main
pscale deploy-request create bgp-members dev
pscale deploy-request deploy bgp-members 1

# Create password for main branch
pscale password create bgp-members main production-password

# Save these credentials! You'll need them later:
# - Host: aws.connect.psdb.cloud
# - Username: xxxxxx
# - Password: pscale_pw_xxxxxx
```

## 🚀 Step 2: Deploy Backend to Railway

### 2.1 Install Railway CLI (Optional)

```bash
# npm
npm install -g @railway/cli

# Or use the Railway dashboard (recommended)
```

### 2.2 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select your `BGP_Members_Management` repository
6. Choose the **backend** directory as root

### 2.3 Configure Railway Environment Variables

In Railway dashboard, go to **Variables** and add:

```env
# Node Environment
NODE_ENV=production
PORT=5000

# PlanetScale Database (from Step 1.4)
DATABASE_HOST=aws.connect.psdb.cloud
DATABASE_USER=your_username_from_planetscale
DATABASE_PASSWORD=pscale_pw_your_password
DATABASE_NAME=bgp-members
DATABASE_PORT=3306
DATABASE_SSL=true
DATABASE_CONNECTION_LIMIT=10
DATABASE_QUEUE_LIMIT=0

# JWT Configuration (generate new secret!)
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email Configuration (choose one)
# Option 1: SendGrid (recommended)
SENDGRID_API_KEY=SG.your_key_here
EMAIL_FROM_ADDRESS=noreply@bgpnc.com
EMAIL_FROM_NAME=Believers Gathering Place

# Option 2: Zoho Mail
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_USER=noreply@bgpnc.com
EMAIL_PASSWORD=your_password

# CORS - Update with your Vercel frontend URL
FRONTEND_URL=https://members.bgpnc.com
CORS_ORIGIN=https://members.bgpnc.com

# Security
SESSION_SECRET=your_session_secret_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2.4 Deploy Backend

Railway will automatically deploy when you push to your main branch.

```bash
# From your backend directory
git add .
git commit -m "Configure for Railway deployment"
git push origin main
```

Your backend will be available at: `https://your-app.railway.app`

### 2.5 Set Custom Domain (Optional)

1. In Railway dashboard → Settings → Domains
2. Add custom domain: `api.bgpnc.com`
3. Update your DNS with the provided CNAME record

## 🎨 Step 3: Deploy Frontend to Vercel

### 3.1 Install Vercel CLI (Optional)

```bash
npm install -g vercel
```

### 3.2 Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import from GitHub
4. Select your repository
5. **Root Directory**: `BGP_Members_Management/frontend`
6. **Framework Preset**: Create React App
7. **Build Command**: `npm run build`
8. **Output Directory**: `build`

### 3.3 Configure Vercel Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```env
# API URL (your Railway backend URL)
REACT_APP_API_URL=https://your-app.railway.app

# Or if using custom domain:
REACT_APP_API_URL=https://api.bgpnc.com
```

### 3.4 Deploy Frontend

```bash
# Using Vercel CLI (alternative)
cd BGP_Members_Management/frontend
vercel --prod

# Or just push to GitHub - Vercel auto-deploys
git add .
git commit -m "Deploy frontend to Vercel"
git push origin main
```

Your frontend will be available at: `https://your-project.vercel.app`

### 3.5 Set Custom Domain

1. In Vercel → Settings → Domains
2. Add domain: `members.bgpnc.com`
3. Update DNS records as instructed by Vercel

## 🔗 Step 4: Connect Everything

### 4.1 Update Backend CORS Settings

In Railway, update the `FRONTEND_URL` environment variable:

```env
FRONTEND_URL=https://members.bgpnc.com
CORS_ORIGIN=https://members.bgpnc.com
```

### 4.2 Update Frontend API URL

In Vercel, update the `REACT_APP_API_URL`:

```env
REACT_APP_API_URL=https://api.bgpnc.com
```

### 4.3 Test the Connection

```bash
# Test backend health
curl https://api.bgpnc.com/health

# Should return:
# {
#   "status": "healthy",
#   "database": "connected"
# }
```

## 🎯 Step 5: Create Admin User

### 5.1 Generate Password Hash

```bash
# Install bcrypt CLI tool
npm install -g bcrypt-cli

# Generate hash for password "Admin123!"
bcrypt-cli "Admin123!" 10

# Copy the hash (starts with $2a$10$...)
```

### 5.2 Insert Admin User

```bash
# Connect to PlanetScale
pscale shell bgp-members main

# Run this SQL (replace the hash with yours)
INSERT INTO users (username, email, password_hash, full_name, role, is_active)
VALUES (
    'admin',
    'admin@bgpnc.com',
    '$2a$10$YOUR_BCRYPT_HASH_HERE',
    'System Administrator',
    'admin',
    TRUE
);
```

### 5.3 Test Admin Login

1. Go to `https://members.bgpnc.com/login`
2. Login with:
   - Username: `admin`
   - Password: `Admin123!`
3. **IMPORTANT**: Change password immediately!

## 📊 Step 6: Set Up Monitoring

### 6.1 Vercel Analytics

1. Vercel Dashboard → Analytics → Enable
2. Free tier includes:
   - Real User Monitoring (RUM)
   - Core Web Vitals
   - Custom events

### 6.2 Railway Logs

1. Railway Dashboard → Deployments → View Logs
2. Monitor for errors and performance

### 6.3 PlanetScale Insights

1. PlanetScale Dashboard → Your Database → Insights
2. Monitor:
   - Query performance
   - Connection usage
   - Slow queries

## 🔐 Step 7: Security Checklist

- [ ] Changed default admin password
- [ ] Generated new JWT_SECRET (min 32 chars)
- [ ] Generated new SESSION_SECRET
- [ ] SSL enabled for database (DATABASE_SSL=true)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Email credentials secured
- [ ] PlanetScale password secured (not committed to Git)
- [ ] Environment variables set in Vercel/Railway (not in code)
- [ ] .env files added to .gitignore

## 🌐 DNS Configuration

If using custom domains, add these DNS records:

### For Frontend (members.bgpnc.com)

```
Type: CNAME
Name: members
Value: cname.vercel-dns.com
```

### For Backend (api.bgpnc.com)

```
Type: CNAME
Name: api
Value: your-app.up.railway.app
```

## 📱 Step 8: Test Everything

### 8.1 Frontend Tests

```bash
# Visit these URLs:
✓ https://members.bgpnc.com
✓ https://members.bgpnc.com/login
✓ https://members.bgpnc.com/register
```

### 8.2 Backend Tests

```bash
# Health check
curl https://api.bgpnc.com/health

# Test CORS
curl -X OPTIONS https://api.bgpnc.com/api/public/health \
  -H "Origin: https://members.bgpnc.com" \
  -v
```

### 8.3 Registration Flow

1. Go to registration page
2. Fill out complete form
3. Submit
4. Check email for welcome message
5. Verify member appears in admin dashboard

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:

### Production Deployment

```bash
# Any push to main branch triggers deployment
git add .
git commit -m "Your changes"
git push origin main
```

### Preview Deployments

```bash
# Create a feature branch
git checkout -b feature/new-feature

# Make changes, then push
git push origin feature/new-feature

# Both Vercel and Railway will create preview deployments
```

## 💰 Cost Estimate

### Free Tier (Current Setup)

- **PlanetScale**: $0 (5GB storage, 1B reads/month)
- **Vercel**: $0 (100GB bandwidth)
- **Railway**: $5/month (500 hours free trial, then $5/month)

**Total**: ~$5/month to start

### When You Grow (50+ members, higher traffic)

- **PlanetScale Scaler**: $29/month
- **Vercel Pro**: $20/month (optional, for team features)
- **Railway**: $10-20/month (based on usage)

**Total**: ~$60-70/month

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Test PlanetScale connection
pscale connect bgp-members main --port 3309
mysql -h 127.0.0.1 -P 3309 -u root -e "SELECT 1"
```

### CORS Errors

1. Check Railway environment variable: `FRONTEND_URL`
2. Make sure it matches your Vercel domain exactly
3. Restart Railway deployment after changing

### API Not Responding

1. Check Railway logs for errors
2. Verify environment variables are set
3. Check database connection in logs

### Build Failures

```bash
# Frontend build fails
cd BGP_Members_Management/frontend
npm install
npm run build

# Backend issues
cd BGP_Members_Management/backend
npm install
npm test
```

## 📚 Additional Resources

- [PlanetScale Docs](https://planetscale.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🎉 Next Steps

1. [ ] Test all functionality in production
2. [ ] Import existing member data (if any)
3. [ ] Set up email templates
4. [ ] Configure Zoho CRM integration
5. [ ] Create user documentation
6. [ ] Train church staff on admin dashboard
7. [ ] Promote registration link to congregation

---

**Need Help?** Check the troubleshooting section or refer to the official documentation links above.
