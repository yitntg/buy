-- 创建用于查询SQL的RPC函数
CREATE OR REPLACE FUNCTION query_sql(sql text)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE sql INTO result;
  RETURN result;
END;
$$;

-- 授予执行权限（如果需要）
GRANT EXECUTE ON FUNCTION query_sql TO authenticated;
GRANT EXECUTE ON FUNCTION query_sql TO anon; 