-- 创建和启用必要的SQL扩展

-- 启用 pgcrypto 扩展用于加密函数
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 启用 http 扩展用于远程API调用
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- 启用 uuid-ossp 扩展用于UUID生成
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 启用 pg_stat_statements 扩展用于查询性能监控
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- 给扩展添加注释
COMMENT ON EXTENSION pgcrypto IS '提供加密函数，用于MFA备份码加密和密码哈希等';
COMMENT ON EXTENSION http IS '允许从PostgreSQL中发起HTTP请求，用于触发器中调用外部API';
COMMENT ON EXTENSION "uuid-ossp" IS '提供UUID生成函数，用于创建唯一标识符';
COMMENT ON EXTENSION pg_stat_statements IS '提供SQL查询性能监控功能，用于优化数据库查询'; 