import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/src/app/(shared)/types/supabase';

// 检查并提供默认值，避免在构建过程中报错
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// 检查是否缺少必要的环境变量并发出警告
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('警告: Supabase环境变量未配置，部分功能可能无法正常工作');
}

// 为服务器组件创建Supabase客户端
export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createSupabaseClient<Database>(
    supabaseUrl, 
    supabaseAnonKey
  );
} 