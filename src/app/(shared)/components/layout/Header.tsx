'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/app/(shared)/contexts/AuthContext'
import { useCart } from '@/app/(shared)/contexts/CartContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { items } = useCart()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* 网站Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            乐购商城
          </Link>

          {/* 导航菜单 - 桌面版 */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary">
              首页
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-primary">
              全部商品
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-primary">
              商品分类
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary">
              关于我们
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary">
              联系我们
            </Link>
          </nav>

          {/* 用户操作区 */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/favorites" className="text-gray-600 hover:text-primary">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </Link>
            <Link href="/cart" className="text-gray-600 hover:text-primary">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {items.length > 0 && (
                  <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs absolute -mt-2 ml-4">
                    {items.length}
                  </span>
                )}
              </span>
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center text-gray-600 hover:text-primary">
                  <span className="mr-1">{user.firstName || user.username}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link href="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    个人中心
                  </Link>
                  <Link href="/account/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    我的订单
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      管理后台
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="text-gray-600 hover:text-primary">
                  登录
                </Link>
                <Link href="/register" className="text-gray-600 hover:text-primary">
                  注册
                </Link>
              </div>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <button className="md:hidden" onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <nav className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-600 hover:text-primary" onClick={toggleMenu}>
                首页
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-primary" onClick={toggleMenu}>
                全部商品
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-primary" onClick={toggleMenu}>
                商品分类
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-primary" onClick={toggleMenu}>
                关于我们
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-primary" onClick={toggleMenu}>
                联系我们
              </Link>
              <div className="pt-2 border-t border-gray-200">
                {user ? (
                  <>
                    <Link href="/account" className="block py-1 text-gray-600 hover:text-primary" onClick={toggleMenu}>
                      个人中心
                    </Link>
                    <Link href="/account/orders" className="block py-1 text-gray-600 hover:text-primary" onClick={toggleMenu}>
                      我的订单
                    </Link>
                    <Link href="/favorites" className="block py-1 text-gray-600 hover:text-primary" onClick={toggleMenu}>
                      我的收藏
                    </Link>
                    <Link href="/cart" className="block py-1 text-gray-600 hover:text-primary" onClick={toggleMenu}>
                      购物车 ({items.length})
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="block py-1 text-gray-600 hover:text-primary" onClick={toggleMenu}>
                        管理后台
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout()
                        toggleMenu()
                      }}
                      className="block w-full text-left py-1 text-gray-600 hover:text-primary"
                    >
                      退出登录
                    </button>
                  </>
                ) : (
                  <div className="flex space-x-4">
                    <Link href="/login" className="text-gray-600 hover:text-primary" onClick={toggleMenu}>
                      登录
                    </Link>
                    <Link href="/register" className="text-gray-600 hover:text-primary" onClick={toggleMenu}>
                      注册
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 