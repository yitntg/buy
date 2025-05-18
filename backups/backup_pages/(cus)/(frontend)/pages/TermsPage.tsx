'use client'

import Link from 'next/link'
import CustomerLayout from '../components/CustomerLayout'

export default function TermsPage() {
  return (
    <CustomerLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">服务条款</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            <p className="mb-4">最后更新日期：2023年11月1日</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. 接受条款</h2>
            <p className="mb-4">欢迎使用乐购商城。本服务条款（"条款"）是您与乐购商城之间就使用我们的网站、服务和产品所达成的协议。通过访问或使用乐购商城，您确认已阅读、理解并同意受这些条款的约束。</p>
            <p className="mb-4">如果您不同意这些条款，请勿使用我们的服务。</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. 服务描述</h2>
            <p className="mb-4">乐购商城提供一个在线平台，允许用户浏览、购买各类商品。我们保留随时修改、暂停或终止任何服务的权利，恕不另行通知。</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. 用户账户</h2>
            <p className="mb-4">您可能需要创建一个账户才能使用某些服务。您有责任：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>提供准确、完整和最新的账户信息。</li>
              <li>保护您的账户安全，包括密码的保密。</li>
              <li>对您账户下的所有活动负责。</li>
              <li>立即通知我们任何未经授权的账户使用情况。</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. 购买条款</h2>
            <p className="mb-4">当您通过乐购商城购买商品时：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>您同意按照商品页面上显示的价格和条件付款。</li>
              <li>所有价格均以人民币计价，并包含适用的税费。</li>
              <li>我们保留拒绝或取消任何订单的权利，无论订单是否已确认或付款。</li>
              <li>商品的颜色和外观可能因显示器设置而略有不同。</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">5. 配送政策</h2>
            <p className="mb-4">我们将尽力在预期的时间范围内配送商品，但不对配送延迟承担责任。配送时间可能受多种因素影响，包括但不限于天气条件、交通状况和配送地址的可达性。</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">6. 退货与退款</h2>
            <p className="mb-4">请参阅我们的退货与退款政策了解详细信息。一般而言，您可以在收到商品的15天内申请退货，但某些商品可能有特殊的退货限制。</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">7. 用户行为</h2>
            <p className="mb-4">使用乐购商城时，您同意不会：</p>
            <ul className="list-disc pl-6 mb-4">
              <li>违反任何适用的法律或法规。</li>
              <li>侵犯他人的知识产权或隐私权。</li>
              <li>发布虚假、误导或欺诈性内容。</li>
              <li>使用自动化手段访问或使用我们的服务。</li>
              <li>尝试干扰或破坏我们的服务或服务器。</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">8. 知识产权</h2>
            <p className="mb-4">乐购商城及其内容（包括但不限于文本、图像、徽标、按钮图标、图像和音频剪辑）是乐购商城或其供应商的财产，受适用的知识产权法保护。未经我们明确书面许可，您不得复制、修改、分发或创建衍生作品。</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">9. 责任限制</h2>
            <p className="mb-4">在法律允许的最大范围内，乐购商城不对任何直接、间接、偶然、特殊、惩罚性或后果性损害承担责任，无论这些损害是如何产生的，即使已被告知此类损害的可能性。</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">10. 条款修改</h2>
            <p className="mb-4">我们保留随时修改这些条款的权利。修改后的条款将在网站上发布时生效。继续使用我们的服务将构成您对修改后条款的接受。</p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">11. 适用法律</h2>
            <p className="mb-4">这些条款受中华人民共和国法律管辖，并按其解释，不考虑法律冲突原则。</p>
            
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
