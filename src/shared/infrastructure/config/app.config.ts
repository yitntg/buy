export const appConfig = {
  name: '乐购商城',
  description: '现代化电商平台',
  version: '1.0.0',
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 5000,
  },
  auth: {
    sessionExpiry: 24 * 60 * 60 * 1000, // 24小时
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxFiles: 5,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
}; 