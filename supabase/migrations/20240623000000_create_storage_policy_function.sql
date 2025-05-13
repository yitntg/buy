-- 创建存储策略应用函数
CREATE OR REPLACE FUNCTION public.apply_storage_policy(bucket_name TEXT, policy TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE policy;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 