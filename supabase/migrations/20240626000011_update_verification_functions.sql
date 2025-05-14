-- 更新验证码相关函数，确保与新的表结构兼容

-- 1. 创建或替换验证码创建函数
CREATE OR REPLACE FUNCTION create_verification_code(
    p_user_id UUID,
    p_type VARCHAR(20),
    p_code VARCHAR(10),
    p_expires_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    expire_time TIMESTAMP WITH TIME ZONE;
BEGIN
    -- 检查user_verification_codes表是否存在
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_verification_codes'
    ) THEN
        RAISE EXCEPTION '验证码表不存在，请先运行迁移创建表';
    END IF;

    -- 验证参数
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'user_id不能为空';
    END IF;
    
    IF p_type IS NULL OR p_type NOT IN ('app', 'sms', 'email') THEN
        RAISE EXCEPTION 'type必须是app、sms或email';
    END IF;
    
    IF p_code IS NULL OR LENGTH(p_code) < 4 OR LENGTH(p_code) > 10 THEN
        RAISE EXCEPTION 'code长度必须在4-10个字符之间';
    END IF;

    -- 设置过期时间
    expire_time := NOW() + (p_expires_minutes || ' minutes')::INTERVAL;
    
    -- 删除同类型的旧验证码
    DELETE FROM user_verification_codes
    WHERE user_id = p_user_id AND type = p_type;
    
    -- 插入新验证码
    INSERT INTO user_verification_codes (
        user_id,
        type,
        code,
        created_at,
        expires_at
    ) VALUES (
        p_user_id,
        p_type,
        p_code,
        NOW(),
        expire_time
    );
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'create_verification_code错误: %', SQLERRM;
        RETURN FALSE;
END;
$$;

-- 2. 创建或替换验证码验证函数
CREATE OR REPLACE FUNCTION verify_code(
    p_user_id UUID,
    p_type VARCHAR(20),
    p_code VARCHAR(10)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    code_record RECORD;
BEGIN
    -- 检查user_verification_codes表是否存在
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_verification_codes'
    ) THEN
        RAISE EXCEPTION '验证码表不存在，请先运行迁移创建表';
    END IF;

    -- 验证参数
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'user_id不能为空';
    END IF;
    
    IF p_type IS NULL OR p_type NOT IN ('app', 'sms', 'email') THEN
        RAISE EXCEPTION 'type必须是app、sms或email';
    END IF;
    
    IF p_code IS NULL THEN
        RAISE EXCEPTION 'code不能为空';
    END IF;

    -- 查找匹配的验证码记录
    SELECT * 
    INTO code_record
    FROM user_verification_codes
    WHERE 
        user_id = p_user_id 
        AND type = p_type 
        AND code = p_code;
        
    -- 检查是否找到记录
    IF code_record IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- 检查验证码是否过期
    IF code_record.expires_at < NOW() THEN
        -- 删除过期的验证码
        DELETE FROM user_verification_codes
        WHERE id = code_record.id;
        
        RETURN FALSE;
    END IF;
    
    -- 验证码有效，删除使用过的验证码
    DELETE FROM user_verification_codes
    WHERE id = code_record.id;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'verify_code错误: %', SQLERRM;
        RETURN FALSE;
END;
$$;

-- 3. 添加自动清理过期验证码的函数和触发器
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 删除过期的验证码
    DELETE FROM user_verification_codes
    WHERE expires_at < NOW();
    RETURN NULL;
END;
$$;

-- 删除已存在的触发器（如果有）
DROP TRIGGER IF EXISTS trigger_cleanup_expired_verification_codes ON user_verification_codes;

-- 创建新的触发器
CREATE TRIGGER trigger_cleanup_expired_verification_codes
    AFTER INSERT ON user_verification_codes
    EXECUTE FUNCTION cleanup_expired_verification_codes();

-- 4. 添加函数注释
COMMENT ON FUNCTION create_verification_code IS '为用户创建一次性验证码，会自动删除同类型的旧验证码';
COMMENT ON FUNCTION verify_code IS '验证用户的一次性验证码，验证成功后会删除该验证码';
COMMENT ON FUNCTION cleanup_expired_verification_codes IS '自动清理过期的验证码';

-- 5. 授予函数执行权限
GRANT EXECUTE ON FUNCTION create_verification_code TO authenticated;
GRANT EXECUTE ON FUNCTION create_verification_code TO service_role;

GRANT EXECUTE ON FUNCTION verify_code TO authenticated;
GRANT EXECUTE ON FUNCTION verify_code TO service_role; 