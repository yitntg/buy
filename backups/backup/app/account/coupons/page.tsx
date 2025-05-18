'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// Header import removed
// Footer import removed
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import AccountSidebar from '../../components/AccountSidebar'

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

  // 添加会员注册时间
  const memberSince = '2023年10月'

  return (
    <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">我的账户</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 使用全局侧边栏组件 */}
            <AccountSidebar activePage="coupons" />
            
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
  )
} 