import { Category } from './Category';

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  findByParentId(parentId: string): Promise<Category[]>;
  findActive(): Promise<Category[]>;
  save(category: Category): Promise<void>;
  update(id: string, category: Category): Promise<void>;
  delete(id: string): Promise<void>;
} 