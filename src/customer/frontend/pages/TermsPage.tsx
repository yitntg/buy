import Link from 'next/link'
// Header import removed
// Footer import removed

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-bold">服务条款</h1>
              <Link href="/" className="text-primary hover:underline">
                返回首页
              </Link>
            </div>
            
            <div className="prose max-w-none">
              <h2>1. 接受条款</h2>
              <p>欢迎使用乐购商城网站。本网站由乐购商城运营和维护。通过访问和使用本网站，您同意遵守这些服务条款。如果您不同意这些条款，请不要使用本网站。</p>
              
              <h2>2. 用户账户</h2>
              <p>在使用本网站的某些功能时，您可能需要创建一个账户。您负责维护您的账户信息的保密性，并对您账户下发生的所有活动负责。</p>
              
              <h2>3. 用户行为规范</h2>
              <p>使用本网站时，您同意不会：</p>
              <ul>
                <li>违反任何适用的法律或法规</li>
                <li>侵犯他人的知识产权或其他权利</li>
                <li>上传包含恶意软件的内容</li>
                <li>从事任何可能损害网站功能的活动</li>
              </ul>
              
              <h2>4. 商品和服务</h2>
              <p>我们努力确保网站上展示的产品信息准确，但不保证所有信息完全准确。我们保留更正任何错误和更改任何价格的权利。</p>
              
              <h2>5. 知识产权</h2>
              <p>本网站及其内容受版权和其他知识产权法律保护。未经明确许可，不得复制、修改或分发本网站的内容。</p>
              
              <h2>6. 免责声明</h2>
              <p>本网站按"现状"提供，不提供任何明示或暗示的保证。在法律允许的最大范围内，我们不对因使用本网站而产生的任何损害负责。</p>
              
              <h2>7. 条款变更</h2>
              <p>我们保留随时修改这些条款的权利。修改后的条款将在本页面上发布。继续使用本网站将视为您接受修改后的条款。</p>
              
              <h2>8. 联系我们</h2>
              <p>如果您对这些条款有任何疑问，请联系我们的客服团队。</p>
            </div>
          </div>
        </div>
      </main>
  )
} 
