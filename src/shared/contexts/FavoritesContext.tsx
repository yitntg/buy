'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, FavoriteProduct } from '@/shared/types/product'
import { useAuth } from './AuthContext'
import { createClient } from '../utils/supabase/client'

// 定义收藏夹上下文类型
interface FavoritesContextType {
  favorites: FavoriteProduct[]
  isLoading: boolean
  error: string | null
  addToFavorites: (product: Product) => Promise<void>
  removeFromFavorites: (productId: string | number) => Promise<void>
  clearFavorites: () => Promise<void>
  isInFavorites: (productId: string | number) => boolean
}

// 创建上下文
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// 收藏夹提供者组件
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { user } = useAuth()
  const supabase = createClient()
  
  // 加载收藏夹
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (!user) {
          // 从本地存储加载
          const localFavorites = localStorage.getItem('favorites')
          if (localFavorites) {
            setFavorites(JSON.parse(localFavorites))
          }
          return
        }
        
        setIsLoading(true)
        setError(null)
        
        // 从数据库加载
        const { data, error } = await supabase
          .from('favorites')
          .select('*, products(*)')
          .eq('user_id', user.id)
        
        if (error) {
          throw error
        }
        
        if (data) {
          const mappedFavorites: FavoriteProduct[] = data.map(item => ({
            id: item.products.id,
            name: item.products.name,
            description: item.products.description,
            price: item.products.price,
            image: item.products.image,
            images: item.products.images,
            category: item.products.category_id,
            inventory: item.products.inventory || 0,
            rating: item.products.rating || 0,
            reviews: item.products.review_count || 0,
            addedAt: item.created_at
          }))
          
          setFavorites(mappedFavorites)
        }
      } catch (error: any) {
        console.error('加载收藏夹失败:', error)
        setError(error.message || '加载收藏夹失败')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadFavorites()
  }, [user])
  
  // 保存到本地存储
  useEffect(() => {
    if (!user) {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
  }, [favorites, user])
  
  // 添加到收藏
  const addToFavorites = async (product: Product) => {
    try {
      setError(null)
      
      // 检查是否已在收藏夹
      if (isInFavorites(product.id)) {
        return
      }
      
      if (!user) {
        // 保存到本地
        const favoriteProduct: FavoriteProduct = {
          ...product,
          addedAt: new Date().toISOString(),
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          inventory: product.inventory || (product.stock || 0)
        }
        
        setFavorites(prev => [...prev, favoriteProduct])
        return
      }
      
      setIsLoading(true)
      
      // 保存到数据库
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_id: product.id,
          created_at: new Date().toISOString()
        })
      
      if (error) {
        throw error
      }
      
      // 更新本地状态
      const favoriteProduct: FavoriteProduct = {
        ...product,
        addedAt: new Date().toISOString(),
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        inventory: product.inventory || (product.stock || 0)
      }
      
      setFavorites(prev => [...prev, favoriteProduct])
    } catch (error: any) {
      console.error('添加收藏失败:', error)
      setError(error.message || '添加收藏失败')
    } finally {
      setIsLoading(false)
    }
  }
  
  // 从收藏夹移除
  const removeFromFavorites = async (productId: string | number) => {
    try {
      setError(null)
      
      // 更新本地状态
      setFavorites(prev => prev.filter(item => item.id !== productId))
      
      if (!user) {
        return
      }
      
      setIsLoading(true)
      
      // 从数据库移除
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
      
      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error('移除收藏失败:', error)
      setError(error.message || '移除收藏失败')
    } finally {
      setIsLoading(false)
    }
  }
  
  // 清空收藏夹
  const clearFavorites = async () => {
    try {
      setError(null)
      
      // 更新本地状态
      setFavorites([])
      
      if (!user) {
        return
      }
      
      setIsLoading(true)
      
      // 从数据库清空
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
      
      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error('清空收藏失败:', error)
      setError(error.message || '清空收藏失败')
    } finally {
      setIsLoading(false)
    }
  }
  
  // 检查是否已在收藏夹
  const isInFavorites = (productId: string | number): boolean => {
    return favorites.some(item => item.id === productId)
  }
  
  return (
    <FavoritesContext.Provider value={{
      favorites,
      isLoading,
      error,
      addToFavorites,
      removeFromFavorites,
      clearFavorites,
      isInFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  )
}

// 收藏夹Hook
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

// 导出类型
export type { FavoriteProduct } 