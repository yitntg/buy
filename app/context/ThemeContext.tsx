'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// 定义主题设置类型
interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  productLayout: 'grid' | 'waterfall' | 'list'
  productsPerPage: number
  stickyHeader: boolean
  showCategoriesMenu: boolean
  cardHoverShadow: boolean
  cardHoverTransform: boolean
  cardBorderRadius: number
  carouselCount: number
  featuredCount: number
}

// 定义上下文类型
interface ThemeContextType {
  theme: ThemeSettings
  updateTheme: (settings: Partial<ThemeSettings>) => void
  applyTheme: () => void
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 默认主题设置
const defaultTheme: ThemeSettings = {
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  productLayout: 'waterfall',
  productsPerPage: 12,
  stickyHeader: true,
  showCategoriesMenu: true,
  cardHoverShadow: true,
  cardHoverTransform: true,
  cardBorderRadius: 8,
  carouselCount: 3,
  featuredCount: 4
}

// 主题提供者组件
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)
  
  // 首次加载时从本地存储或API加载主题设置
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // 尝试从本地存储加载
        const savedTheme = localStorage.getItem('theme-settings')
        if (savedTheme) {
          setTheme(JSON.parse(savedTheme))
        } else {
          // 如果本地没有，可以从API加载
          // const response = await fetch('/api/theme-settings')
          // if (response.ok) {
          //   const data = await response.json()
          //   setTheme(data)
          // }
        }
      } catch (error) {
        console.error('加载主题设置失败:', error)
      }
    }
    
    loadTheme()
  }, [])
  
  // 更新主题设置
  const updateTheme = (settings: Partial<ThemeSettings>) => {
    setTheme(prev => {
      const newTheme = { ...prev, ...settings }
      // 保存到本地存储
      localStorage.setItem('theme-settings', JSON.stringify(newTheme))
      return newTheme
    })
  }
  
  // 应用主题到文档
  const applyTheme = () => {
    // 创建或获取样式元素
    let styleEl = document.getElementById('theme-styles')
    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = 'theme-styles'
      document.head.appendChild(styleEl)
    }
    
    // 构建CSS变量
    const css = `
      :root {
        --color-primary: ${theme.primaryColor};
        --color-primary-dark: ${adjustColor(theme.primaryColor, -20)};
        --color-primary-light: ${adjustColor(theme.primaryColor, 20)};
        --color-secondary: ${theme.secondaryColor};
        --card-border-radius: ${theme.cardBorderRadius}px;
      }
      
      .bg-primary {
        background-color: var(--color-primary) !important;
      }
      
      .text-primary {
        color: var(--color-primary) !important;
      }
      
      .border-primary {
        border-color: var(--color-primary) !important;
      }
      
      .ring-primary {
        --tw-ring-color: var(--color-primary) !important;
      }
      
      .bg-primary-dark {
        background-color: var(--color-primary-dark) !important;
      }
      
      .hover\\:bg-primary-dark:hover {
        background-color: var(--color-primary-dark) !important;
      }
      
      .rounded-lg, .rounded-md {
        border-radius: var(--card-border-radius) !important;
      }
    `
    
    styleEl.textContent = css
  }
  
  // 主题更改时应用新样式
  useEffect(() => {
    applyTheme()
  }, [theme])
  
  return (
    <ThemeContext.Provider value={{ theme, updateTheme, applyTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 辅助函数：调整颜色明暗
function adjustColor(color: string, amount: number): string {
  // 简单的颜色调整函数
  if (color.startsWith('#')) {
    let hex = color.slice(1)
    
    // 扩展3位色值为6位
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('')
    }
    
    // 转换为RGB
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    
    // 调整RGB值
    const newR = Math.max(0, Math.min(255, r + amount))
    const newG = Math.max(0, Math.min(255, g + amount))
    const newB = Math.max(0, Math.min(255, b + amount))
    
    // 转回十六进制
    const newHex = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
    
    return newHex
  }
  
  return color
}

// 主题Hook
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 