'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import UserAvatar from './UserAvatar'
import { Menu } from '@headlessui/react'

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { items, itemsCount } = useCart()
  const router = useRouter()
  
  // 模拟用户菜单状态
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  // 管理菜单状态
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
  // 搜索关键词
  const [searchQuery, setSearchQuery] = useState('')
  // 移动端菜单状态
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // 是否为移动设备
  const [isMobile, setIsMobile] = useState(false)
  
  // 检测设备尺寸
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 初始检查
    checkIfMobile();
    
    // 添加事件监听器
    window.addEventListener('resize', checkIfMobile);
    
    // 清理函数
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // 切换移动端菜单状态
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // 如果打开移动菜单，关闭其他菜单
    if (!isMobileMenuOpen) {
      setIsUserMenuOpen(false);
      setIsAdminMenuOpen(false);
    }
  };
  
  // 关闭所有菜单
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsAdminMenuOpen(false);
  };
  
  // 分类数据
  const categories = [
    { id: 1, name: '电子产品' },
    { id: 2, name: '家居用品' },
    { id: 3, name: '服装鞋帽' },
    { id: 4, name: '美妆护肤' },
    { id: 5, name: '食品饮料' },
    { id: 6, name: '运动户外' },
  ]
  
  // 关闭菜单的处理函数
  const handleClickOutside = () => {
    if (isUserMenuOpen) {
      setIsUserMenuOpen(false)
    }
    if (isAdminMenuOpen) {
      setIsAdminMenuOpen(false)
    }
  }
  
  // 添加全局点击事件监听器
  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isUserMenuOpen, isAdminMenuOpen])
  
  // 用户菜单点击处理函数
  const handleUserMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    setIsUserMenuOpen(!isUserMenuOpen)
    // 关闭其他菜单
    if (isAdminMenuOpen) {
      setIsAdminMenuOpen(false)
    }
  }
  
  // 管理菜单点击处理函数
  const handleAdminMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    setIsAdminMenuOpen(!isAdminMenuOpen)
    // 关闭其他菜单
    if (isUserMenuOpen) {
      setIsUserMenuOpen(false)
    }
  }
  
  // 退出登录处理函数
  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push('/')
  }
  
  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }
  
  // 处理搜索框键盘事件
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
  }
  
  // 检查用户是否是管理员
  const isAdmin = user?.role === 'admin'
  
  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo 和品牌名称 */}
        <div className="flex items-center">
          <Link href="/products" className="text-2xl font-bold text-primary">
            乐购商城
          </Link>
        </div>
        
        {/* 搜索框 - 在移动端隐藏 */}
        <div className="flex-1 max-w-xl px-6 hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="搜索商品..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1 rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
        
        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        
        {/* 桌面端导航 */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/products" 
            className="text-gray-700 hover:text-primary"
            title="商品分类"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </Link>

          <Link href="/favorites" className="text-gray-700 hover:text-primary relative" title="收藏夹">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Link>

          <Link href="/cart" className="text-gray-700 hover:text-primary relative" title="购物车">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="relative">
              <Link
                href="/account"
                className="flex items-center focus:outline-none"
                title={user?.username || '用户'}
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="relative w-8 h-8">
                  <UserAvatar 
                    user={user} 
                    size={32} 
                    showStatusIndicator={true}
                    status="online"
                    border={true}
                    borderColor="#f9fafb"
                  />
                </div>
              </Link>
              
              {/* 用户个人中心选项，根据用户角色显示不同选项 */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 hidden md:block" style={{ display: isUserMenuOpen ? 'block' : 'none' }}>
                <div className="py-1">
                  <Link 
                    href="/account" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    个人中心
                  </Link>
                  {isAdmin && (
                    <Link 
                      href="/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      管理后台
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="bg-primary text-white p-1.5 rounded-full hover:bg-blue-600" title="登录/注册">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </Link>
            </div>
          )}
          
          {isAuthenticated && isAdmin && (
            <div className="relative ml-4">
              <Link
                href="/admin"
                className="text-gray-700 hover:text-primary"
                title="管理后台"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Link>
            </div>
          )}
        </nav>
      </div>
      
      {/* 移动端导航菜单 */}
      <div 
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeAllMenus}
      ></div>
      
      <div 
        className={`fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-medium">菜单</h2>
          <button 
            onClick={closeAllMenus}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* 移动端搜索框 */}
        <div className="p-4 border-b">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="搜索商品..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1 rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
        
        {/* 移动端菜单项 */}
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link 
                href="/products"
                className="flex items-center py-2 text-gray-700 hover:text-primary"
                onClick={closeAllMenus}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                商城首页
              </Link>
            </li>
            <li>
              <Link 
                href="/products"
                className="flex items-center py-2 text-gray-700 hover:text-primary"
                onClick={closeAllMenus}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                全部商品
              </Link>
            </li>
            <li>
              <Link 
                href="/favorites"
                className="flex items-center py-2 text-gray-700 hover:text-primary"
                onClick={closeAllMenus}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                收藏夹
              </Link>
            </li>
            <li>
              <Link 
                href="/cart"
                className="flex items-center py-2 text-gray-700 hover:text-primary"
                onClick={closeAllMenus}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                购物车
                {itemsCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemsCount}
                  </span>
                )}
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    href="/account"
                    className="flex items-center py-2 text-gray-700 hover:text-primary"
                    onClick={closeAllMenus}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    我的账户
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link 
                      href="/admin"
                      className="flex items-center py-2 text-gray-700 hover:text-primary"
                      onClick={closeAllMenus}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      管理后台
                    </Link>
                  </li>
                )}
                <li className="border-t mt-2 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full py-2 text-red-600 hover:text-red-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    退出登录
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link 
                  href="/auth/login"
                  className="flex items-center py-2 text-gray-700 hover:text-primary"
                  onClick={closeAllMenus}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  登录/注册
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
} 