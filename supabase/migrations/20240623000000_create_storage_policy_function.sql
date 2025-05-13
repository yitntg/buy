-- 创建存储桶策略应用函数
CREATE OR REPLACE FUNCTION public.apply_storage_policy(
  bucket_name TEXT, 
  policy JSONB
) RETURNS VOID AS $$
DECLARE
  policy_type TEXT;
  policy_action TEXT;
  policy_role TEXT;
BEGIN
  policy_type := policy->>'type';
  policy_action := policy->>'action';
  policy_role := policy->>'role';

  IF policy_type = 'rls' THEN
    EXECUTE format(
      'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;'
    );

    EXECUTE format(
      'CREATE POLICY "%s_%s_%s" ON storage.objects FOR %s TO %s USING (%s)',
      bucket_name,
      policy_action,
      policy_role,
      policy_action,
      policy_role,
      policy->>'condition'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 授予执行权限
GRANT EXECUTE ON FUNCTION public.apply_storage_policy(TEXT, JSONB) TO authenticated, service_role; 