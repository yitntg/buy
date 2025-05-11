import { createClient } from '@supabase/supabase-js'

// 使用环境变量获取Supabase配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 创建模拟客户端的功能
function createMockClient() {
  console.warn('使用模拟Supabase客户端 - 所有操作将返回空数据')
  
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
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  }
}

// 创建Supabase客户端或模拟客户端
export const supabase = (!supabaseUrl || !supabaseKey) 
  ? createMockClient() 
  : createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })

// 简化的诊断信息（只在开发环境下输出详细信息）
if (process.env.NODE_ENV === 'development') {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('=== Supabase配置警告 ===')
    console.warn('未配置Supabase环境变量，使用模拟客户端')
    console.warn('所有数据库操作将返回空数据')
    console.warn('如需连接真实数据库，请配置以下环境变量:')
    console.warn('- NEXT_PUBLIC_SUPABASE_URL')
    console.warn('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  } else {
    console.log('Supabase已配置，使用实际客户端')
  }
}

// 导出增强型客户端（也使用模拟客户端机制）
export const supabaseEnhanced = (!supabaseUrl || !supabaseKey)
  ? createMockClient()
  : createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })

// 检查环境变量是否已配置
if (!supabaseUrl || !supabaseKey) {
  console.error('未配置Supabase环境变量。请确保设置了以下环境变量：')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// 确认凭证
console.log('Supabase配置信息:')
console.log('- URL:', supabaseUrl)
console.log('- API密钥存在:', !!supabaseKey)
console.log('- API密钥前10位:', supabaseKey.substring(0, 10) + '...')

// 诊断URL和密钥
let urlDiagnostic = '正常'
let keyDiagnostic = '正常'

// 检查URL格式
if (!supabaseUrl) {
  urlDiagnostic = '缺失'
  console.error('Supabase URL缺失。请确保环境变量中设置了NEXT_PUBLIC_SUPABASE_URL。')
} else if (!supabaseUrl.startsWith('https://')) {
  urlDiagnostic = '格式错误 - 应以https://开头'
  console.error('Supabase URL格式错误。应以https://开头。')
} else if (!supabaseUrl.includes('.supabase.co')) {
  urlDiagnostic = '格式可能异常 - 应包含.supabase.co'
  console.warn('Supabase URL格式可能异常。通常应包含.supabase.co。')
}

// 检查密钥格式
if (!supabaseKey) {
  keyDiagnostic = '缺失'
  console.error('Supabase密钥缺失。请确保环境变量中设置了NEXT_PUBLIC_SUPABASE_ANON_KEY。')
} else if (supabaseKey.length < 30) {
  keyDiagnostic = '长度异常 - 密钥通常较长'
  console.warn('Supabase密钥长度异常。通常Supabase密钥较长。')
}

// 如果有错误，在控制台显示诊断信息
if (urlDiagnostic !== '正常' || keyDiagnostic !== '正常') {
  console.info('=== Supabase连接诊断 ===')
  console.info(`URL: ${urlDiagnostic}`)
  console.info(`KEY: ${keyDiagnostic}`)
  
  // 在开发环境中提供更详细的错误信息
  if (process.env.NODE_ENV === 'development') {
    console.info('\n开发环境提示：请在项目根目录创建.env.local文件，包含以下内容：')
    console.info('NEXT_PUBLIC_SUPABASE_URL=您的Supabase项目URL')
    console.info('NEXT_PUBLIC_SUPABASE_ANON_KEY=您的Supabase匿名密钥')
    console.info('\n您可以通过以下步骤获取这些值：')
    console.info('1. 登录Supabase控制台 (https://app.supabase.io)')
    console.info('2. 选择您的项目')
    console.info('3. 在项目设置中，点击"API"选项卡')
    console.info('4. 复制"Project URL"和"anon public"的值')
  }
}

// 创建增强型客户端
export const supabaseEnhanced = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    // 当API请求失败时添加更有用的错误信息
    fetch: (url, options = {}) => {
      // 添加请求时间戳
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Supabase请求: ${url.toString().substring(0, 100)}...`);
      
      // 确保请求头存在并添加默认请求头
      const customHeaders = options.headers as Record<string, string> || {};
      
      // 创建新的headers对象
      const headers: Record<string, string> = {
        'X-Client-Info': 'supabase-js/2.0.0',
        'Content-Type': 'application/json',
        ...customHeaders
      };
      
      // 确保包含apikey头
      if (!headers['apikey'] && !headers['Authorization']) {
        headers['apikey'] = supabaseKey;
        headers['Authorization'] = `Bearer ${supabaseKey}`;
      }
      
      return fetch(url, {
        ...options,
        headers,
      }).then(async (response) => {
        // 记录请求结果
        console.log(`[${timestamp}] Supabase响应状态: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
          const responseText = await response.text();
          console.error(`Supabase 请求失败 (${response.status}): ${responseText}`);
          
          // 添加一些常见错误的诊断提示
          if (response.status === 401) {
            console.error('提示: 401错误通常表示密钥无效或过期。请检查Supabase ANON_KEY是否正确。');
          } else if (response.status === 403) {
            console.error('提示: 403错误通常表示权限问题。检查RLS策略是否限制了访问。您可能需要在Supabase控制台中调整表的RLS设置。');
          } else if (response.status === 404) {
            console.error('提示: 404错误表示资源不存在。检查表名或API路径是否正确。表可能尚未创建。');
          } else if (response.status === 500) {
            console.error('提示: 500错误表示服务器内部错误。可能是Supabase实例问题或SQL语法错误。');
          }
        }
        return response;
      }).catch(err => {
        console.error(`[${timestamp}] Supabase网络错误:`, err);
        throw err;
      });
    }
  }
}) 