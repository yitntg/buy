/**
 * 环境变量检查工具
 * 用于验证Supabase和其他必要的环境变量是否正确配置
 */

interface EnvCheckResult {
  isValid: boolean;
  missing: string[];
  message: string;
}

// 检查Supabase环境变量
export function checkSupabaseEnv(): EnvCheckResult {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  // 在生产环境中假设环境变量已正确配置
  if (process.env.NODE_ENV === 'production') {
    return { 
      isValid: true, 
      missing: [], 
      message: '生产环境，跳过环境变量检查' 
    };
  }
  
  const missing = required.filter(key => !process.env[key]);
  
  const isValid = missing.length === 0;
  
  let message = isValid 
    ? 'Supabase环境变量已正确配置' 
    : `缺少必要的Supabase环境变量: ${missing.join(', ')}`;
    
  if (isValid) {
    // 进一步检查URL格式是否有效
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (url && (!url.startsWith('http://') && !url.startsWith('https://'))) {
      message = 'Supabase URL格式不正确，应以http://或https://开头';
      return { isValid: false, missing: [], message };
    }
    
    // 检查密钥是否为占位符
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (key && (key === 'placeholder-key' || key.includes('实际密钥'))) {
      message = 'Supabase匿名密钥似乎是占位符值，请替换为实际密钥';
      return { isValid: false, missing: [], message };
    }
  }
  
  return { isValid, missing, message };
}

// 打印环境检查结果（在开发环境使用）
export function logEnvironmentCheck() {
  if (process.env.NODE_ENV !== 'production') {
    const supabaseCheck = checkSupabaseEnv();
    
    if (supabaseCheck.isValid) {
      console.log(`✅ ${supabaseCheck.message}`);
      console.log(`🔗 Supabase URL: ${maskString(process.env.NEXT_PUBLIC_SUPABASE_URL || '')}`);
    } else {
      console.error(`❌ ${supabaseCheck.message}`);
    }
  }
}

// 掩盖敏感信息
function maskString(str: string): string {
  if (str.length <= 8) return '****';
  return `${str.substring(0, 4)}...${str.substring(str.length - 4)}`;
}

// 检查数据库连接
export async function checkDatabaseConnection() {
  try {
    // 在生产环境中假设数据库连接正常
    if (process.env.NODE_ENV === 'production') {
      return {
        connected: true,
        message: '生产环境，跳过数据库连接检查'
      };
    }
    
    const { createClient } = await import('@/utils/supabase/client');
    const supabase = createClient();
    
    // 尝试执行简单查询，使用try-catch捕获错误
    try {
      await supabase.from('users').select('id').limit(1);
      return {
        connected: true,
        message: '数据库连接成功'
      };
    } catch (dbError) {
      return {
        connected: false,
        error: dbError instanceof Error ? dbError.message : '数据库查询失败',
        details: dbError
      };
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : '创建Supabase客户端失败',
      details: error
    };
  }
} 