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
          <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center">
            <span>ShopHub</span>
          </Link>
          
          {/* 导航菜单 - 桌面端 */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className={`hover:text-blue-600 transition-colors ${
                pathname === '/' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              首页
            </Link>
            <Link 
              href="/products" 
              className={`hover:text-blue-600 transition-colors ${
                pathname === '/products' || pathname.startsWith('/product/') 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-700'
              }`}
            >
              全部商品
            </Link>
            <Link 
              href="/categories" 
              className={`hover:text-blue-600 transition-colors ${
                pathname.startsWith('/category/') ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              商品分类
            </Link>
            <Link 
              href="/about" 
              className={`hover:text-blue-600 transition-colors ${
                pathname === '/about' ? 'text-blue-600 font-medium' : 'text-gray-700'
              }`}
            >
              关于我们
            </Link>
            <Link 
              href="/contact" 
              className={`hover:text-blue-600 transition-colors ${
                pathname === '/contact' ? 'text-blue-600 font-medium' : 'text-gray-700'
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
              href="/favorites" 
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative"
              aria-label="收藏夹"
            >
              <FaHeart size={18} />
            </Link>
            
            {/* 购物车 */}
            <Link 
              href="/cart" 
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
                href="/account" 
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
                href="/login"
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
              <Link href="/" className="text-2xl font-bold text-blue-600" onClick={closeMenu}>
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
                href="/" 
                className={`text-lg py-2 border-b border-gray-100 ${
                  pathname === '/' ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMenu}
              >
                首页
              </Link>
              <Link 
                href="/products" 
                className={`text-lg py-2 border-b border-gray-100 ${
                  pathname === '/products' ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMenu}
              >
                全部商品
              </Link>
              <Link 
                href="/categories" 
                className={`text-lg py-2 border-b border-gray-100 ${
                  pathname === '/categories' ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMenu}
              >
                商品分类
              </Link>
              <Link 
                href="/about" 
                className={`text-lg py-2 border-b border-gray-100 ${
                  pathname === '/about' ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMenu}
              >
                关于我们
              </Link>
              <Link 
                href="/contact" 
                className={`text-lg py-2 border-b border-gray-100 ${
                  pathname === '/contact' ? 'text-blue-600 font-medium' : 'text-gray-700'
                }`}
                onClick={closeMenu}
              >
                联系我们
              </Link>
              {!user && (
                <>
                  <Link 
                    href="/login" 
                    className="text-lg py-2 text-blue-600"
                    onClick={closeMenu}
                  >
                    登录
                  </Link>
                  <Link 
                    href="/register" 
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
                <Link 
                  href="/account" 
                  className="flex items-center space-x-3 mb-4"
                  onClick={closeMenu}
                >
                  <img 
                    src={user.avatar || '/images/default-avatar.png'} 
                    alt={getDisplayName()} 
                    className="w-10 h-10 rounded-full border-2 border-blue-200"
                  />
                  <div>
                    <div className="font-medium">{getDisplayName()}</div>
                    <div className="text-sm text-gray-500">管理您的帐户</div>
                  </div>
                </Link>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/orders" 
                    className="bg-gray-100 rounded-lg p-3 text-center hover:bg-gray-200"
                    onClick={closeMenu}
                  >
                    我的订单
                  </Link>
                  <Link 
                    href="/favorites" 
                    className="bg-gray-100 rounded-lg p-3 text-center hover:bg-gray-200"
                    onClick={closeMenu}
                  >
                    我的收藏
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 