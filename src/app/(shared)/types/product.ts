/**
 * 产品相关类型定义
 */

// 确保首先引入基本类型
import { BaseEntity } from './base';

// 产品图片类型
export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order?: number;
  is_primary?: boolean;
}

// 产品类型
export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  original_price?: number;
  category_id?: string;
  category?: string;
  sku?: string;
  inventory: number;
  rating?: number;
  reviews?: number;
  primary_image?: string;
  images?: ProductImage[];
  is_featured?: boolean;
  is_new?: boolean;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
}

// 收藏夹中的产品类型
export interface FavoriteProduct extends Product {
  addedAt: string;
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