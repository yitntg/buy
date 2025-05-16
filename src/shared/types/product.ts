/**
 * 产品相关类型定义
 */

// 基础产品类型
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  inventory: number;
  rating: number;
  reviews: number;
  created_at?: string;
  brand?: string;
  model?: string;
  specifications?: string;
  free_shipping?: boolean;
  returnable?: boolean;
  warranty?: boolean;
  images?: ProductImage[];
  primary_image?: string;
  updated_at?: string;
  tags?: string[];
  discount?: number;
  is_featured?: boolean;
  is_new?: boolean;
  quantity?: number; // 购物车中的数量
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  stock?: number;
  options: Record<string, string | number>;
  images?: string[];
}

export interface ReviewInput {
  product_id: string;
  rating: number;
  content: string;
  title?: string;
  images?: string[];
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  created_at: string;
  updated_at?: string;
  likes_count: number;
  is_verified_purchase: boolean;
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

export interface ProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
} 
