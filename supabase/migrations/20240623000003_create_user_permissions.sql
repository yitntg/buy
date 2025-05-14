-- 创建用户权限表，用于存储细粒度的权限配置

-- 用户权限表（引用auth.users表）
CREATE TABLE IF NOT EXISTS user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  granted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 外键约束（使用配置确保数据一致性但允许灵活的错误处理）
  CONSTRAINT fk_user_permissions_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE,
    
  -- 确保用户-资源-操作的唯一性
  CONSTRAINT unique_user_resource_action
    UNIQUE (user_id, resource, action)
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id 
ON user_permissions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_permissions_resource 
ON user_permissions(resource);

-- 创建复合索引用于常见查询模式
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_resource 
ON user_permissions(user_id, resource);

-- 添加内建的默认权限数据（可选）
INSERT INTO user_permissions (user_id, resource, action, granted)
SELECT 
  id, 'products', 'read', true
FROM 
  auth.users
ON CONFLICT (user_id, resource, action) 
DO NOTHING; 