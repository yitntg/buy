'use client'

export default function TermsClient() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">服务条款</h1>

      <div className="prose prose-lg mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">1. 接受条款</h2>
          <p className="text-gray-600 mb-4">
            通过访问和使用本网站，您同意遵守并受这些服务条款的约束。如果您不同意这些条款的任何部分，
            请不要使用我们的服务。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">2. 账户注册</h2>
          <p className="text-gray-600 mb-4">
            使用我们的某些服务可能需要注册账户。您同意：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>提供准确、完整和最新的个人信息</li>
            <li>保护您的账户安全，包括密码保密</li>
            <li>对您账户下的所有活动负责</li>
            <li>及时更新您的个人信息</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">3. 商品和服务</h2>
          <p className="text-gray-600 mb-4">
            我们提供的商品和服务：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>所有商品描述和价格如有变更，恕不另行通知</li>
            <li>商品库存情况可能随时变化</li>
            <li>我们保留拒绝任何订单的权利</li>
            <li>所有价格均以人民币计价</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">4. 订单和支付</h2>
          <p className="text-gray-600 mb-4">
            关于订单和支付：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>订单确认不代表我们接受订单</li>
            <li>我们保留拒绝任何订单的权利</li>
            <li>支付必须在订单确认后完成</li>
            <li>我们接受多种支付方式</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">5. 配送和交付</h2>
          <p className="text-gray-600 mb-4">
            配送相关条款：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>配送时间仅供参考</li>
            <li>我们不对不可抗力导致的延迟负责</li>
            <li>收货人必须提供有效身份证明</li>
            <li>商品交付后风险转移给买方</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">6. 退货和退款</h2>
          <p className="text-gray-600 mb-4">
            退货和退款政策：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>商品必须保持原包装和状态</li>
            <li>必须在收到商品后7天内提出退货申请</li>
            <li>某些商品可能不适用退货政策</li>
            <li>退款将在确认退货后处理</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">7. 知识产权</h2>
          <p className="text-gray-600 mb-4">
            网站内容的知识产权：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>所有内容均受版权法保护</li>
            <li>未经许可不得复制或使用</li>
            <li>商标和标识归我们所有</li>
            <li>用户内容授权给我们使用</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">8. 免责声明</h2>
          <p className="text-gray-600 mb-4">
            我们不对以下情况负责：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>服务中断或故障</li>
            <li>数据丢失或损坏</li>
            <li>第三方行为</li>
            <li>不可抗力事件</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">9. 条款修改</h2>
          <p className="text-gray-600 mb-4">
            我们保留随时修改这些条款的权利。修改后的条款将在网站上发布，继续使用我们的服务即表示您接受修改后的条款。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. 联系我们</h2>
          <p className="text-gray-600 mb-4">
            如果您对这些服务条款有任何疑问，请通过以下方式联系我们：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">电子邮箱</h3>
              <p className="text-gray-600">terms@example.com</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">客服电话</h3>
              <p className="text-gray-600">400-123-4567</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
} 