-- 创建存储策略应用函数
CREATE OR REPLACE FUNCTION public.apply_storage_policy(bucket_name TEXT, policy TEXT)
RETURNS VOID AS $$
BEGIN
  -- 动态执行多个策略语句
  FOR stmt IN 
    SELECT unnest(string_to_array(policy, ';')) AS statement
  LOOP
    IF trim(stmt) != '' THEN
      EXECUTE trim(stmt);
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 