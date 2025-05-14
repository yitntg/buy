-- 创建secrets表，用于安全存储应用程序配置

-- 1. 创建secrets架构（如果不存在）
CREATE SCHEMA IF NOT EXISTS secrets;

-- 2. 创建secrets表
CREATE TABLE IF NOT EXISTS secrets.secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 添加自动更新时间戳的触发器
CREATE OR REPLACE FUNCTION secrets.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_secrets_updated_at ON secrets.secrets;
CREATE TRIGGER trigger_update_secrets_updated_at
    BEFORE UPDATE ON secrets.secrets
    FOR EACH ROW
    EXECUTE FUNCTION secrets.update_updated_at_column();

-- 4. 添加默认秘钥（使用环境变量）
INSERT INTO secrets.secrets (name, value, description)
VALUES 
    ('PROJECT_URL', current_setting('app.settings.project_url', TRUE), '项目URL，用于触发器中发送请求'),
    ('FUNCTION_SECRET', current_setting('app.settings.function_secret', TRUE), '用于认证Edge Function的密钥'),
    ('EMAIL_SERVICE_KEY', current_setting('app.settings.email_service_key', TRUE), '邮件服务API密钥'),
    ('SMS_SERVICE_KEY', current_setting('app.settings.sms_service_key', TRUE), '短信服务API密钥')
ON CONFLICT (name) 
DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = NOW()
WHERE secrets.secrets.value IS NULL OR secrets.secrets.value = '';

-- 5. 配置访问权限
REVOKE ALL ON SCHEMA secrets FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA secrets FROM PUBLIC;

GRANT USAGE ON SCHEMA secrets TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA secrets TO service_role;

-- 6. 添加注释
COMMENT ON SCHEMA secrets IS '用于存储敏感配置信息的架构';
COMMENT ON TABLE secrets.secrets IS '敏感配置信息表，仅限服务角色访问';
COMMENT ON COLUMN secrets.secrets.name IS '配置项名称';
COMMENT ON COLUMN secrets.secrets.value IS '配置项值（敏感信息）';
COMMENT ON COLUMN secrets.secrets.description IS '配置项说明'; 