import { Order } from '../../domain/entities/Order';

export interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  save(order: Order): Promise<void>;
  updateStatus(id: string, status: Order['status']): Promise<void>;
} 