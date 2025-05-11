import { supabase } from '@/lib/supabase'

// 定义商品类型接口
export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: number
  inventory: number
  rating: number
  reviews: number
}

// 定义分类类型接口
export interface Category {
  id: number
  name: string
  icon: string
}

// 获取商品数据
export async function getFeaturedProducts(limit = 4) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('获取商品失败:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('获取商品异常:', error)
    return []
  }
}

// 获取分类数据
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('获取分类失败:', error)
      return []
    }

    // 为分类添加图标
    const categoriesWithIcons = data.map(category => ({
      ...category,
      icon: getCategoryIcon(category.id)
    }))

    return categoriesWithIcons || []
  } catch (error) {
    console.error('获取分类异常:', error)
    return []
  }
}

// 获取分类图标
export function getCategoryIcon(categoryId: number): string {
  const icons: Record<number, string> = {
    1: '📱',
    2: '🏠',
    3: '👕',
    4: '💄',
    5: '🍎',
    6: '⚽'
  }
  return icons[categoryId] || '🔍'
} 