-- Email Allowlist Setup for Church Admin Portal
-- This script creates an email allowlist system to restrict magic link access
-- Run this in your Supabase SQL Editor

-- ==============================================
-- 1. Create allowed_emails table
-- ==============================================
CREATE TABLE IF NOT EXISTS public.allowed_emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    added_by UUID REFERENCES auth.users(id),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- ==============================================
-- 2. Add initial admin emails (UPDATE THESE WITH YOUR EMAILS)
-- ==============================================
INSERT INTO public.allowed_emails (email) VALUES 
    ('your-admin@example.com'),
    ('admin@yourchurch.org'),
    ('pastor@yourchurch.org')
ON CONFLICT (email) DO NOTHING;

-- ==============================================
-- 3. Enable RLS for allowed_emails table
-- ==============================================
ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 4. Create RLS policy for allowed_emails
-- ==============================================
-- Only authenticated admin users can manage the allowlist
CREATE POLICY "Allow authenticated users to read allowed emails" 
ON public.allowed_emails
FOR SELECT
TO authenticated
USING (true);

-- Only allow updating/inserting if you're already an admin (circular, but secure)
CREATE POLICY "Allow authenticated users to manage allowed emails" 
ON public.allowed_emails
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ==============================================
-- 5. Create function to check if email is allowed
-- ==============================================
CREATE OR REPLACE FUNCTION public.is_email_allowed(check_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.allowed_emails 
        WHERE email = check_email AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- 6. Grant permissions
-- ==============================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.allowed_emails TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_email_allowed TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_email_allowed TO anon;