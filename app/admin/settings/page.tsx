'use client';

// 强制所有管理员页面在客户端渲染，因为它们需要AuthProvider
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useTheme, ThemeSettings } from '@/context/ThemeContext';
import { ThemeSettingsPreview } from '@/components/ThemeSettingsPreview';
import { SpecificSettingPreview } from '@/components/SpecificSettingPreview';
import { ThemePresetManager } from '@/components/ThemePresetManager';

interface SystemSettings extends ThemeSettings {
  siteName: string;
  contactEmail: string;
  currency: string;
  itemsPerPage: number;
  allowGuestCheckout: boolean;
  enableReviews: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, updateTheme } = useTheme();
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    // 基础设置
    siteName: '现代电商',
    contactEmail: 'support@example.com',
    currency: 'CNY',
    itemsPerPage: 12,
    allowGuestCheckout: true,
    enableReviews: true,
    // 主题设置
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    textColor: theme.textColor,
    backgroundColor: theme.backgroundColor,
    productLayout: theme.productLayout,
    productsPerPage: theme.productsPerPage,
    stickyHeader: theme.stickyHeader,
    showCategoriesMenu: theme.showCategoriesMenu,
    cardHoverShadow: theme.cardHoverShadow,
    cardHoverTransform: theme.cardHoverTransform,
    cardBorderRadius: theme.cardBorderRadius,
    carouselCount: theme.carouselCount,
    featuredCount: theme.featuredCount,
    showHeroSection: theme.showHeroSection,
    showSearchBar: theme.showSearchBar,
    gridColumns: theme.gridColumns,
    categorySpecificLayouts: theme.categorySpecificLayouts,
    themeMode: theme.themeMode,
    navbarStyle: theme.navbarStyle,
    cardPadding: theme.cardPadding,
    cardTitleSize: theme.cardTitleSize,
    cardImageAspectRatio: theme.cardImageAspectRatio,
    enableAnimations: theme.enableAnimations,
    pageTransitions: theme.pageTransitions,
    animationSpeed: theme.animationSpeed,
    reducedMotion: theme.reducedMotion,
    imageLoadStrategy: theme.imageLoadStrategy,
    textDirection: theme.textDirection
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">请先登录</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">主题设置</h1>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">主题预设</h2>
            <ThemePresetManager />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">颜色设置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  主色调
                </label>
                <input
                  type="color"
                  value={systemSettings.primaryColor}
                  onChange={(e) => {
                    setSystemSettings(prev => ({ ...prev, primaryColor: e.target.value }));
                    updateTheme({ primaryColor: e.target.value });
                  }}
                  className="w-full h-10 rounded cursor-pointer"
                />
                <SpecificSettingPreview setting="primaryColor" value={systemSettings.primaryColor} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  次要色调
                </label>
                <input
                  type="color"
                  value={systemSettings.secondaryColor}
                  onChange={(e) => {
                    setSystemSettings(prev => ({ ...prev, secondaryColor: e.target.value }));
                    updateTheme({ secondaryColor: e.target.value });
                  }}
                  className="w-full h-10 rounded cursor-pointer"
                />
                <SpecificSettingPreview setting="secondaryColor" value={systemSettings.secondaryColor} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  文本颜色
                </label>
                <input
                  type="color"
                  value={systemSettings.textColor}
                  onChange={(e) => {
                    setSystemSettings(prev => ({ ...prev, textColor: e.target.value }));
                    updateTheme({ textColor: e.target.value });
                  }}
                  className="w-full h-10 rounded cursor-pointer"
                />
                <SpecificSettingPreview setting="textColor" value={systemSettings.textColor} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  背景颜色
                </label>
                <input
                  type="color"
                  value={systemSettings.backgroundColor}
                  onChange={(e) => {
                    setSystemSettings(prev => ({ ...prev, backgroundColor: e.target.value }));
                    updateTheme({ backgroundColor: e.target.value });
                  }}
                  className="w-full h-10 rounded cursor-pointer"
                />
                <SpecificSettingPreview setting="backgroundColor" value={systemSettings.backgroundColor} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">布局设置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品布局
                </label>
                <select
                  value={systemSettings.productLayout}
                  onChange={(e) => {
                    const value = e.target.value as 'grid' | 'waterfall' | 'list';
                    setSystemSettings(prev => ({ ...prev, productLayout: value }));
                    updateTheme({ productLayout: value });
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="grid">网格</option>
                  <option value="waterfall">瀑布流</option>
                  <option value="list">列表</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  每页商品数量
                </label>
                <input
                  type="number"
                  value={systemSettings.productsPerPage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setSystemSettings(prev => ({ ...prev, productsPerPage: value }));
                    updateTheme({ productsPerPage: value });
                  }}
                  min="4"
                  max="48"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  网格列数
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">中等屏幕</label>
                    <input
                      type="number"
                      value={systemSettings.gridColumns.md}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        const newGridColumns = {
                          ...systemSettings.gridColumns,
                          md: value
                        };
                        setSystemSettings(prev => ({ ...prev, gridColumns: newGridColumns }));
                        updateTheme({ gridColumns: newGridColumns });
                      }}
                      min="1"
                      max="6"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">大屏幕</label>
                    <input
                      type="number"
                      value={systemSettings.gridColumns.lg}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        const newGridColumns = {
                          ...systemSettings.gridColumns,
                          lg: value
                        };
                        setSystemSettings(prev => ({ ...prev, gridColumns: newGridColumns }));
                        updateTheme({ gridColumns: newGridColumns });
                      }}
                      min="1"
                      max="6"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <SpecificSettingPreview setting="gridColumns" value={systemSettings.gridColumns} />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">卡片设置</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  卡片圆角
                </label>
                <input
                  type="range"
                  value={systemSettings.cardBorderRadius}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setSystemSettings(prev => ({ ...prev, cardBorderRadius: value }));
                    updateTheme({ cardBorderRadius: value });
                  }}
                  min="0"
                  max="24"
                  className="w-full"
                />
                <SpecificSettingPreview setting="cardBorderRadius" value={systemSettings.cardBorderRadius} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  卡片内边距
                </label>
                <input
                  type="range"
                  value={systemSettings.cardPadding}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setSystemSettings(prev => ({ ...prev, cardPadding: value }));
                    updateTheme({ cardPadding: value });
                  }}
                  min="0"
                  max="32"
                  className="w-full"
                />
                <SpecificSettingPreview setting="cardPadding" value={systemSettings.cardPadding} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  卡片标题大小
                </label>
                <input
                  type="range"
                  value={systemSettings.cardTitleSize}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setSystemSettings(prev => ({ ...prev, cardTitleSize: value }));
                    updateTheme({ cardTitleSize: value });
                  }}
                  min="12"
                  max="24"
                  className="w-full"
                />
                <SpecificSettingPreview setting="cardTitleSize" value={systemSettings.cardTitleSize} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  图片比例
                </label>
                <select
                  value={systemSettings.cardImageAspectRatio}
                  onChange={(e) => {
                    const value = e.target.value as '1:1' | '4:3' | '16:9' | 'auto';
                    setSystemSettings(prev => ({ ...prev, cardImageAspectRatio: value }));
                    updateTheme({ cardImageAspectRatio: value });
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1:1">1:1</option>
                  <option value="4:3">4:3</option>
                  <option value="16:9">16:9</option>
                  <option value="auto">自动</option>
                </select>
                <SpecificSettingPreview setting="cardImageAspectRatio" value={systemSettings.cardImageAspectRatio} />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={systemSettings.cardHoverShadow}
                    onChange={(e) => {
                      setSystemSettings(prev => ({ ...prev, cardHoverShadow: e.target.checked }));
                      updateTheme({ cardHoverShadow: e.target.checked });
                    }}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">悬停阴影</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={systemSettings.cardHoverTransform}
                    onChange={(e) => {
                      setSystemSettings(prev => ({ ...prev, cardHoverTransform: e.target.checked }));
                      updateTheme({ cardHoverTransform: e.target.checked });
                    }}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">悬停缩放</span>
                </label>
              </div>
            </div>
          </section>
        </div>

        <div>
          <section>
            <h2 className="text-xl font-semibold mb-4">实时预览</h2>
            <ThemeSettingsPreview />
          </section>
        </div>
      </div>
    </div>
  );
} 