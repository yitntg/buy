'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  // 模拟用户登录状态
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // 模拟用户数据
  const user = {
    name: '张三',
    avatar: 'https://picsum.photos/id/64/200/200'
  }
  
  // 模拟用户菜单状态
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            乐购商城
          </Link>
        </div>
        
        <div className="flex-1 max-w-xl px-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索商品..."
              className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1 rounded-full">
              🔍
            </button>
          </div>
        </div>
        
        <nav className="flex items-center space-x-6">
          <Link href="/products" className="text-gray-700 hover:text-primary">
            商品分类
          </Link>
          <Link href="/cart" className="text-gray-700 hover:text-primary relative">
            购物车
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </Link>
          
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-gray-700">{user.name}</span>
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
                  <Link href="/upload" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    上传商品
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => setIsLoggedIn(false)}
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
          
          <Link href="/upload" className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600">
            上传商品
          </Link>
        </nav>
      </div>
    </header>
  )
} 