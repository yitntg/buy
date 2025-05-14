-- 创建验证码表
CREATE TABLE IF NOT EXISTS user_verification_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  code VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- 添加索引以提高查询性能
  CONSTRAINT user_verification_codes_type_check 
    CHECK (type IN ('app', 'sms', 'email')),
  CONSTRAINT user_verification_codes_code_length_check 
    CHECK (LENGTH(code) > 3 AND LENGTH(code) <= 10)
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_user_verification_codes_user_id 
  ON user_verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verification_codes_type 
  ON user_verification_codes(type);
CREATE INDEX IF NOT EXISTS idx_user_verification_codes_expires_at 
  ON user_verification_codes(expires_at);

-- 添加用于自动清理过期验证码的函数
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 删除过期的验证码
  DELETE FROM user_verification_codes
  WHERE expires_at < NOW();
  RETURN NULL;
END;
$$;

-- 创建触发器，在每次插入后运行清理函数
DROP TRIGGER IF EXISTS trigger_cleanup_expired_verification_codes ON user_verification_codes;
CREATE TRIGGER trigger_cleanup_expired_verification_codes
  AFTER INSERT ON user_verification_codes
  EXECUTE PROCEDURE cleanup_expired_verification_codes();

-- 添加RLS策略
ALTER TABLE user_verification_codes ENABLE ROW LEVEL SECURITY;

-- 仅允许用户访问自己的验证码
CREATE POLICY "用户可以查看自己的验证码"
  ON user_verification_codes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "服务角色可以管理所有验证码"
  ON user_verification_codes
  FOR ALL
  TO service_role
  USING (true);

-- 确保安全
REVOKE ALL ON user_verification_codes FROM anon;
GRANT SELECT ON user_verification_codes TO authenticated; 