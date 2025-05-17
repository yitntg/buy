import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/src/app/(shared)/types/supabase';

export function createClient() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // 检查环境变量
  if (!supabaseUrl || !supabaseKey) {
    console.warn('警告: Supabase环境变量未配置');
    console.warn('- NEXT_PUBLIC_SUPABASE_URL');
    console.warn('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    // 由于这是服务端代码，我们不能返回模拟客户端，必须抛出错误
    throw new Error('Supabase环境变量未配置');
  }

  try {
    return createServerClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch (error) {
              // 处理cookie设置错误
              console.error('设置cookie失败:', error);
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options });
            } catch (error) {
              // 处理cookie删除错误
              console.error('移除cookie失败:', error);
            }
          },
        },
        // 添加全局错误处理
        global: {
          fetch: (url, options = {}) => {
            // 只在开发环境记录详细日志
            if (process.env.NODE_ENV === 'development') {
              const timestamp = new Date().toISOString();
              console.log(`[Server] [${timestamp}] Supabase请求: ${url.toString().substring(0, 80)}...`);
            }
            
            // 使用原生fetch并添加错误捕获
            return fetch(url, options).catch(err => {
              console.error('[Server] Supabase请求失败:', err);
              throw err;
            });
          }
        }
      }
    );
  } catch (error) {
    console.error('创建服务端Supabase客户端失败:', error);
    throw error;
  }
} 
