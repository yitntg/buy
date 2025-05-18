'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useAuth } from '../../../context/AuthContext'

// 定义订单类型
interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: OrderItem[]
  address: {
    name: string
    phone: string
    province: string
    city: string
    district: string
    detail: string
    postalCode: string
  }
  payment: {
    method: string
    paid: boolean
    time: string | null
  }
  shipping: {
    method: string
    fee: number
    trackingNumber: string | null
    company: string | null
  }
  timeline: {
    time: string
    status: string
    description: string
  }[]
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoadingOrder, setIsLoadingOrder] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    } else {
      // 加载订单数据
      fetchOrderDetail()
    }
  }, [isLoading, isAuthenticated, router, params.id])
  
  // 模拟从API获取订单数据
  const fetchOrderDetail = async () => {
    setIsLoadingOrder(true)
    setError(null)
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 模拟订单数据
      // 根据订单ID返回对应的订单
      let mockOrder: Order | null = null
      
      switch (params.id) {
        case 'ORD20231115001':
          mockOrder = {
            id: 'ORD20231115001',
            date: '2023-11-15 14:30:25',
            status: '已完成',
            total: 598,
            items: [
              {
                id: '1',
                name: '高品质蓝牙耳机',
                price: 299,
                quantity: 1,
                image: 'https://picsum.photos/id/1/400/300'
              },
              {
                id: '5',
                name: '时尚双肩包',
                price: 199,
                quantity: 1,
                image: 'https://picsum.photos/id/5/400/300'
              }
            ],
            address: {
              name: '张三',
              phone: '138****1234',
              province: '北京市',
              city: '北京市',
              district: '海淀区',
              detail: '中关村南大街5号',
              postalCode: '100081'
            },
            payment: {
              method: '微信支付',
              paid: true,
              time: '2023-11-15 14:32:10'
            },
            shipping: {
              method: '顺丰速递',
              fee: 0,
              trackingNumber: 'SF1234567890',
              company: '顺丰速递'
            },
            timeline: [
              {
                time: '2023-11-15 14:30:25',
                status: '订单创建',
                description: '您的订单已提交，等待支付'
              },
              {
                time: '2023-11-15 14:32:10',
                status: '支付完成',
                description: '您的订单已支付成功'
              },
              {
                time: '2023-11-15 15:45:30',
                status: '商品出库',
                description: '您的商品已出库，等待配送'
              },
              {
                time: '2023-11-16 09:15:40',
                status: '开始配送',
                description: '配送员正在为您配送'
              },
              {
                time: '2023-11-17 14:20:15',
                status: '已签收',
                description: '您的订单已签收，如有问题请联系客服'
              }
            ]
          }
          break
          
        case 'ORD20231102001':
          mockOrder = {
            id: 'ORD20231102001',
            date: '2023-11-02 10:15:30',
            status: '已发货',
            total: 4999,
            items: [
              {
                id: '3',
                name: '轻薄笔记本电脑',
                price: 4999,
                quantity: 1,
                image: 'https://picsum.photos/id/3/400/300'
              }
            ],
            address: {
              name: '张三',
              phone: '138****1234',
              province: '北京市',
              city: '北京市',
              district: '海淀区',
              detail: '中关村南大街5号',
              postalCode: '100081'
            },
            payment: {
              method: '支付宝',
              paid: true,
              time: '2023-11-02 10:17:45'
            },
            shipping: {
              method: '京东快递',
              fee: 0,
              trackingNumber: 'JD9876543210',
              company: '京东物流'
            },
            timeline: [
              {
                time: '2023-11-02 10:15:30',
                status: '订单创建',
                description: '您的订单已提交，等待支付'
              },
              {
                time: '2023-11-02 10:17:45',
                status: '支付完成',
                description: '您的订单已支付成功'
              },
              {
                time: '2023-11-03 11:30:20',
                status: '商品出库',
                description: '您的商品已出库，等待配送'
              },
              {
                time: '2023-11-04 08:45:10',
                status: '开始配送',
                description: '配送员正在为您配送'
              }
            ]
          }
          break
          
        case 'ORD20231025001':
          mockOrder = {
            id: 'ORD20231025001',
            date: '2023-10-25 16:40:12',
            status: '待发货',
            total: 159,
            items: [
              {
                id: '8',
                name: '专业瑜伽垫',
                price: 159,
                quantity: 1,
                image: 'https://picsum.photos/id/8/400/300'
              }
            ],
            address: {
              name: '张三',
              phone: '138****1234',
              province: '北京市',
              city: '北京市',
              district: '海淀区',
              detail: '中关村南大街5号',
              postalCode: '100081'
            },
            payment: {
              method: '微信支付',
              paid: true,
              time: '2023-10-25 16:42:30'
            },
            shipping: {
              method: '标准快递',
              fee: 0,
              trackingNumber: null,
              company: null
            },
            timeline: [
              {
                time: '2023-10-25 16:40:12',
                status: '订单创建',
                description: '您的订单已提交，等待支付'
              },
              {
                time: '2023-10-25 16:42:30',
                status: '支付完成',
                description: '您的订单已支付成功'
              }
            ]
          }
          break
          
        case 'ORD20231018001':
          mockOrder = {
            id: 'ORD20231018001',
            date: '2023-10-18 09:10:05',
            status: '已取消',
            total: 599,
            items: [
              {
                id: '6',
                name: '多功能厨房料理机',
                price: 599,
                quantity: 1,
                image: 'https://picsum.photos/id/6/400/300'
              }
            ],
            address: {
              name: '张三',
              phone: '138****1234',
              province: '北京市',
              city: '北京市',
              district: '海淀区',
              detail: '中关村南大街5号',
              postalCode: '100081'
            },
            payment: {
              method: '微信支付',
              paid: false,
              time: null
            },
            shipping: {
              method: '标准快递',
              fee: 0,
              trackingNumber: null,
              company: null
            },
            timeline: [
              {
                time: '2023-10-18 09:10:05',
                status: '订单创建',
                description: '您的订单已提交，等待支付'
              },
              {
                time: '2023-10-18 21:10:05',
                status: '订单取消',
                description: '订单超时未支付，系统自动取消'
              }
            ]
          }
          break
          
        default:
          setError('订单不存在')
      }
      
      setOrder(mockOrder)
    } catch (error) {
      console.error('获取订单详情失败:', error)
      setError('获取订单详情失败，请稍后重试')
    } finally {
      setIsLoadingOrder(false)
    }
  }
  
  // 获取订单状态对应的样式
  const getStatusStyle = (status: string) => {
    switch (status) {
      case '已完成':
        return 'bg-green-100 text-green-800'
      case '已发货':
        return 'bg-blue-100 text-blue-800'
      case '待发货':
        return 'bg-yellow-100 text-yellow-800'
      case '已取消':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // 处理取消订单
  const handleCancelOrder = () => {
    if (window.confirm('确定要取消此订单吗？')) {
      // 模拟API调用
      alert('订单已取消')
      router.push('/account/orders')
    }
  }
  
  // 处理申请退款
  const handleRefund = () => {
    if (window.confirm('确定要申请退款吗？')) {
      // 模拟API调用
      alert('退款申请已提交')
      router.push('/account/orders')
    }
  }
  
  if (isLoading || isLoadingOrder) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }
  
  if (error || !order) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-4xl text-red-500 mb-4">⚠️</div>
              <h2 className="text-xl font-medium mb-4">{error || '订单不存在'}</h2>
              <p className="text-gray-500 mb-8">请返回订单列表查看其他订单</p>
              <Link 
                href="/account/orders" 
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600 inline-block"
              >
                返回订单列表
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* 面包屑导航 */}
          <div className="mb-6 flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-primary">
              首页
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link href="/account" className="text-gray-500 hover:text-primary">
              我的账户
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <Link href="/account/orders" className="text-gray-500 hover:text-primary">
              我的订单
            </Link>
            <span className="mx-2 text-gray-300">/</span>
            <span className="text-gray-700">订单详情</span>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b">
              <div className="flex flex-wrap items-center justify-between">
                <h1 className="text-2xl font-bold">订单详情</h1>
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 订单基本信息 */}
            <div className="p-6 border-b">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium mb-3">订单信息</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <div className="w-24 text-gray-500">订单编号:</div>
                      <div>{order.id}</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-gray-500">下单时间:</div>
                      <div>{order.date}</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-gray-500">支付方式:</div>
                      <div>{order.payment.method}</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-gray-500">支付状态:</div>
                      <div>{order.payment.paid ? '已支付' : '未支付'}</div>
                    </div>
                    {order.payment.time && (
                      <div className="flex">
                        <div className="w-24 text-gray-500">支付时间:</div>
                        <div>{order.payment.time}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium mb-3">配送信息</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <div className="w-24 text-gray-500">收货人:</div>
                      <div>{order.address.name}</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-gray-500">联系电话:</div>
                      <div>{order.address.phone}</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-gray-500">收货地址:</div>
                      <div>{`${order.address.province}${order.address.city}${order.address.district}${order.address.detail}`}</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 text-gray-500">配送方式:</div>
                      <div>{order.shipping.method}</div>
                    </div>
                    {order.shipping.trackingNumber && (
                      <div className="flex">
                        <div className="w-24 text-gray-500">物流单号:</div>
                        <div className="flex items-center">
                          <span>{order.shipping.trackingNumber}</span>
                          <button className="ml-2 text-primary text-xs border border-primary px-2 py-1 rounded hover:bg-blue-50">
                            复制
                          </button>
                          {order.shipping.company && (
                            <a 
                              href="#" 
                              className="ml-2 text-primary text-xs border border-primary px-2 py-1 rounded hover:bg-blue-50"
                              onClick={(e) => {
                                e.preventDefault();
                                alert('跳转到物流查询页面');
                              }}
                            >
                              查看物流
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 订单商品 */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium mb-4">商品信息</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-500">商品</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-500">单价</th>
                      <th className="px-4 py-2 text-center font-medium text-gray-500">数量</th>
                      <th className="px-4 py-2 text-right font-medium text-gray-500">小计</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {order.items.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="w-16 h-16 relative flex-shrink-0">
                              <Image 
                                src={item.image} 
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <Link 
                                href={`/product/${item.id}`}
                                className="font-medium hover:text-primary"
                              >
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">¥{item.price}</td>
                        <td className="px-4 py-4 text-center">{item.quantity}</td>
                        <td className="px-4 py-4 text-right font-medium">¥{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* 订单金额 */}
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium mb-4">订单金额</h2>
              <div className="flex justify-end">
                <div className="w-full md:w-80 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">商品总价:</span>
                    <span>¥{order.total - order.shipping.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">运费:</span>
                    <span>¥{order.shipping.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">优惠金额:</span>
                    <span className="text-red-500">- ¥0</span>
                  </div>
                  <div className="pt-3 border-t flex justify-between">
                    <span className="font-medium">实付款:</span>
                    <span className="font-bold text-primary text-xl">¥{order.total}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 订单状态跟踪 */}
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">订单状态跟踪</h2>
              <div className="relative">
                {/* 左侧时间轴 */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 ml-4"></div>
                
                {/* 状态记录 */}
                <div className="space-y-6 pl-12 relative">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="relative">
                      {/* 状态点 */}
                      <div className={`absolute -left-12 w-9 h-9 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-primary text-white' : 'bg-gray-100'
                      }`}>
                        <span className="text-sm">{index + 1}</span>
                      </div>
                      
                      {/* 状态内容 */}
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium">{event.status}</h3>
                          <span className="ml-3 text-sm text-gray-500">{event.time}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-4 justify-end">
            <Link 
              href="/account/orders" 
              className="px-6 py-2 border border-gray-300 rounded-md hover:border-gray-400"
            >
              返回列表
            </Link>
            
            {order.status === '待发货' && (
              <button 
                className="px-6 py-2 border border-red-300 text-red-500 rounded-md hover:bg-red-50"
                onClick={handleCancelOrder}
              >
                取消订单
              </button>
            )}
            
            {(order.status === '已发货' || order.status === '已完成') && (
              <button 
                className="px-6 py-2 border border-orange-300 text-orange-500 rounded-md hover:bg-orange-50"
                onClick={handleRefund}
              >
                申请退款
              </button>
            )}
            
            {order.status === '已完成' && (
              <Link 
                href="#" 
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                onClick={(e) => {
                  e.preventDefault();
                  // 这里可以实现再次购买逻辑
                  alert('商品已添加到购物车');
                }}
              >
                再次购买
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 