# PlanetScale Setup Guide for BGP Members Management

## Prerequisites

- PlanetScale account (sign up at [planetscale.com](https://planetscale.com))
- PlanetScale CLI installed
- Node.js project ready

## Step 1: Install PlanetScale CLI

### macOS
```bash
brew install planetscale/tap/pscale
brew install mysql-client
```

### Windows
```bash
scoop bucket add pscale https://github.com/planetscale/scoop-bucket.git
scoop install pscale mysql
```

### Linux
```bash
curl -sL https://get.planetscale.com/install.sh | sh
```

## Step 2: Authenticate with PlanetScale

```bash
# Login to PlanetScale
pscale auth login

# This will open a browser window to authenticate
# Follow the prompts to complete authentication
```

## Step 3: Create Your Database

```bash
# Create the database (choose your preferred region)
pscale database create bgp-members --region us-east

# Available regions:
# - us-east (Virginia)
# - us-west (Oregon)
# - eu-west (Dublin)
# - ap-south (Mumbai)
# - ap-southeast (Singapore)
# - ap-northeast (Tokyo)
```

## Step 4: Create Development Branch

PlanetScale uses branches like Git for database changes.

```bash
# Create a development branch
pscale branch create bgp-members dev

# List all branches
pscale branch list bgp-members
```

## Step 5: Connect and Import Schema

### Option A: Using PlanetScale CLI

```bash
# Connect to the dev branch
pscale shell bgp-members dev

# Once connected, you can paste SQL commands
# Copy and paste the contents of schema.sql
```

### Option B: Using MySQL Client

```bash
# Open a connection tunnel (keep this running in one terminal)
pscale connect bgp-members dev --port 3309

# In another terminal, import the schema
mysql -h 127.0.0.1 -P 3309 -u root < database/schema.sql
```

## Step 6: Create Connection String

```bash
# Create a password for the main branch
pscale password create bgp-members main password-name

# Save the output! It will show:
# - Host
# - Username
# - Password
# - SSL Certificate info

# Example output:
# Database: bgp-members
# Branch: main
# Host: aws.connect.psdb.cloud
# Username: xxxxxxxxxxxxxx
# Password: pscale_pw_xxxxxxxxxxxxxx
```

## Step 7: Promote Dev Branch to Production

Once you're happy with your schema in the `dev` branch:

```bash
# Create a deploy request
pscale deploy-request create bgp-members dev

# List deploy requests
pscale deploy-request list bgp-members

# Deploy to main (production)
pscale deploy-request deploy bgp-members <request-number>
```

## Step 8: Update Your .env File

Add these variables to your `.env` file:

```env
# PlanetScale Database Configuration
DATABASE_HOST=aws.connect.psdb.cloud
DATABASE_USER=xxxxxxxxxxxxxx
DATABASE_PASSWORD=pscale_pw_xxxxxxxxxxxxxx
DATABASE_NAME=bgp-members

# SSL Configuration (required for PlanetScale)
DATABASE_SSL=true
DATABASE_SSL_CA_PATH=

# Connection Pool Settings
DATABASE_CONNECTION_LIMIT=10
DATABASE_QUEUE_LIMIT=0
```

## Step 9: Update Database Configuration File

Your existing `src/config/database.js` should be updated:

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '10'),
    queueLimit: parseInt(process.env.DATABASE_QUEUE_LIMIT || '0'),
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

module.exports = pool;
```

## Step 10: Test the Connection

```bash
# Start your backend server
cd BGP_Members_Management/backend
npm run dev

# Check the health endpoint
curl http://localhost:5000/health

# You should see:
# {
#   "status": "healthy",
#   "database": "connected"
# }
```

## PlanetScale Best Practices

### 1. Use Branches for Schema Changes

```bash
# Create a branch for new features
pscale branch create bgp-members feature/add-events-table

# Make changes to the branch
pscale shell bgp-members feature/add-events-table

# Deploy when ready
pscale deploy-request create bgp-members feature/add-events-table
```

### 2. Connection Pooling

PlanetScale handles connection pooling automatically, but ensure:
- Don't create too many pools in your app
- Reuse the same pool instance
- Set reasonable connection limits

### 3. Query Optimization

```javascript
// ❌ Bad - Multiple round trips
const members = await pool.query('SELECT * FROM members');
for (let member of members) {
    const children = await pool.query('SELECT * FROM children WHERE parent_id = ?', [member.id]);
}

// ✅ Good - Single query with JOIN
const members = await pool.query(`
    SELECT m.*,
           JSON_ARRAYAGG(
               JSON_OBJECT('id', c.id, 'name', c.name)
           ) as children
    FROM members m
    LEFT JOIN children c ON m.id = c.parent_id
    GROUP BY m.id
`);
```

### 4. Enable Query Insights

In PlanetScale dashboard:
- Go to your database → Insights
- Monitor slow queries
- Check connection usage
- Review query patterns

## Common Commands Reference

```bash
# Database Management
pscale database list                                    # List all databases
pscale database show bgp-members                        # Show database details
pscale database delete bgp-members                      # Delete database

# Branch Management
pscale branch list bgp-members                          # List branches
pscale branch create bgp-members <branch-name>          # Create branch
pscale branch delete bgp-members <branch-name>          # Delete branch
pscale branch switch bgp-members <branch-name>          # Switch branch

# Connection
pscale connect bgp-members <branch-name>                # Connect to branch
pscale shell bgp-members <branch-name>                  # Open MySQL shell

# Deploy Requests
pscale deploy-request list bgp-members                  # List deploy requests
pscale deploy-request create bgp-members <branch>       # Create deploy request
pscale deploy-request deploy bgp-members <number>       # Deploy changes

# Passwords
pscale password list bgp-members                        # List passwords
pscale password create bgp-members <branch> <name>      # Create password
pscale password delete bgp-members <branch> <id>        # Delete password
```

## Troubleshooting

### Connection Issues

```bash
# Test connection
pscale connect bgp-members main --port 3309

# In another terminal
mysql -h 127.0.0.1 -P 3309 -u root -e "SELECT 1"
```

### SSL Certificate Issues

If you get SSL errors:
```javascript
// Update your pool configuration
ssl: {
    rejectUnauthorized: true,
    // If needed, specify CA
    ca: fs.readFileSync('./path/to/ca-cert.pem')
}
```

### Foreign Key Constraints

PlanetScale uses **vitess** which handles foreign keys differently:
- They're enforced at the application level
- Schema shows them but they work differently
- Use `ON DELETE CASCADE` carefully

### Slow Queries

1. Check PlanetScale Insights dashboard
2. Add indexes for frequently queried columns
3. Avoid `SELECT *` - specify needed columns
4. Use JOINs instead of multiple queries

## Migration from Existing MySQL

If you have existing data:

```bash
# Export from existing database
mysqldump -h your-host -u user -p bgp_members > backup.sql

# Import to PlanetScale
pscale connect bgp-members dev --port 3309
mysql -h 127.0.0.1 -P 3309 -u root < backup.sql
```

## Cost Estimates

**Free Tier (Hobby):**
- 1 database
- 5 GB storage
- 1 billion row reads/month
- 10 million row writes/month
- Perfect for starting out

**Scaler Plan ($29/month):**
- 2 databases
- 10 GB storage
- 100 billion row reads/month
- 50 million row writes/month
- Recommended for production

**Team Plan ($59/month):**
- 5 databases
- 25 GB storage
- Unlimited reads/writes
- Team collaboration features

## Next Steps

1. ✅ Create PlanetScale database
2. ✅ Import schema
3. ✅ Generate connection credentials
4. ✅ Update .env file
5. ⏭️ Deploy backend to Railway/Render
6. ⏭️ Deploy frontend to Vercel
7. ⏭️ Set up production credentials

## Support Resources

- [PlanetScale Documentation](https://planetscale.com/docs)
- [PlanetScale Discord](https://discord.gg/planetscale)
- [PlanetScale Support](mailto:support@planetscale.com)
