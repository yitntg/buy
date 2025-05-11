import { Product } from './Product';
import { PaginatedResult } from '@/shared/domain/PaginatedResult';

export interface ProductSearchParams {
  query?: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'created_at' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByCategory(categoryId: number): Promise<Product[]>;
  findFeatured(limit?: number): Promise<Product[]>;
  search(params: ProductSearchParams): Promise<ProductSearchResult>;
  save(product: Product): Promise<void>;
  update(id: string, product: Partial<Product>): Promise<void>;
  delete(id: string): Promise<void>;
} 