/**
 * 主题相关类型定义
 */

// 定义动画效果类型
export type AnimationStyle = 'none' | 'fade' | 'slide' | 'zoom' | 'bounce';

// 定义主题预设类型
export type ThemePreset = 'default' | 'dark' | 'light' | 'colorful' | 'minimal' | 'elegant' | 'custom';

// 定义布局模式
export type LayoutMode = 'grid' | 'list' | 'waterfall';

// 定义图片加载策略
export type ImageLoadStrategy = 'eager' | 'lazy' | 'progressive';

// 定义性能模式
export type PerformanceMode = 'high' | 'balanced' | 'low';

// 定义不同设备的设置
export interface ResponsiveSettings {
  layoutMode: LayoutMode;
  columns: number;
  gap: number;
  showDescription: boolean;
}

// 定义主题设置类型
export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  productLayout: LayoutMode;
  productsPerPage: number;
  stickyHeader: boolean;
  showCategoriesMenu: boolean;
  cardHoverShadow: boolean;
  cardHoverTransform: boolean;
  cardBorderRadius: number;
  carouselCount: number;
  featuredCount: number;
  showHeroSection: boolean;
  showSearchBar: boolean;
  gridColumns: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  categorySpecificLayouts: boolean;
  themeMode: 'light' | 'dark' | 'auto';
  navbarStyle: 'default' | 'compact' | 'minimal';
  cardPadding: number;
  cardTitleSize: number;
  cardImageAspectRatio: string;
  enableAnimations: boolean;
  pageTransitions: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  reducedMotion: boolean;
  imageLoadStrategy: 'eager' | 'lazy';
  textDirection: 'ltr' | 'rtl';
} 
