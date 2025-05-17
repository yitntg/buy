'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/app/(shared)/contexts/AuthContext'
import UserAvatar from './UserAvatar'

interface AccountSidebarProps {
  activePage: string;
}

export default function AccountSidebar({ activePage }: AccountSidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  // 账户菜单项
  const menuItems = [
    { label: '个人信息', href: '/account', active: activePage === 'profile' },
    { label: '我的订单', href: '/account/orders', active: activePage === 'orders' },
    { label: '收货地址', href: '/account/addresses', active: activePage === 'addresses' },
    { label: '支付方式', href: '/account/payment', active: activePage === 'payment' },
    { label: '优惠券', href: '/account/coupons', active: activePage === 'coupons' },
    { label: '消息通知', href: '/account/notifications', active: activePage === 'notifications' },   
    { label: '账户安全', href: '/account/security', active: activePage === 'security' },
  ];

  // 添加会员注册时间
  const memberSince = '2023年10月'

  // 未读消息数量 (在通知页面中才会用到)
  const unreadCount = activePage === 'notifications' ? 2 : 0;

  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <div className="lg:w-1/4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="relative">
            <UserAvatar
              user={{
                username: user?.username || '用户',
                avatar: user?.avatar
              }}
              size={64}
              border={true}
              borderColor="#f0f0f0"
            />
          </div>
          <div className="ml-4">
            <h3 className="font-medium">{user?.username || '用户'}</h3>
            <p className="text-sm text-gray-500">会员自 {memberSince}</p>
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
                  {item.label === '消息通知' && unreadCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <button 
          onClick={handleLogout}
          className="w-full text-red-500 hover:text-red-600 text-sm font-medium block text-center"
        >
          退出登录
        </button>
      </div>
    </div>
  );
} 