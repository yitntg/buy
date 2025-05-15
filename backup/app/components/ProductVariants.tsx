'use client'

import { useState } from 'react'

// 变体选项接口
interface VariantOption {
  id: string
  name: string
  value: string
  imageUrl?: string // 颜色可能有对应的图片
}

// 变体类型接口
interface VariantType {
  id: string
  name: string // 如"颜色"、"尺寸"等
  options: VariantOption[]
}

// 组件属性接口
interface ProductVariantsProps {
  variants: VariantType[]
  defaultSelections?: Record<string, string> // 默认选择，格式为 { variantTypeId: optionId }
  onChange: (selections: Record<string, string>) => void // 选择变化时的回调
  disabled?: boolean // 是否禁用选择（如库存不足时）
}

export default function ProductVariants({ 
  variants, 
  defaultSelections = {}, 
  onChange,
  disabled = false
}: ProductVariantsProps) {
  // 当前选择状态
  const [selections, setSelections] = useState<Record<string, string>>(defaultSelections)
  
  // 处理选项选择
  const handleSelect = (variantTypeId: string, optionId: string) => {
    if (disabled) return
    
    const newSelections = { ...selections, [variantTypeId]: optionId }
    setSelections(newSelections)
    onChange(newSelections)
  }
  
  // 判断选项是否已选中
  const isSelected = (variantTypeId: string, optionId: string) => {
    return selections[variantTypeId] === optionId
  }
  
  // 判断选项是否可用
  const isAvailable = (_variantTypeId: string, _optionId: string) => {
    // 这里可以添加库存检查逻辑，判断当前选项组合是否有库存
    // 简化版本，默认都可用
    return true
  }
  
  if (!variants || variants.length === 0) {
    return null
  }
  
  return (
    <div className="space-y-4">
      {variants.map((variantType) => (
        <div key={variantType.id} className="mb-4">
          <div className="mb-2 flex items-center">
            <span className="font-medium text-gray-700">{variantType.name}:</span>
            {selections[variantType.id] && (
              <span className="ml-2 text-gray-600">
                {variantType.options.find(opt => opt.id === selections[variantType.id])?.value}
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {variantType.options.map((option) => {
              const available = isAvailable(variantType.id, option.id)
              
              // 颜色变体使用彩色圆圈
              if (variantType.name.toLowerCase().includes('颜色') || variantType.name.toLowerCase().includes('color')) {
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={disabled || !available}
                    onClick={() => handleSelect(variantType.id, option.id)}
                    className={`relative w-10 h-10 rounded-full transition-all ${
                      isSelected(variantType.id, option.id)
                        ? 'ring-2 ring-primary ring-offset-2'
                        : 'ring-1 ring-gray-300 hover:ring-gray-400'
                    } ${!available || disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                    aria-label={`选择${option.value}颜色`}
                    title={option.value}
                  >
                    {option.imageUrl ? (
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        <img 
                          src={option.imageUrl} 
                          alt={option.value} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div 
                        className="absolute inset-0 rounded-full" 
                        style={{ backgroundColor: option.value }}
                      />
                    )}
                  </button>
                )
              }
              
              // 其他变体使用常规按钮
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={disabled || !available}
                  onClick={() => handleSelect(variantType.id, option.id)}
                  className={`px-4 py-2 border transition-all ${
                    isSelected(variantType.id, option.id)
                      ? 'border-primary bg-primary bg-opacity-10 text-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${!available || disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} rounded-md`}
                >
                  {option.value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
} 