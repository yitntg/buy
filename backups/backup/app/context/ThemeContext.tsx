'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// 定义动画效果类型
export type AnimationStyle = 'none' | 'fade' | 'slide' | 'zoom' | 'bounce';

// 定义主题预设类型
export type ThemePreset = 'default' | 'dark' | 'light' | 'colorful' | 'minimal' | 'elegant' | 'custom';

// 定义布局模式
export type LayoutMode = 'grid' | 'waterfall' | 'list' | 'compact' | 'magazine';

// 定义图片加载策略
export type ImageLoadStrategy = 'eager' | 'lazy' | 'progressive';

// 定义性能模式
export type PerformanceMode = 'high' | 'balanced' | 'low';

// 定义不同设备的设置
interface ResponsiveSettings {
  layoutMode: LayoutMode;
  columns: number;
  gap: number;
  showDescription: boolean;
}

// 定义主题设置类型
interface ThemeSettings {
  // 基础颜色
  primaryColor: string
  secondaryColor: string
  textColor: string
  backgroundColor: string
  
  // 布局设置
  productLayout: LayoutMode
  productsPerPage: number
  gridColumns: {
    sm: number; // 移动端
    md: number; // 平板
    lg: number; // 桌面
    xl: number; // 大屏幕
  }
  
  // 导航栏设置
  stickyHeader: boolean
  showCategoriesMenu: boolean
  navbarStyle: 'default' | 'compact' | 'extended'
  
  // 卡片样式
  cardHoverShadow: boolean
  cardHoverTransform: boolean
  cardBorderRadius: number
  cardPadding: number
  cardTitleSize: number
  cardImageAspectRatio: '1:1' | '4:3' | '16:9' | 'auto'
  
  // 动画设置
  enableAnimations: boolean
  animationSpeed: 'slow' | 'normal' | 'fast'
  pageTransitions: boolean
  
  // 首页设置
  carouselCount: number
  featuredCount: number
  showSearchBar: boolean
  showHeroSection: boolean
  
  // 主题模式
  themeMode: 'light' | 'dark' | 'auto'
  
  // 性能设置
  imageLoadStrategy: 'eager' | 'lazy'
  reducedMotion: boolean
  
  // 本地化设置
  textDirection: 'ltr' | 'rtl'
  
  // 分类特定设置
  categorySpecificLayouts: boolean
}

// 定义上下文类型
interface ThemeContextType {
  theme: ThemeSettings
  updateTheme: (settings: Partial<ThemeSettings>) => void
  applyTheme: () => void
  resetToDefaults: () => void
  saveAsPreset: (name: string) => void
  loadPreset: (name: string) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
  presets: {name: string, theme: ThemeSettings}[]
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// 默认主题设置
const defaultTheme: ThemeSettings = {
  // 基础颜色
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  textColor: '#111827',
  backgroundColor: '#F9FAFB',
  
  // 布局设置
  productLayout: 'waterfall',
  productsPerPage: 12,
  gridColumns: {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4
  },
  
  // 导航栏设置
  stickyHeader: true,
  showCategoriesMenu: true,
  navbarStyle: 'default',
  
  // 卡片样式
  cardHoverShadow: true,
  cardHoverTransform: true,
  cardBorderRadius: 8,
  cardPadding: 16,
  cardTitleSize: 16,
  cardImageAspectRatio: '1:1',
  
  // 动画设置
  enableAnimations: true,
  animationSpeed: 'normal',
  pageTransitions: true,
  
  // 首页设置
  carouselCount: 3,
  featuredCount: 4,
  showSearchBar: true,
  showHeroSection: true,
  
  // 主题模式
  themeMode: 'light',
  
  // 性能设置
  imageLoadStrategy: 'lazy',
  reducedMotion: false,
  
  // 本地化设置
  textDirection: 'ltr',
  
  // 分类特定设置
  categorySpecificLayouts: false
}

// 内置预设主题
const builtInPresets = [
  {
    name: '经典电商',
    theme: {
      ...defaultTheme,
      productLayout: 'grid' as LayoutMode,
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
    }
  },
  {
    name: '暗色模式',
    theme: {
      ...defaultTheme,
      primaryColor: '#6366F1',
      secondaryColor: '#8B5CF6',
      textColor: '#F9FAFB',
      backgroundColor: '#111827',
      themeMode: 'dark' as 'light' | 'dark' | 'auto',
      cardBorderRadius: 4,
    }
  },
  {
    name: '简约风格',
    theme: {
      ...defaultTheme,
      primaryColor: '#4B5563',
      secondaryColor: '#9CA3AF',
      cardBorderRadius: 0,
      cardHoverShadow: false,
      cardHoverTransform: false,
      enableAnimations: false,
    }
  },
  {
    name: '活力设计',
    theme: {
      ...defaultTheme,
      primaryColor: '#F59E0B',
      secondaryColor: '#EF4444',
      cardBorderRadius: 16,
      animationSpeed: 'fast' as 'slow' | 'normal' | 'fast',
      productLayout: 'waterfall' as LayoutMode,
    }
  }
]

// 主题提供者组件
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)
  const [presets, setPresets] = useState(builtInPresets)
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // 首次加载时从本地存储或API加载主题设置
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // 尝试从本地存储加载
        const savedTheme = localStorage.getItem('theme-settings')
        if (savedTheme) {
          setTheme(JSON.parse(savedTheme))
        }
        
        // 加载用户预设
        const savedPresets = localStorage.getItem('theme-presets')
        if (savedPresets) {
          // 合并内置预设和用户预设
          setPresets([...builtInPresets, ...JSON.parse(savedPresets)])
        }
        
        // 检测系统偏好
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          setIsDarkMode(true)
        }
      } catch (error) {
        console.error('加载主题设置失败:', error)
      }
    }
    
    loadTheme()
    
    // 监听系统主题变化
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme.themeMode === 'auto') {
        setIsDarkMode(e.matches)
      }
    }
    
    if (darkModeMediaQuery.addEventListener) {
      darkModeMediaQuery.addEventListener('change', handleChange)
      return () => darkModeMediaQuery.removeEventListener('change', handleChange)
    }
  }, [])
  
  // 切换暗色模式
  const toggleDarkMode = () => {
    const newMode = theme.themeMode === 'dark' ? 'light' : 'dark'
    updateTheme({ themeMode: newMode })
    setIsDarkMode(newMode === 'dark')
  }
  
  // 当主题模式改变时
  useEffect(() => {
    if (theme.themeMode === 'auto') {
      const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(isDark)
    } else {
      setIsDarkMode(theme.themeMode === 'dark')
    }
  }, [theme.themeMode])
  
  // 更新主题设置
  const updateTheme = (settings: Partial<ThemeSettings>) => {
    setTheme(prev => {
      const newTheme = { ...prev, ...settings }
      // 保存到本地存储
      localStorage.setItem('theme-settings', JSON.stringify(newTheme))
      return newTheme
    })
  }
  
  // 重置为默认设置
  const resetToDefaults = () => {
    setTheme(defaultTheme)
    localStorage.setItem('theme-settings', JSON.stringify(defaultTheme))
  }
  
  // 保存当前主题为预设
  const saveAsPreset = (name: string) => {
    const newPreset = { name, theme: { ...theme } }
    
    // 检查是否已存在同名预设
    const existingIndex = presets.findIndex(p => p.name === name)
    
    if (existingIndex >= 0) {
      // 更新已有预设
      const updatedPresets = [...presets]
      updatedPresets[existingIndex] = newPreset
      setPresets(updatedPresets)
      
      // 过滤出用户自定义预设
      const userPresets = updatedPresets.filter(
        p => !builtInPresets.some(bp => bp.name === p.name)
      )
      localStorage.setItem('theme-presets', JSON.stringify(userPresets))
    } else {
      // 添加新预设
      const updatedPresets = [...presets, newPreset]
      setPresets(updatedPresets)
      
      // 过滤出用户自定义预设
      const userPresets = updatedPresets.filter(
        p => !builtInPresets.some(bp => bp.name === p.name)
      )
      localStorage.setItem('theme-presets', JSON.stringify(userPresets))
    }
  }
  
  // 加载预设
  const loadPreset = (name: string) => {
    const preset = presets.find(p => p.name === name)
    if (preset) {
      setTheme(preset.theme)
      localStorage.setItem('theme-settings', JSON.stringify(preset.theme))
    }
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
    
    // 添加暗色模式类
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
    
    // 设置文字方向
    document.documentElement.dir = theme.textDirection
    
    // 对于减少动效，添加特殊类
    if (theme.reducedMotion) {
      document.documentElement.classList.add('reduced-motion')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }
    
    // 构建CSS变量
    const css = `
      :root {
        --color-primary: ${theme.primaryColor};
        --color-primary-dark: ${adjustColor(theme.primaryColor, -20)};
        --color-primary-light: ${adjustColor(theme.primaryColor, 20)};
        --color-secondary: ${theme.secondaryColor};
        --color-text: ${theme.textColor};
        --color-background: ${theme.backgroundColor};
        --card-border-radius: ${theme.cardBorderRadius}px;
        --card-padding: ${theme.cardPadding}px;
        --card-title-size: ${theme.cardTitleSize}px;
        --transition-speed: ${
          theme.animationSpeed === 'slow' ? '0.5s' : 
          theme.animationSpeed === 'fast' ? '0.15s' : '0.3s'
        };
      }
      
      .dark-mode {
        --color-text: #F9FAFB;
        --color-background: #111827;
        --color-primary-light: ${adjustColor(theme.primaryColor, -20)};
        --color-primary-dark: ${adjustColor(theme.primaryColor, 20)};
      }
      
      body {
        color: var(--color-text);
        background-color: var(--color-background);
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
      
      .card {
        padding: var(--card-padding) !important;
      }
      
      .card-title {
        font-size: var(--card-title-size) !important;
      }
      
      .reduced-motion * {
        transition: none !important;
        animation: none !important;
      }
      
      ${theme.cardHoverTransform ? `
      .card-hover-transform:hover {
        transform: translateY(-5px);
        transition: transform var(--transition-speed) ease;
      }
      ` : ''}
      
      ${theme.cardHoverShadow ? `
      .card-hover-shadow:hover {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        transition: box-shadow var(--transition-speed) ease;
      }
      ` : ''}
      
      ${theme.pageTransitions ? `
      .page-transition-enter {
        opacity: 0;
        transform: translateY(10px);
      }
      
      .page-transition-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: opacity var(--transition-speed), transform var(--transition-speed);
      }
      
      .page-transition-exit {
        opacity: 1;
        transform: translateY(0);
      }
      
      .page-transition-exit-active {
        opacity: 0;
        transform: translateY(-10px);
        transition: opacity var(--transition-speed), transform var(--transition-speed);
      }
      ` : ''}
    `
    
    styleEl.textContent = css
  }
  
  // 主题更改时应用新样式
  useEffect(() => {
    applyTheme()
  }, [theme, isDarkMode])
  
  return (
    <ThemeContext.Provider value={{ 
      theme, 
      updateTheme, 
      applyTheme, 
      resetToDefaults, 
      saveAsPreset, 
      loadPreset,
      isDarkMode,
      toggleDarkMode,
      presets
    }}>
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