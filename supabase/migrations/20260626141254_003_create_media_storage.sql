/*
# Create Media Storage Bucket

Sets up a public Supabase Storage bucket named `media` for blog images and
configures Row Level Security policies on the storage.objects table.

1. Storage Bucket
   - `media` — public bucket (images accessible via URL without auth)
   - No MIME type restriction so admins can store any image format

2. Policies on storage.objects
   - Public SELECT: anyone can read/download files in the media bucket
   - Authenticated INSERT: only signed-in admins can upload
   - Authenticated UPDATE: only signed-in admins can upsert/replace
   - Authenticated DELETE: only signed-in admins can remove files

## Notes
- The bucket is intentionally public so blog article images render for all readers.
- Upload and delete are restricted to authenticated sessions (admin panel users).
- The `ON CONFLICT (id) DO NOTHING` guard makes this migration re-runnable.
*/

-- Create the bucket (idempotent)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read (blog readers need to see images)
DROP POLICY IF EXISTS "public_read_media" ON storage.objects;
CREATE POLICY "public_read_media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Authenticated upload
DROP POLICY IF EXISTS "auth_upload_media" ON storage.objects;
CREATE POLICY "auth_upload_media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Authenticated upsert/replace
DROP POLICY IF EXISTS "auth_update_media" ON storage.objects;
CREATE POLICY "auth_update_media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

-- Authenticated delete
DROP POLICY IF EXISTS "auth_delete_media" ON storage.objects;
CREATE POLICY "auth_delete_media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');
