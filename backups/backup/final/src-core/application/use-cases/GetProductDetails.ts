import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../interfaces/ProductRepository';

export class GetProductDetailsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }
} 