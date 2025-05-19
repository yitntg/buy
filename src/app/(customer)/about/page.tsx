import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于我们 - 乐购商城',
  description: '了解乐购商城的故事和使命'
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">关于我们</h1>
      <div className="prose max-w-none">
        <p className="mb-4">
          乐购商城是一个现代化的电商平台，致力于为用户提供优质的购物体验。
        </p>
        <p className="mb-4">
          我们的使命是通过创新的技术和优质的服务，让每个人都能享受到便捷的购物体验。
        </p>
      </div>
    </div>
  )
} 
