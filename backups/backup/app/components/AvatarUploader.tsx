'use client'

import { useState } from 'react'
import { AvatarService } from '@/utils/avatarUtils'
import UserAvatar from './UserAvatar'

interface AvatarUploaderProps {
  user: {
    username: string;
    avatar?: string;
  };
  onAvatarChange: (url: string) => void;
  size?: number;
}

export default function AvatarUploader({ 
  user, 
  onAvatarChange,
  size = 48
}: AvatarUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 处理头像上传
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setIsUploading(true);
    setError(null);
    
    try {
      // 本地预览
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          setPreviewUrl(result);
        }
      };
      reader.readAsDataURL(file);
      
      // 上传到服务器
      const avatarUrl = await AvatarService.uploadAvatar(file);
      
      // 回调通知父组件
      onAvatarChange(avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
      console.error('头像上传失败:', err);
    } finally {
      setIsUploading(false);
    }
  };
  
  // 触发文件选择
  const triggerFileInput = () => {
    const fileInput = document.getElementById('avatarInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };
  
  // 使用默认头像
  const useDefaultAvatar = async () => {
    setIsUploading(true);
    setError(null);
    
    try {
      const defaultUrl = AvatarService.getDefaultAvatarUrl(user.username);
      
      // 回调通知父组件
      onAvatarChange(defaultUrl);
      setPreviewUrl(defaultUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : '设置默认头像失败');
      console.error('设置默认头像失败:', err);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div>
      <div className="flex items-center">
        <div className="relative mr-4">
          <UserAvatar 
            user={{
              username: user.username,
              avatar: previewUrl || user.avatar
            }}
            size={size}
            border={true}
            borderColor="#f0f0f0"
          />
          
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col">
          <div className="flex space-x-2">
            <input 
              type="file" 
              id="avatarInput" 
              accept="image/*" 
              className="hidden" 
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              className="text-sm text-primary border border-primary px-3 py-1 rounded-md hover:bg-blue-50"
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              {user.avatar ? '更换头像' : '上传头像'}
            </button>
            
            <button
              type="button"
              className="text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50"
              onClick={useDefaultAvatar}
              disabled={isUploading}
            >
              使用默认头像
            </button>
          </div>
          
          {error && (
            <p className="text-xs text-red-500 mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
} 