'use client'

import Link from 'next/link'
import CustomerLayout from '../components/CustomerLayout'

export default function PrivacyPage() {
  return (
    <CustomerLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">隐私政策</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            <p className="mb-4">最后更新日期：2023年11月1日</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. 引言</h2>
            <p className="mb-4">欢迎访问乐购商城。我们非常重视您的隐私，并致力于保护您的个人信息。本隐私政策旨在向您说明我们如何收集、使用、共享和保护您的个人信息。</p>
            <p className="mb-4">在使用我们的服务前，请您仔细阅读本隐私政策。通过使用我们的服务，您同意本隐私政策中描述的数据处理程序。</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. 信息收集</h2>
            <p className="mb-4">我们可能收集以下类型的信息：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>个人识别信息：包括您的姓名、电子邮件地址、电话号码、送货地址和账单地址。</li>
              <li>账户信息：包括您的用户名、密码和账户设置。</li>
              <li>交易信息：包括您购买的商品、支付方式和支付卡信息。</li>
              <li>技术信息：包括IP地址、浏览器类型、设备信息和访问时间。</li>
              <li>用户行为信息：包括您在我们网站上的浏览记录、搜索查询和互动行为。</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. 信息使用</h2>
            <p className="mb-4">我们使用收集的信息用于：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>提供、维护和改进我们的服务。</li>
              <li>处理和完成交易。</li>
              <li>提供客户支持和回应查询。</li>
              <li>发送交易相关信息，如确认、通知和更新。</li>
              <li>发送营销和促销信息（如果您选择接收）。</li>
              <li>检测、预防和解决欺诈和安全问题。</li>
              <li>遵守法律义务。</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. 信息共享</h2>
            <p className="mb-4">我们可能在以下情况下共享您的个人信息：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>与提供服务所必需的第三方服务提供商共享，如支付处理、订单配送和客户服务。</li>
              <li>在法律要求或为保护我们的权利时。</li>
              <li>在业务转让、合并或收购的情况下。</li>
              <li>在获得您的同意后。</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. 数据安全</h2>
            <p className="mb-4">我们采取适当的技术和组织措施来保护您的个人信息不被未授权访问、使用或披露。然而，请注意，没有任何在线传输或电子存储方法是100%安全的。</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. 您的权利</h2>
            <p className="mb-4">根据适用的数据保护法律，您可能拥有以下权利：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>访问您的个人信息。</li>
              <li>更正不准确的个人信息。</li>
              <li>删除您的个人信息。</li>
              <li>限制或反对处理您的个人信息。</li>
              <li>数据可携带性。</li>
              <li>撤回同意（如果处理基于同意）。</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. Cookie政策</h2>
            <p className="mb-4">我们使用Cookie和类似技术来提高您的浏览体验、分析网站流量和个性化内容。您可以通过浏览器设置控制Cookie的使用。</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">8. 隐私政策变更</h2>
            <p className="mb-4">我们可能会不时更新本隐私政策。任何变更将在本页面上发布，对于重大变更，我们将通过电子邮件或网站通知进行通知。</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">9. 联系我们</h2>
            <p className="mb-4">如果您对本隐私政策有任何疑问或顾虑，请通过以下方式联系我们：</p>
            <p className="mb-4">电子邮件：privacy@example.com</p>
            <p className="mb-4">地址：北京市朝阳区科技园A座123室</p>
            <p className="mb-4">电话：400-123-4567</p>
            
            <div className="mt-8">
              <Link href="/contact" className="text-blue-600 hover:underline">
                联系我们了解更多
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  )
} 
