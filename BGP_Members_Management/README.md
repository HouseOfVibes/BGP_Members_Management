# BGP Members Management System

A comprehensive web application for managing Believers Gathering Place (BGP) North Carolina church members with admin dashboard, member registration, and analytics.

## Features

### Admin Dashboard
- **Member Management**: View, add, edit, and delete member records
- **Analytics Dashboard**: Visual charts showing membership statistics
- **Bulk Operations**: Export data to CSV/Excel, bulk status updates
- **Search & Filter**: Advanced search with filters by status, membership type, location
- **Activity Logs**: Track all admin actions and member activities

### Member Features
- **Self-Registration**: Comprehensive public registration form for new members
- **Embeddable Registration**: Iframe-compatible registration form at `/register/embed`
- **Family Management**: Track spouse, children, and household members
- **Membership Status**: Track active, pending, and inactive members
- **Volunteer & Skills Tracking**: Track volunteer interests and member talents
- **Consent Management**: Photo, social media, and email consent tracking

### Integrations
- **Pabbly Connect**: Webhook integration for automated registration workflows
- **PlanetScale**: Cloud MySQL database support with connection pooling

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Chart.js, React Router, React Query
- **Backend**: Node.js, Express, MySQL/PlanetScale
- **Authentication**: JWT tokens with refresh tokens, bcrypt password hashing
- **Security**: Helmet, rate limiting, input validation, CORS
- **Deployment**: Vercel, Render, or DigitalOcean App Platform

## Quick Start

### Prerequisites
- Node.js 16+ installed
- MySQL 5.7+ or 8.0 installed and running
- npm or yarn package manager

### Local Development Setup

1. **Clone and navigate to the project**
   ```bash
   cd BGP_Members_Management
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Configure environment variables**
   - Edit `backend/.env` with your MySQL credentials:
     ```
     DB_HOST=localhost
     DB_USER=your_mysql_user
     DB_PASSWORD=your_mysql_password
     DB_NAME=bgp_members_db
     ```

4. **Set up the database**
   ```bash
   cd backend
   node database/setup.js
   cd ..
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API: http://localhost:5000
   - Frontend App: http://localhost:3000

### Default Admin Login
- **Email**: admin@bgpnc.com
- **Password**: admin123
- ⚠️ **Important**: Change the password immediately after first login!

## Deployment to Vercel

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/bgp-members-management)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to your project settings in Vercel
   - Add all variables from `.env.example`
   - Use a cloud MySQL database (e.g., PlanetScale, Railway, or AWS RDS)

### Required Environment Variables for Production

```env
# Database (use a cloud MySQL service)
DB_HOST=your-cloud-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=bgp_members_db
DB_PORT=3306

# Security
JWT_SECRET=generate-a-strong-secret-key
JWT_REFRESH_SECRET=another-strong-secret-key

# Frontend
REACT_APP_API_URL=https://your-app.vercel.app
```

## Database Schema

The application uses the following main tables:
- `members`: Core member data (personal info, address, church info, consent flags)
- `users`: Admin user accounts (separate from members)
- `household_members`: Additional adult household members
- `children`: Child records linked to parent members
- `activity_logs`: Audit trail of all system actions

Database schema files are located in `backend/database/`:
- `schema_updated.sql` - Latest schema with all features (recommended)
- `migrate_safe.sql` - Safe migration script for updates

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/change-password` - Change password

### Public
- `POST /api/public/register` - Member registration
- `GET /api/public/health` - Health check

### Webhooks
- `POST /api/webhook/pabbly/registration` - Pabbly Connect registration webhook

### Admin (Protected)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/export/csv` - Export to CSV
- `GET /api/admin/export/excel` - Export to Excel

### Members (Protected)
- `GET /api/members` - List all members
- `GET /api/members/:id` - Get member details
- `POST /api/members` - Create member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

## Project Structure

```
BGP_Members_Management/
├── backend/
│   ├── server.js           # Express server entry (port 5000)
│   ├── database/
│   │   ├── schema_updated.sql  # Latest database schema
│   │   ├── migrate_safe.sql    # Safe migration script
│   │   └── setup.js            # Database setup script
│   ├── src/
│   │   ├── config/         # Database & upload config
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── routes/         # API routes (auth, members, admin, public, webhook)
│   │   ├── services/       # Email service
│   │   └── utils/          # Logger, helpers
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/     # Layout & common components
│   │   ├── contexts/       # Auth context
│   │   ├── pages/          # Page components (public & admin)
│   │   ├── services/       # API services (Axios)
│   │   └── App.js          # Main app with routing
│   ├── tailwind.config.js  # Tailwind with BGP brand colors
│   └── package.json
├── vercel.json             # Vercel deployment config
├── render.yaml             # Render deployment config
├── app.yaml                # DigitalOcean App Platform config
└── package.json            # Root monorepo package (npm run dev)
```

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- SQL injection prevention
- XSS protection

## Development Notes

### Cleanup Recommendations

If you cloned from the parent directory, note that there are outdated duplicate directories at the root level that should be removed:

```bash
# These root-level directories are outdated and should be deleted:
# - /backend/ (57 MB - old version with node_modules)
# - /frontend/ (361 MB - old version with node_modules)
# - /database/ (superseded by BGP_Members_Management/backend/database/)

# The active code is in this BGP_Members_Management/ directory
```

### Registration Page Versions

- `RegisterPageNew.js` - Active comprehensive registration form
- `RegisterPageEmbedded.js` - Embeddable version for iframes (no header/footer)

## Support

For issues or questions, please contact the development team or create an issue in the repository.

## License

Private - Believers Gathering Place North Carolina