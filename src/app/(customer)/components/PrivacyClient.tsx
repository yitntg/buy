'use client'

export default function PrivacyClient() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-12">隐私政策</h1>

      <div className="prose prose-lg mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">引言</h2>
          <p className="text-gray-600 mb-4">
            本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。我们非常重视您的隐私保护，
            并致力于维护您对我们的信任。
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">信息收集</h2>
          <p className="text-gray-600 mb-4">
            我们可能收集以下类型的信息：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>个人身份信息（如姓名、电子邮件地址、电话号码等）</li>
            <li>账户信息（如用户名、密码等）</li>
            <li>交易信息（如订单历史、支付信息等）</li>
            <li>设备信息（如IP地址、浏览器类型、操作系统等）</li>
            <li>位置信息（如您提供的地址信息）</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">信息使用</h2>
          <p className="text-gray-600 mb-4">
            我们使用收集的信息用于以下目的：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>提供、维护和改进我们的服务</li>
            <li>处理您的订单和支付</li>
            <li>发送订单确认和更新信息</li>
            <li>提供客户支持</li>
            <li>发送营销信息（在您同意的情况下）</li>
            <li>防止欺诈和确保安全</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">信息共享</h2>
          <p className="text-gray-600 mb-4">
            我们不会出售您的个人信息。在以下情况下，我们可能会共享您的信息：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>与我们的服务提供商（如支付处理商、物流公司等）</li>
            <li>遵守法律法规要求</li>
            <li>保护我们的权利和财产</li>
            <li>在获得您的明确同意的情况下</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">信息安全</h2>
          <p className="text-gray-600 mb-4">
            我们采取多种安全措施保护您的个人信息：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>使用加密技术保护数据传输</li>
            <li>实施访问控制措施</li>
            <li>定期安全评估和更新</li>
            <li>员工培训和保密协议</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Cookie 使用</h2>
          <p className="text-gray-600 mb-4">
            我们使用 Cookie 和类似技术来：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>记住您的偏好设置</li>
            <li>分析网站使用情况</li>
            <li>提供个性化体验</li>
            <li>改进我们的服务</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">您的权利</h2>
          <p className="text-gray-600 mb-4">
            您对个人信息拥有以下权利：
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>访问您的个人信息</li>
            <li>更正不准确的信息</li>
            <li>删除您的个人信息</li>
            <li>限制或反对处理</li>
            <li>数据可携带性</li>
            <li>撤回同意</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">政策更新</h2>
          <p className="text-gray-600 mb-4">
            我们可能会不时更新本隐私政策。更新后的政策将在网站上发布，并在重大变更时通知您。
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
          <p className="text-gray-600 mb-4">
            如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">电子邮箱</h3>
              <p className="text-gray-600">privacy@example.com</p>
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