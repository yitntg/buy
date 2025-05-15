/**
 * 产品相关类型定义
 */

// 基础产品类型
export interface Product {
  id: string | number
  name: string
  description: string
  price: number
  image?: string
  images?: string[]  // 添加多图片支持
  category: number | string
  inventory?: number
  stock?: number // 添加库存字段
  rating?: number
  reviews?: number
  created_at?: string
  updated_at?: string
  createdAt?: string
  updatedAt?: string
  brand?: string
  model?: string
  specifications?: Record<string, string | number>
  free_shipping?: boolean
  returnable?: boolean
  warranty?: boolean
}

// 带收藏状态的产品（用户端）
export interface ProductWithFavorite extends Product {
  isFavorite: boolean
}

// 收藏商品类型
export interface FavoriteProduct extends Product {
  addedAt: string
  rating: number
  reviews: number
  inventory: number
}

// 购物车商品类型
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string[];  // 添加多图片支持
  quantity: number;
}

// 产品创建请求
export interface ProductCreateRequest {
  name: string
  description: string
  price: number
  image: string
  category: number
  inventory: number
}

// 产品更新请求
export interface ProductUpdateRequest {
  name?: string
  description?: string
  price?: number
  image?: string
  category?: number
  inventory?: number
}

// 产品过滤条件
export interface ProductFilters {
  keyword?: string
  category?: number | string
  minPrice?: number
  maxPrice?: number
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'newest'
}

// 产品分页结果
export interface ProductsResponse {
  success: boolean
  products: Product[] | ProductWithFavorite[]
  total: number
  page: number
  limit: number
  filters?: {
    categories: number[]
    priceRange: {
      min: number
      max: number
    }
  }
} 
