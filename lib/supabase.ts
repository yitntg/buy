import { createClient } from '@supabase/supabase-js'

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

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

// 即使有错误信息，也创建客户端，以便应用程序不会崩溃
// 但如果缺少有效凭据，API调用将失败
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    // 当API请求失败时添加更有用的错误信息
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          'X-Client-Info': 'supabase-js/2.0.0',
        },
      }).then(async (response) => {
        if (!response.ok) {
          const responseText = await response.text()
          console.error(`Supabase 请求失败 (${response.status}): ${responseText}`)
          // 添加一些常见错误的诊断提示
          if (response.status === 401) {
            console.error('提示: 401错误通常表示密钥无效或过期。请检查Supabase ANON_KEY是否正确。')
          } else if (response.status === 403) {
            console.error('提示: 403错误通常表示权限问题。检查RLS策略是否限制了访问。')
          } else if (response.status === 404) {
            console.error('提示: 404错误表示资源不存在。检查表名或API路径是否正确。')
          } else if (response.status === 500) {
            console.error('提示: 500错误表示服务器内部错误。可能是Supabase实例问题或SQL语法错误。')
          }
        }
        return response
      })
    }
  }
}) 