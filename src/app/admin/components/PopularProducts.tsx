'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/src/app/(shared)/utils/formatters'

interface PopularProduct {
  id: number;
  name: string;
  image: string;
  price: number;
  sales: number;
  inventory: number;
  trend: 'up' | 'down' | 'stable';
}

export default function PopularProducts() {
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState<PopularProduct[]>([])
  
  // 获取热门商品数据
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        // 模拟API调用
        // const response = await fetch('/api/admin/products/popular')
        // const data = await response.json()
        
        // 模拟数据
        setTimeout(() => {
          setProducts([
            {
              id: 1,
              name: '高级智能手表 Pro',
              image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
              price: 1299,
              sales: 158,
              inventory: 42,
              trend: 'up'
            },
            {
              id: 2,
              name: '无线蓝牙耳机',
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
              price: 299,
              sales: 243,
              inventory: 56,
              trend: 'up'
            },
            {
              id: 3,
              name: '超薄笔记本电脑',
              image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
              price: 5999,
              sales: 87,
              inventory: 12,
              trend: 'stable'
            },
            {
              id: 4,
              name: '专业摄影相机',
              image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f',
              price: 4599,
              sales: 63,
              inventory: 8,
              trend: 'down'
            },
            {
              id: 5,
              name: '家用智能音箱',
              image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f',
              price: 599,
              sales: 196,
              inventory: 24,
              trend: 'up'
            }
          ])
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error('获取热门商品失败:', error)
        setIsLoading(false)
      }
    }
    
    fetchPopularProducts()
  }, [])
  
  // 获取趋势图标和颜色
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return (
          <span className="text-green-500 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
            </svg>
            上升
          </span>
        );
      case 'down':
        return (
          <span className="text-red-500 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 10.586 3.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
            </svg>
            下降
          </span>
        );
      case 'stable':
        return (
          <span className="text-gray-500 inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
              <path fillRule="evenodd" d="M18 10a1 1 0 01-1 1H3a1 1 0 110-2h14a1 1 0 011 1z" clipRule="evenodd" />
            </svg>
            平稳
          </span>
        );
    }
  };
  
  // 加载状态
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-medium mb-4">热门商品</h2>
        <div className="animate-pulse">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">热门商品</h2>
        <Link href="/admin/products" className="text-primary text-sm hover:underline">
          查看全部
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                商品
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                价格
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                销量
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                库存
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                趋势
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Image 
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(product.price)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.sales} 件
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className={`text-sm ${product.inventory < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {product.inventory} 件
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  {getTrendIcon(product.trend)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 