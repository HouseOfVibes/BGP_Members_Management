# Security Documentation

## Overview
This document outlines the security measures implemented in the BGP Members Management System and provides guidance for maintaining security best practices.

## Critical Security Updates (November 2025)

### Secrets Management
**CRITICAL**: Never commit secrets to version control.

- All deployment configuration files now use placeholders for sensitive values
- Set all secrets via your deployment platform's dashboard/environment variables
- JWT_SECRET should be generated using: `openssl rand -base64 64`
- All admin credentials must meet the strong password requirements

### Files That Should NEVER Be Committed
- `backend/.env.production`
- Any `.env` file except `.env.example`
- Files containing actual passwords, API keys, or JWT secrets

### Required Environment Variables

#### Backend (Production)
```bash
# Server
NODE_ENV=production
PORT=5000

# Security - NEVER commit actual values!
JWT_SECRET=<Generate with: openssl rand -base64 64>
JWT_EXPIRES_IN=2h
BCRYPT_SALT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS - Set to your actual frontend URL
CORS_ORIGIN=https://your-frontend-url.com

# Admin Setup - Must meet password requirements
ADMIN_USERNAME=<Your admin username>
ADMIN_EMAIL=<Your admin email>
ADMIN_PASSWORD=<Strong password: 12+ chars, upper, lower, numbers, symbols>

# Database (when configured)
DATABASE_HOST=<Your DB host>
DATABASE_USER=<Your DB user>
DATABASE_PASSWORD=<Your DB password>
DATABASE_NAME=bgp_members
DATABASE_PORT=3306

# Email (when configured)
EMAIL_HOST=<Your SMTP host>
EMAIL_PORT=587
EMAIL_USER=<Your email>
EMAIL_PASSWORD=<Your email password>
```

## Password Requirements

### Strong Password Policy
All passwords in the system MUST meet these requirements:
- Minimum 12 characters long
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (!@#$%^&*()_+-=[]{}|;:'"<>,.?/)
- Not a common weak password

### Examples
- **WEAK**: `admin123` ❌
- **WEAK**: `Password1` ❌
- **STRONG**: `MyS3cure!P@ssw0rd#2024` ✅

## Security Features Implemented

### 1. Authentication & Authorization
- JWT-based authentication with 2-hour token expiration
- Strong password hashing using bcrypt with 12 salt rounds
- Role-based access control (admin, staff, viewer)
- Token verification on every protected route

### 2. Input Validation
- Express-validator for request validation
- Whitelisted fields for database updates
- SQL injection prevention through parameterized queries
- XSS protection through input sanitization

### 3. Rate Limiting
- General API: 100 requests per 15 minutes
- Registration endpoint: 5 attempts per 15 minutes
- Prevents brute force attacks

### 4. Security Headers
- Helmet.js for security headers
- Content Security Policy (CSP)
- XSS protection
- MIME type sniffing prevention

### 5. CORS Configuration
- Restricted to specific frontend origin
- Credentials support enabled
- Pre-flight request handling

### 6. Activity Logging
- All authentication attempts logged
- Member CRUD operations tracked
- Admin actions recorded with user ID and IP address
- Failed login attempts monitored

### 7. Database Security
- Connection pooling with limits
- Prepared statements (parameterized queries)
- Transaction support with rollback
- Foreign key constraints with CASCADE

## Development vs Production

### Development Mode
- Hardcoded admin credentials available (admin/admin123)
- Only works when `NODE_ENV=development`
- Mock data fallbacks when database unavailable
- Additional logging and error details

### Production Mode
- Hardcoded credentials DISABLED
- Database connection required
- Reduced error information in responses
- Strict CORS policy enforced

## Deployment Checklist

### Before Deploying

- [ ] Generate strong JWT_SECRET: `openssl rand -base64 64`
- [ ] Create strong admin password (12+ chars, meets requirements)
- [ ] Set all environment variables in deployment platform
- [ ] Configure CORS_ORIGIN to your actual frontend URL
- [ ] Verify NODE_ENV is set to "production"
- [ ] Ensure DATABASE_* variables are configured
- [ ] Test authentication flow
- [ ] Verify rate limiting is active

### After Deploying

- [ ] Create initial admin user via POST /api/auth/setup-admin
- [ ] Test login with admin credentials
- [ ] Change admin password if using default
- [ ] Verify CORS is working correctly
- [ ] Check activity logs are recording
- [ ] Test rate limiting
- [ ] Monitor error logs

## Security Best Practices

### For Developers

1. **Never commit secrets**: Always use environment variables
2. **Use parameterized queries**: Prevent SQL injection
3. **Validate all input**: Never trust client data
4. **Log security events**: Track authentication and authorization
5. **Keep dependencies updated**: Regularly check for vulnerabilities
6. **Use HTTPS**: In production, always use TLS/SSL
7. **Implement least privilege**: Users should have minimum necessary permissions

### For Administrators

1. **Strong passwords**: Enforce the 12+ character policy
2. **Regular password changes**: Update admin passwords periodically
3. **Monitor logs**: Review activity logs for suspicious behavior
4. **Backup database**: Regular automated backups
5. **Update software**: Keep Node.js and packages current
6. **Limit admin accounts**: Only create admin users as needed
7. **Enable 2FA**: When available, use two-factor authentication

## Incident Response

### If Credentials Are Compromised

1. **Immediately** rotate all secrets:
   - Generate new JWT_SECRET
   - Change all admin passwords
   - Update environment variables
   - Restart application

2. Review activity logs for unauthorized access

3. Force re-authentication of all users (JWT_SECRET change does this)

4. Investigate how credentials were compromised

5. Implement additional security measures as needed

### If Database Is Compromised

1. Immediately take application offline

2. Change all database credentials

3. Review database for unauthorized modifications

4. Restore from backup if data integrity is questionable

5. Audit all access logs

6. Report incident to appropriate authorities if required

## Security Updates

### Dependencies
Run security audits regularly:
```bash
# Backend
cd backend
npm audit
npm audit fix

# Frontend
cd frontend
npm audit
npm audit fix
```

### Known Issues
Check `npm audit` output for vulnerabilities and update dependencies accordingly.

## Contact

For security issues, please contact:
- Technical Lead: [Contact Information]
- Security Team: [Contact Information]

**DO NOT** disclose security vulnerabilities publicly. Report them privately first.

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Last Updated**: November 2025
**Version**: 2.0
**Status**: Active
