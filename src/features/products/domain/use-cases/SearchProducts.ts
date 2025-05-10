import { Product } from '../Product';
import { ProductRepository, ProductSearchParams, ProductSearchResult } from '../ProductRepository';

export class SearchProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(params: ProductSearchParams): Promise<ProductSearchResult> {
    return this.productRepository.search(params);
  }
} 