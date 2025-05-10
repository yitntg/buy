import { useTheme } from '@/context/ThemeContext';

export function ThemeSettingsPreview() {
  const { theme } = useTheme();

  return (
    <div className="p-4 rounded-lg shadow-lg" style={{ backgroundColor: theme.backgroundColor }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: theme.textColor }}>
        主题预览
      </h2>
      
      <div className="space-y-4">
        <div className="p-4 rounded" style={{ backgroundColor: theme.primaryColor }}>
          <p className="text-white">主色调</p>
        </div>
        
        <div className="p-4 rounded" style={{ backgroundColor: theme.secondaryColor }}>
          <p className="text-white">次要色调</p>
        </div>
        
        <div className="grid gap-4" style={{ 
          gridTemplateColumns: `repeat(${theme.gridColumns.md}, 1fr)` 
        }}>
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="p-4 rounded shadow"
              style={{
                backgroundColor: 'white',
                borderRadius: `${theme.cardBorderRadius}px`,
                padding: `${theme.cardPadding}px`,
                transform: theme.cardHoverTransform ? 'scale(1.02)' : 'none',
                boxShadow: theme.cardHoverShadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
              }}
            >
              <div 
                className="w-full mb-2"
                style={{
                  aspectRatio: theme.cardImageAspectRatio === '1:1' ? '1/1' : 
                              theme.cardImageAspectRatio === '4:3' ? '4/3' : 
                              theme.cardImageAspectRatio === '16:9' ? '16/9' : 'auto'
                }}
              >
                <div className="w-full h-full bg-gray-200 rounded" />
              </div>
              <h3 
                className="font-medium"
                style={{ 
                  fontSize: `${theme.cardTitleSize}px`,
                  color: theme.textColor
                }}
              >
                示例商品 {i}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 