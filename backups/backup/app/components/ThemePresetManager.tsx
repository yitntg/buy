'use client'

import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ThemePresetManager() {
  const { theme, presets, saveAsPreset, loadPreset, resetToDefaults } = useTheme()
  const [newPresetName, setNewPresetName] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [importJSON, setImportJSON] = useState('')
  const [showImport, setShowImport] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  
  // 处理保存预设
  const handleSavePreset = () => {
    if (!newPresetName.trim()) {
      setMessage({type: 'error', text: '请输入预设名称'})
      return
    }
    
    // 检查名称是否已存在
    const exists = presets.some(p => p.name === newPresetName.trim())
    if (exists) {
      // 确认覆盖
      if (!confirm(`预设 "${newPresetName.trim()}" 已存在。是否覆盖？`)) {
        return
      }
    }
    
    saveAsPreset(newPresetName.trim())
    setNewPresetName('')
    setMessage({type: 'success', text: `预设 "${newPresetName.trim()}" 保存成功`})
    
    // 3秒后清除消息
    setTimeout(() => setMessage(null), 3000)
  }
  
  // 处理加载预设
  const handleLoadPreset = (presetName: string) => {
    loadPreset(presetName)
    setMessage({type: 'success', text: `已加载预设 "${presetName}"`})
    
    // 3秒后清除消息
    setTimeout(() => setMessage(null), 3000)
  }
  
  // 导出当前主题
  const exportCurrentTheme = () => {
    setShowExport(true)
  }
  
  // 导入主题
  const handleImportTheme = () => {
    try {
      const parsedTheme = JSON.parse(importJSON)
      
      // 简单验证导入的JSON是否包含必要的主题属性
      if (!parsedTheme.primaryColor || !parsedTheme.productLayout) {
        throw new Error('无效的主题格式')
      }
      
      // 保存为新预设
      const importName = `导入的主题 ${new Date().toLocaleDateString()}`
      saveAsPreset(importName)
      
      // 加载该预设
      loadPreset(importName)
      
      setMessage({type: 'success', text: '主题导入成功'})
      setShowImport(false)
      setImportJSON('')
    } catch (error) {
      setMessage({type: 'error', text: '导入失败: JSON格式无效'})
    }
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">主题预设管理</h3>
      
      {message && (
        <div className={`mb-4 p-3 rounded text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100' : 
          'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-100'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* 新建预设 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">保存当前主题为预设</label>
        <div className="flex">
          <input
            type="text"
            className="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-primary focus:border-primary"
            placeholder="输入预设名称"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
          />
          <button
            onClick={handleSavePreset}
            className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark"
          >
            保存
          </button>
        </div>
      </div>
      
      {/* 预设列表 */}
      <div className="mb-6">
        <h4 className="font-medium text-sm mb-2">可用预设</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleLoadPreset(preset.name)}
              className="text-left px-3 py-2 border rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              style={{
                borderLeft: `4px solid ${preset.theme.primaryColor}`,
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* 导入导出 */}
      <div className="mb-4">
        <h4 className="font-medium text-sm mb-2">导入 / 导出</h4>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowImport(true)}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded text-sm"
          >
            导入主题
          </button>
          <button
            onClick={exportCurrentTheme}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded text-sm"
          >
            导出当前主题
          </button>
          <button
            onClick={resetToDefaults}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-3 py-2 rounded text-sm ml-auto"
          >
            重置为默认值
          </button>
        </div>
      </div>
      
      {/* 导出弹窗 */}
      {showExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h4 className="text-lg font-medium mb-4">导出主题</h4>
            <p className="text-sm mb-4">复制下方JSON数据或保存到文件:</p>
            
            <textarea
              className="w-full h-64 p-2 border rounded font-mono text-sm"
              readOnly
              value={JSON.stringify(theme, null, 2)}
            />
            
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(theme, null, 2))
                  setMessage({type: 'success', text: '已复制到剪贴板'})
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                复制到剪贴板
              </button>
              <button
                onClick={() => {
                  // 创建下载
                  const blob = new Blob([JSON.stringify(theme, null, 2)], {type: 'application/json'})
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `theme-${new Date().toISOString().slice(0, 10)}.json`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
              >
                下载文件
              </button>
              <button
                onClick={() => setShowExport(false)}
                className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 导入弹窗 */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <h4 className="text-lg font-medium mb-4">导入主题</h4>
            <p className="text-sm mb-4">粘贴JSON数据:</p>
            
            <textarea
              className="w-full h-64 p-2 border rounded font-mono text-sm"
              value={importJSON}
              onChange={(e) => setImportJSON(e.target.value)}
              placeholder="{&#34;primaryColor&#34;: &#34;#3B82F6&#34;, ...}"
            />
            
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={handleImportTheme}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                disabled={!importJSON.trim()}
              >
                导入
              </button>
              <button
                onClick={() => setShowImport(false)}
                className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 