import { useTheme, ThemeSettings } from '@/context/ThemeContext';

interface SpecificSettingPreviewProps {
  setting: keyof ThemeSettings;
  value: any;
}

export function SpecificSettingPreview({ setting, value }: SpecificSettingPreviewProps) {
  const { theme } = useTheme();

  const renderPreview = () => {
    switch (setting) {
      case 'primaryColor':
      case 'secondaryColor':
      case 'backgroundColor':
      case 'textColor':
        return (
          <div 
            className="w-full h-12 rounded"
            style={{ backgroundColor: value }}
          />
        );

      case 'cardBorderRadius':
        return (
          <div 
            className="w-24 h-24 bg-white shadow"
            style={{ borderRadius: `${value}px` }}
          />
        );

      case 'cardPadding':
        return (
          <div 
            className="bg-white shadow"
            style={{ padding: `${value}px` }}
          >
            <div className="w-24 h-24 bg-gray-200" />
          </div>
        );

      case 'cardTitleSize':
        return (
          <p style={{ fontSize: `${value}px` }}>
            示例文本
          </p>
        );

      case 'cardImageAspectRatio':
        return (
          <div 
            className="w-24 bg-gray-200"
            style={{
              aspectRatio: value === '1:1' ? '1/1' : 
                          value === '4:3' ? '4/3' : 
                          value === '16:9' ? '16/9' : 'auto'
            }}
          />
        );

      case 'gridColumns':
        return (
          <div 
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${value.md}, 1fr)` }}
          >
            {Array.from({ length: value.md }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded" />
            ))}
          </div>
        );

      case 'cardHoverShadow':
      case 'cardHoverTransform':
        return (
          <div 
            className="w-24 h-24 bg-white rounded cursor-pointer transition-all duration-200"
            style={{
              transform: value ? 'scale(1.05)' : 'none',
              boxShadow: value ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 rounded-lg border border-gray-200">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        {String(setting)}
      </h3>
      <div className="flex items-center justify-center">
        {renderPreview()}
      </div>
    </div>
  );
} 