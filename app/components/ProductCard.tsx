import Image from 'next/image'
import Link from 'next/link'

// 定义商品类型接口
interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category?: number
  inventory?: number
  rating?: number
  reviews?: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // 格式化价格显示
  const formatPrice = (price: number) => {
    return price.toLocaleString('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          {product.inventory !== undefined && product.inventory <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-medium px-2 py-1 rounded">已售罄</span>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-2 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold">{formatPrice(product.price)}</span>
          <button className="bg-primary text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600">
            加入购物车
          </button>
        </div>
        {product.rating !== undefined && (
          <div className="mt-2 flex items-center">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              {product.rating?.toFixed(1)} ({product.reviews || 0}评价)
            </span>
          </div>
        )}
      </div>
    </div>
  )
} 