'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

interface PreviewProps {
  onApply?: () => void;
}

export default function ThemePreview({ onApply }: PreviewProps) {
  const { theme, loadPreset, presets } = useTheme()
  const [currentPresetName, setCurrentPresetName] = useState<string>('')
  
  // 预设名称列表
  const presetNames = presets.map(p => p.name)
  
  // 初始化当前主题名称
  useEffect(() => {
    // 尝试从预设中找到匹配当前主题的预设
    const matchingPreset = presets.find(p => 
      p.theme.primaryColor === theme.primaryColor && 
      p.theme.productLayout === theme.productLayout
    )
    
    setCurrentPresetName(matchingPreset?.name || '自定义主题')
  }, [theme, presets])
  
  // 小型预览卡片样式
  const getPreviewCardStyle = (presetName: string) => {
    // 查找对应的预设
    const preset = presets.find(p => p.name === presetName)
    
    if (!preset) {
      return {
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        color: '#111827',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }
    }
    
    const { theme: presetTheme } = preset
    
    return {
      backgroundColor: presetTheme.backgroundColor,
      border: `1px solid ${presetTheme.backgroundColor === '#FFFFFF' ? '#E5E7EB' : presetTheme.backgroundColor}`,
      borderRadius: `${presetTheme.cardBorderRadius}px`,
      color: presetTheme.textColor,
      boxShadow: presetTheme.cardHoverShadow ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
    }
  }
  
  // 预设中的按钮样式
  const getButtonStyle = (presetName: string) => {
    const preset = presets.find(p => p.name === presetName)
    
    if (!preset) {
      return {
        backgroundColor: '#3B82F6',
        borderRadius: '4px',
      }
    }
    
    return {
      backgroundColor: preset.theme.primaryColor,
      borderRadius: `${preset.theme.cardBorderRadius / 2}px`,
    }
  }

  // 处理应用主题
  const handleApplyPreset = (presetName: string) => {
    loadPreset(presetName)
    setCurrentPresetName(presetName)
    
    if (onApply) {
      onApply()
    }
  }

  // 获取显示名称
  const getDisplayName = (presetName: string) => {
    const displayNames: Record<string, string> = {
      '经典电商': '经典电商',
      '暗色模式': '暗色模式',
      '简约风格': '简约风格',
      '活力设计': '活力设计'
    }
    
    return displayNames[presetName] || presetName
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">主题预览</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {presets.map(preset => (
          <div key={preset.name} className="flex flex-col items-center">
            {/* 预览卡片 */}
            <div
              style={getPreviewCardStyle(preset.name)}
              className="w-full h-36 p-3 flex flex-col justify-between cursor-pointer transition duration-200 hover:opacity-90"
              onClick={() => handleApplyPreset(preset.name)}
            >
              <div>
                <div className="font-medium" style={{ fontSize: '0.75rem' }}>
                  {getDisplayName(preset.name)}
                </div>
                <div style={{ fontSize: '0.6rem' }}>预览样式</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div style={{ fontSize: '0.6rem' }}>¥199.00</div>
                <button
                  className="text-white text-xs px-2 py-1"
                  style={getButtonStyle(preset.name)}
                >
                  购买
                </button>
              </div>
            </div>
            
            {/* 主题名称 */}
            <div className="mt-2 text-xs text-center">
              {getDisplayName(preset.name)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t pt-3 mt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            当前主题: {currentPresetName}
          </div>
        </div>
      </div>
    </div>
  )
} 