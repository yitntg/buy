import { Category, CategoryProps } from '../domain/Category';
import { CategoryRepository } from '../domain/CategoryRepository';

export class CategoryApi implements CategoryRepository {
  private readonly baseUrl = '/api/categories';

  async findById(id: string): Promise<Category | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) return null;

      const data = await response.json();
      return Category.create({
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) return [];

      const data = await response.json();
      return data.map((item: CategoryProps) => Category.create({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async findByParentId(parentId: string): Promise<Category[]> {
    try {
      const response = await fetch(`${this.baseUrl}?parentId=${parentId}`);
      if (!response.ok) return [];

      const data = await response.json();
      return data.map((item: CategoryProps) => Category.create({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
      }));
    } catch (error) {
      console.error('Error fetching categories by parent:', error);
      return [];
    }
  }

  async findActive(): Promise<Category[]> {
    try {
      const response = await fetch(`${this.baseUrl}?isActive=true`);
      if (!response.ok) return [];

      const data = await response.json();
      return data.map((item: CategoryProps) => Category.create({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
      }));
    } catch (error) {
      console.error('Error fetching active categories:', error);
      return [];
    }
  }

  async save(category: Category): Promise<void> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...category,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt?.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      throw error;
    }
  }

  async update(category: Category): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...category,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt?.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
} 