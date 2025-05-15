import Link from 'next/link'
// Header import removed
// Footer import removed

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">隐私政策</h1>
              <Link href="/" className="text-primary hover:underline">
                返回首页
              </Link>
            </div>
            
            <div className="prose max-w-none">
              <h2>1. 引言</h2>
              <p>乐购商城尊重并保护所有用户的个人隐私权。本隐私政策描述了我们如何收集、使用、披露、处理和保护您使用我们的网站和服务时向我们提供的信息。</p>
              
              <h2>2. 信息收集</h2>
              <p>我们可能收集的个人信息包括但不限于：</p>
              <ul>
                <li>您提供的个人资料：如姓名、联系方式、送货地址</li>
                <li>账户信息：如用户名、密码（加密形式）</li>
                <li>交易信息：购买记录、支付信息</li>
                <li>使用数据：如浏览历史、搜索记录、设备信息</li>
              </ul>
              
              <h2>3. 信息使用</h2>
              <p>我们使用收集的信息用于：</p>
              <ul>
                <li>提供、维护和改进我们的服务</li>
                <li>处理交易并发送相关通知</li>
                <li>回应您的问询和请求</li>
                <li>提供个性化的购物体验</li>
                <li>发送产品更新和营销信息</li>
              </ul>
              
              <h2>4. 信息披露</h2>
              <p>除以下情况外，我们不会与第三方共享您的个人信息：</p>
              <ul>
                <li>经您明确同意</li>
                <li>为履行我们的服务需要（如配送公司）</li>
                <li>法律要求或政府机构请求</li>
                <li>保护乐购商城的权利和财产</li>
              </ul>
              
              <h2>5. 信息安全</h2>
              <p>我们采取合理的安全措施保护您的个人信息不被未授权访问、使用或披露。但请注意，互联网传输不能保证100%的安全。</p>
              
              <h2>6. Cookie使用</h2>
              <p>我们使用Cookie和类似技术来提升您的浏览体验、记住您的偏好设置并分析网站流量。</p>
              
              <h2>7. 您的权利</h2>
              <p>您有权访问、更正或删除您的个人信息。您也可以选择退出我们的营销通讯。</p>
              
              <h2>8. 儿童隐私</h2>
              <p>我们的服务不面向13岁以下的儿童。如果您发现我们无意中收集了儿童的个人信息，请联系我们，我们将立即采取措施删除。</p>
              
              <h2>9. 隐私政策变更</h2>
              <p>我们可能会不时更新本隐私政策。变更将在本页面上发布，重大变更时我们会通过显著方式通知您。</p>
              
              <h2>10. 联系我们</h2>
              <p>如果您对我们的隐私政策有任何疑问，请联系我们的客服团队。</p>
            </div>
          </div>
        </div>
      </main>
  )
} 
