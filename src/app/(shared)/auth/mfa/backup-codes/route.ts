import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/app/(shared)/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const bodyText = await request.text()
    let data
    
    try {
      data = JSON.parse(bodyText)
    } catch (jsonError) {
      return NextResponse.json({
        error: '无效的JSON数据',
        details: '请求体不是有效的JSON格式'
      }, { status: 400 })
    }
    
    const { action, count = 10 } = data
    
    // 验证操作类型
    if (!action || !['generate', 'count', 'verify'].includes(action)) {
      return NextResponse.json(
        { error: '无效的操作类型，必须是generate、count或verify' },
        { status: 400 }
      )
    }
    
    // 创建服务端Supabase客户端
    const supabase = createClient()
    
    // 获取当前会话，确保用户已登录
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: '未授权，请先登录' },
        { status: 401 }
      )
    }
    
    const userId = session.user.id
    
    // 检查用户是否已启用MFA
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('mfa_enabled, mfa_verified')
      .eq('id', userId)
      .single()
    
    if (userError || !userData) {
      return NextResponse.json(
        { error: '获取用户信息失败' },
        { status: 500 }
      )
    }
    
    // 对于生成和计数操作，要求MFA已启用
    if ((action === 'generate' || action === 'count') && (!userData.mfa_enabled || !userData.mfa_verified)) {
      return NextResponse.json(
        { error: '用户尚未启用MFA，无法管理备份码' },
        { status: 400 }
      )
    }
    
    // 根据操作类型执行不同逻辑
    if (action === 'generate') {
      // 生成新的备份码
      const { data: backupCodes, error: genError } = await supabase.rpc(
        'generate_backup_codes',
        {
          p_user_id: userId,
          p_count: count > 0 && count <= 20 ? count : 10
        }
      )
      
      if (genError) {
        console.error('生成备份码失败:', genError)
        return NextResponse.json(
          { error: '生成备份码失败' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        success: true,
        backupCodes
      })
      
    } else if (action === 'count') {
      // 获取未使用的备份码数量
      const { data: unusedCount, error: countError } = await supabase.rpc(
        'count_unused_backup_codes',
        {
          p_user_id: userId
        }
      )
      
      if (countError) {
        console.error('获取备份码数量失败:', countError)
        return NextResponse.json(
          { error: '获取备份码数量失败' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        success: true,
        count: unusedCount
      })
      
    } else if (action === 'verify') {
      // 验证备份码
      const { code } = data
      
      if (!code) {
        return NextResponse.json(
          { error: '备份码不能为空' },
          { status: 400 }
        )
      }
      
      // 验证备份码
      const { data: isValid, error: verifyError } = await supabase.rpc(
        'verify_backup_code',
        {
          p_user_id: userId,
          p_code: code
        }
      )
      
      if (verifyError) {
        console.error('验证备份码失败:', verifyError)
        return NextResponse.json(
          { error: '验证备份码失败' },
          { status: 500 }
        )
      }
      
      if (!isValid) {
        return NextResponse.json(
          { error: '无效的备份码' },
          { status: 400 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: '备份码验证成功'
      })
    }
    
    // 不应该运行到这里
    return NextResponse.json(
      { error: '未知操作' },
      { status: 400 }
    )
    
  } catch (error: any) {
    console.error('备份码管理错误:', error)
    return NextResponse.json({ 
      error: '备份码操作失败', 
      details: error instanceof Error ? error.message : '未知错误' 
    }, { status: 500 })
  }
} 
