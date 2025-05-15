'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaShoppingCart, FaUser, FaHeart, FaBars, FaSearch, FaTimes } from 'react-icons/fa'
import { useCart } from '@/shared/contexts/CartContext'
import { useFavorites } from '@/shared/contexts/FavoritesContext'
import { useAuth } from '@/shared/contexts/AuthContext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { favorites } = useFavorites()
  const { user } = useAuth()
  
  // 检测滚动以添加阴影
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    // 重定向到搜索结果页
    window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
  }
  
  // 切换移动菜单
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  
  // 检查链接是否活跃
  const isActive = (path: string) => pathname === path
  
  return (
    <header className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      {/* 顶部导航 */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            Shop<span className="text-gray-800">Hub</span>
          </Link>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex space-x-8 text-gray-700">
            <Link href="/" className={`hover:text-indigo-600 ${isActive('/') ? 'text-indigo-600 font-medium' : ''}`}>
              首页
            </Link>
            <Link href="/products" className={`hover:text-indigo-600 ${isActive('/products') ? 'text-indigo-600 font-medium' : ''}`}>
              商品
            </Link>
            <Link href="/categories" className={`hover:text-indigo-600 ${isActive('/categories') ? 'text-indigo-600 font-medium' : ''}`}>
              分类
            </Link>
            <Link href="/about" className={`hover:text-indigo-600 ${isActive('/about') ? 'text-indigo-600 font-medium' : ''}`}>
              关于我们
            </Link>
            <Link href="/contact" className={`hover:text-indigo-600 ${isActive('/contact') ? 'text-indigo-600 font-medium' : ''}`}>
              联系我们
            </Link>
          </nav>
          
          {/* 搜索栏 */}
          <div className="hidden md:flex relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                placeholder="搜索商品..."
                className="px-4 py-2 w-64 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors"
              >
                <FaSearch />
              </button>
            </form>
          </div>
          
          {/* 用户操作 */}
          <div className="flex items-center space-x-4">
            {/* 收藏夹 */}
            <Link href="/favorites" className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors">
              <FaHeart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            
            {/* 购物车 */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors">
              <FaShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {/* 用户菜单 */}
            {user ? (
              <Link href="/account" className="p-2 text-gray-700 hover:text-indigo-600 transition-colors">
                <FaUser size={20} />
              </Link>
            ) : (
              <Link href="/auth/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                登录
              </Link>
            )}
            
            {/* 移动菜单按钮 */}
            <button 
              className="md:hidden p-2 text-gray-700 hover:text-indigo-600 transition-colors"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4">
          {/* 移动搜索 */}
          <form onSubmit={handleSearchSubmit} className="flex items-center mb-4">
            <input
              type="text"
              placeholder="搜索商品..."
              className="px-4 py-2 w-full border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors"
            >
              <FaSearch />
            </button>
          </form>
          
          {/* 移动导航链接 */}
          <nav className="flex flex-col space-y-3 text-gray-700">
            <Link 
              href="/" 
              className={`hover:text-indigo-600 p-2 ${isActive('/') ? 'text-indigo-600 font-medium bg-gray-50 rounded-md' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              首页
            </Link>
            <Link 
              href="/products" 
              className={`hover:text-indigo-600 p-2 ${isActive('/products') ? 'text-indigo-600 font-medium bg-gray-50 rounded-md' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              商品
            </Link>
            <Link 
              href="/categories" 
              className={`hover:text-indigo-600 p-2 ${isActive('/categories') ? 'text-indigo-600 font-medium bg-gray-50 rounded-md' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              分类
            </Link>
            <Link 
              href="/about" 
              className={`hover:text-indigo-600 p-2 ${isActive('/about') ? 'text-indigo-600 font-medium bg-gray-50 rounded-md' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              关于我们
            </Link>
            <Link 
              href="/contact" 
              className={`hover:text-indigo-600 p-2 ${isActive('/contact') ? 'text-indigo-600 font-medium bg-gray-50 rounded-md' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              联系我们
            </Link>
            
            {/* 用户链接 */}
            {user ? (
              <>
                <Link 
                  href="/account" 
                  className="hover:text-indigo-600 p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  我的账户
                </Link>
                <Link 
                  href="/orders" 
                  className="hover:text-indigo-600 p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  我的订单
                </Link>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/login" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  登录
                </Link>
                <Link 
                  href="/auth/register" 
                  className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  注册
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
} 
