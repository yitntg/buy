import { createClient } from '@supabase/supabase-js';
import { Product, ProductProps } from '../../domain/entities/Product';
import { ProductRepository } from '../../application/interfaces/ProductRepository';
import { Money } from '../../domain/value-objects/Money';

export class SupabaseProductRepository implements ProductRepository {
  private readonly supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return Product.create({
      ...data,
      price: Money.create(data.price),
      createdAt: new Date(data.created_at)
    });
  }

  async findAll(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*');

    if (error || !data) return [];

    return data.map(item => Product.create({
      ...item,
      price: Money.create(item.price),
      createdAt: new Date(item.created_at)
    }));
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId);

    if (error || !data) return [];

    return data.map(item => Product.create({
      ...item,
      price: Money.create(item.price),
      createdAt: new Date(item.created_at)
    }));
  }

  async save(product: Product): Promise<void> {
    const { error } = await this.supabase
      .from('products')
      .upsert({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price.getAmount(),
        images: product.images,
        category_id: product.categoryId,
        stock: product.stock,
        created_at: product.createdAt.toISOString()
      });

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