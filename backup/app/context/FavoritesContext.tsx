'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// 收藏商品类型
export interface FavoriteProduct {
  id: number | string
  name: string
  description: string
  price: number
  image: string
  category?: number
  rating: number
  reviews: number
  addedAt: string
  inventory: number
}

interface FavoritesContextType {
  favorites: FavoriteProduct[]
  addToFavorites: (product: FavoriteProduct) => void
  removeFromFavorites: (productId: number | string) => void
  isInFavorites: (productId: number | string) => boolean
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loaded, setLoaded] = useState(false)

  // 初始化时从localStorage加载收藏列表
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('favorites')
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites))
        }
      } catch (error) {
        console.error('Failed to load favorites from localStorage:', error)
      } finally {
        setLoaded(true)
      }
    }

    loadFavorites()
  }, [])

  // 当收藏列表变化时保存到localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
  }, [favorites, loaded])

  // 添加商品到收藏夹
  const addToFavorites = (product: FavoriteProduct) => {
    // 确保不添加重复商品
    if (!isInFavorites(product.id)) {
      const newProduct = {
        ...product,
        addedAt: new Date().toISOString()
      }
      setFavorites(prev => [newProduct, ...prev])
    }
  }

  // 从收藏夹中移除商品
  const removeFromFavorites = (productId: number | string) => {
    setFavorites(favorites.filter(product => product.id !== productId))
  }

  // 检查商品是否在收藏夹中
  const isInFavorites = (productId: number | string) => {
    return favorites.some(product => product.id === productId)
  }

  // 清空收藏夹
  const clearFavorites = () => {
    setFavorites([])
  }

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isInFavorites,
    clearFavorites
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
} 