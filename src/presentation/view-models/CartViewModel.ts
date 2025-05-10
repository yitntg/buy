import { BehaviorSubject, Observable } from 'rxjs';
import { Cart } from '../../core/domain/entities/Cart';
import { Product } from '../../core/domain/entities/Product';

export interface CartState {
  loading: boolean;
  cart: Cart | null;
  error: string | null;
}

export class CartViewModel {
  private readonly state = new BehaviorSubject<CartState>({
    loading: false,
    cart: null,
    error: null
  });

  public getState(): Observable<CartState> {
    return this.state.asObservable();
  }

  public getCurrentState(): CartState {
    return this.state.value;
  }

  public setLoading(loading: boolean): void {
    this.state.next({
      ...this.state.value,
      loading
    });
  }

  public setCart(cart: Cart): void {
    this.state.next({
      loading: false,
      cart,
      error: null
    });
  }

  public setError(error: string): void {
    this.state.next({
      loading: false,
      cart: null,
      error
    });
  }

  public addToCart(product: Product, quantity: number): void {
    if (!this.state.value.cart) {
      return;
    }

    const cart = this.state.value.cart;
    cart.addItem(product, quantity);

    this.state.next({
      ...this.state.value,
      cart
    });
  }

  public removeFromCart(productId: string): void {
    if (!this.state.value.cart) {
      return;
    }

    const cart = this.state.value.cart;
    cart.removeItem(productId);

    this.state.next({
      ...this.state.value,
      cart
    });
  }

  public updateQuantity(productId: string, quantity: number): void {
    if (!this.state.value.cart) {
      return;
    }

    const cart = this.state.value.cart;
    cart.updateQuantity(productId, quantity);

    this.state.next({
      ...this.state.value,
      cart
    });
  }

  public clearCart(): void {
    if (!this.state.value.cart) {
      return;
    }

    const cart = this.state.value.cart;
    cart.clear();

    this.state.next({
      ...this.state.value,
      cart
    });
  }
} 