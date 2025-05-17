import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent, confirmPaymentIntent } from '@/lib/airwallex'
import { supabase } from '@/src/app/shared/infrastructure/lib/supabase'

/**
 * 创建Airwallex支付意向
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求数据
    const body = await request.json()
    const { 
      amount, 
      currency, 
      orderId, 
      customer, 
      returnUrl
    } = body
    
    if (!amount || !currency || !orderId || !customer || !returnUrl) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 调用Airwallex API创建支付意向
    const paymentIntent = await createPaymentIntent({
      amount, 
      currency, 
      orderId,
      customerInfo: customer,
      returnUrl
    })
    
    // 更新订单状态为"待支付"
    if (orderId) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ 
            payment_status: '待支付',
            payment_method: 'airwallex',
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId)
        
        if (error) {
          console.error('更新订单状态失败:', error)
        }
      } catch (dbError) {
        console.error('数据库更新失败:', dbError)
      }
    }
    
    return NextResponse.json({
      success: true,
      paymentIntent
    })
    
  } catch (error: any) {
    console.error('创建Airwallex支付意向失败:', error)
    return NextResponse.json(
      { 
        error: '创建支付意向失败', 
        details: error.message 
      },
      { status: 500 }
    )
  }
}

/**
 * 确认Airwallex支付意向
 */
export async function PUT(request: NextRequest) {
  try {
    // 解析请求数据
    const body = await request.json()
    const { paymentIntentId, paymentMethod } = body
    
    if (!paymentIntentId || !paymentMethod) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 确认支付意向
    const confirmResponse = await confirmPaymentIntent(paymentIntentId, {
      payment_method: paymentMethod
    })
    
    return NextResponse.json({
      success: true,
      confirmation: confirmResponse
    })
    
  } catch (error: any) {
    console.error('确认Airwallex支付意向失败:', error)
    return NextResponse.json(
      { 
        error: '确认支付意向失败', 
        details: error.message 
      },
      { status: 500 }
    )
  }
} 