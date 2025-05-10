import { Order } from '../../core/domain/entities/Order';
import { OrderRepository } from '../../core/application/interfaces/OrderRepository';
import { prisma } from '../database/prisma';

export class OrderRepositoryImpl implements OrderRepository {
  async findById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return null;
    }

    return Order.create({
      id: order.id,
      userId: order.userId,
      items: order.items.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          stock: item.product.stock,
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt
        },
        quantity: item.quantity,
        price: item.price
      })),
      status: order.status as Order['status'],
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    });
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return orders.map(order => 
      Order.create({
        id: order.id,
        userId: order.userId,
        items: order.items.map(item => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            stock: item.product.stock,
            createdAt: item.product.createdAt,
            updatedAt: item.product.updatedAt
          },
          quantity: item.quantity,
          price: item.price
        })),
        status: order.status as Order['status'],
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      })
    );
  }

  async save(order: Order): Promise<void> {
    await prisma.order.create({
      data: {
        id: order.id,
        userId: order.userId,
        items: {
          create: order.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price
          }))
        },
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  }

  async updateStatus(id: string, status: Order['status']): Promise<void> {
    await prisma.order.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      }
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({
      where: { id }
    });
  }
} 