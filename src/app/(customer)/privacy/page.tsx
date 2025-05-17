'use client'



export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">隐私政策</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="mb-4">
            本隐私政策描述了我们如何收集、使用和披露您的个人信息，以及您在使用我们的服务时所拥有的相关权利。
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">我们收集的信息</h2>
          <p>
            我们可能会收集以下类型的信息：
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>个人识别信息（姓名、电子邮件地址、电话号码等）</li>
            <li>账单和送货地址</li>
            <li>支付信息（信用卡号码等，但我们会通过安全的支付处理商处理）</li>
            <li>购买历史和偏好</li>
            <li>设备和浏览信息</li>
            <li>位置数据</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">我们如何使用您的信息</h2>
          <p>
            我们可能会将收集的信息用于以下目的：
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>提供、维护和改进我们的服务</li>
            <li>处理订单和支付</li>
            <li>发送订单确认和更新</li>
            <li>提供客户支持</li>
            <li>发送技术通知、更新和安全警报</li>
            <li>在您同意的情况下发送营销和促销信息</li>
            <li>监控和分析使用趋势</li>
            <li>预防欺诈和增强安全</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">信息共享与披露</h2>
          <p>
            我们不会出售您的个人信息。但我们可能会在以下情况下共享您的信息：
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>与提供服务的供应商和合作伙伴（如支付处理商、物流公司等）</li>
            <li>在合并、出售或资产转让的情况下</li>
            <li>在法律要求的情况下</li>
            <li>在保护我们的权利和财产安全的情况下</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">您的权利</h2>
          <p>
            您有权：
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>访问我们持有的关于您的个人信息</li>
            <li>更正不准确或不完整的信息</li>
            <li>在某些情况下删除您的信息</li>
            <li>反对或限制我们处理您的信息</li>
            <li>在适用的情况下，数据可携带性</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">安全</h2>
          <p className="mb-4">
            我们实施了适当的技术和组织措施来保护您的个人信息免受意外丢失、不当使用、未经授权的访问、披露、更改和破坏。
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Cookie政策</h2>
          <p className="mb-4">
            我们使用Cookie和类似技术来收集有关您如何使用我们服务的信息，并为您提供个性化体验。您可以通过浏览器设置控制Cookie的使用。
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">隐私政策更新</h2>
          <p className="mb-4">
            我们可能会不时更新本隐私政策。更新后的版本将在网站上发布，重大变更时我们会通知您。
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">联系我们</h2>
          <p className="mb-4">
            如果您对我们的隐私政策有任何疑问，请联系我们：privacy@example.com
          </p>
          
          <p className="text-sm text-gray-500 mt-8">
            最后更新日期：2024年1月1日
          </p>
        </div>
      </div>
  );
} 