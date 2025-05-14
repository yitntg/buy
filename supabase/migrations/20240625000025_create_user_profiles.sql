-- 创建用户配置表，用于存储用户的偏好设置
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_preference VARCHAR(20) DEFAULT 'system', -- light, dark, system
  language_preference VARCHAR(10) DEFAULT 'zh-CN',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}'::jsonb,
  address_book JSONB,
  payment_methods JSONB,
  last_viewed_products UUID[] DEFAULT '{}',
  viewed_products_history JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_profiles_theme ON user_profiles(theme_preference);
CREATE INDEX IF NOT EXISTS idx_user_profiles_language ON user_profiles(language_preference);

-- 添加注释
COMMENT ON TABLE user_profiles IS '用户配置表，存储用户的偏好设置和历史记录';
COMMENT ON COLUMN user_profiles.theme_preference IS '主题偏好 (光模式, 暗模式, 系统)';
COMMENT ON COLUMN user_profiles.notification_preferences IS '通知偏好，如邮件、推送、短信等';
COMMENT ON COLUMN user_profiles.last_viewed_products IS '最近查看的产品ID数组';
COMMENT ON COLUMN user_profiles.viewed_products_history IS '产品查看历史记录，包含时间戳';

-- 自动更新updated_at列的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 