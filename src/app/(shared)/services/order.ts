import { Order } from '../types/order'

export async function getOrders(): Promise<Order[]> {
  const response = await fetch('/api/admin/orders')
  if (!response.ok) {
    throw new Error('获取订单列表失败')
  }
  const data = await response.json()
  
  // 确保数据是可序列化的
  return data.map((order: any) => ({
    id: order.id,
    user_id: order.user_id,
    user: order.user ? {
      id: order.user.id,
      name: order.user.name || `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email,
      email: order.user.email,
      role: order.user.role
    } : null,
    status: order.status,
    total: order.total,
    items: order.items.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    })),
    created_at: order.created_at,
    updated_at: order.updated_at,
    shipping_address: order.shipping_address ? {
      id: order.shipping_address.id,
      recipient_name: order.shipping_address.recipient_name,
      address_line1: order.shipping_address.address_line1,
      city: order.shipping_address.city,
      state: order.shipping_address.state,
      postal_code: order.shipping_address.postal_code,
      country: order.shipping_address.country,
      phone: order.shipping_address.phone
    } : null,
    tracking_number: order.tracking_number,
    estimated_delivery: order.estimated_delivery,
    notes: order.notes
  }))
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
  const response = await fetch(`/api/admin/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error('更新订单状态失败')
  }

  return response.json()
}

export async function bulkUpdateOrderStatus(orderIds: string[], status: Order['status']): Promise<void> {
  const response = await fetch('/api/admin/orders/bulk-update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderIds, status }),
  })

  if (!response.ok) {
    throw new Error('批量更新订单状态失败')
  }
} 