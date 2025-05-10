import { GetProductDetailsUseCase } from '../../core/application/use-cases/GetProductDetails';
import { ProductViewModel } from '../view-models/ProductViewModel';

export class ProductController {
  constructor(
    private readonly getProductDetailsUseCase: GetProductDetailsUseCase,
    private readonly viewModel: ProductViewModel
  ) {}

  async loadProduct(id: string): Promise<void> {
    try {
      this.viewModel.setLoading(true);
      const product = await this.getProductDetailsUseCase.execute(id);
      if (product) {
        this.viewModel.setProduct(product);
      } else {
        this.viewModel.setError('Product not found');
      }
    } catch (error) {
      this.viewModel.setError(error instanceof Error ? error.message : 'Failed to load product');
    }
  }
} 