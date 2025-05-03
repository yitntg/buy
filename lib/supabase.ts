import { createClient } from '@supabase/supabase-js'

// 获取环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 检查环境变量是否存在
if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL或密钥缺失。请确保在Vercel项目设置中正确配置环境变量或在本地.env文件中设置。')
  
  // 在开发环境中提供更详细的错误信息
  if (process.env.NODE_ENV === 'development') {
    console.info('开发环境提示：请在项目根目录创建.env文件，包含以下内容：')
    console.info('NEXT_PUBLIC_SUPABASE_URL=您的Supabase项目URL')
    console.info('NEXT_PUBLIC_SUPABASE_ANON_KEY=您的Supabase匿名密钥')
  }
}

// 无论是否有错误信息，都创建客户端，这样应用程序不会崩溃
// 但如果缺少有效凭据，API调用将失败
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true
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
          console.error(`Supabase 请求失败 (${response.status}): ${await response.text()}`)
        }
        return response
      })
    }
  }
}) 