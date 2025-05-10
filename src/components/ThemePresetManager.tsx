import { useState } from 'react';
import { useTheme, ThemeSettings } from '@/context/ThemeContext';

interface ThemePreset {
  id: string;
  name: string;
  settings: Partial<ThemeSettings>;
}

const defaultPresets: ThemePreset[] = [
  {
    id: 'default',
    name: '默认主题',
    settings: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      textColor: '#111827',
      backgroundColor: '#F9FAFB',
      productLayout: 'grid',
      productsPerPage: 12,
      stickyHeader: true,
      showCategoriesMenu: true,
      cardHoverShadow: true,
      cardHoverTransform: true,
      cardBorderRadius: 8,
      carouselCount: 3,
      featuredCount: 4,
      showHeroSection: true,
      showSearchBar: true,
      gridColumns: {
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4
      },
      categorySpecificLayouts: false,
      themeMode: 'light',
      navbarStyle: 'default',
      cardPadding: 16,
      cardTitleSize: 16,
      cardImageAspectRatio: '1:1',
      enableAnimations: true,
      pageTransitions: true,
      animationSpeed: 'normal',
      reducedMotion: false,
      imageLoadStrategy: 'lazy',
      textDirection: 'ltr'
    }
  },
  {
    id: 'dark',
    name: '暗色主题',
    settings: {
      primaryColor: '#60A5FA',
      secondaryColor: '#34D399',
      textColor: '#F9FAFB',
      backgroundColor: '#111827',
      themeMode: 'dark',
      cardHoverShadow: true,
      cardHoverTransform: true
    }
  },
  {
    id: 'compact',
    name: '紧凑布局',
    settings: {
      cardPadding: 8,
      cardTitleSize: 14,
      gridColumns: {
        sm: 2,
        md: 3,
        lg: 4,
        xl: 6
      },
      navbarStyle: 'compact',
      productsPerPage: 24
    }
  }
];

export function ThemePresetManager() {
  const { theme, updateTheme } = useTheme();
  const [presets, setPresets] = useState<ThemePreset[]>(defaultPresets);
  const [newPresetName, setNewPresetName] = useState('');

  const applyPreset = (preset: ThemePreset) => {
    updateTheme(preset.settings);
  };

  const saveCurrentAsPreset = () => {
    if (!newPresetName.trim()) return;

    const newPreset: ThemePreset = {
      id: Date.now().toString(),
      name: newPresetName.trim(),
      settings: { ...theme }
    };

    setPresets([...presets, newPreset]);
    setNewPresetName('');
  };

  const deletePreset = (presetId: string) => {
    setPresets(presets.filter(p => p.id !== presetId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={newPresetName}
          onChange={(e) => setNewPresetName(e.target.value)}
          placeholder="输入预设名称"
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={saveCurrentAsPreset}
          disabled={!newPresetName.trim()}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          保存当前设置
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {presets.map((preset) => (
          <div
            key={preset.id}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{preset.name}</h3>
              {preset.id !== 'default' && (
                <button
                  onClick={() => deletePreset(preset.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  删除
                </button>
              )}
            </div>
            <button
              onClick={() => applyPreset(preset)}
              className="w-full px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              应用
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 