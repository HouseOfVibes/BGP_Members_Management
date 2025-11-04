# Member Management Web Application
## Complete Development Roadmap for Believers Gathering Place

## Hosting Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)
- **Frontend**: Deploy React app to Vercel (free tier available)
- **Backend**: Deploy Node.js API to Railway or Render
- **Database**: Railway PostgreSQL or PlanetScale MySQL
- **Cost**: ~$0-20/month starting

### Option 2: Netlify (Frontend) + Heroku (Backend)
- **Frontend**: Deploy React app to Netlify (free tier)
- **Backend**: Deploy Node.js to Heroku (Eco dynos $5/month)
- **Database**: Heroku PostgreSQL or ClearDB MySQL
- **Cost**: ~$5-15/month

### Option 3: DigitalOcean App Platform
- **All-in-One**: Frontend, Backend, and Database
- **Simple deployment** from GitHub
- **Cost**: ~$12-25/month

### Option 4: AWS Amplify
- **Full-stack platform** with hosting
- **Built-in authentication** and database
- **Cost**: Pay-as-you-go, ~$10-30/month

### Option 5: Self-Hosted VPS
- **Providers**: DigitalOcean, Linode, or Vultr
- **Full control** over environment
- **Cost**: ~$6-20/month
- **Setup**: Requires more configuration

## Design System (Matching BGP Website)

### BGP Brand Guidelines
Based on the official BGPNC color palette:
- **Primary Colors**: 
  - Primary Dark: #212121 (Main background, headers)
  - Dark Variant: #1a1a1a (Footer bottom, dark sections)
  - Brand Gold: #9c8040 (Primary brand color)
  - Action Teal: #009688 (CTAs, primary buttons)
  
- **Interactive States**:
  - Gold Hover: #b59448 (Gold button hover state)
  - Gold Active: #8a6f37 (Gold button active state)
  - Teal Hover: #00796b (Teal button hover state)
  
- **Text Colors**:
  - Primary Text: #ffffff (Main text on dark bg)
  - Secondary Text: #cccccc (Secondary info)
  - Muted Text: #666666 (Subtle text, labels)
  - Light Background: #f5f5f5 (Input backgrounds)
  
- **Typography**:
  - Headers: Bold, sans-serif
  - Body: Clean, readable sans-serif
  - Font sizes matching website hierarchy

- **UI Components**:
  - Rounded corners on cards and buttons
  - Subtle shadows for depth
  - Consistent spacing and padding
  - Mobile-first responsive design

### Custom CSS Framework
```css
/* bgp-styles.css - Matching website design */
:root {
  /* Primary Colors */
  --color-primary-dark: #212121;
  --color-dark-variant: #1a1a1a;
  --color-brand-gold: #9c8040;
  --color-action-teal: #009688;
  
  /* Interactive States */
  --color-gold-hover: #b59448;
  --color-gold-active: #8a6f37;
  --color-teal-hover: #00796b;
  
  /* Text Colors */
  --color-text-primary: #ffffff;
  --color-text-secondary: #cccccc;
  --color-text-muted: #666666;
  --color-bg-light: #f5f5f5;
  
  /* Utility Colors with Transparency */
  --color-white-10: rgba(255, 255, 255, 0.1);
  --color-white-5: rgba(255, 255, 255, 0.05);
  --color-gold-10: rgba(156, 128, 64, 0.1);
  --color-gold-20: rgba(156, 128, 64, 0.2);
  --color-teal-10: rgba(0, 150, 136, 0.1);
  --color-black-50: rgba(0, 0, 0, 0.5);
  --color-black-30: rgba(0, 0, 0, 0.3);
}

/* Matching BGP website styling */
.bgp-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.bgp-card {
  background: var(--color-bg-light);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.bgp-btn {
  background: var(--color-action-teal);
  color: var(--color-text-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.bgp-btn:hover {
  background: var(--color-teal-hover);
  transform: translateY(-2px);
}

.bgp-btn-gold {
  background: var(--color-brand-gold);
  color: var(--color-text-primary);
}

.bgp-btn-gold:hover {
  background: var(--color-gold-hover);
}

.bgp-header {
  color: var(--color-brand-gold);
  font-weight: bold;
  margin-bottom: 1rem;
}
```

### Tailwind Config
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'bgp-dark': '#212121',
        'bgp-darker': '#1a1a1a',
        'bgp-gold': {
          DEFAULT: '#9c8040',
          hover: '#b59448',
          active: '#8a6f37'
        },
        'bgp-teal': {
          DEFAULT: '#009688',
          hover: '#00796b'
        },
        'bgp-gray': {
          light: '#f5f5f5',
          medium: '#cccccc',
          dark: '#666666'
        }
      }
    }
  }
}
```

---

## Analytics Dashboard

### Built-in Analytics Features
```javascript
// Analytics tracking for member management
const analyticsMetrics = {
  // Registration Analytics
  registrations: {
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    conversionRate: 0, // completed vs started
    averageCompletionTime: 0,
    dropoffPoints: [] // which step users abandon
  },
  
  // Member Demographics
  demographics: {
    ageGroups: {}, // 18-25, 26-35, 36-45, etc.
    maritalStatus: {},
    hasChildren: 0,
    location: {}, // by zip code
    referralSources: {} // how they heard about church
  },
  
  // Engagement Metrics
  engagement: {
    photoConsent: 0,
    socialMediaConsent: 0,
    emailConsent: 0,
    baptized: 0,
    activeMemberPercentage: 0
  },
  
  // Growth Metrics
  growth: {
    monthlyGrowthRate: 0,
    retentionRate: 0,
    churnRate: 0,
    projectedGrowth: 0
  }
};
```

### Analytics Dashboard Component
```jsx
// components/admin/Analytics.jsx
import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const Analytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [dateRange, setDateRange] = useState('30days');
  
  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);
  
  const fetchAnalytics = async () => {
    const response = await axios.get(`/api/admin/analytics?range=${dateRange}`);
    setMetrics(response.data);
  };
  
  return (
    <div className="bgp-container">
      <h1 className="bgp-header text-3xl">Church Analytics Dashboard</h1>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bgp-card">
          <h3 className="text-sm text-gray-600">Total Members</h3>
          <p className="text-3xl font-bold">{metrics?.totalMembers}</p>
          <span className="text-green-600 text-sm">
            +{metrics?.growthPercentage}% this month
          </span>
        </div>
        
        <div className="bgp-card">
          <h3 className="text-sm text-gray-600">Active Rate</h3>
          <p className="text-3xl font-bold">{metrics?.activeRate}%</p>
        </div>
        
        <div className="bgp-card">
          <h3 className="text-sm text-gray-600">Avg Family Size</h3>
          <p className="text-3xl font-bold">{metrics?.avgFamilySize}</p>
        </div>
        
        <div className="bgp-card">
          <h3 className="text-sm text-gray-600">Retention Rate</h3>
          <p className="text-3xl font-bold">{metrics?.retentionRate}%</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="bgp-card">
          <h2 className="bgp-header">Member Growth</h2>
          <Line 
            data={metrics?.growthChart}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' }
              }
            }}
          />
        </div>
        
        {/* Demographics */}
        <div className="bgp-card">
          <h2 className="bgp-header">Age Distribution</h2>
          <Doughnut 
            data={metrics?.ageDistribution}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'right' }
              }
            }}
          />
        </div>
        
        {/* Referral Sources */}
        <div className="bgp-card">
          <h2 className="bgp-header">How People Find BGP</h2>
          <Bar 
            data={metrics?.referralSources}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </div>
        
        {/* Consent Metrics */}
        <div className="bgp-card">
          <h2 className="bgp-header">Consent Rates</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>Photo Consent</span>
                <span>{metrics?.photoConsentRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-bgp-teal h-2 rounded-full"
                  style={{width: `${metrics?.photoConsentRate}%`}}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Social Media</span>
                <span>{metrics?.socialMediaConsentRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-bgp-teal h-2 rounded-full"
                  style={{width: `${metrics?.socialMediaConsentRate}%`}}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Email Communications</span>
                <span>{metrics?.emailConsentRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-bgp-teal h-2 rounded-full"
                  style={{width: `${metrics?.emailConsentRate}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
```

---

## Executive Summary

**Project**: Standalone Member Management Web Application for BGP  
**Type**: Full-Stack Web Application  
**Primary User**: Church Administrator  
**Current Size**: ~40 members (growth phase)  
**Hosting**: InMotion Hosting  
**Access**: Subdomain (e.g., members.bgpnc.com)  

---

## System Architecture Overview

### Technology Stack

- **Frontend**: React.js with custom CSS matching BGP website design
- **Backend**: Node.js with Express.js
- **Database**: MySQL or PostgreSQL
- **Authentication**: JWT tokens with bcrypt
- **Analytics**: Custom dashboard with Chart.js
- **Integration**: Zoho CRM & Zoho Mail only
- **Version Control**: GitHub
- **Development**: VS Code
- **API**: RESTful API

### Key Features
1. Responsive web application accessible from any device
2. Secure member portal for registration
3. Administrative dashboard
4. API for integrations
5. Real-time data updates
6. Export capabilities

---

## Database Schema Design

### Core Database Tables

#### 1. members Table
```sql
CREATE TABLE members (
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- Personal Information
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    street_address VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    
    -- Church Information
    join_date DATE DEFAULT CURRENT_DATE,
    baptism_date DATE,
    member_status ENUM('new_member', 'active', 'inactive') DEFAULT 'new_member',
    
    -- Family Information
    marital_status ENUM('single', 'married', 'divorced', 'widowed'),
    spouse_name VARCHAR(100),
    
    -- Permissions
    photo_consent BOOLEAN DEFAULT FALSE,
    social_media_consent BOOLEAN DEFAULT FALSE,
    email_consent BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    registration_method ENUM('online', 'manual') DEFAULT 'online',
    referral_source VARCHAR(255),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_status (member_status),
    INDEX idx_join_date (join_date)
);
```

#### 2. children Table
```sql
CREATE TABLE children (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    age INT GENERATED ALWAYS AS (TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())),
    gender ENUM('male', 'female', 'not_specified'),
    parental_consent BOOLEAN DEFAULT FALSE,
    special_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_parent (parent_id)
);
```

#### 3. users Table (Admin Users)
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'staff', 'viewer') DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email)
);
```

#### 4. activity_logs Table
```sql
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
);
```

---

## Application Structure

### Frontend Structure (React)
```
bgp-member-app/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── forms/
│   │   │   ├── RegistrationForm.jsx
│   │   │   ├── MemberEditForm.jsx
│   │   │   └── FormValidation.js
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MembersList.jsx
│   │   │   ├── MemberDetail.jsx
│   │   │   └── ExportData.jsx
│   │   └── public/
│   │       ├── RegistrationWizard.jsx
│   │       └── SuccessPage.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Register.jsx
│   │   ├── Admin.jsx
│   │   └── Login.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   └── validation.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── formatters.js
│   ├── styles/
│   │   └── tailwind.css
│   ├── App.jsx
│   └── index.js
├── public/
├── package.json
└── tailwind.config.js
```

### Backend Structure (Node.js)
```
bgp-api/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── memberController.js
│   │   ├── childrenController.js
│   │   └── reportController.js
│   ├── models/
│   │   ├── Member.js
│   │   ├── Child.js
│   │   ├── User.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── member.routes.js
│   │   ├── admin.routes.js
│   │   └── public.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── validation.middleware.js
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── exportService.js
│   │   └── integrationService.js
│   ├── config/
│   │   ├── database.js
│   │   ├── config.js
│   │   └── constants.js
│   ├── utils/
│   │   ├── logger.js
│   │   ├── validators.js
│   │   └── helpers.js
│   └── app.js
├── .env
├── package.json
└── server.js
```

---

## Phase 1: Foundation & Setup

### Environment Configuration
```javascript
// .env file
NODE_ENV=production
PORT=5000
DATABASE_HOST=localhost
DATABASE_USER=bgp_user
DATABASE_PASSWORD=secure_password
DATABASE_NAME=bgp_members
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.inmotion.com
EMAIL_PORT=587
EMAIL_USER=noreply@bgpnc.com
EMAIL_PASSWORD=email_password
FRONTEND_URL=https://members.bgpnc.com
API_URL=https://api-members.bgpnc.com
```

### Database Connection Setup
```javascript
// config/database.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
```

### Express Server Setup
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/members', require('./routes/member.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/public', require('./routes/public.routes'));

// Error handling
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

---

## Phase 2: Public Registration System

### Multi-Step Registration Form (React)
```jsx
// components/public/RegistrationWizard.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const RegistrationWizard = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [children, setChildren] = useState([]);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    
    const steps = [
        { id: 1, title: 'Personal Information' },
        { id: 2, title: 'Church Information' },
        { id: 3, title: 'Family Details' },
        { id: 4, title: 'Permissions & Consent' }
    ];
    
    const onSubmit = async (data) => {
        try {
            const formData = {
                ...data,
                children: children
            };
            
            const response = await axios.post('/api/public/register', formData);
            
            if (response.data.success) {
                // Redirect to success page
                window.location.href = '/registration-success';
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };
    
    const addChild = () => {
        setChildren([...children, { name: '', date_of_birth: '', gender: '' }]);
    };
    
    const removeChild = (index) => {
        setChildren(children.filter((_, i) => i !== index));
    };
    
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg">
                {/* Progress Bar */}
                <div className="flex justify-between mb-8">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`flex-1 text-center py-2 ${
                                currentStep >= step.id
                                    ? 'bg-bgp-teal text-white'
                                    : 'bg-gray-200'
                            }`}
                        >
                            {step.title}
                        </div>
                    ))}
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-4 text-bgp-dark">Personal Information</h2>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2">First Name *</label>
                                    <input
                                        type="text"
                                        {...register('first_name', { required: true })}
                                        className="w-full p-2 border rounded"
                                    />
                                    {errors.first_name && (
                                        <span className="text-red-500">This field is required</span>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="block mb-2">Last Name *</label>
                                    <input
                                        type="text"
                                        {...register('last_name', { required: true })}
                                        className="w-full p-2 border rounded"
                                    />
                                    {errors.last_name && (
                                        <span className="text-red-500">This field is required</span>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block mb-2">Email *</label>
                                <input
                                    type="email"
                                    {...register('email', { 
                                        required: true,
                                        pattern: /^\S+@\S+$/i
                                    })}
                                    className="w-full p-2 border rounded"
                                />
                                {errors.email && (
                                    <span className="text-red-500">Valid email is required</span>
                                )}
                            </div>
                            
                            <div>
                                <label className="block mb-2">Phone *</label>
                                <input
                                    type="tel"
                                    {...register('phone', { required: true })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            <div>
                                <label className="block mb-2">Date of Birth *</label>
                                <input
                                    type="date"
                                    {...register('date_of_birth', { required: true })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            <div>
                                <label className="block mb-2">Street Address *</label>
                                <input
                                    type="text"
                                    {...register('street_address', { required: true })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block mb-2">City *</label>
                                    <input
                                        type="text"
                                        {...register('city', { required: true })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block mb-2">State *</label>
                                    <select
                                        {...register('state', { required: true })}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Select State</option>
                                        <option value="NC">North Carolina</option>
                                        {/* Add other states */}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block mb-2">ZIP Code *</label>
                                    <input
                                        type="text"
                                        {...register('zip_code', { 
                                            required: true,
                                            pattern: /^\d{5}$/
                                        })}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Step 2: Church Information */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-4 text-bgp-dark">Church Information</h2>
                            
                            <div>
                                <label className="block mb-2">How did you hear about BGP?</label>
                                <select
                                    {...register('referral_source')}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Please select</option>
                                    <option value="friend_family">Friend or Family</option>
                                    <option value="social_media">Social Media</option>
                                    <option value="website">Website</option>
                                    <option value="driving_by">Driving By</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block mb-2">Baptism Date (if applicable)</label>
                                <input
                                    type="date"
                                    {...register('baptism_date')}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            
                            <div>
                                <label className="block mb-2">Previous Church</label>
                                <input
                                    type="text"
                                    {...register('previous_church')}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Step 3: Family Details */}
                    {currentStep === 3 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-4 text-bgp-dark">Family Details</h2>
                            
                            <div>
                                <label className="block mb-2">Marital Status</label>
                                <select
                                    {...register('marital_status')}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Please select</option>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="divorced">Divorced</option>
                                    <option value="widowed">Widowed</option>
                                </select>
                            </div>
                            
                            {watch('marital_status') === 'married' && (
                                <div>
                                    <label className="block mb-2">Spouse Name</label>
                                    <input
                                        type="text"
                                        {...register('spouse_name')}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                            )}
                            
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Children</h3>
                                {children.map((child, index) => (
                                    <div key={index} className="border p-4 mb-2 rounded">
                                        <div className="grid grid-cols-3 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Child's Name"
                                                value={child.name}
                                                onChange={(e) => {
                                                    const newChildren = [...children];
                                                    newChildren[index].name = e.target.value;
                                                    setChildren(newChildren);
                                                }}
                                                className="p-2 border rounded"
                                            />
                                            <input
                                                type="date"
                                                placeholder="Date of Birth"
                                                value={child.date_of_birth}
                                                onChange={(e) => {
                                                    const newChildren = [...children];
                                                    newChildren[index].date_of_birth = e.target.value;
                                                    setChildren(newChildren);
                                                }}
                                                className="p-2 border rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeChild(index)}
                                                className="bg-red-500 text-white px-4 py-2 rounded"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addChild}
                                    className="bg-bgp-gold text-white px-4 py-2 rounded"
                                >
                                    + Add Child
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {/* Step 4: Permissions & Consent */}
                    {currentStep === 4 && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold mb-4 text-bgp-dark">Permissions & Consent</h2>
                            
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        {...register('photo_consent')}
                                        className="mr-2"
                                    />
                                    I consent to photos/videos being taken during church activities
                                </label>
                            </div>
                            
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        {...register('social_media_consent')}
                                        className="mr-2"
                                    />
                                    I consent to my image being displayed on church social media and website
                                </label>
                            </div>
                            
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        {...register('email_consent')}
                                        className="mr-2"
                                    />
                                    I agree to receive church communications via email
                                </label>
                            </div>
                            
                            {children.length > 0 && (
                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            {...register('parental_consent')}
                                            className="mr-2"
                                        />
                                        I provide parental consent for my minor children to participate in church activities
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-6">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="bg-gray-500 text-white px-6 py-2 rounded"
                            >
                                Previous
                            </button>
                        )}
                        
                        {currentStep < 4 ? (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="bg-bgp-teal text-white px-6 py-2 rounded ml-auto"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="bg-bgp-gold text-white px-6 py-2 rounded ml-auto"
                            >
                                Submit Registration
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationWizard;
```

### API Endpoint for Registration
```javascript
// controllers/memberController.js
const pool = require('../config/database');
const { sendWelcomeEmail } = require('../services/emailService');

exports.registerMember = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Extract member data
        const memberData = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone: req.body.phone,
            street_address: req.body.street_address,
            city: req.body.city,
            state: req.body.state,
            zip_code: req.body.zip_code,
            date_of_birth: req.body.date_of_birth,
            baptism_date: req.body.baptism_date || null,
            marital_status: req.body.marital_status || null,
            spouse_name: req.body.spouse_name || null,
            photo_consent: req.body.photo_consent || false,
            social_media_consent: req.body.social_media_consent || false,
            email_consent: req.body.email_consent || true,
            referral_source: req.body.referral_source || null,
            registration_method: 'online'
        };
        
        // Insert member
        const [memberResult] = await connection.execute(
            `INSERT INTO members SET ?`,
            [memberData]
        );
        
        const memberId = memberResult.insertId;
        
        // Insert children if any
        if (req.body.children && req.body.children.length > 0) {
            for (const child of req.body.children) {
                await connection.execute(
                    `INSERT INTO children (parent_id, name, date_of_birth, gender, parental_consent) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        memberId,
                        child.name,
                        child.date_of_birth || null,
                        child.gender || null,
                        req.body.parental_consent || false
                    ]
                );
            }
        }
        
        // Log activity
        await connection.execute(
            `INSERT INTO activity_logs (action, entity_type, entity_id, details, ip_address) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                'member_registration',
                'member',
                memberId,
                JSON.stringify({ source: 'online_form' }),
                req.ip
            ]
        );
        
        await connection.commit();
        
        // Send welcome email
        await sendWelcomeEmail(memberData.email, memberData.first_name);
        
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            memberId: memberId
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.'
        });
    } finally {
        connection.release();
    }
};
```

---

## Phase 3: Admin Dashboard

### Dashboard Component (React)
```jsx
// components/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Pie } from 'react-chartjs-2';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalMembers: 0,
        newThisMonth: 0,
        activeMembers: 0,
        inactiveMembers: 0
    });
    const [recentMembers, setRecentMembers] = useState([]);
    
    useEffect(() => {
        fetchDashboardData();
    }, []);
    
    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setStats(response.data.stats);
            setRecentMembers(response.data.recentMembers);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };
    
    return (
        <div className="p-6 bg-bgp-dark text-white">
            <h1 className="text-3xl font-bold mb-6 text-bgp-gold">Member Management Dashboard</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-bgp-darker p-4 rounded-lg shadow">
                    <h3 className="text-gray-400 text-sm">Total Members</h3>
                    <p className="text-3xl font-bold">{stats.totalMembers}</p>
                </div>
                <div className="bg-bgp-darker p-4 rounded-lg shadow">
                    <h3 className="text-gray-400 text-sm">New This Month</h3>
                    <p className="text-3xl font-bold text-bgp-gold">{stats.newThisMonth}</p>
                </div>
                <div className="bg-bgp-darker p-4 rounded-lg shadow">
                    <h3 className="text-gray-400 text-sm">Active Members</h3>
                    <p className="text-3xl font-bold text-bgp-teal">{stats.activeMembers}</p>
                </div>
                <div className="bg-bgp-darker p-4 rounded-lg shadow">
                    <h3 className="text-gray-400 text-sm">Inactive Members</h3>
                    <p className="text-3xl font-bold text-gray-400">{stats.inactiveMembers}</p>
                </div>
            </div>
            
            {/* Recent Registrations */}
            <div className="bg-bgp-darker rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 text-bgp-gold">Recent Registrations</h2>
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left py-2 text-gray-400">Name</th>
                            <th className="text-left py-2 text-gray-400">Email</th>
                            <th className="text-left py-2 text-gray-400">Phone</th>
                            <th className="text-left py-2 text-gray-400">Join Date</th>
                            <th className="text-left py-2 text-gray-400">Status</th>
                            <th className="text-left py-2 text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentMembers.map(member => (
                            <tr key={member.id} className="border-b border-gray-700">
                                <td className="py-2">{member.first_name} {member.last_name}</td>
                                <td className="py-2">{member.email}</td>
                                <td className="py-2">{member.phone}</td>
                                <td className="py-2">{new Date(member.join_date).toLocaleDateString()}</td>
                                <td className="py-2">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        member.member_status === 'active' 
                                            ? 'bg-green-900 text-green-300'
                                            : member.member_status === 'new_member'
                                            ? 'bg-blue-900 text-blue-300'
                                            : 'bg-gray-700 text-gray-300'
                                    }`}>
                                        {member.member_status}
                                    </span>
                                </td>
                                <td className="py-2">
                                    <button className="text-bgp-teal hover:underline mr-2">View</button>
                                    <button className="text-bgp-gold hover:underline">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
```

### Member Management Interface
```jsx
// components/admin/MembersList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MembersList = () => {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        fetchMembers();
    }, [searchTerm, filterStatus, currentPage]);
    
    const fetchMembers = async () => {
        try {
            const response = await axios.get('/api/admin/members', {
                params: {
                    search: searchTerm,
                    status: filterStatus,
                    page: currentPage,
                    limit: 25
                },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMembers(response.data.members);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    };
    
    const handleExport = async (format) => {
        try {
            const response = await axios.get(`/api/admin/export/${format}`, {
                params: { status: filterStatus },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `members_${Date.now()}.${format}`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Export error:', error);
        }
    };
    
    return (
        <div className="p-6 bg-bgp-dark text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-bgp-gold">All Members</h1>
                <div className="space-x-2">
                    <button 
                        onClick={() => handleExport('csv')}
                        className="bg-bgp-teal text-white px-4 py-2 rounded hover:bg-bgp-teal-hover"
                    >
                        Export CSV
                    </button>
                    <button 
                        onClick={() => handleExport('xlsx')}
                        className="bg-bgp-gold text-white px-4 py-2 rounded hover:bg-bgp-gold-hover"
                    >
                        Export Excel
                    </button>
                </div>
            </div>
            
            {/* Search and Filters */}
            <div className="bg-bgp-darker p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded bg-color-bg-light text-bgp-dark"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-2 border rounded bg-color-bg-light text-bgp-dark"
                    >
                        <option value="all">All Status</option>
                        <option value="new_member">New Member</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            
            {/* Members Table */}
            <div className="bg-bgp-darker rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-4 py-3 text-left text-gray-400">Name</th>
                            <th className="px-4 py-3 text-left text-gray-400">Contact</th>
                            <th className="px-4 py-3 text-left text-gray-400">Address</th>
                            <th className="px-4 py-3 text-left text-gray-400">Join Date</th>
                            <th className="px-4 py-3 text-left text-gray-400">Status</th>
                            <th className="px-4 py-3 text-left text-gray-400">Consent</th>
                            <th className="px-4 py-3 text-left text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr key={member.id} className="border-b border-gray-700 hover:bg-gray-800">
                                <td className="px-4 py-3">
                                    <div>
                                        <p className="font-semibold">{member.first_name} {member.last_name}</p>
                                        {member.spouse_name && (
                                            <p className="text-sm text-gray-400">Spouse: {member.spouse_name}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <p>{member.email}</p>
                                    <p className="text-sm text-gray-400">{member.phone}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <p className="text-sm">{member.street_address}</p>
                                    <p className="text-sm">{member.city}, {member.state} {member.zip_code}</p>
                                </td>
                                <td className="px-4 py-3">
                                    {new Date(member.join_date).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        member.member_status === 'active' 
                                            ? 'bg-green-900 text-green-300'
                                            : member.member_status === 'new_member'
                                            ? 'bg-blue-900 text-blue-300'
                                            : 'bg-gray-700 text-gray-300'
                                    }`}>
                                        {member.member_status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex space-x-2">
                                        {member.photo_consent && (
                                            <span className="text-green-300" title="Photo consent">📷</span>
                                        )}
                                        {member.social_media_consent && (
                                            <span className="text-blue-300" title="Social media consent">📱</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <button className="text-bgp-teal hover:underline mr-2">View</button>
                                    <button className="text-bgp-gold hover:underline mr-2">Edit</button>
                                    <button className="text-red-400 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                {/* Pagination */}
                <div className="flex justify-between items-center p-4">
                    <p className="text-gray-400">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="space-x-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-600 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-gray-600 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembersList;
```

---

## Phase 4: API & Integrations

### RESTful API Endpoints
```javascript
// API Routes Documentation
/**
 * Authentication Endpoints
 */
POST   /api/auth/login              // Admin login
POST   /api/auth/logout             // Admin logout
POST   /api/auth/refresh            // Refresh JWT token
POST   /api/auth/forgot-password    // Request password reset
POST   /api/auth/reset-password     // Reset password

/**
 * Public Endpoints (No Auth Required)
 */
POST   /api/public/register         // Member registration
GET    /api/public/verify-email     // Email verification

/**
 * Member Management Endpoints (Auth Required)
 */
GET    /api/members                 // List all members (with pagination)
GET    /api/members/:id             // Get single member details
POST   /api/members                 // Create new member (manual)
PUT    /api/members/:id             // Update member information
DELETE /api/members/:id             // Delete member
GET    /api/members/:id/children    // Get member's children
POST   /api/members/:id/children    // Add child to member
PUT    /api/members/:id/status      // Update member status

/**
 * Admin Dashboard Endpoints
 */
GET    /api/admin/dashboard         // Dashboard statistics
GET    /api/admin/activity-logs     // View activity logs
GET    /api/admin/export/csv        // Export members to CSV
GET    /api/admin/export/xlsx       // Export members to Excel
POST   /api/admin/import            // Import members from file

/**
 * Search & Filter Endpoints
 */
GET    /api/search/members          // Search members
GET    /api/filter/by-status        // Filter by status
GET    /api/filter/by-date-range    // Filter by join date
GET    /api/filter/by-consent       // Filter by consent status
```

### N8N Integration Workflows
```json
{
  "name": "BGP Member Management Automations",
  "nodes": [
    {
      "name": "New Member Webhook",
      "type": "webhook",
      "parameters": {
        "path": "bgp-new-member",
        "method": "POST"
      }
    },
    {
      "name": "Send Welcome Email",
      "type": "emailSend",
      "parameters": {
        "to": "{{$json.email}}",
        "subject": "Welcome to Believers Gathering Place!",
        "template": "welcome_email"
      }
    },
    {
      "name": "Add to Google Contacts",
      "type": "googleContacts",
      "parameters": {
        "operation": "create",
        "firstName": "{{$json.first_name}}",
        "lastName": "{{$json.last_name}}",
        "email": "{{$json.email}}",
        "phone": "{{$json.phone}}"
      }
    },
    {
      "name": "Create Zoho CRM Contact",
      "type": "zoho",
      "parameters": {
        "module": "Contacts",
        "operation": "create",
        "fields": {
          "First_Name": "{{$json.first_name}}",
          "Last_Name": "{{$json.last_name}}",
          "Email": "{{$json.email}}",
          "Phone": "{{$json.phone}}",
          "Lead_Source": "Church Registration"
        }
      }
    },
    {
      "name": "Notify Admin",
      "type": "emailSend",
      "parameters": {
        "to": "admin@bgpnc.com",
        "subject": "New Member Registration",
        "body": "A new member has registered: {{$json.first_name}} {{$json.last_name}}"
      }
    }
  ]
}
```

### Zoho CRM & Mail Integration
```javascript
// services/zohoIntegration.js
const axios = require('axios');

class ZohoIntegration {
    constructor() {
        this.accessToken = null;
        this.refreshToken = process.env.ZOHO_REFRESH_TOKEN;
        this.clientId = process.env.ZOHO_CLIENT_ID;
        this.clientSecret = process.env.ZOHO_CLIENT_SECRET;
        this.accountsUrl = 'https://accounts.zoho.com';
        this.crmApiUrl = 'https://www.zohoapis.com/crm/v2';
        this.mailApiUrl = 'https://mail.zoho.com/api';
    }
    
    async getAccessToken() {
        if (this.accessToken) return this.accessToken;
        
        const response = await axios.post(`${this.accountsUrl}/oauth/v2/token`, {
            refresh_token: this.refreshToken,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'refresh_token'
        });
        
        this.accessToken = response.data.access_token;
        return this.accessToken;
    }
    
    // CRM Functions
    async createContact(memberData) {
        const token = await this.getAccessToken();
        
        const zohoData = {
            data: [{
                First_Name: memberData.first_name,
                Last_Name: memberData.last_name,
                Email: memberData.email,
                Phone: memberData.phone,
                Mailing_Street: memberData.street_address,
                Mailing_City: memberData.city,
                Mailing_State: memberData.state,
                Mailing_Zip: memberData.zip_code,
                Lead_Source: 'Church Registration',
                Description: `Member since: ${memberData.join_date}`,
                // Custom fields for church
                Member_Status: memberData.member_status,
                Baptism_Date: memberData.baptism_date,
                Birthday: memberData.date_of_birth,
                Spouse_Name: memberData.spouse_name,
                Photo_Consent: memberData.photo_consent,
                Social_Media_Consent: memberData.social_media_consent
            }]
        };
        
        const response = await axios.post(
            `${this.crmApiUrl}/Contacts`,
            zohoData,
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    }
    
    async updateContact(zohoId, updates) {
        const token = await this.getAccessToken();
        
        const response = await axios.put(
            `${this.crmApiUrl}/Contacts/${zohoId}`,
            { data: [updates] },
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    }
    
    async searchContact(email) {
        const token = await this.getAccessToken();
        
        const response = await axios.get(
            `${this.crmApiUrl}/Contacts/search?criteria=(Email:equals:${email})`,
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`
                }
            }
        );
        
        return response.data;
    }
    
    // Zoho Mail Functions
    async sendWelcomeEmail(memberData) {
        const token = await this.getAccessToken();
        
        const emailContent = {
            fromAddress: 'welcome@bgpnc.com',
            toAddress: memberData.email,
            subject: 'Welcome to Believers Gathering Place!',
            content: this.getWelcomeEmailTemplate(memberData),
            mailFormat: 'html'
        };
        
        const response = await axios.post(
            `${this.mailApiUrl}/accounts/accountId/messages`,
            emailContent,
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        return response.data;
    }
    
    async sendBulkEmail(recipients, subject, content) {
        const token = await this.getAccessToken();
        
        // Zoho Mail bulk email API
        const bulkData = {
            fromAddress: 'info@bgpnc.com',
            subject: subject,
            content: content,
            mailFormat: 'html',
            recipients: recipients.map(r => ({
                emailId: r.email,
                name: `${r.first_name} ${r.last_name}`
            }