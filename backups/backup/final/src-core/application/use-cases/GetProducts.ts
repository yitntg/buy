import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../interfaces/ProductRepository';

export class GetProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
} 