import { Product } from '@/core/domain/entities/Product';
import { ProductRepository, ProductSearchParams, ProductSearchResult } from '@/core/application/interfaces/ProductRepository';
import { Money } from '@/core/domain/value-objects/Money';

export class ProductApi implements ProductRepository {
  private readonly baseUrl = '/api/products';

  async findById(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) return null;

      const data = await response.json();
      return Product.create({
        ...data,
        price: Money.create(data.price),
        createdAt: new Date(data.createdAt)
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) return [];

      const data = await response.json();
      return data.map((item: any) => Product.create({
        ...item,
        price: Money.create(item.price),
        createdAt: new Date(item.createdAt)
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async findByCategory(categoryId: string): Promise<Product[]> {
    try {
      const response = await fetch(`${this.baseUrl}?categoryId=${categoryId}`);
      if (!response.ok) return [];

      const data = await response.json();
      return data.map((item: any) => Product.create({
        ...item,
        price: Money.create(item.price),
        createdAt: new Date(item.createdAt)
      }));
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  async save(product: Product): Promise<void> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...product,
          price: product.price.getAmount(),
          createdAt: product.createdAt.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }

  async update(id: string, product: Product): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...product,
          price: product.price.getAmount(),
          createdAt: product.createdAt.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async search(params: ProductSearchParams): Promise<ProductSearchResult> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('query', params.query);
      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const response = await fetch(`${this.baseUrl}/search?${queryParams.toString()}`);
      if (!response.ok) {
        return {
          items: [],
          total: 0,
          page: params.page || 1,
          limit: params.limit || 10,
          totalPages: 0
        };
      }

      const data = await response.json();
      return {
        items: data.items.map((item: any) => Product.create({
          ...item,
          price: Money.create(item.price),
          createdAt: new Date(item.createdAt)
        })),
        total: data.total,
        page: data.page,
        limit: data.limit,
        totalPages: data.totalPages
      };
    } catch (error) {
      console.error('Error searching products:', error);
      return {
        items: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0
      };
    }
  }
} 