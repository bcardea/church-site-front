# Email Allowlist Setup Guide

This guide will help you implement an email allowlist system for your church admin portal's magic link authentication.

## Overview

The email allowlist system ensures that only approved email addresses can access your admin portal through magic link authentication. This adds an extra layer of security while maintaining the convenience of passwordless login.

## Setup Steps

### 1. Database Setup

Run the SQL script in your Supabase SQL Editor:

```sql
-- Copy the contents of email_allowlist_setup.sql and run in Supabase SQL Editor
```

**Important:** Before running the script, update the initial admin emails in the script:

```sql
-- Replace these with your actual admin email addresses
INSERT INTO public.allowed_emails (email) VALUES 
    ('your-admin@example.com'),           -- Replace with your email
    ('admin@yourchurch.org'),             -- Replace with church admin email
    ('pastor@yourchurch.org')             -- Replace with pastor's email
ON CONFLICT (email) DO NOTHING;
```

### 2. Test the Implementation

1. **Add your email to the allowlist** (if you haven't already in step 1)
2. **Try logging in** with an approved email - should work
3. **Try logging in** with a non-approved email - should be rejected

### 3. Manage Email Access

Once logged in, you can manage the email allowlist through the admin dashboard:

1. Go to the **"Email Access"** tab in your dashboard
2. **Add new emails** to grant access to other administrators
3. **Deactivate emails** temporarily without removing them
4. **Remove emails** permanently from the allowlist

## How It Works

### Login Process
1. User enters email address
2. System checks if email exists in `allowed_emails` table and is active
3. If approved: magic link is sent
4. If not approved: user gets an error message
5. User clicks magic link and is authenticated normally

### Security Features
- **Database function**: `is_email_allowed()` checks email approval status
- **Row Level Security**: Protects the allowlist table
- **Active/Inactive status**: Allows temporary access control
- **Audit trail**: Tracks when emails were added

## Database Schema

The system adds one new table:

```sql
allowed_emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    added_by UUID REFERENCES auth.users(id),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
)
```

## Troubleshooting

### Common Issues

**"Unable to verify email permissions"**
- Check that the database function was created successfully
- Verify RLS policies are set correctly

**"Email already exists" error when adding**
- The email is already in the allowlist (possibly inactive)
- Check the email list and activate it if needed

**Magic link not being sent**
- Verify the email is in the allowlist and marked as active
- Check Supabase auth logs for any errors

### Rollback (if needed)

If you need to disable the allowlist system:

```sql
-- Remove the email check (temporarily)
-- You would need to revert the Login.jsx changes
DROP FUNCTION IF EXISTS public.is_email_allowed;
DROP TABLE IF EXISTS public.allowed_emails;
```

## Best Practices

1. **Always add your own email first** before testing
2. **Use lowercase emails** for consistency
3. **Regular cleanup** - remove inactive/unused emails
4. **Backup the allowlist** before major changes
5. **Test access** after adding new emails

## Security Considerations

- The allowlist is protected by Row Level Security (RLS)
- Only authenticated users can view/manage the list
- Email checking happens before magic link generation
- No sensitive data is stored in the allowlist table

This system provides a good balance between security and usability for your church admin portal.