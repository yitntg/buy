import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            乐购商城
          </Link>
        </div>
        
        <div className="flex-1 max-w-xl px-6">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索商品..."
              className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1 rounded-full">
              🔍
            </button>
          </div>
        </div>
        
        <nav className="flex items-center space-x-6">
          <Link href="/products" className="text-gray-700 hover:text-primary">
            商品分类
          </Link>
          <Link href="/cart" className="text-gray-700 hover:text-primary">
            购物车
          </Link>
          <Link href="/account" className="text-gray-700 hover:text-primary">
            我的账户
          </Link>
          <Link href="/upload" className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-600">
            上传商品
          </Link>
        </nav>
      </div>
    </header>
  )
} 