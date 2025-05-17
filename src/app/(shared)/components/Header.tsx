'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 客户端页面导航组件
export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 主导航链接
  const navLinks = [
    { href: '/', label: '首页' },
    { href: '/products', label: '全部商品' },
    { href: '/categories', label: '商品分类' },
    { href: '/about', label: '关于我们' },
    { href: '/contact', label: '联系我们' },
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center">
            <span>ShopHub</span>
          </Link>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-blue-600 transition-colors ${
                    isActive ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          {/* 用户功能 */}
          <div className="flex items-center space-x-4">
            {/* 搜索按钮 */}
            <button className="p-2 text-gray-700 hover:text-blue-600 transition-colors" aria-label="搜索">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
              </svg>
            </button>
            
            {/* 收藏夹 */}
            <Link 
              href="/favorites" 
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative" 
              aria-label="收藏夹"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path>
              </svg>
            </Link>
            
            {/* 购物车 */}
            <Link 
              href="/cart" 
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors relative" 
              aria-label="购物车"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M528.12 301.319l47.273-208C578.806 78.301 567.391 64 551.99 64H159.208l-9.166-44.81C147.758 8.021 137.93 0 126.529 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24h69.883l70.248 343.435C147.325 417.1 136 435.222 136 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-15.674-6.447-29.835-16.824-40h209.647C430.447 426.165 424 440.326 424 456c0 30.928 25.072 56 56 56s56-25.072 56-56c0-22.172-12.888-41.332-31.579-50.405l5.517-24.276c3.413-15.018-8.002-29.319-23.403-29.319H218.117l-6.545-32h293.145c11.206 0 20.92-7.754 23.403-18.681z"></path>
              </svg>
            </Link>
            
            {/* 用户头像 */}
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            
            {/* 移动端菜单开关 */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 md:hidden" 
              aria-label="打开菜单"
            >
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
              </svg>
            </button>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        <div className={`md:hidden fixed inset-0 z-50 bg-white transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-8">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                ShopHub
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-700" 
                aria-label="关闭菜单"
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
                </svg>
              </button>
            </div>
            
            {/* 移动端导航 */}
            <nav className="flex flex-col space-y-4">
              {navLinks.map(link => {
                const isActive = pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg py-2 border-b border-gray-100 ${
                      isActive ? 'text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              {/* 移动端登录/注册 */}
              <Link href="/login" className="text-lg py-2 text-blue-600">
                登录
              </Link>
              <Link href="/register" className="text-lg py-2 text-blue-600">
                注册
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
} 