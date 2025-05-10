import { Cart } from '../../core/domain/entities/Cart';
import { CartRepository } from '../../core/application/interfaces/CartRepository';
import { prisma } from '../database/prisma';

export class CartRepositoryImpl implements CartRepository {
  async findById(id: string): Promise<Cart | null> {
    const cart = await prisma.cart.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      return null;
    }

    return Cart.create({
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          stock: item.product.stock,
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt
        },
        quantity: item.quantity
      })),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    });
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      return null;
    }

    return Cart.create({
      id: cart.id,
      userId: cart.userId,
      items: cart.items.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          stock: item.product.stock,
          createdAt: item.product.createdAt,
          updatedAt: item.product.updatedAt
        },
        quantity: item.quantity
      })),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    });
  }

  async save(cart: Cart): Promise<void> {
    await prisma.cart.create({
      data: {
        id: cart.id,
        userId: cart.userId,
        items: {
          create: cart.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
          }))
        },
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
      }
    });
  }

  async update(cart: Cart): Promise<void> {
    // 首先删除所有现有的购物车项
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    // 然后更新购物车和创建新的购物车项
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          create: cart.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity
          }))
        },
        updatedAt: cart.updatedAt
      }
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.cart.delete({
      where: { id }
    });
  }
} 