import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 检查环境变量
const envVarsPresent = supabaseUrl && supabaseKey;

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
        console.log(`[${timestamp}] Supabase请求: ${url.toString().substring(0, 80)}...`);
      }
      
      // 检查环境变量
      if (!envVarsPresent) {
        console.error('Supabase环境变量缺失，请检查.env.local文件');
        console.error('请运行 node scripts/fix-config.js 来修复配置');
        
        // 在开发环境中，抛出明确的错误
        if (process.env.NODE_ENV === 'development') {
          throw new Error('Supabase配置错误: 环境变量缺失');
        }
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
  // 添加环境变量检查
  if (!envVarsPresent) {
    console.warn('警告: Supabase环境变量未配置，请运行 node scripts/fix-config.js 来修复配置');
  }
  
  return supabase;
}

// 辅助函数，检查Supabase配置
export function checkSupabaseConfig() {
  return {
    isConfigured: envVarsPresent,
    url: supabaseUrl ? '已配置' : '未配置',
    key: supabaseKey ? '已配置' : '未配置'
  };
} 