// 主要的根页面
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">欢迎来到 ShopHub</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          我们致力于提供最优质的商品和最贴心的服务，为您的生活增添便利与乐趣。
        </p>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-3">品质保证</h2>
          <p className="text-gray-600">所有商品均经过严格筛选，确保品质</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-3">快速配送</h2>
          <p className="text-gray-600">下单后24小时内发货，配送迅速</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-3">售后无忧</h2>
          <p className="text-gray-600">7天无理由退换，90天保修服务</p>
        </div>
      </section>
      
      <section className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-8">热门分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-medium">电子产品</h3>
          </div>
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-medium">服装服饰</h3>
          </div>
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-medium">家居生活</h3>
          </div>
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-medium">美妆个护</h3>
          </div>
          <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-medium">运动户外</h3>
          </div>
        </div>
      </section>
      
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-6">立即开始购物体验</h2>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          浏览商品
        </button>
      </section>
    </div>
  );
} 