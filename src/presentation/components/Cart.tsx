import React, { useEffect, useState } from 'react';
import { CartViewModel } from '../view-models/CartViewModel';
import { Container } from '../../infrastructure/container';
import { GetUserCartUseCase } from '../../core/application/use-cases/GetUserCart';
import { Cart as CartEntity } from '../../core/domain/entities/Cart';
import { CartItem } from '../../core/domain/entities/Cart';

interface CartProps {
  viewModel: CartViewModel;
  userId: string;
}

export const Cart: React.FC<CartProps> = ({ viewModel, userId }) => {
  const container = Container.getInstance();
  const getUserCartUseCase = container.getUseCase<GetUserCartUseCase>('GetUserCartUseCase');
  const [state, setState] = useState(viewModel.getCurrentState());

  useEffect(() => {
    const subscription = viewModel.getState().subscribe(setState);
    return () => subscription.unsubscribe();
  }, [viewModel]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        viewModel.setLoading(true);
        const cart = await getUserCartUseCase.execute(userId);
        if (cart) {
          viewModel.setCart(cart);
        }
      } catch (error) {
        viewModel.setError(error instanceof Error ? error.message : '加载购物车失败');
      }
    };

    loadCart();
  }, [viewModel, getUserCartUseCase, userId]);

  if (state.loading) {
    return <div>加载中...</div>;
  }

  if (state.error) {
    return <div>错误: {state.error}</div>;
  }

  if (!state.cart) {
    return <div>购物车为空</div>;
  }

  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">购物车</h2>
      <div className="space-y-4">
        {state.cart.items.map((item: CartItem) => (
          <div key={item.product.id} className="flex justify-between items-center border-b pb-4">
            <div>
              <h3 className="font-semibold">{item.product.name}</h3>
              <p className="text-gray-600">¥{item.product.price.toString()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => viewModel.updateQuantity(item.product.id, item.quantity - 1)}
                  className="px-2 py-1 border rounded"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => viewModel.updateQuantity(item.product.id, item.quantity + 1)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => viewModel.removeFromCart(item.product.id)}
                className="text-red-500 hover:text-red-700"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-bold">
          总计: ¥{state.cart.total.toString()}
        </span>
        <button
          onClick={() => viewModel.clearCart()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          清空购物车
        </button>
      </div>
    </div>
  );
}; 