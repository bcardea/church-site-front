-- This script enables Row-Level Security (RLS) for the tables and storage buckets
-- used in the church website admin portal. It allows any authenticated user
-- to perform SELECT, INSERT, UPDATE, and DELETE operations.

-- Make sure to run this in your Supabase SQL Editor.

-- ==============================================
-- 1. Enable RLS for each table
-- ==============================================
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- 2. Drop existing policies (optional, but good for a clean slate)
-- ==============================================
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.hero_content;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.connection_cards;
DROP POLICY IF EXISTS "Allow all access for authenticated users" ON public.pages;

-- ==============================================
-- 3. Create policies for `hero_content` table
-- ==============================================
CREATE POLICY "Allow all access for authenticated users" 
ON public.hero_content
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ==============================================
-- 4. Create policies for `connection_cards` table
-- ==============================================
CREATE POLICY "Allow all access for authenticated users" 
ON public.connection_cards
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ==============================================
-- 5. Create policies for `pages` table
-- ==============================================
CREATE POLICY "Allow all access for authenticated users" 
ON public.pages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ==============================================
-- 6. Create policies for `images` storage bucket
-- ==============================================

-- Drop existing policies for the storage bucket (optional)
DROP POLICY IF EXISTS "Allow authenticated users to manage images" ON storage.objects;

-- Create a policy that allows authenticated users to view, upload, update, and delete images.
CREATE POLICY "Allow authenticated users to manage images"
ON storage.objects
FOR ALL
TO authenticated
USING ( bucket_id = 'images' )
WITH CHECK ( bucket_id = 'images' );

-- Note: If you have different roles in the future (e.g., 'admin', 'editor'),
-- you can create more granular policies based on user roles instead of just 'authenticated'.
