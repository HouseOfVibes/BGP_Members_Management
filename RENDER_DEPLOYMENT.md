# BGP Member Management - Render Deployment Guide

## 💰 Cost Comparison
- **Render**: FREE (frontend) + FREE/7$ (backend) = **$0-7/month**
- **DigitalOcean**: $24/month
- **Savings**: $200-300/year for BGP!

## Prerequisites
- GitHub repository with the code
- Render account (free)

## Deployment Steps

### Option 1: Automatic Deployment (Recommended - Easy)

#### 1. Deploy Backend (API)
1. Go to [Render Dashboard](https://render.com/dashboard)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `HouseOfVibes/BGP_Members_Management`
4. Configure:
   - **Name**: `bgp-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: **Free** (or $7/month for more resources)

5. **Environment Variables** (Add these in Render dashboard):
```
NODE_ENV=production
PORT=10000
JWT_SECRET=bgp-super-secure-jwt-secret-2024-change-in-production
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://your-frontend-url.onrender.com
ADMIN_USERNAME=bgpadmin
ADMIN_EMAIL=admin@bgpnc.com
ADMIN_PASSWORD=BGP2024Admin!
```

6. Click **"Create Web Service"**

#### 2. Deploy Frontend (React App)
1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect same GitHub repository: `HouseOfVibes/BGP_Members_Management`
3. Configure:
   - **Name**: `bgp-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. **Environment Variables**:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_ENVIRONMENT=production
```

5. Click **"Create Static Site"**

#### 3. Update CORS Settings
After both deploy:
1. Go to your backend service settings
2. Update `CORS_ORIGIN` environment variable with your actual frontend URL
3. Save and redeploy

### Option 2: Using render.yaml (Advanced)
1. The `render.yaml` file is already in your repository
2. In Render dashboard, look for "Deploy from render.yaml" option
3. Connect your repository and it will deploy both services automatically

## Post-Deployment

### 1. Test Your Application
- **Frontend URL**: `https://bgp-frontend.onrender.com`
- **Backend URL**: `https://bgp-backend.onrender.com`
- **Admin Login**: `bgpadmin` / `BGP2024Admin!`

### 2. Custom Domain (Optional - FREE)
1. In your static site settings, go to "Custom Domains"
2. Add your domain (e.g., `members.bgpnc.com`)
3. Update DNS records as instructed
4. Free SSL certificate included!

### 3. Adding Database (When Ready)
Render offers PostgreSQL databases:
- **Free**: 90-day limit, 1GB storage
- **Paid**: $7/month, 10GB storage

## Expected Performance
- **Free Tier**: Services sleep after 15 minutes of inactivity (30-second cold start)
- **Paid Tier**: Always on, faster performance

## Render Advantages for BGP
✅ **Much cheaper** than other platforms  
✅ **Free static site hosting**  
✅ **Free SSL certificates**  
✅ **GitHub auto-deployment**  
✅ **Easy custom domains**  
✅ **Built-in monitoring**  
✅ **Perfect for churches/nonprofits**  

## Monitoring & Maintenance
- View logs in Render dashboard
- Automatic deployments on git push
- Built-in monitoring and alerts
- 99.9% uptime guarantee

## Support
For deployment issues:
- Render Documentation: https://render.com/docs
- BGP Support: Contact MW Design Studio

## Security Notes
1. **Change admin password immediately after first login**
2. **Use strong JWT secrets in production**
3. **Render provides HTTPS by default**
4. **Environment variables are encrypted**

---

**Total Monthly Cost for BGP: $0-7 (vs $24 on DigitalOcean)**  
**Annual Savings: $200-300** 💰