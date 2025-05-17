'use client'

import React from 'react'
import Link from 'next/link'
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white">
      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 商店信息 */}
          <div>
            <h3 className="text-xl font-bold mb-4">ShopHub</h3>
            <p className="text-gray-400 mb-4">
              我们致力于提供最优质的商品和最贴心的服务，为您的生活增添便利与乐趣。
            </p>
            {/* 社交媒体链接 */}
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
          
          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-bold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  使用条款
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  隐私政策
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 商品分类 */}
          <div>
            <h3 className="text-lg font-bold mb-4">商品分类</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/electronics" className="text-gray-400 hover:text-white transition-colors">
                  电子产品
                </Link>
              </li>
              <li>
                <Link href="/category/clothing" className="text-gray-400 hover:text-white transition-colors">
                  服装服饰
                </Link>
              </li>
              <li>
                <Link href="/category/home" className="text-gray-400 hover:text-white transition-colors">
                  家居生活
                </Link>
              </li>
              <li>
                <Link href="/category/beauty" className="text-gray-400 hover:text-white transition-colors">
                  美妆个护
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="text-gray-400 hover:text-white transition-colors">
                  运动户外
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 联系信息 */}
          <div>
            <h3 className="text-lg font-bold mb-4">联系我们</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-gray-400 mt-1 mr-3" />
                <span className="text-gray-400">上海市浦东新区张江高科技园区</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-gray-400 mr-3" />
                <span className="text-gray-400">400-123-4567</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-gray-400 mr-3" />
                <a href="mailto:info@shophub.com" className="text-gray-400 hover:text-white transition-colors">
                  info@shophub.com
                </a>
              </li>
            </ul>
            
            {/* 订阅表单 */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">订阅我们的通讯</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="您的邮箱地址" 
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-md flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors">
                  订阅
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 底部版权信息 */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* 版权信息 */}
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} ShopHub. 保留所有权利
            </p>
            
            {/* 底部链接 */}
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                使用条款
              </Link>
              <Link href="/shipping" className="text-gray-400 hover:text-white text-sm transition-colors">
                配送政策
              </Link>
              <Link href="/refund" className="text-gray-400 hover:text-white text-sm transition-colors">
                退款政策
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 