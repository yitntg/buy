'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/shared/contexts/CartContext'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { useAuth } from '@/shared/contexts/AuthContext'
import { FaShoppingCart, FaUser, FaSearch, FaHeart, FaBars, FaTimes } from 'react-icons/fa'

export default function Header() {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { theme } = useTheme()
  const { user, isLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // 获取显示名称
  const getDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.username) return user.username;
    return user.email;
  }
  
  // 监听滚动事件来决定导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 切换移动端菜单
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  // 关闭移动端菜单
  const closeMenu = () => {
    setIsMenuOpen(false)
  }
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* 品牌Logo */}
          <Link href="/customer" className="text-2xl font-bold text-blue-600 flex items-center">
            <span>ShopHub</span>
          </Link>
          
          {/* 导航菜单 - 桌面端 */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/customer" 
              className={`hover:text-blue-600 transition-colors ${
                pathname === '/customer' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              首页
            </Link>
            <Link 
                            href="/customer/products"               className={`hover:text-blue-600 transition-colors ${                pathname === '/customer/products' || pathname.startsWith('/customer/product/')                   ? 'text-blue-600 font-medium'                   : 'text-gray-700'              }`}
            >
              全部商品
            </Link>
            <Link 
              href="/customer/categories" 
              className={`hover:text-blue-600 transition-colors ${
                pathname.startsWith('/customer/category/') || pathname === '/customer/categories' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              商品分类
            </Link>
            <Link 
              href="/customer/about" 
              className={`hover:text-blue-600 transition-colors ${
                pathname === '/customer/about' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              关于我们
            </Link>
            <Link 
              href="/customer/contact" 
              className={`hover:text-blue-600 transition-colors ${
                pathname === '/customer/contact' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              联系我们
            </Link>
          </nav>
          
          {/* 用户工具栏 */}
          <div className="flex items-center space-x-4">
            {/* 搜索按钮 */}
            <button 
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="搜索"
            >
              <FaSearch size={18} />
            </button>
            
            {/* 收藏夹 */}
            <Link 
              href="/customer/favorites" 
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
              aria-label="收藏夹"
            >
              <FaHeart size={18} />
            </Link>
            
            {/* 购物车 */}
            <Link 
              href="/customer/cart" 
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
              aria-label="购物车"
            >
              <FaShoppingCart size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            
            {/* 用户菜单 */}
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <Link 
                href="/customer/account" 
                className="p-1 rounded-full border-2 border-blue-200 hover:border-blue-400 transition-colors"
              >
                <img 
                  src={user.avatar || '/images/default-avatar.png'} 
                  alt={getDisplayName()} 
                  className="w-7 h-7 rounded-full"
                />
              </Link>
            ) : (
              <Link 
                href="/customer/login"
                className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                aria-label="登录"
              >
                <FaUser size={18} />
              </Link>
            )}
            
            {/* 移动端菜单按钮 */}
            <button 
              className="p-2 text-gray-700 md:hidden"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        <div className={`md:hidden fixed inset-0 z-50 bg-white transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-8">
              <Link href="/customer" className="text-2xl font-bold text-blue-600" onClick={closeMenu}>
                ShopHub
              </Link>
              <button 
                className="p-2 text-gray-700"
                onClick={closeMenu}
                aria-label="关闭菜单"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/customer" 
                className={`text-lg py-2 border-b border-gray-100 ${
                  pathname === '/customer' ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMenu}
              >
                首页
              </Link>
              <Link 
                                href="/customer/products"                 className={`text-lg py-2 border-b border-gray-100 ${                  pathname === '/customer/products' ? 'text-blue-600 font-medium' : 'text-gray-700'                }`}
                onClick={closeMenu}
              >
                全部商品
              </Link>
              <Link 
                href="/customer/categories" 
                className={`text-lg py-2 border-b border-gray-100 ${
                  pathname === '/customer/categories' ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMenu}
              >
                商品分类
              </Link>
              <Link 
                href="/customer/about" 
                className={`text-lg py-2 border-b border-gray-100 ${
                  pathname === '/customer/about' ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMenu}
              >
                关于我们
              </Link>
              <Link 
                href="/customer/contact" 
                className={`text-lg py-2 border-b border-gray-100 ${
                  pathname === '/customer/contact' ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMenu}
              >
                联系我们
              </Link>
              {!user && (
                <>
                  <Link 
                    href="/customer/login" 
                    className="text-lg py-2 text-blue-600"
                    onClick={closeMenu}
                  >
                    登录
                  </Link>
                  <Link 
                    href="/customer/register" 
                    className="text-lg py-2 text-blue-600"
                    onClick={closeMenu}
                  >
                    注册
                  </Link>
                </>
              )}
            </nav>
            
            {user && (
              <div className="mt-8 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={user.avatar || '/images/default-avatar.png'} 
                    alt={getDisplayName()} 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{getDisplayName()}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <Link 
                    href="/customer/account" 
                    className="flex items-center space-x-2 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    <span>我的账户</span>
                  </Link>
                  <Link 
                    href="/customer/account/orders" 
                    className="flex items-center space-x-2 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    <span>我的订单</span>
                  </Link>
                  <Link 
                    href="/customer/favorites" 
                    className="flex items-center space-x-2 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    <span>收藏夹</span>
                  </Link>
                  <button 
                    className="w-full flex items-center space-x-2 text-red-600 py-2 px-3 rounded-md hover:bg-red-50 mt-4"
                    onClick={() => {
                      // 处理登出
                      closeMenu();
                    }}
                  >
                    <span>退出登录</span>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 