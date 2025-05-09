'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useAuth } from '../../context/AuthContext'

// 优惠券数据类型
interface Coupon {
  id: string;
  code: string;
  discount: string;
  minPurchase: number;
  description: string;
  validUntil: string;
  status: 'valid' | 'used' | 'expired';
}

export default function CouponsPage() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: '1',
      code: 'WELCOME2023',
      discount: '¥50',
      minPurchase: 300,
      description: '新用户首单满¥300减¥50',
      validUntil: '2023-12-31',
      status: 'valid'
    },
    {
      id: '2',
      code: 'SUMMER10',
      discount: '10%',
      minPurchase: 100,
      description: '夏季促销满¥100打9折',
      validUntil: '2023-08-31',
      status: 'expired'
    },
    {
      id: '3',
      code: 'MEMBER50',
      discount: '¥50',
      minPurchase: 500,
      description: '会员专享满¥500减¥50',
      validUntil: '2023-12-15',
      status: 'used'
    }
  ]);
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // 账户菜单项
  const menuItems = [
    { label: '个人信息', href: '/account', active: false },
    { label: '我的订单', href: '/account/orders', active: false },
    { label: '收货地址', href: '/account/addresses', active: false },
    { label: '支付方式', href: '/account/payment', active: false },
    { label: '优惠券', href: '/account/coupons', active: true },
    { label: '消息通知', href: '/account/notifications', active: false },
    { label: '账户安全', href: '/account/security', active: false },
  ];

  // 领取优惠券
  const handleRedeemCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setMessage({ type: 'error', text: '请输入优惠券码' });
      return;
    }
    
    // 模拟优惠券码验证逻辑
    if (couponCode.toUpperCase() === 'NEWYEAR2023') {
      const newCoupon: Coupon = {
        id: String(coupons.length + 1),
        code: 'NEWYEAR2023',
        discount: '¥100',
        minPurchase: 500,
        description: '新年特惠满¥500减¥100',
        validUntil: '2023-12-31',
        status: 'valid'
      };
      
      setCoupons(prev => [...prev, newCoupon]);
      setMessage({ type: 'success', text: '优惠券兑换成功！' });
      setCouponCode('');
    } else {
      setMessage({ type: 'error', text: '无效的优惠券码或已被使用' });
    }
    
    // 3秒后清除消息
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // 根据状态显示不同样式
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  // 根据状态显示文字
  const getStatusText = (status: string) => {
    switch(status) {
      case 'valid':
        return '可使用';
      case 'used':
        return '已使用';
      case 'expired':
        return '已过期';
      default:
        return '';
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">我的账户</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏菜单 */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.username} 
                        className="object-cover w-full h-full" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{user?.username || '用户'}</h3>
                    <p className="text-sm text-gray-500">会员</p>
                  </div>
                </div>
                
                <nav>
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={`block px-3 py-2 rounded-md ${
                            item.active
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <Link href="/" className="w-full text-red-500 hover:text-red-600 text-sm font-medium block text-center">
                  退出登录
                </Link>
              </div>
            </div>
            
            {/* 主内容区 */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-medium mb-6">我的优惠券</h2>
                
                {message.text && (
                  <div className={`p-3 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                  </div>
                )}
                
                <div className="mb-6">
                  <form onSubmit={handleRedeemCoupon} className="flex">
                    <input
                      type="text"
                      placeholder="输入优惠券码"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      className="bg-primary text-white px-6 py-2 rounded-r-md hover:bg-blue-600"
                    >
                      兑换
                    </button>
                  </form>
                  <p className="text-sm text-gray-500 mt-2">
                    输入优惠券码以获取折扣。例如尝试输入: NEWYEAR2023
                  </p>
                </div>
                
                {coupons.length > 0 ? (
                  <div className="space-y-4">
                    {coupons.map(coupon => (
                      <div 
                        key={coupon.id}
                        className={`border rounded-lg p-4 ${coupon.status === 'valid' ? 'border-primary' : 'border-gray-200'}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center mb-2">
                              <h3 className="font-bold text-lg mr-3">{coupon.discount} 优惠</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(coupon.status)}`}>
                                {getStatusText(coupon.status)}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{coupon.description}</p>
                            <div className="flex flex-col sm:flex-row text-sm text-gray-500">
                              <span className="sm:mr-4">优惠码: <strong>{coupon.code}</strong></span>
                              <span>有效期至: {coupon.validUntil}</span>
                            </div>
                          </div>
                          
                          {coupon.status === 'valid' && (
                            <div className="mt-4 md:mt-0">
                              <Link 
                                href="/products" 
                                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 inline-block"
                              >
                                去使用
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>您还没有任何优惠券</p>
                  </div>
                )}
                
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">优惠券使用须知</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>优惠券仅可在有效期内使用</li>
                    <li>优惠券不可与其他优惠活动同时使用</li>
                    <li>每个订单仅限使用一张优惠券</li>
                    <li>优惠券金额不可超过实际消费金额</li>
                    <li>使用限制请参考优惠券说明</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 