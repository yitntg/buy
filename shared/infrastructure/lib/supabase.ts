import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 检查必要环境变量
if (!supabaseUrl || !supabaseKey) {
  console.warn('警告: Supabase环境变量未配置，部分功能可能无法正常工作');
}

// 创建Supabase客户端
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (url, options = {}) => {
      // 在开发环境下添加请求日志
      if (process.env.NODE_ENV === 'development') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Supabase直接请求: ${url.toString().substring(0, 80)}...`);
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