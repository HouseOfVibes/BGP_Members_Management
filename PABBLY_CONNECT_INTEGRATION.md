# Pabbly Connect Email Verification Integration Guide

This guide explains how to integrate Pabbly Connect with your BGP Members Registration form for automatic email verification and data processing.

## Overview

Pabbly Connect can:
- ✅ Verify email addresses before registration
- ✅ Send welcome emails automatically
- ✅ Integrate with your existing email service (Zoho)
- ✅ Process form submissions
- ✅ Store data in Google Sheets (optional)
- ✅ Trigger workflows based on registration events

## Setup Options

### Option 1: Form Submission → Pabbly → Your Database (Recommended)

This is the most secure approach where Pabbly handles email verification first.

**Flow:**
1. User submits form on your website
2. Form data goes to Pabbly Connect webhook
3. Pabbly verifies email address
4. Pabbly sends data to your backend API
5. Your backend stores verified data in database

**Setup Steps:**

#### 1. Create Pabbly Connect Workflow

1. Log into [Pabbly Connect](https://www.pabbly.com/connect/)
2. Create a new workflow
3. **Trigger:** Choose "Webhook" → Copy the webhook URL
4. **Add Action:** Email Verification
   - Service: Pabbly Email Verification
   - Input: Email field from webhook
5. **Add Action:** Webhook POST
   - URL: `https://your-backend-url.com/api/webhook/pabbly/registration`
   - Method: POST
   - Body: Map all form fields
   - Headers:
     - `Content-Type: application/json`
     - `Authorization: Bearer YOUR_SECRET_TOKEN`

#### 2. Update Your Frontend Form

Update your `RegisterPageNew.js` to submit to Pabbly webhook:

```javascript
const onSubmit = async (data) => {
    setLoading(true);
    try {
        // Prepare data for Pabbly webhook
        const formData = {
            // Personal Information
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            date_of_birth: data.date_of_birth,
            gender: data.gender,

            // Address
            street_address: data.street_address,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
            country: data.country || 'US',

            // Church Information
            baptism_status: data.baptism_status,
            baptism_date: data.baptism_date,
            previous_church: data.previous_church,
            referral_source: data.referral_source,

            // Family
            marital_status: data.marital_status,
            spouse_name: data.spouse_name,
            children: children.filter(child => child.name),
            household_members: householdMembers.filter(member => member.name),

            // Volunteer & Skills
            volunteer_interests: selectedVolunteerInterests,
            skills_talents: selectedSkills,

            // Permissions
            photo_consent: data.photo_consent,
            children_photo_consent: data.children_photo_consent,
            email_consent: data.email_consent,
            social_media_consent: data.social_media_consent,
            parental_consent: data.parental_consent,

            // Metadata
            submission_timestamp: new Date().toISOString(),
            source: 'web_registration_form'
        };

        // Send to Pabbly webhook
        const response = await fetch('YOUR_PABBLY_WEBHOOK_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            toast.success('Registration submitted! Please check your email to verify.');
            navigate('/registration-pending');
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        toast.error('Registration failed. Please try again.');
    } finally {
        setLoading(false);
    }
};
```

#### 3. Create Registration Pending Page

Create `frontend/src/pages/RegistrationPendingPage.js`:

```javascript
import React from 'react';
import { Link } from 'react-router-dom';

const RegistrationPendingPage = () => {
    return (
        <div className="min-h-screen bg-bgp-gray-light flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <svg className="mx-auto h-16 w-16 text-bgp-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-secondary font-light text-bgp-dark mb-4">
                    Check Your Email
                </h1>

                <p className="text-gray-600 mb-6 font-primary">
                    We've sent a verification link to your email address.
                    Please click the link to complete your registration.
                </p>

                <div className="bg-bgp-gray-light p-4 rounded-md mb-6">
                    <p className="text-sm text-gray-700">
                        <strong>Didn't receive the email?</strong><br />
                        Check your spam folder or contact us at{' '}
                        <a href="mailto:info@bgpnc.com" className="text-bgp-teal hover:underline">
                            info@bgpnc.com
                        </a>
                    </p>
                </div>

                <Link to="/" className="bgp-btn-primary inline-block">
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default RegistrationPendingPage;
```

### Option 2: Direct Submission with Background Email Verification

Submit to your backend first, then use Pabbly for email verification in the background.

**Flow:**
1. User submits form to your backend
2. Backend stores data with `email_verified: false`
3. Backend triggers Pabbly workflow via API
4. Pabbly verifies email and sends confirmation
5. User clicks verification link → Updates database

This requires the webhook endpoint we created earlier.

## Pabbly Connect Workflow Configuration

### Recommended Workflow Steps:

1. **Trigger: Webhook** (Receive form data)

2. **Filter: Email Validation**
   - Check if email format is valid
   - Check if email domain exists

3. **Action: Email Verification** (Pabbly's built-in feature)
   - Verify email deliverability
   - Check for disposable/temporary emails

4. **Router: Split based on verification result**

   **Path A - Email Valid:**
   - Send welcome email (via Zoho Mail API or SMTP)
   - POST data to your backend API
   - Add to Google Sheets (optional)
   - Add to mailing list (optional)

   **Path B - Email Invalid:**
   - Send notification to admin
   - Log invalid attempt

5. **Action: Send Welcome Email**
   - To: Verified email address
   - From: noreply@bgpnc.com
   - Subject: "Welcome to Believers Gathering Place!"
   - Body: Personalized welcome message

6. **Action: POST to Your Backend**
   - URL: `https://your-backend.com/api/webhook/pabbly/registration`
   - Method: POST
   - Headers:
     ```json
     {
       "Content-Type": "application/json",
       "Authorization": "Bearer YOUR_SECRET_TOKEN"
     }
     ```
   - Body: All form fields mapped

## Backend Webhook Setup

### 1. Add Webhook Routes to Your Server

In `backend/server.js`, add:

```javascript
const webhookRoutes = require('./src/routes/webhook.routes');

// Webhook routes (before other middleware that might interfere)
app.use('/api/webhook', webhookRoutes);
```

### 2. Add Environment Variables

In `backend/.env`, add:

```env
# Pabbly Connect Configuration
PABBLY_WEBHOOK_TOKEN=your-secret-token-here
PABBLY_API_KEY=your-pabbly-api-key-here
```

### 3. Secure Your Webhook Endpoint

Update `webhook.routes.js` to verify requests from Pabbly:

```javascript
const verifyPabblyWebhook = (req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (token !== process.env.PABBLY_WEBHOOK_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};

router.post('/pabbly/registration', verifyPabblyWebhook, async (req, res) => {
    // ... handler code
});
```

## Email Templates for Pabbly

### Welcome Email Template

**Subject:** Welcome to Believers Gathering Place!

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Noto Serif', Georgia, serif; color: #333; }
        .header { background: #212121; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .button {
            background: #9c8040;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            display: inline-block;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to BGP!</h1>
    </div>
    <div class="content">
        <p>Dear {{first_name}},</p>

        <p>Thank you for joining Believers Gathering Place! We're thrilled to have you as part of our church family.</p>

        <p>Your registration has been confirmed, and we look forward to connecting with you soon.</p>

        <p><strong>Next Steps:</strong></p>
        <ul>
            <li>Join us for Sunday service at 10:00 AM</li>
            <li>Connect with our welcome team</li>
            <li>Explore ministries that interest you</li>
        </ul>

        <a href="https://bgpnc.com/next-steps" class="button">Get Started</a>

        <p>If you have any questions, feel free to reach out to us at info@bgpnc.com or call (919) 555-0123.</p>

        <p>Believe. Connect. Grow.</p>

        <p>Blessings,<br>
        <strong>The BGP Team</strong></p>
    </div>
</body>
</html>
```

## Testing Your Integration

### 1. Test the Pabbly Workflow

1. Go to your Pabbly Connect workflow
2. Click "Send Test Request" in the webhook trigger
3. Verify each step executes correctly
4. Check that your backend receives the webhook

### 2. Test the Complete Flow

1. Fill out the registration form on your website
2. Submit the form
3. Check Pabbly Connect task history
4. Verify email was sent
5. Check your database for the new member record

### 3. Test Error Scenarios

- Invalid email address
- Disposable email address
- Network timeout
- Backend API down

## Monitoring & Troubleshooting

### Pabbly Connect Dashboard

- Monitor workflow execution history
- Check for failed tasks
- View detailed logs for each step

### Backend Logs

Check your backend logs for webhook activity:

```bash
cd backend
npm run logs
# or
tail -f logs/app.log | grep webhook
```

### Common Issues

**Issue:** Webhook not receiving data
- **Solution:** Check firewall rules, ensure endpoint is publicly accessible

**Issue:** Email verification failing
- **Solution:** Verify Pabbly credits, check email format

**Issue:** Duplicate registrations
- **Solution:** Add duplicate check in backend before inserting

## Cost Considerations

Pabbly Connect Pricing (as of 2024):
- Standard Plan: $19/month (10,000 tasks)
- Pro Plan: $39/month (25,000 tasks)
- Ultimate Plan: $79/month (50,000 tasks)

One registration = ~3-5 tasks (webhook, verification, email, database)

## Alternative: Pabbly Form Builder

If you want an even simpler solution, you can use **Pabbly Form Builder** which includes:
- Built-in email verification
- Form hosting
- Automatic email sending
- Direct integration with your database

However, the custom React form gives you more control over the user experience and branding.

## Next Steps

1. ✅ Database migration completed
2. ⏳ Set up Pabbly Connect account
3. ⏳ Create webhook workflow
4. ⏳ Update frontend to use Pabbly webhook
5. ⏳ Test complete flow
6. ⏳ Go live!

## Support

If you need help with Pabbly Connect integration:
- Pabbly Support: https://www.pabbly.com/support/
- BGP Technical Team: tech@bgpnc.com

---

**Last Updated:** November 2025
