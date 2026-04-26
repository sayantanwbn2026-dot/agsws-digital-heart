CREATE POLICY "Public upload application docs"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'cms-uploads'
  AND (storage.foldername(name))[1] = 'applications'
);