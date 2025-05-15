import { NextRequest, NextResponse } from 'next/server'
import { getPaymentIntent } from '@/lib/airwallex'
import { supabase } from '@/shared/infrastructure/lib/supabase'

/**
 * 更新订单状态
 */
async function updateOrderStatus(orderId: string, status: string, paymentInfo?: any) {
  try {
    // 更新订单支付状态
    const { error } = await supabase
      .from('orders')
      .update({ 
        payment_status: status,
        status: status === 'paid' ? '待发货' : status === 'payment_canceled' ? '已取消' : '待付款',
        payment_info: paymentInfo ? JSON.stringify(paymentInfo) : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
    
    if (error) {
      console.error(`更新订单 ${orderId} 状态失败:`, error)
      throw error
    }
    
    return true
  } catch (error) {
    console.error(`更新订单 ${orderId} 状态失败:`, error)
    return false
  }
}

/**
 * 保存支付交易记录
 */
async function savePaymentTransaction(transactionData: any) {
  try {
    // 在实际项目中，这里应该保存交易记录到数据库
    console.log(`保存支付交易:`, transactionData)
    
    // 可以使用supabase保存交易记录
    const { error } = await supabase
      .from('payment_transactions')
      .insert([{
        order_id: transactionData.orderId,
        payment_id: transactionData.paymentId,
        method: transactionData.method,
        amount: transactionData.amount,
        currency: transactionData.currency,
        status: transactionData.status,
        created_at: new Date().toISOString()
      }])
    
    if (error) {
      console.error('保存支付交易记录失败:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('保存支付交易记录失败:', error)
    return false
  }
}

/**
 * Airwallex支付回调处理
 */
export async function GET(request: NextRequest) {
  try {
    // 从URL获取参数
    const searchParams = request.nextUrl.searchParams
    const paymentIntentId = searchParams.get('payment_intent_id')
    const orderId = searchParams.get('order_id')
    const status = searchParams.get('status')
    
    // 参数验证
    if (!paymentIntentId || !orderId) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }
    
    // 如果请求被取消
    if (status === 'canceled') {
      // 更新订单状态为已取消
      await updateOrderStatus(orderId, 'payment_canceled')
      
      // 重定向到订单确认页面，带上取消状态
      return NextResponse.redirect(
        `${request.headers.get('origin') || ''}/checkout/confirmation?orderId=${orderId}&status=canceled`
      )
    }
    
    // 验证支付状态 - 调用Airwallex API
    const paymentIntent = await getPaymentIntent(paymentIntentId)
    
    // 检查支付状态
    if (paymentIntent.status === 'SUCCEEDED') {
      // 支付成功，更新订单状态
      const paymentInfo = {
        paymentIntentId: paymentIntentId,
        paymentMethod: 'airwallex',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        timestamp: new Date().toISOString()
      }
      
      await updateOrderStatus(orderId, 'paid', paymentInfo)
      
      // 保存支付交易记录
      await savePaymentTransaction({
        orderId,
        paymentId: paymentIntentId,
        method: 'airwallex',
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'success',
        timestamp: new Date().toISOString()
      })
      
      // 重定向到订单确认页面
      return NextResponse.redirect(
        `${request.headers.get('origin') || ''}/checkout/confirmation?orderId=${orderId}`
      )
    } else {
      // 支付失败或处理中
      const status = paymentIntent.status === 'REQUIRES_PAYMENT_METHOD' ? 'payment_failed' : 'payment_processing'
      await updateOrderStatus(orderId, status)
      
      // 重定向到订单确认页面，带上状态
      return NextResponse.redirect(
        `${request.headers.get('origin') || ''}/checkout/confirmation?orderId=${orderId}&status=${status}`
      )
    }
  } catch (error: any) {
    console.error('处理Airwallex支付回调失败:', error)
    
    // 重定向到错误页面
    return NextResponse.redirect(
      `${request.headers.get('origin') || ''}/checkout/error?message=${encodeURIComponent('支付处理失败，请联系客服')}`
    )
  }
} 