'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Product } from '@/shared/types/product'

// 定义购物车上下文类型
interface CartContextType {
  items: CartItem[]
  addItem: (product: Product | Partial<CartItem> & { id: string | number, name: string, price: number }, quantity?: number) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isInCart: (id: string) => boolean
}

// 创建上下文
const CartContext = createContext<CartContextType | undefined>(undefined)

// 购物车提供者组件
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  
  // 首次加载时从本地存储加载购物车
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('加载购物车失败:', error)
    }
  }, [])
  
  // 当购物车变更时保存到本地存储
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])
  
  // 添加商品到购物车
  const addItem = (product: Product | Partial<CartItem> & { id: string | number, name: string, price: number }, quantity: number = 1) => {
    setItems(prevItems => {
      // 检查商品是否已存在于购物车
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id.toString())
      
      if (existingItemIndex >= 0) {
        // 更新已有商品数量
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        // 添加新商品
        return [...prevItems, {
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          image: product.image,
          images: product.images,
          quantity: ('quantity' in product) ? (product.quantity || 1) + quantity : quantity
        }]
      }
    })
  }
  
  // 更新商品数量
  const updateQuantity = (id: string, quantity: number) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, quantity } : item
    ))
  }
  
  // 移除商品
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }
  
  // 清空购物车
  const clearCart = () => {
    setItems([])
  }
  
  // 计算商品总数
  const totalItems = items.reduce((total, item) => total + item.quantity, 0)
  
  // 计算总价
  const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0)
  
  // 检查商品是否在购物车中
  const isInCart = (id: string) => {
    return items.some(item => item.id === id)
  }
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      totalItems,
      totalPrice,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

// 购物车Hook
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 