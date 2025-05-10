import { Product } from '../entities/Product';
import { Order } from '../entities/Order';

export class InventoryService {
  public static validateStockAvailability(order: Order): void {
    for (const item of order.items) {
      if (!item.product.hasStock(item.quantity)) {
        throw new Error(`商品 ${item.product.name} 库存不足`);
      }
    }
  }

  public static async reserveStock(order: Order): Promise<void> {
    this.validateStockAvailability(order);

    for (const item of order.items) {
      const newStock = item.product.stock - item.quantity;
      item.product.updateStock(newStock);
    }
  }

  public static async releaseStock(order: Order): Promise<void> {
    for (const item of order.items) {
      const newStock = item.product.stock + item.quantity;
      item.product.updateStock(newStock);
    }
  }

  public static async updateStockAfterCancellation(order: Order): Promise<void> {
    if (order.status === 'cancelled') {
      await this.releaseStock(order);
    }
  }
} 