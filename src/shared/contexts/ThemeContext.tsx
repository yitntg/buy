'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  AnimationStyle, 
  ThemePreset, 
  LayoutMode, 
  ImageLoadStrategy, 
  PerformanceMode,
  ThemeSettings 
} from '@/shared/types/theme'

// 定义不同设备的设置
interface ResponsiveSettings {
  layoutMode: LayoutMode;
  columns: number;
  gap: number;
  showDescription: boolean;
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
      productLayout: 'grid',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
    } as ThemeSettings
  },
  {
    name: '暗色模式',
    theme: {
      ...defaultTheme,
      primaryColor: '#6366F1',
      secondaryColor: '#8B5CF6',
      textColor: '#F9FAFB',
      backgroundColor: '#111827',
      themeMode: 'dark' as const,
      cardBorderRadius: 4,
    } as ThemeSettings
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
    } as ThemeSettings
  },
  {
    name: '活力设计',
    theme: {
      ...defaultTheme,
      primaryColor: '#F59E0B',
      secondaryColor: '#EF4444',
      cardBorderRadius: 16,
      animationSpeed: 'fast',
      productLayout: 'grid',
    } as ThemeSettings
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
  
  // 应用主题到DOM
  const applyTheme = () => {
    // 应用主题色到CSS变量
    document.documentElement.style.setProperty('--color-primary', theme.primaryColor)
    document.documentElement.style.setProperty('--color-secondary', theme.secondaryColor)
    document.documentElement.style.setProperty('--color-text', theme.textColor)
    document.documentElement.style.setProperty('--color-background', theme.backgroundColor)
    
    // 设置暗色模式
    if (theme.themeMode === 'dark' || (theme.themeMode === 'auto' && isDarkMode)) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
    
    // 设置减弱动画
    if (theme.reducedMotion) {
      document.documentElement.classList.add('reduced-motion')
    } else {
      document.documentElement.classList.remove('reduced-motion')
    }
    
    // 设置文本方向
    document.documentElement.dir = theme.textDirection
    
    // 设置动画速度
    document.documentElement.style.setProperty(
      '--animation-speed', 
      theme.animationSpeed === 'slow' ? '0.5s' : 
      theme.animationSpeed === 'fast' ? '0.15s' : '0.3s'
    )
    
    // 设置边框圆角
    document.documentElement.style.setProperty(
      '--border-radius', 
      `${theme.cardBorderRadius}px`
    )
    
    // 设置卡片内边距
    document.documentElement.style.setProperty(
      '--card-padding', 
      `${theme.cardPadding}px`
    )
    
    // 设置标题文字大小
    document.documentElement.style.setProperty(
      '--title-size', 
      `${theme.cardTitleSize}px`
    )
  }
  
  // 当主题变更时应用到DOM
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

// 调整颜色亮度的辅助函数
function adjustColor(color: string, amount: number): string {
  // 移除 # 并转换为 RGB
  let hex = color.replace('#', '')
  
  // 扩展 3 位颜色为 6 位
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }
  
  // 转换为 RGB
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)
  
  // 调整亮度
  r = Math.min(255, Math.max(0, r + amount))
  g = Math.min(255, Math.max(0, g + amount))
  b = Math.min(255, Math.max(0, b + amount))
  
  // 转回 hex
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

// 主题Hook
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 