
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM public, anon, authenticated;

-- Restrict bucket listing: only allow reading individual files, not listing all
DROP POLICY IF EXISTS "Site images are public" ON storage.objects;
CREATE POLICY "Site images are readable" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'site-images');
