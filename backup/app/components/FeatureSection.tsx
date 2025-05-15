export default function FeatureSection() {
  return (
    <section className="py-12 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">我们的优势</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="text-4xl mb-4 text-primary">🚚</div>
            <h3 className="text-xl font-medium mb-2">快速配送</h3>
            <p className="text-gray-600">大部分地区24小时内发货，特定地区支持当日达</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="text-4xl mb-4 text-primary">💯</div>
            <h3 className="text-xl font-medium mb-2">品质保证</h3>
            <p className="text-gray-600">所有商品严格品质把关，7天无理由退换</p>
          </div>
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="text-4xl mb-4 text-primary">💬</div>
            <h3 className="text-xl font-medium mb-2">贴心服务</h3>
            <p className="text-gray-600">专业客服团队，提供7×24小时在线咨询服务</p>
          </div>
        </div>
      </div>
    </section>
  )
} 