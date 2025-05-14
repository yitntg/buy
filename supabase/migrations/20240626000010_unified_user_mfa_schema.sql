-- 统一用户表和MFA相关表的定义

-- 1. 创建必要的枚举类型
DO $$
BEGIN
    -- 用户角色枚举
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_type 
        WHERE typname = 'user_role'
    ) THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin');
    END IF;

    -- MFA方法枚举
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_type 
        WHERE typname = 'mfa_method'
    ) THEN
        CREATE TYPE mfa_method AS ENUM ('app', 'sms', 'email');
    END IF;

    -- MFA状态枚举
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_type 
        WHERE typname = 'mfa_status'
    ) THEN
        CREATE TYPE mfa_status AS ENUM ('disabled', 'enabled', 'setup_required', 'verification_required');
    END IF;
END $$;

-- 2. 更新用户表结构（如果表已存在）
ALTER TABLE IF EXISTS users
    ADD COLUMN IF NOT EXISTS username TEXT,
    ADD COLUMN IF NOT EXISTS first_name TEXT,
    ADD COLUMN IF NOT EXISTS last_name TEXT,
    ADD COLUMN IF NOT EXISTS phone TEXT,
    ADD COLUMN IF NOT EXISTS join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user',
    ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS mfa_verified BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS mfa_status mfa_status DEFAULT 'disabled',
    ADD COLUMN IF NOT EXISTS mfa_preferred_method mfa_method;

-- 3. 创建或替换用户索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 4. 删除旧的MFA因子表（如果存在）
DROP TABLE IF EXISTS user_mfa_factors CASCADE;

-- 5. 重新创建MFA因子表（使用枚举类型）
CREATE TABLE IF NOT EXISTS user_mfa_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type mfa_method NOT NULL,
    secret TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    -- 外键约束
    CONSTRAINT fk_user_mfa_factors_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
        
    -- 确保每个用户的每种MFA类型只有一条记录
    CONSTRAINT unique_user_mfa_type UNIQUE (user_id, type)
);

-- 6. 创建MFA因子表索引
CREATE INDEX IF NOT EXISTS idx_user_mfa_factors_user_id ON user_mfa_factors(user_id);
CREATE INDEX IF NOT EXISTS idx_user_mfa_factors_type ON user_mfa_factors(type::text);

-- 7. 删除旧的验证码表（如果存在）
DROP TABLE IF EXISTS user_verification_codes CASCADE;

-- 8. 重新创建验证码表
CREATE TABLE IF NOT EXISTS user_verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type VARCHAR(20) NOT NULL,
    code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- 约束条件
    CONSTRAINT fk_user_verification_codes_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE,
    CONSTRAINT user_verification_codes_type_check 
        CHECK (type IN ('app', 'sms', 'email')),
    CONSTRAINT user_verification_codes_code_length_check 
        CHECK (LENGTH(code) >= 4 AND LENGTH(code) <= 10)
);

-- 9. 创建验证码表索引
CREATE INDEX IF NOT EXISTS idx_user_verification_codes_user_id ON user_verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verification_codes_type ON user_verification_codes(type);
CREATE INDEX IF NOT EXISTS idx_user_verification_codes_expires_at ON user_verification_codes(expires_at);

-- 10. 创建MFA备份码表
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

-- 11. 创建备份码表索引
CREATE INDEX IF NOT EXISTS idx_user_mfa_backup_codes_user_id ON user_mfa_backup_codes(user_id);

-- 12. 配置RLS策略
-- MFA因子表
ALTER TABLE user_mfa_factors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "用户可以查看自己的MFA因子" ON user_mfa_factors;
CREATE POLICY "用户可以查看自己的MFA因子"
    ON user_mfa_factors
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "服务角色可以管理所有MFA因子" ON user_mfa_factors;
CREATE POLICY "服务角色可以管理所有MFA因子"
    ON user_mfa_factors
    FOR ALL
    TO service_role
    USING (true);

-- 验证码表
ALTER TABLE user_verification_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "用户可以查看自己的验证码" ON user_verification_codes;
CREATE POLICY "用户可以查看自己的验证码"
    ON user_verification_codes
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "服务角色可以管理所有验证码" ON user_verification_codes;
CREATE POLICY "服务角色可以管理所有验证码"
    ON user_verification_codes
    FOR ALL
    TO service_role
    USING (true);

-- 备份码表
ALTER TABLE user_mfa_backup_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "用户可以查看自己的备份码" ON user_mfa_backup_codes;
CREATE POLICY "用户可以查看自己的备份码"
    ON user_mfa_backup_codes
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "服务角色可以管理所有备份码" ON user_mfa_backup_codes;
CREATE POLICY "服务角色可以管理所有备份码"
    ON user_mfa_backup_codes
    FOR ALL
    TO service_role
    USING (true);

-- 13. 配置权限
REVOKE ALL ON user_mfa_factors FROM anon;
GRANT SELECT ON user_mfa_factors TO authenticated;

REVOKE ALL ON user_verification_codes FROM anon;
GRANT SELECT ON user_verification_codes TO authenticated;

REVOKE ALL ON user_mfa_backup_codes FROM anon;
GRANT SELECT ON user_mfa_backup_codes TO authenticated; 