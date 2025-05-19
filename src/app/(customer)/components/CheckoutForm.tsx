'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/src/app/(shared)/contexts/CartContext'
import { useAuth } from '@/src/app/(shared)/contexts/AuthContext'
import { formatCurrency } from '@/src/app/(shared)/utils/formatters'
import AirwallexPayment from '@/src/app/(customer)/components/AirwallexPayment'

// 地址接口
interface Address {
  id: string
  name: string
  phone: string
  province: string
  city: string
  district: string
  address: string
  isDefault: boolean
}

// 支付方式接口
interface PaymentMethod {
  id: string
  name: string
  icon: string
}

// 地址表单字段类型
interface AddressForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// 支付方式类型
type PaymentMethodType = 'credit_card' | 'alipay' | 'wechat_pay' | 'bank_transfer';

export default function CheckoutForm() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPaymentComponent, setShowPaymentComponent] = useState(false)
  const [orderId, setOrderId] = useState<string>('')
  const [paymentError, setPaymentError] = useState<string>('')

  // 结账步骤
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // 地址信息
  const [savedAddresses, setSavedAddresses] = useState<AddressForm[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);
  
  // 配送方式
  const [deliveryMethod, setDeliveryMethod] = useState<string>('standard');
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  
  // 支付方式
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('alipay');
  
  // 订单摘要
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [orderTotal, setOrderTotal] = useState<number>(0);
  
  // 提交状态
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 模拟获取用户地址
  useEffect(() => {
    // 模拟API请求
    setTimeout(() => {
      const mockAddresses: Address[] = [
        {
          id: '1',
          name: '张三',
          phone: '13800138000',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          address: '科技园路123号科技大厦101室',
          isDefault: true
        },
        {
          id: '2',
          name: '李四',
          phone: '13900139000',
          province: '北京市',
          city: '北京市',
          district: '海淀区',
          address: '中关村大街188号创业大厦5层',
          isDefault: false
        }
      ]
      
      setAddresses(mockAddresses)
      
      // 默认选择默认地址
      const defaultAddress = mockAddresses.find(addr => addr.isDefault)
      if (defaultAddress) {
        setSelectedAddress(defaultAddress.id)
      } else if (mockAddresses.length > 0) {
        setSelectedAddress(mockAddresses[0].id)
      }
    }, 500)
  }, [])
  
  // 检查购物车是否为空
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])
  
  // 处理地址选择
  const handleSelectAddress = (id: string) => {
    setSelectedAddress(id)
  }
  
  // 处理新地址输入变化
  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewAddress({
      ...newAddress,
      [name]: value
    })
  }
  
  // 处理添加新地址
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 模拟API请求
    const newAddressWithId: Address = {
      ...newAddress,
      id: `new-${Date.now()}`,
      isDefault: addresses.length === 0
    }
    
    const updatedAddresses = [...addresses, newAddressWithId]
    setAddresses(updatedAddresses)
    setSelectedAddress(newAddressWithId.id)
    setShowAddressForm(false)
    
    // 重置表单
    setNewAddress({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      address: ''
    })
  }
  
  // 提交订单
  const handleSubmitOrder = async () => {
    if (!selectedAddress) {
      alert('请选择收货地址')
      return
    }
    
    setLoading(true)
    
    try {
      // 获取选中的地址信息
      const address = addresses.find(addr => addr.id === selectedAddress)
      if (!address) {
        throw new Error('无效的地址')
      }
      
      // 创建订单数据
      const orderData = {
        user_id: 1, // 实际应用中应该是登录用户的ID
        status: '待付款',
        total: totalPrice,
        items_count: items.length,
        customer_name: address.name,
        customer_email: 'customer@example.com', // 实际应用中应该是用户的邮箱
        payment_method: 'airwallex',
        payment_status: '待支付',
        shipping_address: `${address.province} ${address.city} ${address.district} ${address.address}`,
        shipping_method: '快递',
        items: items.map((item: any) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        }))
      }
      
      // 创建订单API请求
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '创建订单失败')
      }
      
      const data = await response.json()
      
      if (data.order && data.order.id) {
        // 保存订单ID
        setOrderId(data.order.id)
        
        // 显示支付组件
        setShowPaymentComponent(true)
      } else {
        throw new Error('未获取到有效的订单信息')
      }
    } catch (error: any) {
      console.error('提交订单失败:', error)
      setPaymentError(error.message || '创建订单失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  // 处理支付成功
  const handlePaymentSuccess = (paymentId: string) => {
    console.log('支付成功:', paymentId)
    
    // 清空购物车
    clearCart()
    
    // 跳转到订单成功页面
    router.push(`/orders/success?orderId=${orderId}&paymentId=${paymentId}`)
  }
  
  // 处理支付取消
  const handlePaymentCancel = () => {
    console.log('支付取消')
    setShowPaymentComponent(false)
  }
  
  // 处理支付错误
  const handlePaymentError = (error: any) => {
    console.error('支付错误:', error)
    setPaymentError(error.message || '支付过程中发生错误')
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">结账</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：订单信息 */}
        <div className="lg:col-span-2">
          {/* 地址选择 */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">收货地址</h2>
            
            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map(address => (
                  <div
                    key={address.id}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      selectedAddress === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleSelectAddress(address.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{address.name}</p>
                        <p className="text-gray-600">{address.phone}</p>
                        <p className="text-gray-600 mt-1">
                          {address.province} {address.city} {address.district} {address.address}
                        </p>
                      </div>
                      {address.isDefault && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          默认地址
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-4">暂无收货地址</p>
            )}
            
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              {showAddressForm ? '取消' : '+ 添加新地址'}
            </button>
            
            {/* 新地址表单 */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    收货人姓名
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newAddress.name}
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    手机号码
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                      省份
                    </label>
                    <input
                      type="text"
                      id="province"
                      name="province"
                      value={newAddress.province}
                      onChange={handleAddressInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      城市
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={newAddress.city}
                      onChange={handleAddressInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                      区/县
                    </label>
                    <input
                      type="text"
                      id="district"
                      name="district"
                      value={newAddress.district}
                      onChange={handleAddressInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    详细地址
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={newAddress.address}
                    onChange={handleAddressInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    保存地址
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* 支付方式 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">支付方式</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="alipay"
                  name="payment"
                  value="alipay"
                  checked={paymentMethod === 'alipay'}
                  onChange={() => setPaymentMethod('alipay')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="alipay" className="ml-3 flex items-center">
                  <img src="/images/alipay.png" alt="支付宝" className="h-6 w-6 mr-2" />
                  <span>支付宝</span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="wechat"
                  name="payment"
                  value="wechat_pay"
                  checked={paymentMethod === 'wechat_pay'}
                  onChange={() => setPaymentMethod('wechat_pay')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="wechat" className="ml-3 flex items-center">
                  <img src="/images/wechat.png" alt="微信支付" className="h-6 w-6 mr-2" />
                  <span>微信支付</span>
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="radio"
                  id="credit_card"
                  name="payment"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={() => setPaymentMethod('credit_card')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="credit_card" className="ml-3 flex items-center">
                  <img src="/images/credit-card.png" alt="信用卡" className="h-6 w-6 mr-2" />
                  <span>信用卡</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧：订单摘要 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">订单摘要</h2>
            
            <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">数量: {item.quantity}</p>
                    <p className="text-blue-600">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t mt-6 pt-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">商品总额</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">运费</span>
                <span>{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">税费</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>总计</span>
                <span className="text-blue-600">{formatCurrency(totalPrice + deliveryFee + tax)}</span>
              </div>
            </div>
            
            <button
              onClick={handleSubmitOrder}
              disabled={loading || !selectedAddress}
              className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium ${
                loading || !selectedAddress
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? '处理中...' : '提交订单'}
            </button>
            
            {paymentError && (
              <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
                {paymentError}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 支付组件 */}
      {showPaymentComponent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">完成支付</h3>
            <AirwallexPayment
              orderId={orderId}
              amount={totalPrice}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
              onError={handlePaymentError}
            />
          </div>
        </div>
      )}
    </div>
  )
} 