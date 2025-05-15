import { Order, OrderItem } from '../../core/domain/entities/Order';
import { OrderRepository } from '../../core/application/interfaces/OrderRepository';
import { supabase } from '../database/supabase';
import { Money } from '../../core/domain/value-objects/Money';
import { Product } from '../../core/domain/entities/Product';
import { OrderStatus } from '@/types/supabase';

export class OrderRepositoryImpl implements OrderRepository {
  // Supabase状态到实体状态的映射
  private mapDbToEntityStatus(dbStatus: OrderStatus): 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' {
    const map: Record<OrderStatus, 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'> = {
      'pending': 'pending',
      'processing': 'paid', // 处理中映射为已支付
      'shipped': 'shipped',
      'delivered': 'delivered',
      'canceled': 'cancelled'
    };
    return map[dbStatus] || 'pending';
  }

  // 实体状态到Supabase状态的映射
  private mapEntityToDbStatus(entityStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'): OrderStatus {
    const map: Record<string, OrderStatus> = {
      'pending': 'pending',
      'paid': 'processing', // 已支付映射为处理中
      'shipped': 'shipped',
      'delivered': 'delivered',
      'cancelled': 'canceled'
    };
    return map[entityStatus] || 'pending';
  }

  async findById(id: string): Promise<Order | null> {
    // 获取订单数据
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError || !order) {
      return null;
    }

    // 获取订单项及关联产品
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('order_id', id);

    if (itemsError || !orderItems) {
      return null;
    }

    return Order.create({
      id: order.id,
      userId: order.user_id,
      items: orderItems.map(item => OrderItem.create({
        product: Product.create({
          id: item.products.id,
          name: item.products.name,
          description: item.products.description || '',
          price: Money.create(item.products.price),
          images: Array.isArray(item.products.images) ? 
            item.products.images.map(img => String(img)) : [],
          categoryId: item.products.category || '0',
          stock: item.products.stock,
          createdAt: new Date(item.products.created_at),
          updatedAt: new Date(item.products.updated_at)
        }),
        quantity: item.quantity,
        price: Money.create(item.price)
      })),
      status: this.mapDbToEntityStatus(order.status),
      total: Money.create(order.total),
      createdAt: new Date(order.created_at)
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    // 获取用户所有订单
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId);

    if (ordersError || !orders || orders.length === 0) {
      return [];
    }

    // 构建结果数组
    const result: Order[] = [];

    // 为每个订单获取订单项
    for (const order of orders) {
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          products:product_id (*)
        `)
        .eq('order_id', order.id);

      if (!itemsError && orderItems) {
        result.push(
          Order.create({
            id: order.id,
            userId: order.user_id,
            items: orderItems.map(item => OrderItem.create({
              product: Product.create({
                id: item.products.id,
                name: item.products.name,
                description: item.products.description || '',
                price: Money.create(item.products.price),
                images: Array.isArray(item.products.images) ? 
                  item.products.images.map(img => String(img)) : [],
                categoryId: item.products.category || '0',
                stock: item.products.stock,
                createdAt: new Date(item.products.created_at),
                updatedAt: new Date(item.products.updated_at)
              }),
              quantity: item.quantity,
              price: Money.create(item.price)
            })),
            status: this.mapDbToEntityStatus(order.status),
            total: Money.create(order.total),
            createdAt: new Date(order.created_at)
          })
        );
      }
    }

    return result;
  }

  async save(order: Order): Promise<void> {
    // 首先创建订单，确保使用shipping_address和payment_method的必填字段
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        id: order.id,
        user_id: order.userId,
        status: this.mapEntityToDbStatus(order.status),
        total: order.total.getAmount(),
        shipping_address: { address: "未提供" }, // 提供必填字段的默认值
        payment_method: "未指定", // 提供必填字段的默认值
        payment_status: "pending",
        created_at: order.createdAt.toISOString(),
        updated_at: new Date().toISOString()
      });

    if (orderError) {
      throw new Error(`创建订单失败: ${orderError.message}`);
    }

    // 然后创建订单项
    if (order.items.length > 0) {
      const orderItems = order.items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.price.getAmount(),
        discount: 0, // 提供默认的折扣值
        created_at: new Date().toISOString()
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw new Error(`创建订单项失败: ${itemsError.message}`);
      }
    }
  }

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({
        status: this.mapEntityToDbStatus(status),
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw new Error(`更新订单状态失败: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    // 删除订单项
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);

    if (itemsError) {
      throw new Error(`删除订单项失败: ${itemsError.message}`);
    }

    // 删除订单
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (orderError) {
      throw new Error(`删除订单失败: ${orderError.message}`);
    }
  }
} 