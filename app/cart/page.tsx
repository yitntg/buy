'use client'

import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useState } from 'react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  
  const handleCheckout = () => {
    setIsCheckingOut(true)
    // 这里可以添加跳转到结算页面的逻辑
    setTimeout(() => {
      setIsCheckingOut(false)
      alert('此功能尚未实现，敬请期待！')
    }, 1500)
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">购物车</h1>
          
          {items.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* 购物车商品列表 */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* 表头 */}
                  <div className="hidden md:grid grid-cols-12 bg-gray-50 p-4 text-gray-600 text-sm font-medium">
                    <div className="col-span-6">商品信息</div>
                    <div className="col-span-2 text-center">单价</div>
                    <div className="col-span-2 text-center">数量</div>
                    <div className="col-span-2 text-center">金额</div>
                  </div>
                  
                  {/* 购物车商品 */}
                  {items.map(item => (
                    <div key={item.id} className="border-t first:border-t-0 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* 商品信息 */}
                        <div className="md:col-span-6 flex items-center">
                          <div className="w-20 h-20 relative rounded overflow-hidden flex-shrink-0">
                            <Image 
                              src={item.image} 
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <Link href={`/product/${item.id}`} className="font-medium hover:text-primary">
                              {item.name}
                            </Link>
                          </div>
                        </div>
                        
                        {/* 单价 */}
                        <div className="md:col-span-2 text-center">
                          <span className="md:hidden inline-block w-20 text-gray-500">单价：</span>
                          <span className="text-gray-800">¥{item.price}</span>
                        </div>
                        
                        {/* 数量 */}
                        <div className="md:col-span-2 text-center">
                          <span className="md:hidden inline-block w-20 text-gray-500">数量：</span>
                          <div className="inline-flex items-center border border-gray-300 rounded">
                            <button 
                              className="w-8 h-8 flex items-center justify-center text-gray-600"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              readOnly
                              className="w-12 h-8 text-center border-x border-gray-300"
                            />
                            <button 
                              className="w-8 h-8 flex items-center justify-center text-gray-600"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* 金额 */}
                        <div className="md:col-span-2 text-center">
                          <span className="md:hidden inline-block w-20 text-gray-500">金额：</span>
                          <span className="text-primary font-bold">¥{item.price * item.quantity}</span>
                        </div>
                      </div>
                      
                      {/* 移除按钮 */}
                      <div className="mt-4 md:text-right">
                        <button 
                          className="text-gray-500 hover:text-red-500 text-sm"
                          onClick={() => removeItem(item.id)}
                        >
                          移除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 订单汇总 */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-medium mb-6">订单汇总</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">商品总价</span>
                      <span>¥{totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">运费</span>
                      <span>¥0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">优惠</span>
                      <span className="text-red-500">- ¥0</span>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between font-bold">
                        <span>实付款</span>
                        <span className="text-primary text-xl">¥{totalPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-md mt-6 flex items-center justify-center"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        处理中...
                      </>
                    ) : (
                      `去结算 (${items.length}件商品)`
                    )}
                  </button>
                </div>
                
                {/* 猜你喜欢 */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                  <h2 className="text-lg font-medium mb-4">猜你喜欢</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                        <Image 
                          src="https://picsum.photos/id/2/400/300" 
                          alt="智能手表"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium">智能手表</h3>
                        <p className="text-primary text-sm mt-1">¥599</p>
                      </div>
                      <button className="text-sm text-primary border border-primary rounded-full px-3 py-1 hover:bg-blue-50">
                        加入购物车
                      </button>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                        <Image 
                          src="https://picsum.photos/id/4/400/300" 
                          alt="专业摄影相机"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium">专业摄影相机</h3>
                        <p className="text-primary text-sm mt-1">¥3299</p>
                      </div>
                      <button className="text-sm text-primary border border-primary rounded-full px-3 py-1 hover:bg-blue-50">
                        加入购物车
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl text-gray-400 mb-4">🛒</div>
              <h2 className="text-xl font-medium mb-4">购物车空空如也</h2>
              <p className="text-gray-500 mb-8">快去挑选心仪的商品吧！</p>
              <Link 
                href="/products" 
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 inline-block"
              >
                去购物
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
} 