'use client'

import React from 'react'
import { useTheme } from '../context/ThemeContext'
import type { ThemePreset } from '../context/ThemeContext'

interface PreviewProps {
  onApply?: () => void;
}

export default function ThemePreview({ onApply }: PreviewProps) {
  const { theme, setPreset } = useTheme()
  
  const presets: ThemePreset[] = [
    'default', 'dark', 'light', 'colorful', 'minimal', 'elegant'
  ]
  
  // 小型预览卡片样式
  const getPreviewCardStyle = (preset: ThemePreset) => {
    // 获取预设的主要样式
    const presetStyles = {
      default: {
        background: '#FFFFFF',
        primary: '#3B82F6',
        text: '#111827',
      },
      dark: {
        background: '#1F2937',
        primary: '#3B82F6',
        text: '#F3F4F6',
      },
      light: {
        background: '#F9FAFB',
        primary: '#60A5FA',
        text: '#1F2937',
      },
      colorful: {
        background: '#FFFFFF',
        primary: '#8B5CF6',
        text: '#111827',
      },
      minimal: {
        background: '#F9FAFB',
        primary: '#4B5563',
        text: '#111827',
      },
      elegant: {
        background: '#FFFFFF', 
        primary: '#4F46E5',
        text: '#111827',
      },
      custom: {
        background: theme.backgroundColor,
        primary: theme.primaryColor,
        text: theme.textColor,
      }
    }
    
    const style = presetStyles[preset]
    
    return {
      backgroundColor: style.background,
      border: `1px solid ${style.background === '#FFFFFF' ? '#E5E7EB' : style.background}`,
      borderRadius: preset === 'minimal' ? '0px' : '8px',
      color: style.text,
      boxShadow: preset === 'minimal' ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)',
    }
  }
  
  // 预设中的按钮样式
  const getButtonStyle = (preset: ThemePreset) => {
    const presetStyles = {
      default: { background: '#3B82F6' },
      dark: { background: '#3B82F6' },
      light: { background: '#60A5FA' },
      colorful: { background: '#8B5CF6' },
      minimal: { background: '#4B5563' },
      elegant: { background: '#4F46E5' },
      custom: { background: theme.primaryColor }
    }
    
    return {
      backgroundColor: presetStyles[preset].background,
      borderRadius: preset === 'minimal' ? '0px' : '4px',
    }
  }

  // 处理应用主题
  const handleApplyPreset = (preset: ThemePreset) => {
    setPreset(preset)
    if (onApply) {
      onApply()
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">主题预览</h3>
      
      <div className="grid grid-cols-3 gap-4">
        {presets.map(preset => (
          <div key={preset} className="flex flex-col items-center">
            {/* 预览卡片 */}
            <div
              style={getPreviewCardStyle(preset)}
              className="w-full h-36 p-3 flex flex-col justify-between cursor-pointer transition duration-200 hover:opacity-90"
              onClick={() => handleApplyPreset(preset)}
            >
              <div>
                <div className="font-medium" style={{ fontSize: '0.75rem' }}>
                  {preset === 'default' && '默认主题'}
                  {preset === 'dark' && '暗色主题'}
                  {preset === 'light' && '亮色主题'}
                  {preset === 'colorful' && '多彩主题'}
                  {preset === 'minimal' && '极简主题'}
                  {preset === 'elegant' && '优雅主题'}
                </div>
                <div style={{ fontSize: '0.6rem' }}>预览样式</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div style={{ fontSize: '0.6rem' }}>¥199.00</div>
                <button
                  className="text-white text-xs px-2 py-1"
                  style={getButtonStyle(preset)}
                >
                  购买
                </button>
              </div>
            </div>
            
            {/* 主题名称 */}
            <div className="mt-2 text-xs text-center">
              {preset === 'default' && '默认主题'}
              {preset === 'dark' && '暗色主题'}
              {preset === 'light' && '亮色主题'}
              {preset === 'colorful' && '多彩主题'}
              {preset === 'minimal' && '极简主题'}
              {preset === 'elegant' && '优雅主题'}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-3 mt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">当前主题: {
            theme.currentPreset === 'default' ? '默认主题' :
            theme.currentPreset === 'dark' ? '暗色主题' :
            theme.currentPreset === 'light' ? '亮色主题' :
            theme.currentPreset === 'colorful' ? '多彩主题' :
            theme.currentPreset === 'minimal' ? '极简主题' :
            theme.currentPreset === 'elegant' ? '优雅主题' :
            '自定义主题'
          }</div>
        </div>
      </div>
    </div>
  )
} 