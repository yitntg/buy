-- 创建用户验证码表
CREATE TABLE IF NOT EXISTS user_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'email', 'sms', 'password_reset'
  code VARCHAR(10) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 外键约束
  CONSTRAINT fk_user_verification_codes_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_verification_codes_user_id 
ON user_verification_codes(user_id);

CREATE INDEX IF NOT EXISTS idx_user_verification_codes_type 
ON user_verification_codes(type);

-- 设置自动过期的RLS策略
ALTER TABLE user_verification_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to access only their own verification codes"
  ON user_verification_codes
  FOR ALL
  USING (auth.uid() = user_id);

-- 为auth用户创建专用的验证码函数
CREATE OR REPLACE FUNCTION create_verification_code(
  p_user_id UUID,
  p_type VARCHAR(20),
  p_code VARCHAR(10),
  p_expires_minutes INTEGER DEFAULT 15
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- 删除该用户同类型的旧验证码
  DELETE FROM user_verification_codes 
  WHERE user_id = p_user_id AND type = p_type;
  
  -- 插入新的验证码
  INSERT INTO user_verification_codes (
    user_id,
    type,
    code,
    expires_at
  ) VALUES (
    p_user_id,
    p_type,
    p_code,
    NOW() + (p_expires_minutes * INTERVAL '1 minute')
  )
  RETURNING id INTO v_id;
  
  RETURN v_id;
END;
$$; 