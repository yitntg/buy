import { Product } from '@/core/domain/entities/Product';
import { ProductRepository, ProductSearchParams, ProductSearchResult } from '@/core/application/interfaces/ProductRepository';
import { Money } from '@/core/domain/value-objects/Money';
import { supabase } from '../database/supabase';

export class ProductRepositoryImpl implements ProductRepository {
  constructor() {}

  async findById(id: string): Promise<Product | null> {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) return null;

    return Product.create({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Money.create(product.price),
      images: product.images || [],
      categoryId: product.category || '0',
      stock: product.stock,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    });
  }

  async findAll(): Promise<Product[]> {
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error || !products) return [];
    
    return products.map(product => Product.create({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Money.create(product.price),
      images: product.images || [],
      categoryId: product.category || '0',
      stock: product.stock,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    }));
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', categoryId);
    
    if (error || !products) return [];
    
    return products.map(product => Product.create({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Money.create(product.price),
      images: product.images || [],
      categoryId: product.category || categoryId,
      stock: product.stock,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    }));
  }

  async findFeatured(limit: number = 4): Promise<Product[]> {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error || !products) return [];
    
    return products.map(product => new Product(
      product.id,
      product.name,
      product.description,
      product.price,
      product.images || [], 
      product.category || '0',
      product.stock,
      new Date(product.created_at),
      new Date(product.updated_at)
    ));
  }

  async search(params: ProductSearchParams): Promise<ProductSearchResult> {
    const { 
      query, 
      categoryId, 
      minPrice, 
      maxPrice, 
      sortBy = 'created_at', 
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = params;

    let queryBuilder = supabase
      .from('products')
      .select('*', { count: 'exact' });
    
    if (query) {
      // PostgreSQL ILIKE用于不区分大小写搜索
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }
    
    if (minPrice !== undefined) {
      queryBuilder = queryBuilder.gte('price', minPrice);
    }
    
    if (maxPrice !== undefined) {
      queryBuilder = queryBuilder.lte('price', maxPrice);
    }
    
    if (categoryId !== undefined) {
      queryBuilder = queryBuilder.eq('category', categoryId);
    }

    // 添加排序
    queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });

    // 添加分页
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    queryBuilder = queryBuilder.range(from, to);
    
    const { data: products, error, count } = await queryBuilder;

    if (error || !products) {
      return {
        items: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }

    const mappedProducts = products.map(product => Product.create({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Money.create(product.price),
      images: product.images || [],
      categoryId: product.category || '0',
      stock: product.stock,
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    }));

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      items: mappedProducts,
      total,
      page,
      limit,
      totalPages
    };
  }

  async save(product: Product): Promise<void> {
    const { error } = await supabase
      .from('products')
      .upsert({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.getAmount(),
        images: product.images,
        category: product.categoryId,
        stock: product.stock,
        created_at: product.createdAt.toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw new Error(`保存产品失败: ${error.message}`);
    }
  }

  async update(id: string, product: Product): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        description: product.description,
        price: product.price.getAmount(),
        images: product.images,
        category: product.categoryId,
        stock: product.stock,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw new Error(`更新产品失败: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw new Error(`删除产品失败: ${error.message}`);
    }
  }
} 