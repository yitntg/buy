import React, { useState } from 'react';
import { ProductList } from '../components/ProductList';
import { Cart } from '../components/Cart';
import { OrderList } from '../components/OrderList';
import { ProductViewModel } from '../view-models/ProductViewModel';
import { CartViewModel } from '../view-models/CartViewModel';
import { OrderViewModel } from '../view-models/OrderViewModel';

interface HomePageProps {
  userId: string;
}

export const HomePage: React.FC<HomePageProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'cart' | 'orders'>('products');
  const productViewModel = new ProductViewModel();
  const cartViewModel = new CartViewModel();
  const orderViewModel = new OrderViewModel();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border p-1">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'products'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            商品列表
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'cart'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            购物车
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'orders'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            我的订单
          </button>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'products' && <ProductList viewModel={productViewModel} />}
        {activeTab === 'cart' && <Cart viewModel={cartViewModel} userId={userId} />}
        {activeTab === 'orders' && <OrderList viewModel={orderViewModel} userId={userId} />}
      </div>
    </div>
  );
}; 