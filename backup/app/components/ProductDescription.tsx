'use client'

import { useState } from 'react'

interface TabContent {
  id: string
  title: string
  content: React.ReactNode
}

interface ProductDescriptionProps {
  description: string
  specifications?: Record<string, string>
  reviewsSection: React.ReactNode
  additionalInfo?: React.ReactNode
}

export default function ProductDescription({
  description,
  specifications,
  reviewsSection,
  additionalInfo
}: ProductDescriptionProps) {
  const [activeTabId, setActiveTabId] = useState('description')
  
  // 创建标签内容
  const tabs: TabContent[] = [
    {
      id: 'description',
      title: '商品详情',
      content: (
        <div className="prose max-w-none">
          {description.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
      )
    }
  ]
  
  // 如果有规格信息，添加规格标签
  if (specifications && Object.keys(specifications).length > 0) {
    tabs.push({
      id: 'specifications',
      title: '规格参数',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="flex border-b border-gray-100 py-2">
              <div className="w-32 text-gray-500">{key}:</div>
              <div className="text-gray-800 flex-1">{value}</div>
            </div>
          ))}
        </div>
      )
    })
  }
  
  // 添加评价标签
  tabs.push({
    id: 'reviews',
    title: '用户评价',
    content: reviewsSection
  })
  
  // 如果有附加信息，添加相应标签
  if (additionalInfo) {
    tabs.push({
      id: 'additional',
      title: '购买须知',
      content: additionalInfo
    })
  }
  
  return (
    <div className="mt-8 border rounded-lg overflow-hidden bg-white">
      {/* 标签页头部 */}
      <div className="border-b flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTabId === tab.id
                ? 'text-primary border-b-2 border-primary -mb-px'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      
      {/* 标签页内容 */}
      <div className="p-6">
        {tabs.find(tab => tab.id === activeTabId)?.content}
      </div>
    </div>
  )
} 