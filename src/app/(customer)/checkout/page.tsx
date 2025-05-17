'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// Header import removed
// Footer import removed
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

export default function CheckoutPage() {
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
    
    // 跳转到订单确认页面
    router.push(`/checkout/confirmation?orderId=${orderId}`)
  }
  
  // 处理支付取消
  const handlePaymentCancel = () => {
    setShowPaymentComponent(false)
  }
  
  // 处理支付错误
  const handlePaymentError = (error: any) => {
    console.error('支付错误:', error)
    setPaymentError(error.message || '支付处理失败，请重试')
    setShowPaymentComponent(false)
  }
  
  return (
    <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">结算</h1>
        
        {showPaymentComponent ? (
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">支付订单</h2>
            
            {paymentError && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                {paymentError}
              </div>
            )}
            
            <AirwallexPayment
              orderId={orderId}
              amount={totalPrice}
              currency="USD" // 使用美元作为默认货币，实际应用中可以让用户选择
              customerInfo={{
                email: 'customer@example.com', // 实际应用中应该是用户的邮箱
                name: addresses.find(addr => addr.id === selectedAddress)?.name || '',
                phone: addresses.find(addr => addr.id === selectedAddress)?.phone
              }}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
              onError={handlePaymentError}
            />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 左侧结算信息 */}
            <div className="lg:w-2/3">
              {/* 收货地址 */}
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">收货地址</h2>
                  <button 
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-primary text-sm hover:underline"
                  >
                    {showAddressForm ? '取消添加' : '+ 添加新地址'}
                  </button>
                </div>
                
                {/* 地址列表 */}
                {!showAddressForm && (
                  <div className="space-y-4">
                    {addresses.map(address => (
                      <div 
                        key={address.id}
                        className={`border rounded-lg p-4 cursor-pointer transition ${
                          selectedAddress === address.id 
                            ? 'border-primary bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleSelectAddress(address.id)}
                      >
                        <div className="flex justify-between">
                          <div className="flex gap-2">
                            <span className="font-medium">{address.name}</span>
                            <span className="text-gray-600">{address.phone}</span>
                          </div>
                          {address.isDefault && (
                            <span className="text-xs bg-primary text-white px-2 py-1 rounded">默认</span>
                          )}
                        </div>
                        <div className="text-gray-600 mt-1">
                          {address.province} {address.city} {address.district} {address.address}
                        </div>
                      </div>
                    ))}
                    
                    {addresses.length === 0 && !showAddressForm && (
                      <div className="text-center py-6 text-gray-500">
                        没有保存的地址，请添加新地址
                      </div>
                    )}
                  </div>
                )}
                
                {/* 新增地址表单 */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">收货人</label>
                      <input
                        type="text"
                        name="name"
                        value={newAddress.name}
                        onChange={handleAddressInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">手机号码</label>
                      <input
                        type="tel"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleAddressInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">省份</label>
                      <input
                        type="text"
                        name="province"
                        value={newAddress.province}
                        onChange={handleAddressInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">城市</label>
                      <input
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">区/县</label>
                      <input
                        type="text"
                        name="district"
                        value={newAddress.district}
                        onChange={handleAddressInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">详细地址</label>
                      <input
                        type="text"
                        name="address"
                        value={newAddress.address}
                        onChange={handleAddressInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2 mt-2">
                      <button 
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        保存地址
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              {/* 商品信息 */}
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h2 className="text-lg font-medium mb-4">订单商品</h2>
                
                <div className="divide-y">
                  {items.map((item: any) => (
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
            </div>
            
            {/* 右侧订单摘要 */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
                <h2 className="text-lg font-medium mb-4">订单摘要</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">商品总额</span>
                    <span>¥{totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">运费</span>
                    <span>¥0.00</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200 flex justify-between font-bold">
                    <span>订单总计</span>
                    <span className="text-primary">¥{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleSubmitOrder}
                  disabled={loading || !selectedAddress}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? '处理中...' : '提交订单'}
                </button>
                
                <div className="mt-4 text-center">
                  <Link href="/cart" className="text-gray-600 text-sm hover:text-primary">
                    返回购物车
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  )
} 
