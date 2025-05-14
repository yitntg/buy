import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // 检查环境变量
  if (!supabaseUrl || !supabaseKey) {
    console.warn('警告: Supabase环境变量未配置');
    console.warn('- NEXT_PUBLIC_SUPABASE_URL');
    console.warn('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    // 返回模拟客户端，避免在未配置时崩溃
    return createMockClient();
  }
  
  try {
    return createBrowserClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'supabase.auth.token',
          flowType: 'pkce'
        },
        global: {
          // 添加请求日志和错误捕获
          fetch: (url, options = {}) => {
            // 只在开发环境记录详细日志
            if (process.env.NODE_ENV === 'development') {
              const timestamp = new Date().toISOString();
              console.log(`[${timestamp}] Supabase请求: ${url.toString().substring(0, 80)}...`);
            }
            
            // 使用原生fetch
            return fetch(url, options).catch(err => {
              console.error('Supabase请求失败:', err);
              throw err;
            });
          }
        }
      }
    );
  } catch (error) {
    console.error('创建Supabase客户端失败:', error);
    return createMockClient();
  }
}

// 创建模拟客户端函数（在环境变量缺失或客户端创建失败时使用）
function createMockClient() {
  if (process.env.NODE_ENV === 'development') {
    console.warn('使用模拟Supabase客户端 - 所有操作将返回空数据');
  }
  
  // 返回一个模拟对象，所有方法都返回空数据
  return {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
          eq: () => Promise.resolve({ data: [], error: null }),
          in: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        eq: () => Promise.resolve({ data: [], error: null }),
        in: () => Promise.resolve({ data: [], error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
        match: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
        match: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    rpc: () => Promise.resolve({ data: null, error: null }),
  };
} 