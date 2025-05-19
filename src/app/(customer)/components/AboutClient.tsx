'use client'

import Image from 'next/image'

export default function AboutClient() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">关于我们</h1>

      <div className="prose prose-lg mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">公司简介</h2>
          <p className="text-gray-600 mb-4">
            我们是一家专注于提供优质商品和服务的电子商务平台。自成立以来，我们始终坚持以客户为中心，
            致力于为消费者提供便捷、安全、愉悦的购物体验。
          </p>
          <p className="text-gray-600">
            通过不断创新和完善，我们已经发展成为行业内领先的电商平台之一，为数百万用户提供优质的商品和服务。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">我们的使命</h2>
          <p className="text-gray-600 mb-4">
            让每个人都能享受到优质的商品和服务，创造更美好的生活。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">核心价值观</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2">诚信为本</h3>
              <p className="text-gray-600">
                我们始终坚持诚信经营，以真诚的态度对待每一位客户。
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2">创新驱动</h3>
              <p className="text-gray-600">
                不断创新是我们的发展动力，我们致力于为用户带来更好的购物体验。
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2">品质至上</h3>
              <p className="text-gray-600">
                我们严格把控商品质量，确保每一件商品都符合高品质标准。
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-2">服务至上</h3>
              <p className="text-gray-600">
                我们提供优质的客户服务，确保每一位用户都能得到满意的购物体验。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">发展历程</h2>
          <div className="space-y-6">
            <div className="flex">
              <div className="flex-shrink-0 w-24 text-gray-500">2020年</div>
              <div>
                <h3 className="font-medium mb-1">公司成立</h3>
                <p className="text-gray-600">
                  公司正式成立，开始提供电子商务服务。
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-24 text-gray-500">2021年</div>
              <div>
                <h3 className="font-medium mb-1">业务扩展</h3>
                <p className="text-gray-600">
                  成功拓展多个品类，服务范围不断扩大。
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-24 text-gray-500">2022年</div>
              <div>
                <h3 className="font-medium mb-1">技术创新</h3>
                <p className="text-gray-600">
                  推出多项创新服务，提升用户体验。
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="flex-shrink-0 w-24 text-gray-500">2023年</div>
              <div>
                <h3 className="font-medium mb-1">持续发展</h3>
                <p className="text-gray-600">
                  用户规模突破百万，成为行业领先平台。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
          <p className="text-gray-600 mb-4">
            如果您有任何问题或建议，欢迎随时与我们联系。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">客服电话</h3>
              <p className="text-gray-600">400-123-4567</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">电子邮箱</h3>
              <p className="text-gray-600">contact@example.com</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">公司地址</h3>
              <p className="text-gray-600">
                北京市朝阳区建国路88号
                <br />
                现代城5号楼
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">工作时间</h3>
              <p className="text-gray-600">
                周一至周日
                <br />
                9:00 - 21:00
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 