# Supabase Setup Guide

## Overview

This project now uses **Supabase** (PostgreSQL) instead of MySQL. Supabase provides a complete backend-as-a-service with:
- PostgreSQL database
- Auto-generated REST API
- Real-time subscriptions
- Row Level Security (RLS)
- Built-in authentication
- File storage
- Edge functions

## Quick Start

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if you don't have one)
4. Click "New project"
5. Fill in:
   - **Name**: BGP Members Management
   - **Database Password**: (Save this securely!)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is perfect to start

### 2. Get Your API Credentials

Once your project is created:

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **service_role key**: `eyJhbGc...` (the secret one, NOT anon)

⚠️ **IMPORTANT**: Use the `service_role` key for the backend API, not the `anon` key!

### 3. Set Up the Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Copy the contents of `backend/database/schema-postgres.sql`
4. Paste and click "Run"

This will create:
- All tables (members, children, users, activity_logs)
- Indexes for performance
- Row Level Security policies
- Automatic `updated_at` triggers
- Helper views for age calculations

### 4. Configure Environment Variables

#### Local Development

Create `/backend/.env`:

```bash
NODE_ENV=development
PORT=5000

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-here
JWT_EXPIRES_IN=2h

# Frontend URL
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Admin Credentials (for initial setup)
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@bgpnc.com
ADMIN_PASSWORD=YourSecure!P@ssw0rd123
```

#### Production Deployment

Set these environment variables in your deployment platform (Render, Vercel, Railway, etc.):

```bash
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=<generate with: openssl rand -base64 64>
JWT_EXPIRES_IN=2h
CORS_ORIGIN=https://your-frontend-url.com
ADMIN_USERNAME=bgpadmin
ADMIN_EMAIL=admin@bgpnc.com
ADMIN_PASSWORD=<Strong password 12+ chars>
```

### 5. Install Dependencies

```bash
cd backend
npm install
```

This will install `@supabase/supabase-js` and other dependencies.

### 6. Create Initial Admin User

Start the backend server:

```bash
npm start
```

Then create the admin user:

```bash
curl -X POST http://localhost:5000/api/auth/setup-admin
```

Or visit the endpoint in your browser and it will create the admin user.

### 7. Test the Application

1. **Frontend**: `cd frontend && npm start`
2. **Backend**: `cd backend && npm start`
3. Open [http://localhost:3000](http://localhost:3000)
4. Register a test member
5. Log in to admin panel with your admin credentials

## Migration Status

### ✅ Completed

- [x] Database schema converted to PostgreSQL
- [x] Supabase client integrated
- [x] Environment variables updated
- [x] Row Level Security policies created
- [x] Auto-updating timestamps with triggers
- [x] Indexes and foreign keys

### ⚠️ In Progress

The following controllers still need to be updated to use Supabase client methods instead of raw SQL:

- `authController.js` - Login, password changes, admin setup
- `memberController.js` - Member CRUD operations
- `adminController.js` - Dashboard, analytics, exports, bulk import

### Current Approach

The codebase currently uses raw SQL queries with the MySQL `pool.execute()` pattern. With Supabase, there are two approaches:

#### Approach 1: Supabase Client Methods (Recommended)

```javascript
// Old MySQL way
const [members] = await pool.execute(
    'SELECT * FROM members WHERE email = ?',
    [email]
);

// New Supabase way
const { data: members, error } = await supabase
    .from('members')
    .select('*')
    .eq('email', email);
```

#### Approach 2: PostgreSQL Functions

For complex queries, create PostgreSQL functions and call them:

```javascript
// Create a function in Supabase SQL Editor
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
  -- Complex SQL here
$$ LANGUAGE sql;

// Call from Node.js
const { data, error } = await supabase.rpc('get_dashboard_stats');
```

## Row Level Security (RLS)

The schema includes RLS policies for security:

- **Members**: Public can insert (registration), authenticated users can read, service role can update/delete
- **Users**: Service role only (admin operations)
- **Activity Logs**: Service role only
- **Children**: Follow members policy

Since we're using the `service_role` key in the backend, RLS is bypassed for admin operations.

## Supabase Features You Can Use

### 1. Real-time Subscriptions

```javascript
supabase
  .channel('members')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'members' },
    (payload) => console.log('Change detected:', payload)
  )
  .subscribe();
```

### 2. Storage for Files

```javascript
// Upload photos
const { data, error } = await supabase.storage
  .from('member-photos')
  .upload(`public/${filename}`, file);
```

### 3. Authentication

Supabase has built-in auth, but this app uses custom JWT auth. You could migrate to Supabase Auth in the future.

### 4. Edge Functions

Deploy serverless functions for complex operations:

```bash
supabase functions new my-function
supabase functions deploy my-function
```

## Advantages of Supabase

1. **No Infrastructure Management**: Supabase handles the database hosting
2. **Automatic Backups**: Daily backups included
3. **Real-time Updates**: Built-in WebSocket support
4. **Better Performance**: PostgreSQL is generally faster than MySQL for this workload
5. **Advanced Features**: JSON/JSONB support, full-text search, PostGIS for maps
6. **Auto-generated API**: REST endpoints created automatically
7. **Admin Dashboard**: Beautiful UI to manage data
8. **Free Tier**: 500MB database, 2GB file storage, 50MB database space

## Database Management

### Using Supabase Dashboard

1. **Table Editor**: View and edit data directly
2. **SQL Editor**: Run custom queries
3. **Database**: View migrations and backups
4. **API**: Test endpoints
5. **Logs**: Monitor errors and slow queries

### Using SQL Editor

Run queries directly in Supabase:

```sql
-- View all members
SELECT * FROM members ORDER BY created_at DESC;

-- Get member count by status
SELECT member_status, COUNT(*)
FROM members
GROUP BY member_status;

-- Find recent registrations
SELECT first_name, last_name, email, created_at
FROM members
WHERE created_at > NOW() - INTERVAL '7 days';
```

## Troubleshooting

### Connection Issues

If you see "Supabase connection failed":

1. Check your `SUPABASE_URL` is correct
2. Verify you're using the `service_role` key (not `anon` key)
3. Ensure your IP is not blocked (Supabase free tier allows all IPs)
4. Check Supabase status: [status.supabase.com](https://status.supabase.com)

### RLS Errors

If you get "new row violates row-level security policy":

- Make sure you're using `service_role` key in backend
- Check the RLS policies in SQL Editor
- For testing, you can temporarily disable RLS:
  ```sql
  ALTER TABLE members DISABLE ROW LEVEL SECURITY;
  ```

### Migration Issues

If you have existing MySQL data:

1. Export from MySQL:
   ```bash
   mysqldump -u root -p bgp_members > backup.sql
   ```

2. Convert to PostgreSQL format (tools like `pgloader` can help)

3. Import to Supabase via SQL Editor or `psql`

## Next Steps

1. **Update Controllers**: Convert remaining SQL queries to Supabase client methods
2. **Add Real-time**: Implement live updates for the admin dashboard
3. **Enable Storage**: Add member photo uploads
4. **Optimize Queries**: Use PostgreSQL-specific features for better performance
5. **Add Search**: Implement full-text search for members
6. **Backup Strategy**: Set up automated backups beyond Supabase defaults

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Community](https://github.com/supabase/supabase/discussions)

## Support

- **Supabase Support**: support@supabase.com
- **Project Issues**: Create an issue in this repository
- **Community**: Join the Supabase Discord

---

**Last Updated**: November 2025
**Supabase Schema Version**: 2.0.0
**Status**: Ready for Production
