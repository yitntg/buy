import { Category } from '../Category';
import { CategoryRepository } from '../CategoryRepository';

export class GetCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(): Promise<Category[]> {
    return this.categoryRepository.findActive();
  }
} 