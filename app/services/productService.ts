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
    console.log('正在获取精选商品数据...')
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('获取商品失败:', error)
      // 返回一些模拟数据，确保UI能够正常渲染
      return getMockProducts(limit)
    }

    console.log(`成功获取${data?.length || 0}个精选商品`)
    return data || []
  } catch (error) {
    console.error('获取商品异常:', error)
    return getMockProducts(limit)
  }
}

// 获取分类数据
export async function getCategories() {
  try {
    console.log('正在获取分类数据...')
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('获取分类失败:', error)
      // 返回一些模拟数据，确保UI能够正常渲染
      return getMockCategories()
    }

    // 为分类添加图标
    const categoriesWithIcons = data.map(category => ({
      ...category,
      icon: getCategoryIcon(category.id)
    }))

    console.log(`成功获取${data?.length || 0}个分类`)
    return categoriesWithIcons || []
  } catch (error) {
    console.error('获取分类异常:', error)
    return getMockCategories()
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

// 模拟商品数据，用于数据库连接失败时的回退方案
function getMockProducts(limit = 4): Product[] {
  console.log('使用模拟商品数据')
  return Array(limit).fill(null).map((_, index) => ({
    id: index + 1,
    name: `模拟商品 ${index + 1}`,
    description: '这是一个模拟商品，表示数据库连接暂时不可用',
    price: 99.99,
    image: 'https://placehold.co/300x300?text=Product',
    category: Math.floor(Math.random() * 6) + 1,
    inventory: 10,
    rating: 4.5,
    reviews: 10
  }))
}

// 模拟分类数据，用于数据库连接失败时的回退方案
function getMockCategories(): Category[] {
  console.log('使用模拟分类数据')
  return [
    { id: 1, name: '电子产品', icon: '📱' },
    { id: 2, name: '家居用品', icon: '🏠' },
    { id: 3, name: '服装', icon: '👕' },
    { id: 4, name: '美妆', icon: '💄' },
    { id: 5, name: '食品', icon: '🍎' },
    { id: 6, name: '运动', icon: '⚽' }
  ]
} 