'use client'

import React from 'react'
import { useTheme } from '../context/ThemeContext'
import type { LayoutMode } from '../context/ThemeContext'

interface PreviewProps {
  onSelect?: (layout: LayoutMode) => void;
}

export default function LayoutPreview({ onSelect }: PreviewProps) {
  const { theme, updateTheme } = useTheme()
  
  // 所有布局模式
  const layouts: { id: LayoutMode; name: string }[] = [
    { id: 'grid', name: '网格布局' },
    { id: 'waterfall', name: '瀑布流' },
    { id: 'list', name: '列表布局' },
    { id: 'compact', name: '紧凑布局' },
    { id: 'magazine', name: '杂志风格' }
  ]
  
  // 布局预览项
  const LayoutPreviewItem = ({ layout }: { layout: LayoutMode }) => {
    // 处理选择布局
    const handleSelect = () => {
      if (onSelect) {
        onSelect(layout)
      } else {
        updateTheme({ productLayout: layout })
      }
    }
    
    // 生成预览内容
    const renderPreviewContent = () => {
      switch (layout) {
        case 'grid':
          return (
            <div className="grid grid-cols-2 gap-1 w-full">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-200 h-8 rounded"></div>
              ))}
            </div>
          )
        case 'waterfall':
          return (
            <div className="flex w-full space-x-1">
              <div className="w-1/2 space-y-1">
                <div className="bg-gray-200 h-12 rounded"></div>
                <div className="bg-gray-200 h-8 rounded"></div>
              </div>
              <div className="w-1/2 space-y-1">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-12 rounded"></div>
              </div>
            </div>
          )
        case 'list':
          return (
            <div className="space-y-1 w-full">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 h-6 rounded flex">
                  <div className="w-1/4 bg-gray-300 h-full rounded-l"></div>
                  <div className="w-3/4"></div>
                </div>
              ))}
            </div>
          )
        case 'compact':
          return (
            <div className="grid grid-cols-3 gap-0.5 w-full">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-200 h-6 rounded"></div>
              ))}
            </div>
          )
        case 'magazine':
          return (
            <div className="grid grid-cols-3 gap-1 w-full">
              <div className="col-span-2 bg-gray-200 h-10 rounded"></div>
              <div className="bg-gray-200 h-10 rounded"></div>
              <div className="bg-gray-200 h-8 rounded"></div>
              <div className="col-span-2 bg-gray-200 h-8 rounded"></div>
            </div>
          )
        default:
          return null
      }
    }
    
    return (
      <div 
        className={`border p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                   ${theme.productLayout === layout ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-gray-200'}`}
        onClick={handleSelect}
      >
        <div className="mb-2">
          {renderPreviewContent()}
        </div>
        <div className="text-sm font-medium text-center mt-2">
          {layouts.find(l => l.id === layout)?.name || layout}
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">布局预览</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {layouts.map(layout => (
          <LayoutPreviewItem key={layout.id} layout={layout.id} />
        ))}
      </div>
      
      <div className="flex justify-between text-sm text-gray-500 pt-2">
        <div>当前布局: {layouts.find(l => l.id === theme.productLayout)?.name}</div>
      </div>
    </div>
  )
} 