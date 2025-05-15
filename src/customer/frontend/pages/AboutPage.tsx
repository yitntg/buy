import Link from 'next/link'
import Image from 'next/image'
// Header import removed
// Footer import removed

export default function AboutPage() {
  // 团队成员数据
  const teamMembers = [
    {
      name: '张明',
      position: '创始人兼CEO',
      bio: '拥有10年电商行业经验，致力于为用户提供优质的购物体验。',
      image: 'https://picsum.photos/id/1005/300/300'
    },
    {
      name: '李华',
      position: '技术总监',
      bio: '全栈开发专家，负责乐购商城的技术架构和开发。',
      image: 'https://picsum.photos/id/1006/300/300'
    },
    {
      name: '王芳',
      position: '产品经理',
      bio: '专注于用户体验设计，确保乐购商城的每个功能都简单易用。',
      image: 'https://picsum.photos/id/1011/300/300'
    },
    {
      name: '赵强',
      position: '营销总监',
      bio: '精通数字营销和品牌推广，为乐购商城带来持续增长。',
      image: 'https://picsum.photos/id/1012/300/300'
    }
  ]
  
  return (
    <main className="min-h-screen bg-gray-50">
        {/* 公司简介 */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">关于乐购商城</h1>
              <p className="text-lg text-gray-600 mb-8">
                乐购商城成立于2023年，是一家专注于提供高品质商品和卓越购物体验的现代化电商平台。
                我们的使命是让每位用户都能享受到便捷、安全、愉悦的网上购物体验。
              </p>
              <Link href="/contact" className="bg-primary text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 inline-block">
                联系我们
              </Link>
            </div>
          </div>
        </section>
        
        {/* 我们的优势 */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">我们的优势</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="text-5xl text-primary mb-4">🌟</div>
                <h3 className="text-xl font-medium mb-3">精选商品</h3>
                <p className="text-gray-600">
                  我们严格把关每一件商品的质量，确保用户购买到最优质的产品。
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="text-5xl text-primary mb-4">🔒</div>
                <h3 className="text-xl font-medium mb-3">安全保障</h3>
                <p className="text-gray-600">
                  采用先进的安全技术，保护用户信息和支付安全，让您放心购物。
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <div className="text-5xl text-primary mb-4">🚚</div>
                <h3 className="text-xl font-medium mb-3">快速配送</h3>
                <p className="text-gray-600">
                  高效的物流系统，确保商品以最快的速度送达您的手中。
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* 团队介绍 */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">我们的团队</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative h-48 w-48 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium">{member.name}</h3>
                  <p className="text-primary mb-2">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 公司愿景 */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">我们的愿景</h2>
              <p className="text-lg text-gray-600 mb-8">
                我们致力于打造中国最受信赖的电商平台，通过创新和优质服务，不断提升用户的购物体验。
                未来，我们将持续拓展商品品类，优化服务流程，为用户提供更多元化、个性化的购物选择。
              </p>
              <div className="flex justify-center space-x-4 mt-8">
                <Link href="/products" className="bg-primary text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 inline-block">
                  浏览商品
                </Link>
                <Link href="/contact" className="border border-primary text-primary px-6 py-3 rounded-full text-lg hover:bg-blue-50 inline-block">
                  加入我们
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
  )
} 
