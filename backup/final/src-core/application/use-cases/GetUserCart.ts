import { Cart } from '../../domain/entities/Cart';
import { CartRepository } from '../interfaces/CartRepository';

export class GetUserCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(userId: string): Promise<Cart | null> {
    return this.cartRepository.findByUserId(userId);
  }
} 