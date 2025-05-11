'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function PaymentErrorPage() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>('')
  
  useEffect(() => {
    const message = searchParams.get('message') || '支付处理过程中出现错误'
    setErrorMessage(message)
  }, [searchParams])
  
  return (
    <>
      <Header />
      <main className="min-h-screen py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-8 shadow-md">
            <div className="text-center mb-8">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">支付失败</h1>
              <p className="text-gray-600">{errorMessage}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-gray-600 mb-6 text-center">
                您可以返回结账页面重新尝试，或联系我们的客户支持团队获取帮助。
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/checkout" 
                  className="bg-primary text-white py-3 px-6 rounded-lg text-center hover:bg-blue-600 transition"
                >
                  重新结账
                </Link>
                <Link 
                  href="/contact" 
                  className="border border-gray-300 text-gray-700 py-3 px-6 rounded-lg text-center hover:bg-gray-50 transition"
                >
                  联系客服
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 