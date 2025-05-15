import React, { useEffect, useState } from 'react';
import { Product } from '../domain/Product';
import { ProductApi } from '../api/ProductApi';

interface ProductDetailProps {
  productId: string;
  onAddToCart?: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  productId,
  onAddToCart
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productRepository = new ProductApi();
        const productData = await productRepository.findById(productId);
        setProduct(productData);
      } catch (err) {
        setError('加载产品详情失败');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">加载中...</div>;
  }

  if (error || !product) {
    return <div className="text-red-500 text-center">{error || '产品不存在'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} - ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <div className="text-2xl font-bold text-primary">
            {product.price.getFormattedAmount()}
          </div>
          <div className="text-sm text-gray-500">
            库存: {product.stock}
          </div>
          {product.stock > 0 ? (
            <button
              onClick={() => onAddToCart?.(product)}
              className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
            >
              加入购物车
            </button>
          ) : (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg cursor-not-allowed"
            >
              暂时缺货
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 