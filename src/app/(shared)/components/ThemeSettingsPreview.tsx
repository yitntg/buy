import { useTheme } from '@/src/app/(shared)/contexts/ThemeContext';

export function ThemeSettingsPreview() {
  const { theme } = useTheme();
  
  // 根据当前主题设置生成样式
  const styles = {
    container: {
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      padding: '20px',
      borderRadius: `${theme.cardBorderRadius}px`,
      boxShadow: theme.cardHoverShadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
      transform: theme.cardHoverTransform ? 'scale(1.01)' : 'none',
      transition: 'all 0.3s ease'
    },
    header: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    primary: {
      backgroundColor: theme.primaryColor,
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '4px',
      marginRight: '8px'
    },
    secondary: {
      backgroundColor: theme.secondaryColor,
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '4px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${theme.gridColumns.md}, 1fr)`,
      gap: '16px',
      marginTop: '16px'
    },
    card: {
      padding: `${theme.cardPadding}px`,
      borderRadius: `${theme.cardBorderRadius}px`,
      border: '1px solid #e2e8f0',
      backgroundColor: '#fff'
    },
    cardTitle: {
      fontSize: `${theme.cardTitleSize}px`,
      fontWeight: 'bold',
      marginBottom: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>当前主题预览</span>
        <div>
          <button style={styles.primary}>主要按钮</button>
          <button style={styles.secondary}>次要按钮</button>
        </div>
      </div>
      
      <div style={styles.grid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardTitle}>卡片标题 {i + 1}</div>
            <p>卡片内容示例，展示当前主题的文字样式和布局效果。</p>
          </div>
        ))}
      </div>
    </div>
  );
} 
