import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useColorScheme } from 'react-native';

export const defaultTheme = {
  name: 'dark',
  background: '#000014',
  text: '#FFFFFF',
  primary: '#F69B0C',
  secondary: '#9CA3AF',
  accent: '#FBBF24',
  border: '#374151',
  card: '#121226',
  error: '#F87171',
  success: '#34D399',
  tabBarBackground: '#111827',
  tabBarActiveTint: '#60A5FA',
  tabBarInactiveTint: '#9CA3AF',
  statusBar: 'light',
};

export const blueTheme = {
  name: 'blue',
  background: '#EFF6FF',
  text: '#1E3A8A',
  primary: '#2563EB',
  secondary: '#64748B',
  accent: '#3B82F6',
  border: '#BFDBFE',
  card: '#DBEAFE',
  error: '#F87171',
  success: '#34D399',
  tabBarBackground: '#DBEAFE',
  tabBarActiveTint: '#2563EB',
  tabBarInactiveTint: '#64748B',
  statusBar: 'dark',
};

export const purpleTheme = {
  name: 'purple',
  background: '#1c1c29',
  text: '#ffffff',
  primary: '#8B5CF6',
  secondary: '#6B7280',
  accent: '#A78BFA',
  border: '#DDD6FE',
  card: '#525152',
  error: '#EF4444',
  success: '#10B981',
  tabBarBackground: '#EDE9FE',
  tabBarActiveTint: '#8B5CF6',
  tabBarInactiveTint: '#6B7280',
  statusBar: 'light',
};

export const greenTheme = {
  name: 'green',
  background: '#ECFDF5',
  text: '#064E3B',
  primary: '#10B981',
  secondary: '#6B7280',
  accent: '#34D399',
  border: '#A7F3D0',
  card: '#D1FAE5',
  error: '#EF4444',
  success: '#059669',
  tabBarBackground: '#D1FAE5',
  tabBarActiveTint: '#10B981',
  tabBarInactiveTint: '#6B7280',
  statusBar: 'dark',
};

// Colección de todos los temas disponibles
export const availableThemes = [defaultTheme, blueTheme, purpleTheme, greenTheme];

// Tipo para nuestros temas
export type Theme = (typeof availableThemes)[0];

// Contexto para el tema
type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (themeName: string) => void;
  availableThemes: Theme[];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Proveedor del tema
type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const colorScheme = useColorScheme();
  // Definimos lightTheme si no existe
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    colorScheme === 'dark' ? defaultTheme : availableThemes[0]
  );

  const isDark = currentTheme.name === 'dark';
  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev.name === 'dark' ? availableThemes[0] : defaultTheme));
  };

  const setTheme = (themeName: string) => {
    const newTheme =
      availableThemes.find((theme) => theme.name === themeName) || availableThemes[0];
    setCurrentTheme(newTheme);
  };

  const contextValue = useMemo(
    () => ({
      theme: currentTheme,
      isDark,
      toggleTheme,
      setTheme,
      availableThemes,
    }),
    [currentTheme, isDark, toggleTheme, setTheme, availableThemes]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar el tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};
