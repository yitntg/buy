import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-6 fixed bottom-0 left-0 right-0 z-40">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-2">乐购商城</h3>
            <p className="text-gray-400">提供优质商品和卓越的购物体验</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">快速链接</h4>
            <ul className="grid grid-cols-2 gap-1">
              <li><Link href="/about" className="text-gray-400 hover:text-white">关于我们</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">联系我们</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white">常见问题</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">条款与条件</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">联系我们</h4>
            <address className="text-gray-400 not-italic">
              <p>中国上海市</p>
              <p>电话: 021-12345678</p>
              <p>邮箱: contact@legou.com</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-4 pt-3 text-center text-gray-500">
          <p>© {new Date().getFullYear()} 乐购商城. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
} 