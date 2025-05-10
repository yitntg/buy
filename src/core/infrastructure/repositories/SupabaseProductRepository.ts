import { createClient } from '@supabase/supabase-js';
import { Product } from '@/core/domain/entities/Product';
import { ProductRepository, ProductSearchParams, ProductSearchResult } from '@/core/application/interfaces/ProductRepository';
import { Money } from '@/core/domain/value-objects/Money';

export class SupabaseProductRepository implements ProductRepository {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  private mapToProduct(data: any): Product {
    return Product.create({
      id: data.id,
      name: data.name,
      description: data.description,
      price: Money.create(data.price),
      images: data.images || [],
      categoryId: data.category_id,
      stock: data.stock,
      createdAt: new Date(data.created_at),
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
    });
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToProduct(data);
  }

  async findAll(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*');

    if (error || !data) return [];
    return data.map(this.mapToProduct);
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId);

    if (error || !data) return [];
    return data.map(this.mapToProduct);
  }

  async search(params: ProductSearchParams): Promise<ProductSearchResult> {
    let query = this.supabase
      .from('products')
      .select('*', { count: 'exact' });

    if (params.query) {
      query = query.ilike('name', `%${params.query}%`);
    }

    if (params.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }

    if (params.minPrice) {
      query = query.gte('price', params.minPrice);
    }

    if (params.maxPrice) {
      query = query.lte('price', params.maxPrice);
    }

    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    query = query.range(start, end);

    if (params.sortBy) {
      query = query.order(params.sortBy, { ascending: params.sortOrder === 'asc' });
    }

    const { data, error, count } = await query;

    if (error || !data) {
      return {
        items: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }

    return {
      items: data.map(this.mapToProduct),
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  async save(product: Product): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .insert({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.getAmount(),
        images: product.images,
        category_id: product.categoryId,
        stock: product.stock,
        created_at: product.createdAt,
        updated_at: product.updatedAt
      });

    if (error) throw error;
  }

  async update(id: string, product: Product): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price.getAmount(),
        images: product.images,
        category_id: product.categoryId,
        stock: product.stock,
        updated_at: new Date()
      })
      .eq('id', id);

    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
} 