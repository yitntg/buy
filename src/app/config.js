// 应用程序全局配置

// API重验证时间配置（秒）
export const apiRevalidate = 60; // 默认为60秒

// 图像配置
export const IMAGE_CONFIG = {
  // 默认图像路径
  DEFAULT_AVATAR: '/images/default-avatar.png',
  DEFAULT_PRODUCT: '/images/default-product.jpg',
  // 图像大小限制（字节）
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
};

// 应用程序全局常量
export const APP_CONSTANTS = {
  APP_NAME: '现代电子商务平台',
  CURRENCY: '¥',
  PAGINATION_LIMIT: 10,
};

// 环境变量配置
export const ENV = {
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  API_URL: process.env.API_URL || 'http://localhost:3000',
}; 