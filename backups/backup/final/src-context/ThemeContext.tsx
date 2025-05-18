import { createContext, useContext, useState, ReactNode } from 'react';

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  productLayout: 'grid' | 'waterfall' | 'list';
  productsPerPage: number;
  stickyHeader: boolean;
  showCategoriesMenu: boolean;
  cardHoverShadow: boolean;
  cardHoverTransform: boolean;
  cardBorderRadius: number;
  carouselCount: number;
  featuredCount: number;
  showHeroSection: boolean;
  showSearchBar: boolean;
  gridColumns: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  categorySpecificLayouts: boolean;
  themeMode: 'light' | 'dark' | 'auto';
  navbarStyle: 'default' | 'compact' | 'extended';
  cardPadding: number;
  cardTitleSize: number;
  cardImageAspectRatio: '1:1' | '4:3' | '16:9' | 'auto';
  enableAnimations: boolean;
  pageTransitions: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  reducedMotion: boolean;
  imageLoadStrategy: 'eager' | 'lazy';
  textDirection: 'ltr' | 'rtl';
}

const defaultTheme: ThemeSettings = {
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
};

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (settings: Partial<ThemeSettings>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);

  const updateTheme = (settings: Partial<ThemeSettings>) => {
    setTheme(prev => ({ ...prev, ...settings }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 