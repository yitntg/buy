'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

// Airwallex支付方式接口
interface AirwallexPaymentMethod {
  id: string
  name: string
  icon: string
  type: string
}

interface AirwallexPaymentProps {
  orderId: string
  amount: number
  currency: string
  customerInfo: {
    email: string
    name: string
    phone?: string
  }
  onSuccess: (paymentId: string) => void
  onCancel: () => void
  onError: (error: any) => void
}

export default function AirwallexPayment({
  orderId,
  amount,
  currency,
  customerInfo,
  onSuccess,
  onCancel,
  onError
}: AirwallexPaymentProps) {
  const [loading, setLoading] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState<AirwallexPaymentMethod[]>([])
  const [selectedPayment, setSelectedPayment] = useState<string>('')
  const [paymentIntentId, setPaymentIntentId] = useState<string>('')
  const [clientSecret, setClientSecret] = useState<string>('')
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // 预定义的国际支付方式
  const internationalPaymentMethods: AirwallexPaymentMethod[] = [
    { id: 'card', name: '信用卡/借记卡', icon: '💳', type: 'card' },
    { id: 'googlepay', name: 'Google Pay', icon: '📱', type: 'google_pay' },
    { id: 'applepay', name: 'Apple Pay', icon: '📱', type: 'apple_pay' },
    { id: 'paypal', name: 'PayPal', icon: '💰', type: 'paypal' },
  ]

  // 初始化 - 创建支付意向
  useEffect(() => {
    async function createPaymentIntent() {
      try {
        setLoading(true)
        
        // 创建支付意向
        const response = await fetch('/api/payment/airwallex', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            currency,
            orderId,
            customer: customerInfo,
            returnUrl: `${window.location.origin}/api/payment/airwallex/callback?order_id=${orderId}`
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '创建支付失败')
        }

        const data = await response.json()
        
        // 设置支付意向ID和客户端密钥
        if (data.paymentIntent && data.paymentIntent.id && data.paymentIntent.client_secret) {
          setPaymentIntentId(data.paymentIntent.id)
          setClientSecret(data.paymentIntent.client_secret)
        } else {
          throw new Error('未获取到有效的支付意向数据')
        }
        
        // 默认选择第一个支付方式
        if (internationalPaymentMethods.length > 0) {
          setSelectedPayment(internationalPaymentMethods[0].id)
        }
        
        // 设置可用的支付方式
        setPaymentMethods(internationalPaymentMethods)
        
      } catch (error) {
        console.error('创建支付意向失败:', error)
        onError(error)
      } finally {
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [amount, currency, orderId, customerInfo])

  // 当脚本加载并且有支付意向ID时，初始化Airwallex
  useEffect(() => {
    if (scriptLoaded && paymentIntentId && clientSecret) {
      initializeAirwallex()
    }
  }, [scriptLoaded, paymentIntentId, clientSecret])

  // 初始化Airwallex
  const initializeAirwallex = () => {
    if (typeof window !== 'undefined' && window.Airwallex) {
      window.Airwallex.init({
        env: process.env.NODE_ENV === 'production' ? 'prod' : 'demo',
        origin: window.location.origin,
      })
    }
  }

  // 处理支付方式选择
  const handleSelectPayment = (id: string) => {
    setSelectedPayment(id)
  }

  // 处理支付提交
  const handleSubmitPayment = async () => {
    if (!selectedPayment || !paymentIntentId || !clientSecret) {
      onError(new Error('支付信息不完整'))
      return
    }

    try {
      setLoading(true)
      
      // 根据选择的支付方式创建不同的支付处理
      const selectedMethod = paymentMethods.find(m => m.id === selectedPayment)
      
      if (!selectedMethod) {
        throw new Error('无效的支付方式')
      }
      
      if (selectedMethod.type === 'card') {
        // 处理信用卡支付 - 这里应该使用Airwallex SDK的card组件
        if (window.Airwallex && window.Airwallex.createElement) {
          const card = window.Airwallex.createElement('card')
          
          // 创建卡片元素
          card.mount('card-element')
          
          // 提交卡片支付
          const response = await window.Airwallex.confirmPaymentIntent({
            element: card,
            intent_id: paymentIntentId,
            client_secret: clientSecret,
          })
          
          if (response && response.status === 'SUCCEEDED') {
            onSuccess(response.id)
          } else {
            throw new Error('支付失败')
          }
        }
      } else if (selectedMethod.type === 'google_pay' || selectedMethod.type === 'apple_pay') {
        // 处理Google Pay或Apple Pay
        let walletType = selectedMethod.type === 'google_pay' ? 'googlepay' : 'applepay'
        
        // 调用API确认支付意向
        const response = await fetch('/api/payment/airwallex', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId,
            paymentMethod: {
              type: walletType,
            }
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '支付确认失败')
        }
        
        const data = await response.json()
        
        if (data.confirmation && data.confirmation.status === 'SUCCEEDED') {
          onSuccess(data.confirmation.id)
        } else {
          window.location.href = data.confirmation.next_action.url
        }
      } else {
        // 其他支付方式
        // 调用API确认支付意向
        const response = await fetch('/api/payment/airwallex', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId,
            paymentMethod: {
              type: selectedMethod.type,
            }
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || '支付确认失败')
        }
        
        const data = await response.json()
        
        if (data.confirmation && data.confirmation.status === 'SUCCEEDED') {
          onSuccess(data.confirmation.id)
        } else if (data.confirmation && data.confirmation.next_action && data.confirmation.next_action.url) {
          // 重定向到支付网关
          window.location.href = data.confirmation.next_action.url
        } else {
          throw new Error('支付处理失败')
        }
      }
    } catch (error) {
      console.error('支付处理失败:', error)
      onError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="airwallex-payment">
      <Script
        src="https://checkout.airwallex.com/assets/elements.bundle.min.js"
        onLoad={() => setScriptLoaded(true)}
      />
      
      <h2 className="text-lg font-medium mb-4">支付方式</h2>
      
      {loading ? (
        <div className="text-center py-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">加载支付方式...</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {paymentMethods.map(method => (
              <div
                key={method.id}
                className={`border rounded-lg p-4 flex items-center cursor-pointer transition ${
                  selectedPayment === method.id
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectPayment(method.id)}
              >
                <div className="text-xl mr-3">{method.icon}</div>
                <div className="font-medium">{method.name}</div>
              </div>
            ))}
          </div>
          
          {selectedPayment === 'card' && (
            <div className="mb-6">
              <div id="card-element" className="p-4 border rounded-lg"></div>
            </div>
          )}
          
          <button
            onClick={handleSubmitPayment}
            disabled={loading || !selectedPayment}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : '确认支付'}
          </button>
          
          <button
            onClick={onCancel}
            className="w-full mt-3 text-gray-600 py-2 hover:underline"
          >
            取消支付
          </button>
        </>
      )}
    </div>
  )
}

// 为TypeScript声明全局Airwallex对象
declare global {
  interface Window {
    Airwallex: any;
  }
} 