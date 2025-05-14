-- 创建保存密钥的模式和表
CREATE SCHEMA IF NOT EXISTS secrets;

-- 创建secrets表存储应用密钥
CREATE TABLE IF NOT EXISTS secrets.secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加加密存储值的函数 (可选，如果需要额外安全性)
CREATE OR REPLACE FUNCTION secrets.encrypt_secret_value()
RETURNS TRIGGER AS $$
BEGIN
  -- 这里可以添加更复杂的加密逻辑
  -- 示例使用简单加密，生产环境应使用更强大的加密方法
  NEW.value = encode(encrypt(
    convert_to(NEW.value, 'utf8'),
    current_setting('app.encryption_key', true),
    'aes'
  ), 'hex');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 设置RLS，只有超级用户可以访问
ALTER TABLE secrets.secrets ENABLE ROW LEVEL SECURITY;

-- 限制访问权限
GRANT USAGE ON SCHEMA secrets TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA secrets TO service_role;
REVOKE ALL ON ALL TABLES IN SCHEMA secrets FROM anon, authenticated;
REVOKE USAGE ON SCHEMA secrets FROM anon, authenticated;

-- 添加secrets示例注释
COMMENT ON SCHEMA secrets IS '存储应用密钥的安全模式，仅限服务角色访问';
COMMENT ON TABLE secrets.secrets IS '存储应用密钥和配置，如API密钥、密码等';

-- 设置必要的环境变量说明
DO $$
BEGIN
  RAISE NOTICE '
  注意：使用secrets表需要设置以下环境变量：
  1. 如果使用加密功能，需设置 app.encryption_key 密钥：
     ALTER DATABASE your_db_name SET app.encryption_key = ''your-secure-key'';
  ';
END $$; 