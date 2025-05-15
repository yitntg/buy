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
            <h3 className="text-xl font-bold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white transition-colors">
                  商品列表
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors">
                  商品分类
                </Link>
              </li>
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
            </ul>
          </div>
          
          {/* 用户服务 */}
          <div>
            <h3 className="text-xl font-bold mb-4">用户服务</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/account" className="text-gray-400 hover:text-white transition-colors">
                  我的账户
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-400 hover:text-white transition-colors">
                  订单追踪
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-gray-400 hover:text-white transition-colors">
                  收藏列表
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-white transition-colors">
                  购物车
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                  客户支持
                </Link>
              </li>
            </ul>
          </div>
          
          {/* 联系信息 */}
          <div>
            <h3 className="text-xl font-bold mb-4">联系我们</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-indigo-500 mt-1 mr-3" />
                <span className="text-gray-400">
                  北京市朝阳区建国路88号
                  <br />
                  金融中心A座1805室
                </span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-indigo-500 mr-3" />
                <span className="text-gray-400">+86 10 8888 7777</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-indigo-500 mr-3" />
                <span className="text-gray-400">contact@shophub.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* 分隔线 */}
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