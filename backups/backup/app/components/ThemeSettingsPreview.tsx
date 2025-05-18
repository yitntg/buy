'use client'

import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import Image from 'next/image'

// 模拟商品数据
const mockProducts = [
  { id: 1, name: '优质T恤', price: 199, image: '/images/preview/tshirt.jpg' },
  { id: 2, name: '精致手表', price: 1299, image: '/images/preview/watch.jpg' },
  { id: 3, name: '时尚背包', price: 399, image: '/images/preview/backpack.jpg' },
  { id: 4, name: '运动鞋', price: 599, image: '/images/preview/shoes.jpg' },
]

// 不同布局的预览组件
export function ThemeSettingsPreview() {
  const { theme, isDarkMode } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // 在客户端挂载后再渲染，避免服务器端和客户端不匹配
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b flex justify-between items-center">
        <h3 className="text-sm font-medium">预览</h3>
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
      </div>
      
      <div className={`p-4 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'}`} style={{minHeight: '300px'}}>
        {/* 导航栏预览 */}
        <div className="border-b pb-2 mb-4 flex justify-between items-center" 
          style={{
            position: theme.stickyHeader ? 'sticky' : 'static',
            top: 0,
            zIndex: 10,
            padding: theme.navbarStyle === 'compact' ? '4px 0' : 
                   theme.navbarStyle === 'extended' ? '12px 0' : '8px 0'
          }}>
          <div className="font-bold" style={{color: theme.primaryColor}}>预览商城</div>
          {theme.showCategoriesMenu && (
            <div className="text-xs">
              <span className="mx-1">分类1</span>
              <span className="mx-1">分类2</span>
            </div>
          )}
          <div className="text-xs">购物车</div>
        </div>
        
        {/* 商品列表预览 */}
        <div className={`
          ${theme.productLayout === 'grid' ? 'grid grid-cols-2 gap-4' : 
            theme.productLayout === 'waterfall' ? 'columns-2 gap-4' : 
            'flex flex-col space-y-4'}
        `}>
          {mockProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  )
}

// 商品卡片组件
function ProductCard({ product }: { product: any }) {
  const { theme } = useTheme()
  
  // 添加卡片样式
  const cardClasses = `
    bg-white dark:bg-gray-800 
    ${theme.productLayout !== 'list' ? 'mb-4' : 'flex items-center'} 
    ${theme.cardHoverShadow ? 'card-hover-shadow' : ''} 
    ${theme.cardHoverTransform ? 'card-hover-transform' : ''}
  `
  
  // 根据布局设置图片大小
  const imageStyle = {
    borderRadius: `${theme.cardBorderRadius}px`,
    aspectRatio: theme.cardImageAspectRatio === 'auto' ? 'auto' : 
                theme.cardImageAspectRatio === '1:1' ? '1' : 
                theme.cardImageAspectRatio === '4:3' ? '4/3' : '16/9',
    objectFit: 'cover' as const,
    width: theme.productLayout === 'list' ? '80px' : '100%'
  }
  
  // 根据设置调整商品标题大小
  const titleStyle = {
    fontSize: `${theme.cardTitleSize}px`,
    marginTop: `${theme.cardPadding / 2}px`,
    marginBottom: `${theme.cardPadding / 4}px`
  }
  
  return (
    <div className={cardClasses} style={{
      padding: `${theme.cardPadding}px`,
      borderRadius: `${theme.cardBorderRadius}px`,
      transition: theme.enableAnimations ? 'all 0.3s ease' : 'none'
    }}>
      {/* 为简化预览，使用占位图 */}
      <div style={imageStyle} className="bg-gray-200 dark:bg-gray-700 w-full h-24"></div>
      
      <div className={theme.productLayout === 'list' ? 'ml-4' : ''}>
        <h3 style={titleStyle} className="font-medium dark:text-white">{product.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">¥{product.price}</p>
        
        <button className="mt-2 text-xs px-2 py-1 rounded" style={{
          backgroundColor: theme.primaryColor,
          color: 'white',
          transition: theme.enableAnimations ? 'all 0.3s ease' : 'none'
        }}>
          加入购物车
        </button>
      </div>
    </div>
  )
}

// 预览组件 - 为特定设置显示不同预览
export function SpecificSettingPreview({ setting }: { setting: string }) {
  const { theme } = useTheme()
  
  // 根据不同设置项展示不同的预览内容
  switch (setting) {
    case 'colors':
      return (
        <div className="p-4 border rounded-lg">
          <div className="flex space-x-4 mb-4">
            <ColorSwatch label="主色调" color={theme.primaryColor} />
            <ColorSwatch label="辅助色" color={theme.secondaryColor} />
            <ColorSwatch label="文本色" color={theme.textColor} />
            <ColorSwatch label="背景色" color={theme.backgroundColor} />
          </div>
          <div className="border-t pt-4">
            <p className="text-sm mb-2">文本预览:</p>
            <h2 style={{color: theme.primaryColor}} className="text-lg font-bold mb-1">这是主色标题</h2>
            <p className="mb-1">这是正常文本内容</p>
            <p style={{color: theme.secondaryColor}} className="text-sm">这是辅助色文本</p>
          </div>
        </div>
      )
      
    case 'animations':
      return (
        <div className="p-4 border rounded-lg">
          <p className="text-sm mb-4">悬停下方元素查看动画效果:</p>
          
          <div className="flex space-x-4 mb-4">
            <div className={`w-20 h-20 bg-blue-500 ${theme.cardHoverShadow ? 'card-hover-shadow' : ''}`}
                style={{
                  borderRadius: `${theme.cardBorderRadius}px`,
                  transition: theme.enableAnimations ? `all ${
                    theme.animationSpeed === 'slow' ? '0.5s' : 
                    theme.animationSpeed === 'fast' ? '0.15s' : '0.3s'
                  } ease` : 'none'
                }}>
              阴影效果
            </div>
            
            <div className={`w-20 h-20 bg-green-500 ${theme.cardHoverTransform ? 'card-hover-transform' : ''}`}
                style={{
                  borderRadius: `${theme.cardBorderRadius}px`,
                  transition: theme.enableAnimations ? `all ${
                    theme.animationSpeed === 'slow' ? '0.5s' : 
                    theme.animationSpeed === 'fast' ? '0.15s' : '0.3s'
                  } ease` : 'none'
                }}>
              上移效果
            </div>
            
            <div className="w-20 h-20 bg-purple-500 hover:opacity-80"
                style={{
                  borderRadius: `${theme.cardBorderRadius}px`,
                  transition: theme.enableAnimations ? `all ${
                    theme.animationSpeed === 'slow' ? '0.5s' : 
                    theme.animationSpeed === 'fast' ? '0.15s' : '0.3s'
                  } ease` : 'none'
                }}>
              不透明度
            </div>
          </div>
          
          <p className="text-sm">
            动画: {theme.enableAnimations ? '启用' : '禁用'} | 
            速度: {theme.animationSpeed} | 
            减少动效: {theme.reducedMotion ? '是' : '否'}
          </p>
        </div>
      )
      
    default:
      return null
  }
}

// 颜色样本组件
function ColorSwatch({ color, label }: { color: string, label: string }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 rounded-full mb-1 mx-auto" style={{ backgroundColor: color }}></div>
      <p className="text-xs">{label}</p>
      <p className="text-xs text-gray-500">{color}</p>
    </div>
  )
} 