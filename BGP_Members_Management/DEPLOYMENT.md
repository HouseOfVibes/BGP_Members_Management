# BGP Member Management - DigitalOcean Deployment Guide

## Prerequisites
- DigitalOcean account
- GitHub repository with the code
- Domain name (optional, DO provides subdomains)

## Deployment Steps

### 1. Push Code to GitHub
First, ensure your code is pushed to the GitHub repository:
```bash
git add .
git commit -m "Prepare for DigitalOcean deployment"
git push origin main
```

### 2. Deploy on DigitalOcean App Platform

#### Option A: Using App Spec File (Recommended)
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository: `HouseOfVibes/BGP_Members_Management`
4. Choose "Import from App Spec" and upload `.do/app.yaml`
5. Review and modify environment variables
6. Deploy!

#### Option B: Manual Setup
1. Go to DigitalOcean App Platform
2. Create New App → GitHub → Select `BGP_Members_Management` repo
3. Configure Backend Service:
   - Name: `bgp-backend`
   - Source: `/backend`
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Port: 5000
4. Configure Frontend Service:
   - Name: `bgp-frontend`
   - Source: `/frontend`
   - Build Command: `npm install && npm run build`
   - Port: 3000

### 3. Environment Variables Setup

#### Backend Environment Variables:
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://your-frontend-domain.ondigitalocean.app
ADMIN_USERNAME=bgpadmin
ADMIN_EMAIL=admin@bgpnc.com
ADMIN_PASSWORD=ChangeThisPassword123!
```

#### Frontend Environment Variables:
```
REACT_APP_API_URL=https://your-backend-domain.ondigitalocean.app/api
REACT_APP_ENVIRONMENT=production
```

### 4. Post-Deployment Setup

1. **Update CORS Origins**: After deployment, update the `CORS_ORIGIN` variable with your actual frontend domain
2. **Change Admin Password**: Login with the default credentials and change the password immediately
3. **Test Registration**: Try the member registration form
4. **Test Admin Login**: Access `/login` and test admin functionality

### 5. Adding Database (Optional - When Ready)

To add MySQL database:
1. In DigitalOcean App Platform, go to your app
2. Add Database component:
   - Engine: MySQL 8
   - Size: Basic ($15/month)
3. Add database environment variables to backend:
   ```
   DB_HOST=your-database-host
   DB_PORT=25060
   DB_NAME=bgp_members
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_SSL=true
   ```
4. Run database migrations (connect via MySQL client and run `/backend/database/schema.sql`)

### 6. Custom Domain (Optional)

1. In App Platform, go to Settings → Domains
2. Add your custom domain (e.g., members.bgpnc.com)
3. Update DNS records as instructed
4. SSL certificate will be automatically generated

## Expected Costs

- **App Platform**: ~$12/month for both services
- **MySQL Database** (when added): ~$15/month
- **Total**: ~$27/month

## Monitoring

- App Platform provides built-in monitoring
- Check logs in the DigitalOcean dashboard
- Set up alerts for downtime

## Security Notes

1. **Change all default passwords immediately**
2. **Use strong JWT secrets**
3. **Enable database SSL in production**
4. **Regular backups** (DigitalOcean provides automated backups)

## Troubleshooting

- **Build Fails**: Check build logs for missing dependencies
- **Environment Variables**: Ensure all required vars are set
- **CORS Errors**: Update CORS_ORIGIN with correct frontend domain
- **Database Connection**: Verify database credentials and SSL settings

## Support

For deployment issues:
- DigitalOcean Documentation: https://docs.digitalocean.com/products/app-platform/
- BGP Support: Contact MW Design Studio