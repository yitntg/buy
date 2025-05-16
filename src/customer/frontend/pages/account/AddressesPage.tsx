'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// Header import removed
// Footer import removed
import { useAuth } from '@/shared/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import UserAvatar from '../../components/UserAvatar'
import AccountSidebar from '../../components/AccountSidebar'
import CustomerLayout from '../../components/CustomerLayout'

// 模拟地址数据类型
interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [isLoading, user, router]);
  
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: '张三',
      phone: '13800138000',
      province: '广东省',
      city: '深圳市',
      district: '南山区',
      detail: '科技园路000号A栋101室',
      isDefault: true
    },
    {
      id: '2',
      name: '李四',
      phone: '13900139000',
      province: '北京市',
      city: '北京市',
      district: '海淀区',
      detail: '中关村大街000号B座202室',
      isDefault: false
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  });

  // 账户菜单项
  const menuItems = [
    { label: '个人信息', href: '/account', active: false },
    { label: '我的订单', href: '/account/orders', active: false },
    { label: '收货地址', href: '/account/addresses', active: true },
    { label: '支付方式', href: '/account/payment', active: false },
    { label: '优惠券', href: '/account/coupons', active: false },
    { label: '消息通知', href: '/account/notifications', active: false },
    { label: '账户安全', href: '/account/security', active: false },
  ];

  // 添加会员注册时间
  const memberSince = '2023年10月'

  // 处理表单字段变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setNewAddress(prev => ({ ...prev, [name]: target.checked }));
    } else {
      setNewAddress(prev => ({ ...prev, [name]: value }));
    }
  };

  // 添加新地址
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newId = String(addresses.length + 1);
    const addressToAdd = {
      ...newAddress,
      id: newId
    } as Address;
    
    // 如果新地址设为默认，则取消其他地址的默认状态
    if (addressToAdd.isDefault) {
      setAddresses(prev => 
        prev.map(addr => ({ ...addr, isDefault: false }))
      );
    }
    
    setAddresses(prev => [...prev, addressToAdd]);
    setShowAddForm(false);
    setNewAddress({
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false
    });
  };

  // 设为默认地址
  const setAsDefault = (id: string) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }))
    );
  };

  // 删除地址
  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  return (
    <CustomerLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">我的账户</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 使用全局侧边栏组件 */}
          <AccountSidebar activePage="addresses" />
          
          {/* 主内容区 */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-medium">收货地址</h2>
                <button 
                  className="text-primary border border-primary px-4 py-1 rounded-md hover:bg-blue-50 text-sm"
                  onClick={() => setShowAddForm(true)}
                >
                  添加新地址
                </button>
              </div>
              
              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`border rounded-lg p-4 relative ${address.isDefault ? 'border-primary bg-blue-50' : 'border-gray-200'}`}
                    >
                      {address.isDefault && (
                        <span className="absolute top-2 right-2 text-xs px-2 py-1 bg-primary text-white rounded-full">
                          默认地址
                        </span>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{address.name}</p>
                          <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">
                        {address.province} {address.city} {address.district} {address.detail}
                      </p>
                      <div className="flex justify-end space-x-3 text-sm">
                        {!address.isDefault && (
                          <button 
                            onClick={() => setAsDefault(address.id)}
                            className="text-primary hover:text-blue-700"
                          >
                            设为默认
                          </button>
                        )}
                        <button 
                          onClick={() => deleteAddress(address.id)}
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
                  <p>您还没有添加任何收货地址</p>
                </div>
              )}
              
              {/* 添加新地址表单 */}
              {showAddForm && (
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">添加新地址</h3>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          收货人
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={newAddress.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          手机号码
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={newAddress.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                          省份
                        </label>
                        <input
                          type="text"
                          id="province"
                          name="province"
                          required
                          value={newAddress.province}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          城市
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          required
                          value={newAddress.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                          区/县
                        </label>
                        <input
                          type="text"
                          id="district"
                          name="district"
                          required
                          value={newAddress.district}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label htmlFor="detail" className="block text-sm font-medium text-gray-700 mb-1">
                          详细地址
                        </label>
                        <textarea
                          id="detail"
                          name="detail"
                          required
                          value={newAddress.detail}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={newAddress.isDefault}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                        设为默认收货地址
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
                        保存地址
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
} 
