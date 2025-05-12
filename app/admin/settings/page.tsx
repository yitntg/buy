'use client';

// 移除对配置文件的导入，统一从layout继承配置
// import '../revalidate-config.js';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { ThemeSettingsPreview, SpecificSettingPreview } from '@/app/components/ThemeSettingsPreview';
import { supabase } from '@/lib/supabase';

// 移除本地revalidate配置，依赖layout中的全局设置
// export const revalidate = 0;

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
  spacing: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [settings, setSettings] = useState<ThemeSettings>({
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    fontFamily: 'system-ui',
    borderRadius: '0.5rem',
    spacing: '1rem',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 加载设置
  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setSettings(data.theme_settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // 客户端渲染检查
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 认证检查和数据加载
  useEffect(() => {
    if (isClient) {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      loadSettings();
    }
  }, [isClient, isAuthenticated, router]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          id: 1,
          theme_settings: settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof ThemeSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // 加载状态
  if (!isClient || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">主题设置</h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
            </div>
            <div className="bg-gray-200 h-64 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // 主要内容渲染
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">主题设置</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">主色调</label>
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
              className="w-full h-10 rounded border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">次要色调</label>
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
              className="w-full h-10 rounded border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">字体</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
              className="w-full p-2 rounded border"
            >
              <option value="system-ui">系统默认</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">圆角大小</label>
            <input
              type="text"
              value={settings.borderRadius}
              onChange={(e) => handleSettingChange('borderRadius', e.target.value)}
              className="w-full p-2 rounded border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">间距</label>
            <input
              type="text"
              value={settings.spacing}
              onChange={(e) => handleSettingChange('spacing', e.target.value)}
              className="w-full p-2 rounded border"
            />
          </div>

          <button
            onClick={saveSettings}
            disabled={saving}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存设置'}
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">预览</h2>
          <ThemeSettingsPreview settings={settings} />
        </div>
      </div>
    </div>
  );
} 