'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

// 为生成头像颜色准备的颜色数组 - 优化后更丰富的颜色方案
const avatarColors = [
  '#FF5252', // 鲜红色
  '#FF9800', // 橙色
  '#FFCC00', // 黄色
  '#00C853', // 绿色
  '#2196F3', // 蓝色
  '#673AB7', // 深紫色
  '#E91E63', // 粉色
  '#00BCD4', // 青色
  '#3F51B5', // 靛蓝色
  '#009688', // 青绿色
  '#9C27B0', // 紫色
  '#F44336', // 红色
];

// 文字颜色（深色与浅色）
const textColors = {
  light: '#FFFFFF',
  dark: '#212121'
};

// 新增：头像形状选项
export type AvatarShape = 'circle' | 'square' | 'rounded';

interface UserAvatarProps {
  user: {
    username: string;
    avatar?: string;
  } | null;
  size?: number;
  shape?: AvatarShape;
  className?: string;
  showStatusIndicator?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
  border?: boolean;
  borderColor?: string;
}

export default function UserAvatar({ 
  user, 
  size = 32, 
  shape = 'circle',
  className = '',
  showStatusIndicator = false,
  status = 'offline',
  border = false,
  borderColor = 'white'
}: UserAvatarProps) {
  const [mounted, setMounted] = useState(false);
  
  // 避免SSR水合过程中的不匹配
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  if (!user) return null;
  
  // 获取随机但固定的颜色（基于用户名）
  const getAvatarColor = (username: string) => {
    let hashCode = 0;
    for (let i = 0; i < username.length; i++) {
      hashCode = (hashCode << 5) - hashCode + username.charCodeAt(i);
      hashCode = hashCode & hashCode; // 转换为32位整数
    }
    const index = Math.abs(hashCode) % avatarColors.length;
    return avatarColors[index];
  };
  
  // 确定文字颜色（根据背景色的亮度）
  const getTextColor = (backgroundColor: string) => {
    // 简易版亮度计算，转换十六进制颜色为RGB，计算亮度
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // 计算亮度（基于RGB的加权平均值）
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // 亮度大于125使用深色文字，否则使用浅色文字
    return brightness > 125 ? textColors.dark : textColors.light;
  };
  
  // 从用户名生成首字母
  const getInitials = (username: string) => {
    if (!username) return '?';
    
    // 处理中文姓名 - 取第一个字符
    if (/[\u4e00-\u9fa5]/.test(username)) {
      return username.charAt(0);
    }
    
    // 处理英文姓名 - 取首字母
    const parts = username.split(/\s+/);
    if (parts.length === 1) {
      return username.charAt(0).toUpperCase();
    }
    
    // 多个单词取首字母
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  // 设置边框圆角（基于形状）
  const getBorderRadius = () => {
    switch(shape) {
      case 'circle': return '50%';
      case 'square': return '0';
      case 'rounded': return '8px';
      default: return '50%';
    }
  };
  
  // 获取状态指示器的颜色
  const getStatusColor = () => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };
  
  // 如果用户有头像，显示头像图片
  if (user.avatar) {
    return (
      <div 
        className={`relative inline-block ${className}`}
        style={{ 
          width: `${size}px`, 
          height: `${size}px`,
          borderRadius: getBorderRadius(),
          overflow: 'hidden',
          border: border ? `2px solid ${borderColor}` : 'none'
        }}
      >
        <Image
          src={user.avatar}
          alt={user.username || '用户'}
          fill
          className="object-cover"
        />
        
        {showStatusIndicator && (
          <span 
            className={`absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 block ${getStatusColor()}`}
            style={{
              width: `${size * 0.3}px`,
              height: `${size * 0.3}px`,
              borderRadius: '50%',
              border: '2px solid white'
            }}
          />
        )}
      </div>
    );
  }
  
  // 为没有头像的用户生成字母头像
  const backgroundColor = getAvatarColor(user.username);
  const textColor = getTextColor(backgroundColor);
  const initials = getInitials(user.username);
  
  return (
    <div
      className={`relative inline-flex items-center justify-center font-medium ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
        color: textColor,
        fontSize: `${size * 0.4}px`,
        borderRadius: getBorderRadius(),
        border: border ? `2px solid ${borderColor}` : 'none'
      }}
    >
      {initials}
      
      {showStatusIndicator && (
        <span 
          className={`absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 block ${getStatusColor()}`}
          style={{
            width: `${size * 0.3}px`,
            height: `${size * 0.3}px`,
            borderRadius: '50%',
            border: '2px solid white'
          }}
        />
      )}
    </div>
  );
} 