// 在用户注册时自动创建用户配置记录的Edge Function
// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @deno-types="https://esm.sh/@supabase/supabase-js@2/dist/module/index.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface UserRecord {
  id: string
  email: string
  [key: string]: any
}

interface EventPayload {
  type: string
  record: UserRecord
  [key: string]: any
}

// 创建一个Supabase客户端（带服务器角色权限）
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req: Request) => {
  try {
    const payload = await req.json() as EventPayload
    
    // 仅在用户是通过邮件和密码新注册时处理
    const eventType = payload.type
    const { id, email } = payload.record
    
    if (eventType === 'INSERT' && email) {
      try {
        // 创建用户配置记录
        const { data, error } = await supabaseAdmin
          .from('users')
          .insert({
            id,
            theme_preference: 'system',
            language_preference: 'zh-CN',
            notification_preferences: {
              email: true,
              push: true,
              sms: false
            },
            last_viewed_products: [],
            viewed_products_history: {
              items: [],
              lastUpdated: new Date().toISOString()
            }
          })
        
        if (error) {
          console.error('Error creating user profile:', error)
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          })
        }
        
        console.log(`成功为用户 ${id} 创建配置记录`)
        
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      } catch (err: any) {
        console.error('处理请求时出错:', err)
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }
    
    // 如果不是INSERT事件，只返回成功响应
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err: any) {
    console.error('解析请求时出错:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}) 