import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../core/domain/entities/Product';

export interface ProductState {
  loading: boolean;
  products: Product[];
  selectedProduct: Product | null;
  error: string | null;
}

export class ProductViewModel {
  private readonly state = new BehaviorSubject<ProductState>({
    loading: false,
    products: [],
    selectedProduct: null,
    error: null
  });

  public getState(): Observable<ProductState> {
    return this.state.asObservable();
  }

  public getCurrentState(): ProductState {
    return this.state.value;
  }

  public setLoading(loading: boolean): void {
    this.state.next({
      ...this.state.value,
      loading
    });
  }

  public setProducts(products: Product[]): void {
    this.state.next({
      loading: false,
      products,
      selectedProduct: null,
      error: null
    });
  }

  public setSelectedProduct(product: Product): void {
    this.state.next({
      ...this.state.value,
      selectedProduct: product
    });
  }

  public setError(error: string): void {
    this.state.next({
      loading: false,
      products: [],
      selectedProduct: null,
      error
    });
  }

  public addProduct(product: Product): void {
    this.state.next({
      ...this.state.value,
      products: [...this.state.value.products, product]
    });
  }

  public updateProduct(product: Product): void {
    const products = this.state.value.products.map(p => {
      if (p.id === product.id) {
        return product;
      }
      return p;
    });

    this.state.next({
      ...this.state.value,
      products
    });
  }

  public removeProduct(productId: string): void {
    const products = this.state.value.products.filter(p => p.id !== productId);
    this.state.next({
      ...this.state.value,
      products
    });
  }
} 