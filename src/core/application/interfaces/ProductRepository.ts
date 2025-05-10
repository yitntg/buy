import { Product } from '@/core/domain/entities/Product';

export interface ProductSearchParams {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductSearchResult {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  findByCategory(categoryId: string): Promise<Product[]>;
  search(params: ProductSearchParams): Promise<ProductSearchResult>;
  save(product: Product): Promise<void>;
  update(id: string, product: Product): Promise<void>;
  delete(id: string): Promise<void>;
} 