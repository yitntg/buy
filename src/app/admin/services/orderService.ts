import { Order, OrderStatus, OrderItem } from '@/app/(shared)/types/order'

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟数据
let orders: Order[] = [
  {
    id: '1',
    user_id: '1',
    status: OrderStatus.PENDING,
    total: 299.97,
    items: [
      {
        product_id: '1',
        quantity: 2,
        price: 149.99
      }
    ],
    created_at: '2024-03-20T10:00:00Z'
  },
  {
    id: '2',
    user_id: '2',
    status: OrderStatus.PAID,
    total: 199.99,
    items: [
      {
        product_id: '2',
        quantity: 1,
        price: 199.99
      }
    ],
    created_at: '2024-03-19T15:30:00Z'
  }
]

export const orderService = {
  // 获取订单列表
  async getOrders(): Promise<Order[]> {
    await delay(1000)
    return orders
  },
  
  // 获取单个订单
  async getOrder(id: string): Promise<Order | null> {
    await delay(500)
    return orders.find(o => o.id === id) || null
  },
  
  // 更新订单状态
  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    await delay(500)
    const index = orders.findIndex(o => o.id === id)
    if (index === -1) return null
    
    orders[index].status = status
    return orders[index]
  },
  
  // 删除订单
  async deleteOrder(id: string): Promise<boolean> {
    await delay(500)
    const index = orders.findIndex(o => o.id === id)
    if (index === -1) return false
    
    orders.splice(index, 1)
    return true
  },
  
  // 获取订单统计数据
  async getOrderStats() {
    await delay(1000)
    return {
      totalOrders: orders.length,
      totalSales: orders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(o => o.status === OrderStatus.PENDING).length,
      paidOrders: orders.filter(o => o.status === OrderStatus.PAID).length,
      shippedOrders: orders.filter(o => o.status === OrderStatus.SHIPPED).length,
      deliveredOrders: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
      cancelledOrders: orders.filter(o => o.status === OrderStatus.CANCELLED).length
    }
  }
} 