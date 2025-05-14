-- 创建验证码验证函数
CREATE OR REPLACE FUNCTION verify_code(
  p_user_id UUID,
  p_type VARCHAR(20),
  p_code VARCHAR(10)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  code_record RECORD;
  is_valid BOOLEAN := FALSE;
BEGIN
  -- 查找匹配的验证码记录
  SELECT * 
  INTO code_record
  FROM user_verification_codes
  WHERE 
    user_id = p_user_id 
    AND type = p_type 
    AND code = p_code;
    
  -- 检查是否找到记录
  IF code_record IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- 检查验证码是否过期
  IF code_record.expires_at < NOW() THEN
    -- 删除过期的验证码
    DELETE FROM user_verification_codes
    WHERE id = code_record.id;
    
    RETURN FALSE;
  END IF;
  
  -- 验证码有效，删除使用过的验证码
  DELETE FROM user_verification_codes
  WHERE id = code_record.id;
  
  RETURN TRUE;
END;
$$;

-- 更新Supabase类型定义
COMMENT ON FUNCTION verify_code IS '验证用户的一次性验证码';

-- 添加RLS策略保护
GRANT EXECUTE ON FUNCTION verify_code TO authenticated;
GRANT EXECUTE ON FUNCTION verify_code TO service_role; 