-- 合并之前的多个迁移文件，统一users表结构

-- 创建用户角色枚举（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_type 
        WHERE typname = 'user_role'
    ) THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin');
    END IF;
END $$;

-- 更新用户表结构（使用IF NOT EXISTS确保可以重复运行）
ALTER TABLE users
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS join_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- 设置默认角色（安全方式，检查是否已有角色值）
UPDATE users 
SET role = 'user' 
WHERE role IS NULL;

-- 创建或替换索引（如果不存在）
DROP INDEX IF EXISTS idx_users_role;
CREATE INDEX idx_users_role ON users(role);

-- 添加其他必要索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username); 