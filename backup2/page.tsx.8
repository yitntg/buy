'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { useAuth } from '../../context/AuthContext'

export default function SecurityPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'password' | 'phone' | 'question'>('password');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  // 密码修改表单
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // 手机绑定表单
  const [phoneForm, setPhoneForm] = useState({
    phone: '',
    verificationCode: ''
  });
  
  // 安全问题表单
  const [questionForm, setQuestionForm] = useState({
    question1: '',
    answer1: '',
    question2: '',
    answer2: ''
  });
  
  // 密码强度
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: '弱',
    color: 'bg-red-500'
  });
  
  // 发送验证码倒计时
  const [countdown, setCountdown] = useState(0);

  // 账户菜单项
  const menuItems = [
    { label: '个人信息', href: '/account', active: false },
    { label: '我的订单', href: '/account/orders', active: false },
    { label: '收货地址', href: '/account/addresses', active: false },
    { label: '支付方式', href: '/account/payment', active: false },
    { label: '优惠券', href: '/account/coupons', active: false },
    { label: '消息通知', href: '/account/notifications', active: false },
    { label: '账户安全', href: '/account/security', active: true },
  ];

  // 添加会员注册时间
  const memberSince = '2023年10月'

  // 处理密码表单更改
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    
    // 评估密码强度
    if (name === 'newPassword') {
      evaluatePasswordStrength(value);
    }
  };
  
  // 处理手机表单更改
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPhoneForm(prev => ({ ...prev, [name]: value }));
  };
  
  // 处理安全问题表单更改
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuestionForm(prev => ({ ...prev, [name]: value }));
  };

  // 评估密码强度
  const evaluatePasswordStrength = (password: string) => {
    let score = 0;
    
    // 长度
    if (password.length > 6) score += 1;
    if (password.length > 10) score += 1;
    
    // 复杂度
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    let text = '弱';
    let color = 'bg-red-500';
    
    if (score >= 4) {
      text = '强';
      color = 'bg-green-500';
    } else if (score >= 2) {
      text = '中';
      color = 'bg-yellow-500';
    }
    
    setPasswordStrength({ score, text, color });
  };

  // 发送验证码
  const sendVerificationCode = () => {
    if (!phoneForm.phone || phoneForm.phone.length !== 11) {
      setMessage({ type: 'error', text: '请输入有效的手机号码' });
      return;
    }
    
    // 模拟发送验证码
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: 'success', text: `验证码已发送至 ${phoneForm.phone}` });
      
      // 启动倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // 3秒后清除消息
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  // 提交密码修改
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: '两次输入的密码不一致' });
      return;
    }
    
    if (passwordStrength.score < 2) {
      setMessage({ type: 'error', text: '密码强度不足，请设置更复杂的密码' });
      return;
    }
    
    // 模拟密码修改
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: 'success', text: '密码修改成功' });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // 3秒后清除消息
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };
  
  // 提交手机绑定
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneForm.phone || phoneForm.phone.length !== 11) {
      setMessage({ type: 'error', text: '请输入有效的手机号码' });
      return;
    }
    
    if (!phoneForm.verificationCode || phoneForm.verificationCode.length !== 6) {
      setMessage({ type: 'error', text: '请输入有效的验证码' });
      return;
    }
    
    // 模拟手机绑定
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: 'success', text: `手机号 ${phoneForm.phone} 绑定成功` });
      setPhoneForm({
        phone: '',
        verificationCode: ''
      });
      
      // 3秒后清除消息
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };
  
  // 提交安全问题
  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!questionForm.question1 || !questionForm.answer1 || !questionForm.question2 || !questionForm.answer2) {
      setMessage({ type: 'error', text: '请完成所有安全问题和答案' });
      return;
    }
    
    // 模拟安全问题设置
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: 'success', text: '安全问题设置成功' });
      setQuestionForm({
        question1: '',
        answer1: '',
        question2: '',
        answer2: ''
      });
      
      // 3秒后清除消息
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">我的账户</h1>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 侧边栏菜单 */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.username} 
                        className="object-cover w-full h-full" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">{user?.username || '用户'}</h3>
                    <p className="text-sm text-gray-500">会员自 {memberSince}</p>
                  </div>
                </div>
                
                <nav>
                  <ul className="space-y-2">
                    {menuItems.map((item) => (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          className={`block px-3 py-2 rounded-md ${
                            item.active
                              ? 'bg-primary text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <Link href="/" className="w-full text-red-500 hover:text-red-600 text-sm font-medium block text-center">
                  退出登录
                </Link>
              </div>
            </div>
            
            {/* 主内容区 */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-medium mb-6">账户安全</h2>
                
                {message.text && (
                  <div className={`p-3 mb-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                  </div>
                )}
                
                {/* 安全选项卡 */}
                <div className="mb-6 border-b">
                  <div className="flex flex-wrap -mb-px">
                    <button
                      className={`inline-block p-4 rounded-t-lg ${
                        activeTab === 'password'
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('password')}
                    >
                      修改密码
                    </button>
                    <button
                      className={`inline-block p-4 rounded-t-lg ${
                        activeTab === 'phone'
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('phone')}
                    >
                      绑定手机
                    </button>
                    <button
                      className={`inline-block p-4 rounded-t-lg ${
                        activeTab === 'question'
                          ? 'border-b-2 border-primary text-primary'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('question')}
                    >
                      安全问题
                    </button>
                  </div>
                </div>
                
                {/* 修改密码表单 */}
                {activeTab === 'password' && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        当前密码
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        required
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        新密码
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        required
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      
                      {/* 密码强度指示器 */}
                      {passwordForm.newPassword && (
                        <div className="mt-2">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${passwordStrength.color}`}
                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-500">
                              {passwordStrength.text}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            密码应包含大小写字母、数字和特殊字符，长度至少8位
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        确认新密码
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            处理中...
                          </>
                        ) : '修改密码'}
                      </button>
                    </div>
                  </form>
                )}
                
                {/* 绑定手机表单 */}
                {activeTab === 'phone' && (
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        手机号码
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
                          +86
                        </span>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          pattern="[0-9]{11}"
                          required
                          placeholder="请输入11位手机号码"
                          value={phoneForm.phone}
                          onChange={handlePhoneChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                        验证码
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="verificationCode"
                          name="verificationCode"
                          pattern="[0-9]{6}"
                          required
                          placeholder="请输入6位验证码"
                          value={phoneForm.verificationCode}
                          onChange={handlePhoneChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <button
                          type="button"
                          onClick={sendVerificationCode}
                          disabled={countdown > 0 || isLoading}
                          className={`px-4 py-2 rounded-r-md ${
                            countdown > 0
                              ? 'bg-gray-300 text-gray-500'
                              : 'bg-primary text-white hover:bg-blue-600'
                          }`}
                        >
                          {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            处理中...
                          </>
                        ) : '绑定手机'}
                      </button>
                    </div>
                  </form>
                )}
                
                {/* 安全问题表单 */}
                {activeTab === 'question' && (
                  <form onSubmit={handleQuestionSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="question1" className="block text-sm font-medium text-gray-700 mb-1">
                        安全问题1
                      </label>
                      <select
                        id="question1"
                        name="question1"
                        required
                        value={questionForm.question1}
                        onChange={handleQuestionChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">请选择安全问题</option>
                        <option value="母亲的姓名">您母亲的姓名是？</option>
                        <option value="小学名称">您就读的第一所小学名称是？</option>
                        <option value="宠物名字">您的第一个宠物名字是？</option>
                        <option value="出生城市">您的出生城市是？</option>
                        <option value="最喜欢的电影">您最喜欢的电影是？</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="answer1" className="block text-sm font-medium text-gray-700 mb-1">
                        答案1
                      </label>
                      <input
                        type="text"
                        id="answer1"
                        name="answer1"
                        required
                        value={questionForm.answer1}
                        onChange={handleQuestionChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="question2" className="block text-sm font-medium text-gray-700 mb-1">
                        安全问题2
                      </label>
                      <select
                        id="question2"
                        name="question2"
                        required
                        value={questionForm.question2}
                        onChange={handleQuestionChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">请选择安全问题</option>
                        <option value="父亲的姓名">您父亲的姓名是？</option>
                        <option value="最好朋友">您最好朋友的名字是？</option>
                        <option value="纪念日">您最难忘的日期是？</option>
                        <option value="喜欢的歌手">您最喜欢的歌手是？</option>
                        <option value="职业梦想">您童年的职业梦想是？</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="answer2" className="block text-sm font-medium text-gray-700 mb-1">
                        答案2
                      </label>
                      <input
                        type="text"
                        id="answer2"
                        name="answer2"
                        required
                        value={questionForm.answer2}
                        onChange={handleQuestionChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 flex items-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            处理中...
                          </>
                        ) : '保存安全问题'}
                      </button>
                    </div>
                  </form>
                )}
                
                <div className="mt-8 border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">安全提示</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>定期更改密码可以提高账户安全性</li>
                    <li>不要使用与其他网站相同的密码</li>
                    <li>安全问题的答案应该只有您自己知道</li>
                    <li>绑定手机号有助于快速找回账户</li>
                    <li>切勿向他人透露您的账户信息和验证码</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 