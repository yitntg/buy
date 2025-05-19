'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/src/app/(shared)/contexts/CartContext'
import { formatCurrency } from '@/src/app/(shared)/utils/formatters'

export default function CheckoutClient() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    paymentMethod: 'alipay',
    shippingMethod: 'standard'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // 这里应该调用实际的订单创建 API
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     items,
      //     totalPrice,
      //     shippingInfo: {
      //       name: formData.name,
      //       phone: formData.phone,
      //       address: `${formData.province} ${formData.city} ${formData.address}`,
      //       zipCode: formData.zipCode
      //     },
      //     paymentMethod: formData.paymentMethod,
      //     shippingMethod: formData.shippingMethod
      //   })
      // })
      
      // if (!response.ok) {
      //   throw new Error('创建订单失败')
      // }
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 清空购物车
      clearCart()
      
      // 显示成功消息
      alert('订单已成功提交！')
      
      // 重定向到订单确认页
      router.push('/account/orders')
    } catch (error) {
      console.error('提交订单时出错:', error)
      alert('提交订单失败，请稍后重试')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">购物车为空</h1>
          <p className="text-gray-600 mb-6">您的购物车中没有商品，请先添加商品后再进行结算。</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            去购物
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">确认订单</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 收货信息 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">收货信息</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  收货人姓名
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  联系电话
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  详细地址
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  省份
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">请选择省份</option>
                  <option value="北京">北京</option>
                  <option value="上海">上海</option>
                  <option value="广东">广东</option>
                  {/* 添加更多省份选项 */}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  城市
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">请选择城市</option>
                  <option value="北京">北京</option>
                  <option value="上海">上海</option>
                  <option value="广州">广州</option>
                  {/* 添加更多城市选项 */}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮政编码
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          
          {/* 配送方式 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">配送方式</h2>
            
            <div className="space-y-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="standard"
                  checked={formData.shippingMethod === 'standard'}
                  onChange={handleInputChange}
                  className="text-primary"
                />
                <div className="ml-3 flex-1">
                  <div className="font-medium">标准配送</div>
                  <div className="text-sm text-gray-600">预计3-5天送达</div>
                </div>
                <div className="text-gray-600">免费</div>
              </label>
              
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="express"
                  checked={formData.shippingMethod === 'express'}
                  onChange={handleInputChange}
                  className="text-primary"
                />
                <div className="ml-3 flex-1">
                  <div className="font-medium">快递配送</div>
                  <div className="text-sm text-gray-600">预计1-2天送达</div>
                </div>
                <div className="text-gray-600">¥15</div>
              </label>
            </div>
          </div>
          
          {/* 支付方式 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">支付方式</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="alipay"
                  checked={formData.paymentMethod === 'alipay'}
                  onChange={handleInputChange}
                  className="text-primary"
                />
                <div className="ml-3">
                  <div className="font-medium">支付宝</div>
                </div>
              </label>
              
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wechat"
                  checked={formData.paymentMethod === 'wechat'}
                  onChange={handleInputChange}
                  className="text-primary"
                />
                <div className="ml-3">
                  <div className="font-medium">微信支付</div>
                </div>
              </label>
            </div>
          </div>
          
          {/* 订单金额 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">订单金额</h2>
            
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>商品金额</span>
                <span>¥{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>运费</span>
                <span>¥{formData.shippingMethod === 'express' ? '15.00' : '0.00'}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>实付金额</span>
                <span className="text-primary">
                  ¥{formatCurrency(totalPrice + (formData.shippingMethod === 'express' ? 15 : 0))}
                </span>
              </div>
            </div>
          </div>
          
          {/* 提交按钮 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '提交中...' : '提交订单'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 