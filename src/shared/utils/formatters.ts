/**
 * 价格格式化工具函数
 */

// 将价格格式化为货币显示（默认人民币）
export function formatCurrency(
  value: number,
  locale: string = 'zh-CN',
  currency: string = 'CNY'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// 将分为单位的价格转换为元
export function convertCentsToYuan(cents: number): number {
  return cents / 100;
}

// 将元为单位的价格转换为分
export function convertYuanToCents(yuan: number): number {
  return Math.round(yuan * 100);
}

/**
 * 日期格式化工具函数
 */

// 格式化日期为本地字符串
export function formatDate(
  date: Date | string,
  locale: string = 'zh-CN'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

// 格式化日期为相对时间（如"3天前"）
export function formatRelativeTime(dateString: string, locale = 'zh-CN'): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // 定义时间段及其描述
  const timeIntervals = {
    year: 60 * 60 * 24 * 365,
    month: 60 * 60 * 24 * 30,
    week: 60 * 60 * 24 * 7,
    day: 60 * 60 * 24,
    hour: 60 * 60,
    minute: 60,
    second: 1
  };
  
  // 中文时间单位
  const timeUnits = {
    year: '年',
    month: '个月',
    week: '周',
    day: '天',
    hour: '小时',
    minute: '分钟',
    second: '秒'
  };
  
  for (const [unit, seconds] of Object.entries(timeIntervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    
    if (interval >= 1) {
      return `${interval} ${timeUnits[unit as keyof typeof timeUnits]}前`;
    }
  }
  
  return '刚刚';
}

/**
 * 文本处理工具函数
 */

// 截断文本并添加省略号
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.slice(0, maxLength) + '...';
}

// 将数字格式化为带单位的字符串（如1000 -> 1K）
export function formatNumber(num: number, locale = 'zh-CN'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 格式化百分比
 * @param value 0-1之间的小数
 * @returns 格式化后的百分比
 */
export function formatPercent(value: number): string {
  return (value * 100).toFixed(0) + '%';
}

/**
 * 格式化时间间隔为人类可读格式
 * @param seconds 秒数
 * @returns 格式化后的时间
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  const parts = [];
  
  if (hours > 0) {
    parts.push(`${hours}小时`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes}分钟`);
  }
  
  if (remainingSeconds > 0 || parts.length === 0) {
    parts.push(`${remainingSeconds}秒`);
  }
  
  return parts.join(' ');
}

/**
 * 格式化地址
 * @param address 地址对象
 * @returns 格式化后的地址字符串
 */
export function formatAddress(address: {
  province?: string;
  city?: string;
  district?: string;
  street?: string;
  detail?: string;
  postalCode?: string;
}): string {
  const parts = [
    address.province,
    address.city,
    address.district,
    address.street,
    address.detail
  ].filter(Boolean);
  
  return parts.join(', ') + (address.postalCode ? ` (${address.postalCode})` : '');
}

/**
 * 格式化商品数量文本显示
 * @param count 数量
 * @returns 格式化后的文本
 */
export function formatItemCount(count: number): string {
  if (count <= 0) {
    return '无库存';
  } else if (count < 10) {
    return `仅剩 ${count} 件`;
  } else {
    return `库存 ${count} 件`;
  }
} 
