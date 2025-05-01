import Image from 'next/image'
import Link from 'next/link'

// 定义商品类型接口
interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-lg mb-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold">¥{product.price}</span>
          <button className="bg-primary text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600">
            加入购物车
          </button>
        </div>
      </div>
    </div>
  )
} 