import Image from 'next/image'
import Link from 'next/link'

export default function HeroBanner() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
          <h2 className="text-4xl font-bold mb-4">品质购物，品质生活</h2>
          <p className="text-lg text-gray-600 mb-6">
            发现各类优质商品，享受便捷购物体验
          </p>
          <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 inline-block">
            立即购物
          </Link>
        </div>
        <div className="md:w-1/2 relative h-64 md:h-96 w-full">
          <Image
            src="https://picsum.photos/id/10/800/600"
            alt="Banner image"
            fill
            className="rounded-lg object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
} 