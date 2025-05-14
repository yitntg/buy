import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// 检查并提供默认值，避免在构建过程中报错
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// 检查是否缺少必要的环境变量并发出警告
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('警告: Supabase环境变量未配置，部分功能可能无法正常工作');
}

// 创建Supabase客户端
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    fetch: (url, options = {}) => {
      // 在开发环境下添加请求日志
      if (process.env.NODE_ENV === 'development') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Supabase共享客户端请求: ${url.toString().substring(0, 80)}...`);
      }
      
      // 使用原生fetch，添加错误处理
      return fetch(url, options).catch(err => {
        console.error('Supabase请求失败:', err);
        throw err;
      });
    }
  }
});

// 获取全局单例客户端
export function getSupabaseClient() {
  return supabase;
} 