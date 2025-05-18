'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// Header import removed
// Footer import removed
import { useCart } from '@/src/app/(shared)/contexts/CartContext'
import { formatCurrency } from '@/src/app/(shared)/utils/formatters'


export default function CartPage() {
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
  const handleCheckout = () => {
    // 检查是否有库存问题
    if (Object.keys(stockWarnings).length > 0) {
      // 确认是否继续
      if (!window.confirm('您的购物车中有商品库存不足，是否继续结算？')) {
        return;
      }
    }
    
    setIsCheckingOut(true);
    setStep(1);
  };
  
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
                      <div className="font-medium">加急配送</div>
                      <div className="text-sm text-gray-600">预计1-2天送达</div>
                    </label>
                    <div className="text-gray-600">¥15</div>
                  </div>
                </div>
              </div>
              
              {/* 发票信息 */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">发票信息</h3>
                <div className="border rounded-md p-4 flex items-center">
                  <input 
                    type="checkbox" 
                    id="need-invoice" 
                    className="text-primary"
                  />
                  <label htmlFor="need-invoice" className="ml-2">
                    需要开具发票
                  </label>
                </div>
              </div>
              
              {/* 订单备注 */}
              <div>
                <h3 className="text-lg font-medium mb-3">订单备注</h3>
                <textarea 
                  className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入订单备注信息"
                  rows={3}
                ></textarea>
              </div>
            </div>
            
            {/* 订单汇总 */}
            <div className="p-6 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span>商品总价</span>
                <span>¥{totalPrice}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>运费</span>
                <span>¥0</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                <span>应付总额</span>
                <span className="text-primary">¥{totalPrice}</span>
              </div>
              
              <div className="mt-6 flex space-x-4">
                <button 
                  className="flex-1 border border-gray-300 py-3 rounded-md"
                  onClick={() => setStep(0)}
                >
                  返回购物车
                </button>
                <button 
                  className="flex-1 bg-primary hover:bg-blue-600 text-white py-3 rounded-md"
                  onClick={handlePayment}
                >
                  去支付
                </button>
              </div>
            </div>
          </div>
        );
        
      case 2: // 支付方式
        return (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold mb-4">选择支付方式</h2>
              
              <div className="space-y-4 mb-8">
                <div className="border rounded-md p-4 flex items-center bg-blue-50 border-primary">
                  <input 
                    type="radio" 
                    id="payment-wechat" 
                    name="payment"
                    checked 
                    className="text-primary"
                  />
                  <label htmlFor="payment-wechat" className="ml-3 flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white mr-3">微</div>
                    <div>
                      <div className="font-medium">微信支付</div>
                      <div className="text-sm text-gray-600">使用微信扫码支付</div>
                    </div>
                  </label>
                </div>
                
                <div className="border rounded-md p-4 flex items-center">
                  <input 
                    type="radio" 
                    id="payment-alipay" 
                    name="payment" 
                    className="text-primary"
                  />
                  <label htmlFor="payment-alipay" className="ml-3 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white mr-3">支</div>
                    <div>
                      <div className="font-medium">支付宝</div>
                      <div className="text-sm text-gray-600">使用支付宝扫码支付</div>
                    </div>
                  </label>
                </div>
                
                <div className="border rounded-md p-4 flex items-center">
                  <input 
                    type="radio" 
                    id="payment-card" 
                    name="payment" 
                    className="text-primary"
                  />
                  <label htmlFor="payment-card" className="ml-3 flex items-center">
                    <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-white mr-3">卡</div>
                    <div>
                      <div className="font-medium">银行卡支付</div>
                      <div className="text-sm text-gray-600">使用储蓄卡/信用卡支付</div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-md">
                <div className="text-center mb-6">
                  <p className="text-lg font-bold mb-1">订单金额：<span className="text-primary">¥{totalPrice}</span></p>
                  <p className="text-gray-500">请使用微信扫描下方二维码完成支付</p>
                </div>
                
                <div className="flex justify-center mb-6">
                  <div className="w-56 h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                    [二维码占位]
                  </div>
                </div>
                
                <p className="text-center text-gray-500 text-sm">
                  支付二维码有效期为2小时，请尽快完成支付
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 flex justify-between">
              <button 
                className="px-6 py-2 border border-gray-300 rounded-md"
                onClick={() => setStep(1)}
              >
                返回上一步
              </button>
              
              <button 
                className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-md"
                onClick={handlePaymentComplete}
              >
                支付完成
              </button>
            </div>
          </div>
        );
        
      default: // 购物车
        return (
          <>
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
                    {items.map((item: any) => (
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
                              {stockWarnings[item.id] && (
                                <p className="text-sm text-red-500 mt-1">{stockWarnings[item.id]}</p>
                              )}
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
                    
                    {/* 操作栏 */}
                    <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center">
                      <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <button 
                          className="text-gray-600 hover:text-primary text-sm"
                          onClick={() => {
                            if (window.confirm('确定要清空购物车吗？')) {
                              clearCart();
                            }
                          }}
                        >
                          清空购物车
                        </button>
                        <Link href="/products" className="text-primary text-sm hover:underline">
                          继续购物
                        </Link>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-bold mb-1">
                          总计：<span className="text-primary">¥{totalPrice}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          共 {items.reduce((total: number, item: any) => total + item.quantity, 0)} 件商品
                        </div>
                      </div>
                    </div>
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
                    
                    {/* 优惠券 */}
                    <div className="mt-6 border-t pt-6">
                      <button 
                        className="flex items-center text-gray-600 text-sm"
                      >
                        <span className="mr-2">+</span> 使用优惠券
                      </button>
                    </div>
                    
                    <button 
                      className="w-full bg-primary hover:bg-blue-600 text-white py-3 rounded-md mt-6 flex items-center justify-center"
                      onClick={handleCheckout}
                      disabled={isCheckingOut || items.length === 0}
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
                        `去结算 (${items.reduce((total: number, item: any) => total + item.quantity, 0)}件商品)`
                      )}
                    </button>
                  </div>
                  
                  {/* 猜你喜欢 */}
                  <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h2 className="text-lg font-medium mb-4">猜你喜欢</h2>
                    <div className="space-y-4">
                      {recommendedProducts.length > 0 ? (
                        recommendedProducts.map(product => (
                          <div key={product.id} className="flex items-center">
                            <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                              <Image 
                                src={product.image} 
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <Link 
                                href={`/product/${product.id}`}
                                className="text-sm font-medium line-clamp-1 hover:text-primary"
                              >
                                {product.name}
                              </Link>
                              <p className="text-primary text-sm mt-1">¥{product.price}</p>
                            </div>
                            <button 
                              className="text-sm text-primary border border-primary rounded-full px-3 py-1 hover:bg-blue-50"
                              onClick={() => addItemToCartWithEffect(product)}
                            >
                              加入购物车
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          正在加载推荐商品...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl text-gray-300 mb-4">🛒</div>
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
          </>
        );
    }
  };
  
  return (
    <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">购物车</h1>
        
        {/* 面包屑导航 */}
        <div className="mb-6 flex items-center text-sm">
          <Link href="/" className="text-gray-500 hover:text-primary">
            首页
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-700">{
            step === 0 ? '购物车' : 
            step === 1 ? '确认订单' : 
            '支付订单'
          }</span>
        </div>
        
        {/* 步骤导航 */}
        {items.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className={`flex flex-col items-center ${step >= 0 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 0 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <div className="mt-2">购物车</div>
              </div>
              
              <div className={`w-16 md:w-32 h-1 ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              
              <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <div className="mt-2">确认订单</div>
              </div>
              
              <div className={`w-16 md:w-32 h-1 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
              
              <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <div className="mt-2">支付</div>
              </div>
            </div>
          </div>
        )}
        
        {/* 步骤内容 */}
        {renderStepContent()}
      </div>
  )
} 
