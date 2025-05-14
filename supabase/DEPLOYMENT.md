# Supabase 部署指南

## 数据库迁移

迁移文件的执行顺序如下：

1. 20240623000000_create_storage_policy_function.sql - 创建存储策略函数
2. 20240623000001_update_users_table.sql - 更新用户表
3. 20240623000002_unified_user_schema.sql - 统一用户模式
4. 20240623000003_create_user_permissions.sql - 创建用户权限表
5. 20240623000004_create_mfa_tables.sql - 创建MFA表
6. 20240625000010_create_product_tables.sql - 创建产品相关表
7. 20240625000011_create_comment_tables.sql - 创建评论相关表
8. 20240625000012_create_order_tables.sql - 创建订单相关表
9. 20240625000013_create_cart_tables.sql - 创建购物车相关表
10. 20240625000020_create_domain_events.sql - 创建领域事件表
11. 20240625000025_create_user_profiles.sql - 创建用户配置表
12. 20240625000029_create_secrets_table.sql - 创建密钥存储表
13. 20240625000030_create_user_triggers.sql - 创建用户相关触发器

### 本地开发和测试

```bash
# 启动本地Supabase开发环境
supabase start

# 应用迁移
supabase db reset

# 如果想只应用新的迁移
supabase db push
```

### 迁移到生产环境

```bash
# 生成生产环境的迁移SQL
supabase db push --db-url=YOUR_PRODUCTION_DB_URL

# 或者通过Supabase控制台应用迁移
# 1. 登录到Supabase控制台
# 2. 转到SQL编辑器
# 3. 逐个应用迁移文件
```

## Edge Functions

本项目包含以下Edge Function：

1. `create_user_profile` - 当新用户注册时自动创建用户配置记录

### 部署Edge Functions

```bash
# 部署所有Edge Functions
supabase functions deploy

# 部署特定的Edge Function
supabase functions deploy create_user_profile
```

### 配置数据库触发器密钥

20240625000030_create_user_triggers.sql 文件创建的触发器需要设置以下密钥：

1. PROJECT_URL - Supabase项目URL
2. FUNCTION_SECRET - 函数调用的密钥

在本地开发环境中设置：

```sql
-- 在SQL编辑器中运行
INSERT INTO secrets.secrets (name, value)
VALUES 
  ('PROJECT_URL', 'https://your-project-ref.supabase.co'),
  ('FUNCTION_SECRET', 'your-function-secret');
```

在生产环境中，通过Supabase控制台设置这些密钥。

## 设置数据库加密密钥

如果使用加密功能存储密钥值，需要设置数据库加密密钥：

```sql
-- 在SQL编辑器中以超级用户身份运行
ALTER DATABASE your_database_name SET app.encryption_key = 'your-secure-encryption-key';
```

## 设置Supabase环境变量

在Edge Function中使用了以下环境变量，需要在Supabase项目中设置：

```bash
# 在本地开发环境设置
supabase secrets set SUPABASE_URL=your_project_url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# 或在Supabase控制台设置
# 1. 转到项目设置
# 2. 选择API部分
# 3. 查找Service Role密钥并复制
# 4. 转到Edge Functions设置
# 5. 添加环境变量
```

## 安全注意事项

1. 所有表都启用了行级安全(RLS)策略
2. 使用Edge Function时需要谨慎保护服务角色密钥
3. 定期审查数据库权限和安全设置
4. 触发器使用SECURITY DEFINER模式，会以创建者的权限运行
5. secrets表存储敏感信息，只有service_role角色可以访问，不暴露给普通用户 