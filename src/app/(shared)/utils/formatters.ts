/**
 * 格式化工具函数集合
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

/**
 * 格式化日期时间为中文格式
 * @param dateString 日期字符串或Date对象
 * @returns 格式化后的日期时间字符串，如：2023年11月15日 14:30:25
 */
export function formatDateTime(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

/**
 * 格式化货币
 * @param amount 金额
 * @param currency 货币符号，默认为 ¥
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (amount: number, currency: string = '¥'): string => {
  return `${currency}${amount.toFixed(2)}`
}

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @param format 格式化模板，默认为 YYYY-MM-DD
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD'): string => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatPhoneNumber(phone: string): string {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3')
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('zh-CN').format(num)
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
} 
