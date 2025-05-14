-- 添加备份码管理函数

-- 1. 创建生成备份码函数
CREATE OR REPLACE FUNCTION generate_backup_codes(
    p_user_id UUID,
    p_count INTEGER DEFAULT 10
)
RETURNS SETOF TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_code TEXT;
    v_hashed_code TEXT;
BEGIN
    -- 检查备份码表是否存在
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_mfa_backup_codes'
    ) THEN
        RAISE EXCEPTION '备份码表不存在，请先运行迁移创建表';
    END IF;

    -- 验证参数
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'user_id不能为空';
    END IF;
    
    IF p_count IS NULL OR p_count < 1 OR p_count > 100 THEN
        RAISE EXCEPTION 'count必须在1-100之间';
    END IF;

    -- 删除用户现有的所有备份码
    DELETE FROM user_mfa_backup_codes
    WHERE user_id = p_user_id;
    
    -- 生成新的备份码
    FOR i IN 1..p_count LOOP
        -- 生成格式为XXXX-XXXX-XXXX的备份码，其中X是数字或大写字母
        v_code := 
            substring(md5(random()::text) from 1 for 4) || '-' || 
            substring(md5(random()::text) from 1 for 4) || '-' || 
            substring(md5(random()::text) from 1 for 4);
        
        -- 转换为大写并只保留字母和数字
        v_code := upper(regexp_replace(v_code, '[^A-Z0-9\-]', 'A', 'g'));
        
        -- 创建哈希存储的备份码
        v_hashed_code := crypt(v_code, gen_salt('bf'));
        
        -- 存储哈希后的备份码
        INSERT INTO user_mfa_backup_codes (
            user_id,
            code,
            used
        ) VALUES (
            p_user_id,
            v_hashed_code,
            false
        );
        
        -- 返回明文备份码给调用者
        RETURN NEXT v_code;
    END LOOP;
    
    RETURN;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'generate_backup_codes错误: %', SQLERRM;
        RETURN;
END;
$$;

-- 2. 创建验证备份码函数
CREATE OR REPLACE FUNCTION verify_backup_code(
    p_user_id UUID,
    p_code TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_code_id UUID;
BEGIN
    -- 检查备份码表是否存在
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_mfa_backup_codes'
    ) THEN
        RAISE EXCEPTION '备份码表不存在，请先运行迁移创建表';
    END IF;

    -- 验证参数
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'user_id不能为空';
    END IF;
    
    IF p_code IS NULL THEN
        RAISE EXCEPTION 'code不能为空';
    END IF;

    -- 标准化输入的备份码
    p_code := upper(regexp_replace(p_code, '[^A-Z0-9\-]', '', 'g'));
    
    -- 查找匹配的备份码
    SELECT id INTO v_code_id
    FROM user_mfa_backup_codes
    WHERE 
        user_id = p_user_id AND 
        used = false AND
        code = crypt(p_code, code);
    
    -- 如果找到匹配的备份码
    IF v_code_id IS NOT NULL THEN
        -- 标记备份码为已使用
        UPDATE user_mfa_backup_codes
        SET 
            used = true,
            used_at = NOW()
        WHERE id = v_code_id;
        
        RETURN TRUE;
    END IF;
    
    RETURN FALSE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'verify_backup_code错误: %', SQLERRM;
        RETURN FALSE;
END;
$$;

-- 3. 检查用户剩余的未使用备份码数量
CREATE OR REPLACE FUNCTION count_unused_backup_codes(
    p_user_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- 检查备份码表是否存在
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_mfa_backup_codes'
    ) THEN
        RAISE EXCEPTION '备份码表不存在，请先运行迁移创建表';
    END IF;

    -- 验证参数
    IF p_user_id IS NULL THEN
        RAISE EXCEPTION 'user_id不能为空';
    END IF;

    -- 计算未使用的备份码数量
    SELECT COUNT(*) INTO v_count
    FROM user_mfa_backup_codes
    WHERE 
        user_id = p_user_id AND 
        used = false;
    
    RETURN v_count;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'count_unused_backup_codes错误: %', SQLERRM;
        RETURN 0;
END;
$$;

-- 4. 添加函数注释
COMMENT ON FUNCTION generate_backup_codes IS '为用户生成指定数量的MFA备份码，返回明文备份码';
COMMENT ON FUNCTION verify_backup_code IS '验证用户的MFA备份码，验证成功后会将备份码标记为已使用';
COMMENT ON FUNCTION count_unused_backup_codes IS '统计用户剩余的未使用MFA备份码数量';

-- 5. 授予函数执行权限
GRANT EXECUTE ON FUNCTION generate_backup_codes TO authenticated;
GRANT EXECUTE ON FUNCTION generate_backup_codes TO service_role;

GRANT EXECUTE ON FUNCTION verify_backup_code TO authenticated;
GRANT EXECUTE ON FUNCTION verify_backup_code TO service_role;

GRANT EXECUTE ON FUNCTION count_unused_backup_codes TO authenticated;
GRANT EXECUTE ON FUNCTION count_unused_backup_codes TO service_role; 