'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import CustomerLayout from '../components/CustomerLayout'

interface TeamMember {
  name: string
  title: string
  bio: string
  image: string
}

export default function AboutPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  
  useEffect(() => {
    // 模拟从API获取团队成员数据
    const mockTeamMembers: TeamMember[] = [
      {
        name: '张明',
        title: '创始人兼CEO',
        bio: '张明拥有10年以上的电子商务行业经验，致力于为用户提供最优质的购物体验。',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80'
      },
      {
        name: '李华',
        title: '技术总监',
        bio: '李华负责公司的技术团队管理和产品开发，拥有丰富的系统架构经验。',
        image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80'
      },
      {
        name: '王芳',
        title: '营销总监',
        bio: '王芳负责公司的市场策略和品牌建设，有着敏锐的市场洞察力。',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80'
      },
      {
        name: '赵强',
        title: '运营总监',
        bio: '赵强负责公司日常运营管理，保证平台高效稳定运行。',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80'
      }
    ]
    
    setTeamMembers(mockTeamMembers)
  }, [])
  
  return (
    <CustomerLayout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">关于我们</h1>
          
          {/* 公司简介 */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">公司简介</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="mb-4">乐购商城成立于2016年，是一家专注于提供优质商品和卓越购物体验的电子商务平台。我们致力于连接全球优质商品与消费者，让每一次购物都充满愉悦和惊喜。</p>
              <p className="mb-4">经过多年的发展，乐购商城已经成为国内知名的综合性购物平台，拥有数百万注册用户和丰富的商品品类，覆盖电子产品、家居用品、服装鞋包、美妆个护等多个领域。</p>
              <p>我们秉承"品质优先、用户至上"的理念，不断完善服务体系，提升用户体验，为消费者打造一个放心、便捷、愉悦的购物环境。</p>
            </div>
          </section>
          
          {/* 我们的使命 */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">我们的使命</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="mb-4">我们的使命是通过科技创新和优质服务，重新定义人们的购物方式，让购物变得更加简单、愉悦和有意义。</p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">品质保证</h3>
                  <p className="text-gray-600">严选全球优质商品，提供可靠的品质保证。</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">高效服务</h3>
                  <p className="text-gray-600">优化购物流程，提供快速配送和便捷的售后服务。</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">创新体验</h3>
                  <p className="text-gray-600">运用科技创新，不断提升用户购物体验。</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* 团队成员 */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4">我们的团队</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="mb-8">乐购商城拥有一支专业、富有激情的团队，他们来自不同的领域，却拥有共同的愿景——打造最受用户喜爱的购物平台。</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover" />
                    <div>
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-blue-600 mb-1">{member.title}</p>
                      <p className="text-sm text-gray-600">{member.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* 联系我们 */}
          <section>
            <h2 className="text-2xl font-bold mb-4">联系我们</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="mb-6">如果您有任何问题、建议或合作意向，欢迎通过以下方式联系我们：</p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>电子邮箱：info@example.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>客服热线：400-123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>公司地址：北京市朝阳区科技园A座123室</span>
                </div>
              </div>
              <div className="mt-8">
                <Link href="/contact" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                  在线留言
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </CustomerLayout>
  )
} 
