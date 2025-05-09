'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useAuth } from '../../context/AuthContext'

// 支付卡数据类型
interface PaymentCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  isDefault: boolean;
  type: 'visa' | 'mastercard' | 'unionpay' | 'alipay' | 'wechatpay';
}

export default function PaymentPage() {
  const { user } = useAuth();
  const [cards, setCards] = useState<PaymentCard[]>([
    {
      id: '1',
      cardNumber: '6222 **** **** 1234',
      cardHolder: '张三',
      expiry: '09/27',
      isDefault: true,
      type: 'unionpay'
    },
    {
      id: '2',
      cardNumber: '4242 **** **** 5678',
      cardHolder: '张三',
      expiry: '12/25',
      isDefault: false,
      type: 'visa'
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
    isDefault: false,
    type: 'unionpay'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // 账户菜单项
  const menuItems = [
    { label: '个人信息', href: '/account', active: false },
    { label: '我的订单', href: '/account/orders', active: false },
    { label: '收货地址', href: '/account/addresses', active: false },
    { label: '支付方式', href: '/account/payment', active: true },
    { label: '优惠券', href: '/account/coupons', active: false },
    { label: '消息通知', href: '/account/notifications', active: false },
    { label: '账户安全', href: '/account/security', active: false },
  ];

  // 处理表单字段变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setNewCard(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setNewCard(prev => ({ ...prev, [name]: value }));
    }
  };

  // 添加新卡
  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 格式化卡号显示
    const maskedNumber = `${newCard.cardNumber.substring(0, 4)} **** **** ${newCard.cardNumber.slice(-4)}`;
    
    const newId = String(cards.length + 1);
    const cardToAdd = {
      id: newId,
      cardNumber: maskedNumber,
      cardHolder: newCard.cardHolder,
      expiry: newCard.expiry,
      isDefault: newCard.isDefault,
      type: newCard.type
    } as PaymentCard;
    
    // 如果新卡设为默认，则取消其他卡的默认状态
    if (cardToAdd.isDefault) {
      setCards(prev => 
        prev.map(card => ({ ...card, isDefault: false }))
      );
    }
    
    setCards(prev => [...prev, cardToAdd]);
    setShowAddForm(false);
    setNewCard({
      cardNumber: '',
      cardHolder: '',
      expiry: '',
      cvv: '',
      isDefault: false,
      type: 'unionpay'
    });
    
    setMessage({ type: 'success', text: '支付卡添加成功' });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // 设为默认卡
  const setAsDefault = (id: string) => {
    setCards(prev => 
      prev.map(card => ({
        ...card,
        isDefault: card.id === id
      }))
    );
  };

  // 删除卡
  const deleteCard = (id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  // 获取卡类型的图标
  const getCardIcon = (type: string) => {
    switch(type) {
      case 'visa':
        return (
          <div className="flex items-center justify-center h-8 w-12 bg-blue-50 rounded">
            <span className="text-blue-700 font-bold text-xs">VISA</span>
          </div>
        );
      case 'mastercard':
        return (
          <div className="flex items-center justify-center h-8 w-12 bg-red-50 rounded">
            <span className="text-red-700 font-bold text-xs">MC</span>
          </div>
        );
      case 'unionpay':
        return (
          <div className="flex items-center justify-center h-8 w-12 bg-green-50 rounded">
            <span className="text-green-700 font-bold text-xs">银联</span>
          </div>
        );
      case 'alipay':
        return (
          <div className="flex items-center justify-center h-8 w-12 bg-blue-50 rounded">
            <span className="text-blue-700 font-bold text-xs">支付宝</span>
          </div>
        );
      case 'wechatpay':
        return (
          <div className="flex items-center justify-center h-8 w-12 bg-green-50 rounded">
            <span className="text-green-700 font-bold text-xs">微信</span>
          </div>
        );
      default:
        return null;
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-medium">支付方式</h2>
                  <button 
                    className="text-primary border border-primary px-4 py-1 rounded-md hover:bg-blue-50 text-sm"
                    onClick={() => setShowAddForm(true)}
                  >
                    添加支付卡
                  </button>
                </div>
                
                {message.text && (
                  <div className={`p-3 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                  </div>
                )}
                
                {cards.length > 0 ? (
                  <div className="space-y-4">
                    {cards.map(card => (
                      <div 
                        key={card.id} 
                        className={`border rounded-lg p-4 relative ${card.isDefault ? 'border-primary bg-blue-50' : 'border-gray-200'}`}
                      >
                        {card.isDefault && (
                          <span className="absolute top-2 right-2 text-xs px-2 py-1 bg-primary text-white rounded-full">
                            默认支付方式
                          </span>
                        )}
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {getCardIcon(card.type)}
                            <div className="ml-4">
                              <p className="font-medium">{card.cardNumber}</p>
                              <div className="flex text-sm text-gray-600 mt-1">
                                <span>{card.cardHolder}</span>
                                <span className="mx-2">•</span>
                                <span>有效期至 {card.expiry}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-3 text-sm mt-4">
                          {!card.isDefault && (
                            <button 
                              onClick={() => setAsDefault(card.id)}
                              className="text-primary hover:text-blue-700"
                            >
                              设为默认
                            </button>
                          )}
                          <button 
                            onClick={() => deleteCard(card.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>您还没有添加任何支付方式</p>
                  </div>
                )}
                
                {/* 添加新卡表单 */}
                {showAddForm && (
                  <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">添加新支付卡</h3>
                    <form onSubmit={handleAddCard} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cardType" className="block text-sm font-medium text-gray-700 mb-1">
                            卡类型
                          </label>
                          <select
                            id="type"
                            name="type"
                            value={newCard.type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="unionpay">银联卡</option>
                            <option value="visa">Visa</option>
                            <option value="mastercard">MasterCard</option>
                            <option value="alipay">支付宝</option>
                            <option value="wechatpay">微信支付</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            卡号
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="**** **** **** ****"
                            required
                            value={newCard.cardNumber}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                            持卡人姓名
                          </label>
                          <input
                            type="text"
                            id="cardHolder"
                            name="cardHolder"
                            required
                            value={newCard.cardHolder}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                              有效期
                            </label>
                            <input
                              type="text"
                              id="expiry"
                              name="expiry"
                              placeholder="MM/YY"
                              required
                              value={newCard.expiry}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                              安全码
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              placeholder="***"
                              required
                              value={newCard.cvv}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isDefault"
                          name="isDefault"
                          checked={newCard.isDefault}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                          设为默认支付方式
                        </label>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowAddForm(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          取消
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600"
                        >
                          保存
                        </button>
                      </div>
                    </form>
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