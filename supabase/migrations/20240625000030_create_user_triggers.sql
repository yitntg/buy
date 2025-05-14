-- Enable HTTP extension
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Create function for handling new user registrations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  project_url TEXT := (SELECT value FROM secrets.secrets WHERE name = 'PROJECT_URL' LIMIT 1);
  function_secret TEXT := (SELECT value FROM secrets.secrets WHERE name = 'FUNCTION_SECRET' LIMIT 1);
BEGIN
  -- Call the Edge Function to create user profile
  PERFORM extensions.http((
    'POST',
    project_url || '/functions/v1/create_user_profile',
    ARRAY[
      ('Content-Type', 'application/json'),
      ('Authorization', 'Bearer ' || function_secret)
    ],
    'application/json',
    json_build_object('type', TG_OP, 'record', row_to_json(NEW))
  )::extensions.http_request);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Setup the trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to handle user deletion
CREATE OR REPLACE FUNCTION public.handle_user_deleted()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete the user profile when a user is deleted
  DELETE FROM public.user_profiles WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Setup the trigger for user deletion
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_deleted();

-- Add environment variable setup instructions as comments
COMMENT ON FUNCTION public.handle_new_user() IS '
需要在Supabase控制台中设置以下密钥：
1. PROJECT_URL - Supabase项目URL，如 https://xyzproject.supabase.co
2. FUNCTION_SECRET - 用于调用Edge Function的密钥
';

-- Test the triggers
DO $$
BEGIN
  RAISE NOTICE '已设置用户注册和删除的触发器。注意：请确保设置了必要的项目URL和函数密钥。';
END $$; 