'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/src/app/(shared)/contexts/CartContext'
import { formatCurrency, formatPrice } from '@/src/app/(shared)/utils/formatters'

export default function CartClient() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [step, setStep] = useState(0) // 0: 购物车, 1: 确认订单, 2: 支付方式
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([])
  const [stockWarnings, setStockWarnings] = useState<Record<string, string>>({})
  
  // 获取库存信息和推荐产品
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (items.length === 0) return;
      
      // 检查库存
      const warnings: Record<string, string> = {};
      
      for (const item of items) {
        try {
          const res = await fetch(`/api/products/${item.id}`);
          if (res.ok) {
            const product = await res.json();
            
            // 检查库存
            if (product.inventory < item.quantity) {
              warnings[item.id] = `库存不足，仅剩 ${product.inventory} 件`;
            } else if (product.inventory < 5) {
              warnings[item.id] = `库存紧张，仅剩 ${product.inventory} 件`;
            }
          }
        } catch (err) {
          console.error('获取产品详情出错:', err);
        }
      }
      
      setStockWarnings(warnings);
      
      // 获取推荐产品
      fetchRecommendedProducts();
    };
    
    fetchProductDetails();
  }, [items]);
  
  // 获取推荐产品
  const fetchRecommendedProducts = async () => {
    try {
      const res = await fetch('/api/products?limit=4');
      if (res.ok) {
        const data = await res.json();
        // 过滤掉已在购物车中的产品
        const cartItemIds = items.map((item: { id: string }) => item.id);
        setRecommendedProducts(
          data.products.filter((p: any) => !cartItemIds.includes(p.id)).slice(0, 3)
        );
      }
    } catch (err) {
      console.error('获取推荐产品出错:', err);
    }
  };
  
  // 处理结算
  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      // 检查是否有库存问题
      if (Object.keys(stockWarnings).length > 0) {
        // 确认是否继续
        if (!window.confirm('您的购物车中有商品库存不足，是否继续结算？')) {
          return;
        }
      }
      
      // TODO: 实现实际的结账逻辑
      await new Promise(resolve => setTimeout(resolve, 1000))
      clearCart()
      router.push('/checkout/success')
    } catch (error) {
      console.error('结账失败:', error)
    } finally {
      setIsCheckingOut(false)
    }
  }
  
  // 处理支付步骤
  const handlePayment = () => {
    setStep(2);
  };
  
  // 处理支付完成
  const handlePaymentComplete = () => {
    setIsCheckingOut(false);
    // 清空购物车
    clearCart();
    
    // 显示成功消息
    alert('订单已成功提交！');
    
    // 重定向到首页或订单确认页
    router.push('/account/orders');
  };
  
  // 显示已添加到购物车的提示
  const addItemToCartWithEffect = (product: any) => {
    // 添加产品到购物车
    useCart().addItem(product, 1);
    
    // 显示提示消息
    alert(`已将 ${product.name} 添加到购物车`);
  };
  
  // 根据不同步骤显示不同内容
  const renderStepContent = () => {
    switch (step) {
      case 1: // 确认订单
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold mb-4">确认订单信息</h2>
              
              {/* 收货地址 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">收货地址</h3>
                <div className="border rounded-md p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p>
                        <span className="font-medium">张三</span>
                        <span className="ml-4">138****1234</span>
                      </p>
                      <p className="text-gray-600 mt-1">北京市海淀区中关村南大街5号，100081</p>
                    </div>
                    <button className="text-primary text-sm">修改</button>
                  </div>
                </div>
              </div>
              
              {/* 商品清单 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">商品清单</h3>
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-50 p-3 text-sm text-gray-600 grid grid-cols-12">
                    <div className="col-span-6">商品信息</div>
                    <div className="col-span-2 text-center">单价</div>
                    <div className="col-span-2 text-center">数量</div>
                    <div className="col-span-2 text-center">小计</div>
                  </div>
                  
                  {items.map((item: any) => (
                    <div key={item.id} className="border-t p-3 grid grid-cols-12 items-center">
                      <div className="col-span-6 flex items-center">
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm line-clamp-2">{item.name}</p>
                          {stockWarnings[item.id] && (
                            <p className="text-sm text-red-500 mt-1">{stockWarnings[item.id]}</p>
                          )}
                        </div>
                      </div>
                      <div className="col-span-2 text-center">¥{item.price}</div>
                      <div className="col-span-2 text-center">{item.quantity}</div>
                      <div className="col-span-2 text-center font-medium">¥{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 配送方式 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">配送方式</h3>
                <div className="flex space-x-4">
                  <div className="border rounded-md p-3 flex items-center bg-blue-50 border-primary flex-1">
                    <input 
                      type="radio" 
                      id="shipping-standard" 
                      name="shipping"
                      checked 
                      className="text-primary"
                    />
                    <label htmlFor="shipping-standard" className="ml-2 flex-1">
                      <div className="font-medium">标准配送</div>
                      <div className="text-sm text-gray-600">预计3-5天送达</div>
                    </label>
                    <div className="text-gray-600">免费</div>
                  </div>
                  <div className="border rounded-md p-3 flex items-center flex-1">
                    <input 
                      type="radio" 
                      id="shipping-express" 
                      name="shipping" 
                      className="text-primary"
                    />
                    <label htmlFor="shipping-express" className="ml-2 flex-1">
                      <div className="font-medium">快递配送</div>
                      <div className="text-sm text-gray-600">预计1-2天送达</div>
                    </label>
                    <div className="text-gray-600">¥15</div>
                  </div>
                </div>
              </div>
              
              {/* 支付方式 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">支付方式</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-3 flex items-center bg-blue-50 border-primary">
                    <input 
                      type="radio" 
                      id="payment-alipay" 
                      name="payment"
                      checked 
                      className="text-primary"
                    />
                    <label htmlFor="payment-alipay" className="ml-2 flex-1">
                      <div className="font-medium">支付宝</div>
                    </label>
                  </div>
                  <div className="border rounded-md p-3 flex items-center">
                    <input 
                      type="radio" 
                      id="payment-wechat" 
                      name="payment" 
                      className="text-primary"
                    />
                    <label htmlFor="payment-wechat" className="ml-2 flex-1">
                      <div className="font-medium">微信支付</div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* 订单备注 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">订单备注</h3>
                <textarea 
                  className="w-full border rounded-md p-3"
                  rows={3}
                  placeholder="请输入订单备注（选填）"
                ></textarea>
              </div>
              
              {/* 订单金额 */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>商品金额</span>
                  <span>¥{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>运费</span>
                  <span>¥0.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>实付金额</span>
                  <span className="text-primary">¥{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 flex justify-between items-center">
              <button 
                onClick={() => setStep(0)}
                className="text-gray-600 hover:text-gray-800"
              >
                返回购物车
              </button>
              <button 
                onClick={handlePayment}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
              >
                提交订单
              </button>
            </div>
          </div>
        );
        
      case 2: // 支付方式
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">选择支付方式</h2>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4 flex items-center bg-blue-50 border-primary">
                  <input 
                    type="radio" 
                    id="pay-alipay" 
                    name="pay-method"
                    checked 
                    className="text-primary"
                  />
                  <label htmlFor="pay-alipay" className="ml-2 flex-1">
                    <div className="font-medium">支付宝</div>
                  </label>
                </div>
                
                <div className="border rounded-md p-4 flex items-center">
                  <input 
                    type="radio" 
                    id="pay-wechat" 
                    name="pay-method" 
                    className="text-primary"
                  />
                  <label htmlFor="pay-wechat" className="ml-2 flex-1">
                    <div className="font-medium">微信支付</div>
                  </label>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">订单金额：<span className="text-primary font-bold">¥{formatCurrency(totalPrice)}</span></p>
                <button 
                  onClick={handlePaymentComplete}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                  确认支付
                </button>
              </div>
            </div>
          </div>
        );
        
      default: // 购物车
        return (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">购物车</h2>
                
                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-4">您的购物车是空的</p>
                    <Link 
                      href="/products"
                      className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                      去购物
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item: any) => (
                      <div key={item.id} className="flex items-center border-b pb-4">
                        <div className="w-20 h-20 relative flex-shrink-0">
                          <Image 
                            src={item.image} 
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium line-clamp-2">{item.name}</h3>
                          {stockWarnings[item.id] && (
                            <p className="text-sm text-red-500 mt-1">{stockWarnings[item.id]}</p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <button 
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 border rounded-l flex items-center justify-center hover:bg-gray-100"
                              >
                                -
                              </button>
                              <input 
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (!isNaN(value) && value > 0) {
                                    updateQuantity(item.id, value);
                                  }
                                }}
                                className="w-12 h-8 border-t border-b text-center"
                              />
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 border rounded-r flex items-center justify-center hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <div className="flex items-center">
                              <span className="text-primary font-medium mr-4">¥{formatCurrency(item.price * item.quantity)}</span>
                              <button 
                                onClick={() => removeItem(item.id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {items.length > 0 && (
                <div className="p-6 bg-gray-50 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-600">总计：</span>
                      <span className="text-xl font-bold text-primary ml-2">¥{formatCurrency(totalPrice)}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                      结算
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* 推荐商品 */}
            {recommendedProducts.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">猜你喜欢</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {recommendedProducts.map((product: any) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="relative h-48">
                        <Image 
                          src={product.image} 
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-medium line-clamp-2 mb-2">{product.name}</h4>
                        <div className="flex justify-between items-center">
                          <span className="text-primary font-medium">¥{formatCurrency(product.price)}</span>
                          <button 
                            onClick={() => addItemToCartWithEffect(product)}
                            className="text-gray-400 hover:text-primary"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {renderStepContent()}
    </div>
  );
} 