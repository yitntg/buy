'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useAuth } from '../../context/AuthContext'

// 通知数据类型
interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'system' | 'order' | 'promotion';
  isRead: boolean;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: '系统维护通知',
      content: '尊敬的用户，我们将于2023年11月15日凌晨2:00-4:00进行系统维护，期间网站可能无法访问，敬请谅解。',
      date: '2023-11-13',
      type: 'system',
      isRead: false
    },
    {
      id: '2',
      title: '您的订单已发货',
      content: '订单号：ORD12345 已于今日发货，物流单号：SF1234567890，请注意查收。',
      date: '2023-11-10',
      type: 'order',
      isRead: true
    },
    {
      id: '3',
      title: '双十一优惠活动',
      content: '双十一全场商品8折起，还有满减优惠券等你来领！活动时间：2023-11-01至2023-11-11。',
      date: '2023-11-01',
      type: 'promotion',
      isRead: true
    },
    {
      id: '4',
      title: '会员积分更新',
      content: '您的订单（ORD12346）已确认收货，获得积分200点。当前总积分为1200点。',
      date: '2023-10-25',
      type: 'system',
      isRead: true
    },
    {
      id: '5',
      title: '新品上架通知',
      content: '您关注的品类有新品上架，快来查看吧！',
      date: '2023-10-20',
      type: 'promotion',
      isRead: false
    }
  ]);
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'order' | 'promotion'>('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  // 账户菜单项
  const menuItems = [
    { label: '个人信息', href: '/account', active: false },
    { label: '我的订单', href: '/account/orders', active: false },
    { label: '收货地址', href: '/account/addresses', active: false },
    { label: '支付方式', href: '/account/payment', active: false },
    { label: '优惠券', href: '/account/coupons', active: false },
    { label: '消息通知', href: '/account/notifications', active: true },
    { label: '账户安全', href: '/account/security', active: false },
  ];

  // 标记为已读
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  // 标记所有为已读
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setMessage({ type: 'success', text: '所有消息已标记为已读' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // 删除通知
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // 删除全部通知
  const deleteAllNotifications = () => {
    setNotifications([]);
    setMessage({ type: 'success', text: '所有消息已清空' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // 获取已过滤的通知列表
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => notification.type === activeTab);

  // 未读消息数量
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 获取类型对应的徽标颜色
  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case 'system':
        return 'bg-blue-100 text-blue-800';
      case 'order':
        return 'bg-green-100 text-green-800';
      case 'promotion':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取类型对应的文字
  const getTypeText = (type: string) => {
    switch(type) {
      case 'system':
        return '系统';
      case 'order':
        return '订单';
      case 'promotion':
        return '活动';
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
                <Link href="/" className="w-full text-red-500 hover:text-red-600 text-sm font-medium block text-center">
                  退出登录
                </Link>
              </div>
            </div>
            
            {/* 主内容区 */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">消息通知</h2>
                  
                  <div className="flex flex-wrap mt-3 sm:mt-0 gap-2">
                    <button 
                      onClick={markAllAsRead}
                      className="text-primary text-sm hover:underline"
                      disabled={notifications.every(n => n.isRead)}
                    >
                      全部标为已读
                    </button>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={deleteAllNotifications}
                      className="text-red-500 text-sm hover:underline"
                      disabled={notifications.length === 0}
                    >
                      清空所有消息
                    </button>
                  </div>
                </div>
                
                {message.text && (
                  <div className={`p-3 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                  </div>
                )}
                
                {/* 选项卡 */}
                <div className="mb-6 border-b">
                  <div className="flex flex-wrap -mb-px">
                    <button
                      className={`inline-block p-4 rounded-t-lg ${
                        activeTab === 'all'
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('all')}
                    >
                      全部消息
                      {notifications.length > 0 && (
                        <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {notifications.length}
                        </span>
                      )}
                    </button>
                    <button
                      className={`inline-block p-4 rounded-t-lg ${
                        activeTab === 'system'
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('system')}
                    >
                      系统通知
                      {notifications.filter(n => n.type === 'system').length > 0 && (
                        <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {notifications.filter(n => n.type === 'system').length}
                        </span>
                      )}
                    </button>
                    <button
                      className={`inline-block p-4 rounded-t-lg ${
                        activeTab === 'order'
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('order')}
                    >
                      订单消息
                      {notifications.filter(n => n.type === 'order').length > 0 && (
                        <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {notifications.filter(n => n.type === 'order').length}
                        </span>
                      )}
                    </button>
                    <button
                      className={`inline-block p-4 rounded-t-lg ${
                        activeTab === 'promotion'
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('promotion')}
                    >
                      活动通知
                      {notifications.filter(n => n.type === 'promotion').length > 0 && (
                        <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {notifications.filter(n => n.type === 'promotion').length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* 通知列表 */}
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-4">
                    {filteredNotifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`border rounded-lg p-4 relative transition-colors duration-200 ${
                          notification.isRead ? 'border-gray-200 bg-white' : 'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className={`font-medium ${notification.isRead ? 'text-gray-800' : 'text-black'}`}>
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></span>
                              )}
                              <span className={`ml-3 text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(notification.type)}`}>
                                {getTypeText(notification.type)}
                              </span>
                            </div>
                            <p className="text-gray-700 mb-2">{notification.content}</p>
                            <div className="text-sm text-gray-500">{notification.date}</div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            {!notification.isRead && (
                              <button 
                                onClick={() => markAsRead(notification.id)}
                                className="text-primary text-sm hover:underline"
                              >
                                标为已读
                              </button>
                            )}
                            <button 
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-500 text-sm hover:underline"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>暂无消息通知</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 