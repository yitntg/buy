import Link from 'next/link'
import Header from './components/Header'
import Footer from './components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl font-bold text-primary mb-6">404</div>
            <h1 className="text-3xl font-bold mb-4">页面未找到</h1>
            <p className="text-lg text-gray-600 mb-8">
              您访问的页面不存在或已被移除。
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-600">
                返回首页
              </Link>
              <Link href="/contact" className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-blue-50">
                联系我们
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 