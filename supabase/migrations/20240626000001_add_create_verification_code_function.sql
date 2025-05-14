-- 创建验证码创建函数
CREATE OR REPLACE FUNCTION create_verification_code(
  p_user_id UUID,
  p_type VARCHAR(20),
  p_code VARCHAR(10),
  p_expires_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expire_time TIMESTAMP;
BEGIN
  -- 设置过期时间
  expire_time := NOW() + (p_expires_minutes || ' minutes')::INTERVAL;
  
  -- 删除同类型的旧验证码
  DELETE FROM user_verification_codes
  WHERE user_id = p_user_id AND type = p_type;
  
  -- 插入新验证码
  INSERT INTO user_verification_codes (
    user_id,
    type,
    code,
    created_at,
    expires_at
  ) VALUES (
    p_user_id,
    p_type,
    p_code,
    NOW(),
    expire_time
  );
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- 更新Supabase类型定义
COMMENT ON FUNCTION create_verification_code IS '为用户创建一次性验证码';

-- 添加RLS策略保护
GRANT EXECUTE ON FUNCTION create_verification_code TO authenticated;
GRANT EXECUTE ON FUNCTION create_verification_code TO service_role; 