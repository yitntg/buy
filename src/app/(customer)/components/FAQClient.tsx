'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: '如何下单？',
    answer: '您可以在商品详情页点击"加入购物车"或"立即购买"按钮进行下单。在购物车中确认商品信息后，点击"结算"进入支付流程。'
  },
  {
    question: '支持哪些支付方式？',
    answer: '我们支持信用卡、借记卡、支付宝、微信支付等多种支付方式。'
  },
  {
    question: '如何查询订单状态？',
    answer: '您可以在"我的账户"中的"订单列表"查看所有订单状态。点击具体订单可以查看详细信息。'
  },
  {
    question: '商品什么时候发货？',
    answer: '正常情况下，我们会在收到订单后24小时内发货。您可以在订单详情页查看物流信息。'
  },
  {
    question: '如何申请退款？',
    answer: '您可以在订单详情页点击"申请退款"按钮。请确保商品未使用且包装完整。'
  },
  {
    question: '运费如何计算？',
    answer: '运费根据商品重量和配送地址计算。订单满299元可享受免运费优惠。'
  },
  {
    question: '如何修改收货地址？',
    answer: '您可以在"我的账户"中的"收货地址"管理收货地址信息。'
  },
  {
    question: '商品有质量问题怎么办？',
    answer: '如遇商品质量问题，请在收到商品后7天内联系客服处理。'
  }
]

export default function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">常见问题</h1>
      
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>
            
            {openIndex === index && (
              <div className="px-6 py-4 bg-gray-50">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600">
          还有其他问题？请{' '}
          <a
            href="/contact"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            联系我们
          </a>
        </p>
      </div>
    </div>
  )
} 