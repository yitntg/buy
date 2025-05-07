'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'

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
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            乐购商城
          </Link>
        </div>
        
        <div className="flex-1 max-w-xl px-6">
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
        
        <nav className="flex items-center space-x-6">
          <Link 
            href="/products" 
            className="text-gray-700 hover:text-primary"
          >
            商品分类
          </Link>

          <Link href="/cart" className="text-gray-700 hover:text-primary relative">
            购物车
            {itemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemsCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={handleUserMenuClick}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={user?.avatar || 'https://picsum.photos/id/64/200/200'}
                    alt={user?.username || '用户'}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-gray-700">{user?.username}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    我的账户
                  </Link>
                  <Link href="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    我的订单
                  </Link>
                  <Link href="/account/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    收藏夹
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-primary">
                登录
              </Link>
              <Link href="/auth/register" className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600">
                注册
              </Link>
            </div>
          )}
          
          {isAuthenticated && isAdmin && (
            <div className="relative ml-4">
              <Link
                href="/admin"
                className="flex items-center space-x-1 text-gray-700 hover:text-primary focus:outline-none"
              >
                <span>管理</span>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
} 