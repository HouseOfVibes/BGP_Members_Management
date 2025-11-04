# BGP Members Management - Backend API

Backend API for the Believers Gathering Place Member Management System.

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- MySQL 8.0+ installed
- Git

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```
Edit `.env` file with your database and email credentials.

3. **Set up MySQL database:**
```bash
mysql -u root -p < database/schema.sql
```

4. **Create initial admin user:**
Start the server and make a POST request to:
```
POST http://localhost:5000/api/auth/setup-admin
```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Documentation

### Public Endpoints

#### Register Member
```
POST /api/public/register
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "919-555-0123",
  "street_address": "123 Main St",
  "city": "Wendell",
  "state": "NC",
  "zip_code": "27591",
  "date_of_birth": "1990-01-01",
  "photo_consent": true,
  "social_media_consent": true,
  "email_consent": true,
  "children": [
    {
      "name": "Jane Doe",
      "date_of_birth": "2010-05-15",
      "gender": "female"
    }
  ]
}
```

### Authentication Endpoints

#### Admin Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "yourpassword"
}
```

Returns JWT token for authenticated requests.

### Protected Endpoints (Require Authentication)

Include token in Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get All Members
```
GET /api/members?page=1&limit=25&search=john&status=active
```

#### Get Single Member
```
GET /api/members/:id
```

#### Update Member
```
PUT /api/members/:id
Content-Type: application/json

{
  "phone": "919-555-9999",
  "member_status": "active"
}
```

#### Delete Member (Admin only)
```
DELETE /api/members/:id
```

### Admin Dashboard Endpoints

#### Get Dashboard Statistics
```
GET /api/admin/dashboard
```

#### Get Analytics
```
GET /api/admin/analytics?range=30days
```

#### Export Data
```
GET /api/admin/export/csv?status=active
GET /api/admin/export/excel?status=all
```

## Database Schema

### Members Table
- Personal information (name, email, phone, address)
- Church information (join date, baptism date, status)
- Family information (marital status, spouse)
- Consent flags (photo, social media, email)

### Children Table
- Linked to parent member
- Name, date of birth, gender
- Parental consent flag

### Users Table
- Admin users for system access
- Username, email, password hash
- Role-based access (admin, staff, viewer)

### Activity Logs Table
- Tracks all system actions
- User, action, timestamp, IP address

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Deployment

### Using Docker
```bash
docker build -t bgp-api .
docker run -p 5000:5000 --env-file .env bgp-api
```

### Using PM2
```bash
npm install -g pm2
pm2 start server.js --name bgp-api
pm2 save
pm2 startup
```

## Monitoring

Health check endpoint:
```
GET /health
```

Check logs:
- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`

## Support

For issues or questions, contact the development team at House Of Vibes.