import { Cart, CartItem } from '../../core/domain/entities/Cart';
import { CartRepository } from '../../core/application/interfaces/CartRepository';
import { supabase } from '../database/supabase';
import { Product } from '../../core/domain/entities/Product';
import { Money } from '../../core/domain/value-objects/Money';

export class CartRepositoryImpl implements CartRepository {
  async findById(id: string): Promise<Cart | null> {
    // 获取购物车数据
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('id', id)
      .single();

    if (cartError || !cart) {
      return null;
    }

    // 获取购物车项及关联产品
    const { data: cartItems, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('cart_id', id);

    if (itemsError || !cartItems) {
      return null;
    }

    return Cart.create({
      id: cart.id,
      userId: cart.user_id,
      items: cartItems.map(item => CartItem.create({
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
        quantity: item.quantity
      })),
      createdAt: new Date(cart.created_at),
      updatedAt: new Date(cart.updated_at)
    });
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    // 获取用户购物车
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (cartError || !cart) {
      return null;
    }

    // 获取购物车项及关联产品
    const { data: cartItems, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        *,
        products:product_id (*)
      `)
      .eq('cart_id', cart.id);

    if (itemsError || !cartItems) {
      return null;
    }

    return Cart.create({
      id: cart.id,
      userId: cart.user_id,
      items: cartItems.map(item => CartItem.create({
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
        quantity: item.quantity
      })),
      createdAt: new Date(cart.created_at),
      updatedAt: new Date(cart.updated_at)
    });
  }

  async save(cart: Cart): Promise<void> {
    // 首先创建购物车
    const { error: cartError } = await supabase
      .from('carts')
      .insert({
        id: cart.id,
        user_id: cart.userId,
        created_at: cart.createdAt.toISOString(),
        updated_at: cart.updatedAt.toISOString()
      });

    if (cartError) {
      throw new Error(`创建购物车失败: ${cartError.message}`);
    }

    // 然后创建购物车项
    if (cart.items.length > 0) {
      const cartItems = cart.items.map(item => ({
        cart_id: cart.id,
        product_id: item.product.id,
        quantity: item.quantity,
        created_at: new Date().toISOString()
      }));

      const { error: itemsError } = await supabase
        .from('cart_items')
        .insert(cartItems);

      if (itemsError) {
        throw new Error(`创建购物车项失败: ${itemsError.message}`);
      }
    }
  }

  async update(cart: Cart): Promise<void> {
    // 首先删除所有已有的购物车项
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    if (deleteError) {
      throw new Error(`删除购物车项失败: ${deleteError.message}`);
    }

    // 更新购物车本身
    const { error: updateError } = await supabase
      .from('carts')
      .update({
        updated_at: cart.updatedAt.toISOString()
      })
      .eq('id', cart.id);

    if (updateError) {
      throw new Error(`更新购物车失败: ${updateError.message}`);
    }

    // 添加新的购物车项
    if (cart.items.length > 0) {
      const cartItems = cart.items.map(item => ({
        cart_id: cart.id,
        product_id: item.product.id,
        quantity: item.quantity,
        created_at: new Date().toISOString()
      }));

      const { error: itemsError } = await supabase
        .from('cart_items')
        .insert(cartItems);

      if (itemsError) {
        throw new Error(`创建购物车项失败: ${itemsError.message}`);
      }
    }
  }

  async delete(id: string): Promise<void> {
    // 删除购物车项
    const { error: itemsError } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', id);

    if (itemsError) {
      throw new Error(`删除购物车项失败: ${itemsError.message}`);
    }

    // 删除购物车
    const { error: cartError } = await supabase
      .from('carts')
      .delete()
      .eq('id', id);

    if (cartError) {
      throw new Error(`删除购物车失败: ${cartError.message}`);
    }
  }
} 