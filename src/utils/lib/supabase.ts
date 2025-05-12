import { createClient } from '@supabase/supabase-js';

// 确保环境变量存在
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('缺少Supabase配置，存储服务可能无法正常工作');
}

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseKey); 