import Link from 'next/link'

export default function Footer() {
  // 商品分类
  const categories = [
    { id: 1, name: '电子产品' },
    { id: 2, name: '家居用品' },
    { id: 3, name: '服装鞋帽' },
    { id: 4, name: '美妆护肤' },
    { id: 5, name: '食品饮料' },
    { id: 6, name: '运动户外' },
  ]

  return (
    <footer className="bg-dark text-light py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">乐购商城</h3>
            <p className="text-gray-400">提供优质商品和卓越的购物体验</p>
          </div>
          <div>
            <h4 className="font-medium mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">关于我们</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">联系我们</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">常见问题</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">条款与条件</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">商品分类</h4>
            <ul className="space-y-2">
              {categories.slice(0, 4).map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.id}`} className="text-gray-400 hover:text-white">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">联系我们</h4>
            <address className="text-gray-400 not-italic">
              <p>中国上海市</p>
              <p>电话: 021-12345678</p>
              <p>邮箱: contact@legou.com</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} 乐购商城. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
} 