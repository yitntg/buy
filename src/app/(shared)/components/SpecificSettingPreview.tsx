import { useTheme } from '@/src/app/(shared)/contexts/ThemeContext';

interface SpecificSettingPreviewProps {
  setting: string;
  label: string;
}

export function SpecificSettingPreview({ setting, label }: SpecificSettingPreviewProps) {
  const { theme } = useTheme();
  
  // 获取设置的值
  const value = theme[setting as keyof typeof theme];
  
  // 根据设置类型生成对应的预览
  const renderPreview = () => {
    // 如果是颜色类型
    if (
      setting === 'primaryColor' || 
      setting === 'secondaryColor' || 
      setting === 'backgroundColor' || 
      setting === 'textColor'
    ) {
      return (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full border border-gray-300"
            style={{ backgroundColor: value as string }}
          />
          <span className="text-sm font-mono">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
        </div>
      );
    }
    
    // 如果是数字类型
    if (
      setting === 'cardBorderRadius' || 
      setting === 'cardPadding' || 
      setting === 'cardTitleSize' || 
      setting === 'productsPerPage' ||
      setting === 'carouselCount' ||
      setting === 'featuredCount'
    ) {
      return (
        <div className="text-sm font-mono">
          {typeof value === 'object' ? JSON.stringify(value) : String(value)} {setting.includes('Padding') || setting.includes('Radius') || setting.includes('Size') ? 'px' : ''}
        </div>
      );
    }
    
    // 如果是布尔类型
    if (typeof value === 'boolean') {
      return (
        <div className={`text-sm font-medium ${value ? 'text-green-600' : 'text-red-600'}`}>
          {value ? '启用' : '禁用'}
        </div>
      );
    }
    
    // 如果是对象类型（gridColumns）
    if (setting === 'gridColumns' && typeof value === 'object') {
      const columns = value as Record<string, number>;
      return (
        <div className="text-sm">
          {Object.entries(columns).map(([size, count]) => (
            <span key={size} className="mr-2">
              {size}: {count}
            </span>
          ))}
        </div>
      );
    }
    
    // 默认展示值的字符串表示
    return (
      <div className="text-sm font-mono">
        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
      </div>
    );
  };
  
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <div className="font-medium">{label}</div>
      <div>{renderPreview()}</div>
    </div>
  );
}
