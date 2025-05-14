-- 创建MFA因子表
CREATE TABLE IF NOT EXISTS user_mfa_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  secret TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT user_mfa_factors_type_check 
    CHECK (type IN ('app', 'sms', 'email')),
  UNIQUE (user_id, type)
);

-- 添加索引
CREATE INDEX IF NOT EXISTS idx_user_mfa_factors_user_id 
  ON user_mfa_factors(user_id);
CREATE INDEX IF NOT EXISTS idx_user_mfa_factors_type 
  ON user_mfa_factors(type);

-- 向用户表添加MFA相关字段
ALTER TABLE IF EXISTS users 
  ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS mfa_verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS mfa_status VARCHAR(20) DEFAULT 'disabled',
  ADD COLUMN IF NOT EXISTS mfa_preferred_method VARCHAR(20);

-- 添加RLS策略
ALTER TABLE user_mfa_factors ENABLE ROW LEVEL SECURITY;

-- 仅允许用户访问自己的MFA因子
CREATE POLICY "用户可以查看自己的MFA因子"
  ON user_mfa_factors
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "服务角色可以管理所有MFA因子"
  ON user_mfa_factors
  FOR ALL
  TO service_role
  USING (true);

-- 确保安全
REVOKE ALL ON user_mfa_factors FROM anon;
GRANT SELECT ON user_mfa_factors TO authenticated; 