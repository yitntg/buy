-- 创建多因素认证相关表

-- MFA 方法枚举类型
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_type 
        WHERE typname = 'mfa_method'
    ) THEN
        CREATE TYPE mfa_method AS ENUM ('app', 'sms', 'email');
    END IF;
END $$;

-- MFA 状态枚举类型
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_type 
        WHERE typname = 'mfa_status'
    ) THEN
        CREATE TYPE mfa_status AS ENUM ('disabled', 'enabled', 'setup_required', 'verification_required');
    END IF;
END $$;

-- 更新用户表，添加 MFA 相关字段
ALTER TABLE users
ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS mfa_preferred_method mfa_method,
ADD COLUMN IF NOT EXISTS mfa_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS mfa_status mfa_status DEFAULT 'disabled';

-- MFA 认证器表（存储用户的 TOTP 密钥等信息）
CREATE TABLE IF NOT EXISTS user_mfa_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type mfa_method NOT NULL,
  secret TEXT, -- 加密存储的密钥
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  
  -- 外键约束
  CONSTRAINT fk_user_mfa_factors_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_mfa_factors_user_id 
ON user_mfa_factors(user_id);

-- MFA 备份码表（用于用户无法使用主要验证方式时的备用登录）
CREATE TABLE IF NOT EXISTS user_mfa_backup_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  code TEXT NOT NULL, -- 哈希存储的备份码
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  
  -- 外键约束
  CONSTRAINT fk_user_mfa_backup_codes_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_mfa_backup_codes_user_id 
ON user_mfa_backup_codes(user_id); 