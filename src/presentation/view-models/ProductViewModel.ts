import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../core/domain/entities/Product';

export interface ProductState {
  loading: boolean;
  product: Product | null;
  error: string | null;
}

export class ProductViewModel {
  private readonly state = new BehaviorSubject<ProductState>({
    loading: false,
    product: null,
    error: null
  });

  public getState(): Observable<ProductState> {
    return this.state.asObservable();
  }

  public setLoading(loading: boolean): void {
    this.state.next({
      ...this.state.value,
      loading
    });
  }

  public setProduct(product: Product): void {
    this.state.next({
      loading: false,
      product,
      error: null
    });
  }

  public setError(error: string): void {
    this.state.next({
      loading: false,
      product: null,
      error
    });
  }
} 