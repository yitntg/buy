'use client'

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// 设置分类
interface SettingCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

// 设置项
interface Setting {
  id: string;
  category: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'textarea';
  default_value: string | number | boolean;
  options?: { value: string; label: string }[];
  current_value?: string | number | boolean;
}

/**
 * 管理员设置页面
 */
export function SettingsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);

  // 定义设置分类
  const categories: SettingCategory[] = [
    {
      id: 'general',
      name: '基本设置',
      description: '网站的基本配置信息',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      id: 'shop',
      name: '商店设置',
      description: '商店显示和功能配置',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
    {
      id: 'payment',
      name: '支付设置',
      description: '支付方式和支付网关配置',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      id: 'shipping',
      name: '物流设置',
      description: '配送方式和运费计算规则',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
          />
        </svg>
      ),
    },
    {
      id: 'email',
      name: '邮件设置',
      description: '邮件发送和模板配置',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 'api',
      name: 'API设置',
      description: 'API密钥和第三方集成配置',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
    },
  ];

  // 加载设置数据
  useEffect(() => {
    // 模拟从API加载设置
    const loadSettings = async () => {
      setLoading(true);
      try {
        // 实际项目中，这里应该从API获取
        // 模拟网络请求
        await new Promise((resolve) => setTimeout(resolve, 800));

        // 模拟设置数据
        const mockSettings: Setting[] = [
          {
            id: 'site_name',
            category: 'general',
            name: '网站名称',
            description: '显示在浏览器标题和页面顶部的名称',
            type: 'text',
            default_value: '我的电商网站',
            current_value: '我的电商网站',
          },
          {
            id: 'site_description',
            category: 'general',
            name: '网站描述',
            description: '用于SEO的网站描述',
            type: 'textarea',
            default_value: '一个专业的电子商务平台',
            current_value: '一个专业的电子商务平台，提供高品质的商品和服务',
          },
          {
            id: 'currency',
            category: 'general',
            name: '货币单位',
            description: '网站使用的默认货币',
            type: 'select',
            default_value: 'CNY',
            options: [
              { value: 'CNY', label: '人民币 (¥)' },
              { value: 'USD', label: '美元 ($)' },
              { value: 'EUR', label: '欧元 (€)' },
            ],
            current_value: 'CNY',
          },
          {
            id: 'products_per_page',
            category: 'shop',
            name: '每页显示产品数',
            description: '产品列表页中显示的产品数量',
            type: 'number',
            default_value: 12,
            current_value: 24,
          },
          {
            id: 'allow_reviews',
            category: 'shop',
            name: '允许评价',
            description: '是否允许用户对产品进行评价',
            type: 'boolean',
            default_value: true,
            current_value: true,
          },
          {
            id: 'show_out_of_stock',
            category: 'shop',
            name: '显示缺货产品',
            description: '是否在产品列表中显示缺货产品',
            type: 'boolean',
            default_value: true,
            current_value: false,
          },
          {
            id: 'primary_color',
            category: 'general',
            name: '主题色',
            description: '网站的主题颜色',
            type: 'color',
            default_value: '#3B82F6',
            current_value: '#3B82F6',
          },
          {
            id: 'payment_methods',
            category: 'payment',
            name: '支付方式',
            description: '启用的支付方式',
            type: 'select',
            default_value: 'alipay',
            options: [
              { value: 'alipay', label: '支付宝' },
              { value: 'wechat', label: '微信支付' },
              { value: 'card', label: '银行卡' },
            ],
            current_value: 'alipay,wechat',
          },
          {
            id: 'shipping_fee',
            category: 'shipping',
            name: '基础运费',
            description: '订单的基础运费',
            type: 'number',
            default_value: 10,
            current_value: 12,
          },
          {
            id: 'free_shipping_threshold',
            category: 'shipping',
            name: '免运费阈值',
            description: '订单金额超过该值时免运费',
            type: 'number',
            default_value: 99,
            current_value: 199,
          },
          {
            id: 'smtp_host',
            category: 'email',
            name: 'SMTP服务器',
            description: '邮件发送服务器地址',
            type: 'text',
            default_value: 'smtp.example.com',
            current_value: 'smtp.qq.com',
          },
          {
            id: 'api_key',
            category: 'api',
            name: 'API密钥',
            description: '用于第三方访问的API密钥',
            type: 'text',
            default_value: '',
            current_value: 'sk_test_abcdefghijklmnopqrstuvwxyz',
          },
        ];

        setSettings(mockSettings);
      } catch (error) {
        console.error('加载设置失败:', error);
        toast.error('加载设置失败');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // 处理设置变更
  const handleSettingChange = (settingId: string, value: string | number | boolean) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.id === settingId
          ? { ...setting, current_value: value }
          : setting
      )
    );
    setDirty(true);
  };

  // 保存设置
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // 实际项目中，这里应该调用API保存设置
      // 模拟网络请求
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('设置保存成功');
      setDirty(false);
    } catch (error) {
      console.error('保存设置失败:', error);
      toast.error('保存设置失败');
    } finally {
      setSaving(false);
    }
  };

  // 重置设置
  const handleResetSettings = () => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) => ({
        ...setting,
        current_value: setting.default_value,
      }))
    );
    setDirty(true);
  };

  // 渲染设置输入控件
  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case 'text':
        return (
          <input
            type="text"
            id={setting.id}
            value={setting.current_value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        );
      case 'textarea':
        return (
          <textarea
            id={setting.id}
            rows={3}
            value={setting.current_value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        );
      case 'number':
        return (
          <input
            type="number"
            id={setting.id}
            value={setting.current_value as number}
            onChange={(e) => handleSettingChange(setting.id, Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        );
      case 'boolean':
        return (
          <div className="mt-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={setting.current_value as boolean}
                onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
              <span className="ml-2">
                {(setting.current_value as boolean) ? '启用' : '禁用'}
              </span>
            </label>
          </div>
        );
      case 'select':
        return (
          <select
            id={setting.id}
            value={setting.current_value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'color':
        return (
          <div className="mt-1 flex items-center">
            <input
              type="color"
              id={setting.id}
              value={setting.current_value as string}
              onChange={(e) => handleSettingChange(setting.id, e.target.value)}
              className="h-8 w-8 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="text"
              value={setting.current_value as string}
              onChange={(e) => handleSettingChange(setting.id, e.target.value)}
              className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        );
      default:
        return null;
    }
  };

  // 过滤当前分类的设置
  const currentCategorySettings = settings.filter(
    (setting) => setting.category === activeCategory
  );

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
        <p className="mt-1 text-sm text-gray-500">
          管理网站的各项配置和参数
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* 设置分类侧边栏 */}
        <div className="md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-gray-50 transition duration-150 ${
                      activeCategory === category.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700'
                    }`}
                  >
                    <span
                      className={
                        activeCategory === category.id
                          ? 'text-blue-500'
                          : 'text-gray-500'
                      }
                    >
                      {category.icon}
                    </span>
                    <div>
                      <h3 className="text-sm font-medium">{category.name}</h3>
                      <p className="text-xs text-gray-500">
                        {category.description}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 设置表单 */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8">
                <div className="animate-pulse space-y-4">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    {
                      categories.find((c) => c.id === activeCategory)?.name ||
                      '设置'
                    }
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {
                      categories.find((c) => c.id === activeCategory)
                        ?.description || ''
                    }
                  </p>
                </div>

                {currentCategorySettings.length > 0 ? (
                  <div className="p-6 space-y-6">
                    {currentCategorySettings.map((setting) => (
                      <div key={setting.id} className="space-y-1">
                        <label
                          htmlFor={setting.id}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {setting.name}
                        </label>
                        {renderSettingInput(setting)}
                        <p className="text-xs text-gray-500">
                          {setting.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    此分类暂无设置项
                  </div>
                )}

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    type="button"
                    onClick={handleResetSettings}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    重置为默认值
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSettings}
                    disabled={!dirty || saving}
                    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                      !dirty || saving
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {saving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        保存中...
                      </>
                    ) : (
                      '保存设置'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage; 
