'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// Header import removed
// Footer import removed

// 订单接口
interface OrderItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface Order {
  items: OrderItem[]
  totalPrice: number
  addressId: string
  paymentMethod: string
  orderDate: string
  orderNumber?: string
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // 从localStorage获取订单信息
    const savedOrder = localStorage.getItem('lastOrder')
    
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder) as Order
        
        // 生成随机订单号
        const orderNumber = `ORD${Date.now().toString().substring(5)}${Math.floor(Math.random() * 1000)}`
        setOrder({
          ...parsedOrder,
          orderNumber
        })
      } catch (error) {
        console.error('解析订单信息失败:', error)
      }
    } else {
      // 如果没有订单信息，重定向到首页
      router.push('/')
    }
    
    setLoading(false)
  }, [router])
  
  if (loading) {
    return (
      <main className="min-h-screen py-12 bg-light">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">加载订单信息...</p>
            </div>
          </div>
        </main>
    )
  }
  
  if (!order) {
    return (
      <main className="min-h-screen py-12 bg-light">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg p-8 shadow-sm text-center">
              <div className="text-5xl mb-4">😕</div>
              <h1 className="text-2xl font-bold mb-4">未找到订单信息</h1>
              <p className="text-gray-600 mb-6">
                抱歉，我们无法找到您的订单信息。这可能是因为会话已过期或订单未成功提交。
              </p>
              <Link 
                href="/"
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 inline-block"
              >
                返回首页
              </Link>
            </div>
          </div>
        </main>
    )
  }
  
  return (
    <main className="min-h-screen py-12 bg-light">
        <div className="container mx-auto px-4">
          {/* 成功提示 */}
          <div className="bg-white rounded-lg p-8 shadow-sm text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">订单提交成功！</h1>
            <p className="text-gray-600 mb-0">
              感谢您的购买，您的订单已成功提交。
            </p>
          </div>
          
          {/* 订单详情 */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-lg font-medium mb-4">订单详情</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between pb-3 border-b">
                <span className="text-gray-600">订单编号</span>
                <span className="font-medium">{order.orderNumber}</span>
              </div>
              
              <div className="flex justify-between pb-3 border-b">
                <span className="text-gray-600">下单时间</span>
                <span>{new Date(order.orderDate).toLocaleString('zh-CN')}</span>
              </div>
              
              <div className="flex justify-between pb-3 border-b">
                <span className="text-gray-600">支付方式</span>
                <span>
                  {order.paymentMethod === 'alipay' && '支付宝'}
                  {order.paymentMethod === 'wechat' && '微信支付'}
                  {order.paymentMethod === 'card' && '银行卡'}
                </span>
              </div>
              
              <div className="flex justify-between pb-3 border-b">
                <span className="text-gray-600">订单金额</span>
                <span className="font-medium text-primary">¥{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* 商品清单 */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-lg font-medium mb-4">商品清单</h2>
            
            <div className="divide-y">
              {order.items.map(item => (
                <div key={item.id} className="py-4 flex items-center">
                  <div className="w-16 h-16 relative bg-gray-100 rounded overflow-hidden mr-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="text-gray-500 text-sm mt-1">数量: {item.quantity}</div>
                  </div>
                  
                  <div className="text-primary font-medium">
                    ¥{item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-center"
            >
              继续购物
            </Link>
            
            <Link 
              href="/account/orders"
              className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 text-center"
            >
              查看订单
            </Link>
          </div>
        </div>
      </main>
  )
} 