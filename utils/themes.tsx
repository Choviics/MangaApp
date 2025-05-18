import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const defaultTheme = {
  name: 'Kintsugi',
  background: '#000014',
  text: '#FFFFFF',
  primary: '#F69B0C',
  secondary: '#9CA3AF',
  accent: '#FBBF24',
  border: '#374151',
  card: '#121226',
  error: '#F87171',
  success: '#34D399',
  statusBar: 'light',
  // Estados de publicación
  statusCompleted: '#00B4D8',    // Celeste
  statusOngoing: '#34D399',      // Verde suave
  statusCancelled: '#F87171',    // Rojo suave
  statusHiatus: '#9CA3AF',       // Gris
};

export const redTheme = {
  name: 'Akatsuki',
  background: '#0A0E1F',
  text: '#FFFFFF',
  primary: '#E30613',
  secondary: '#8D95A7',
  accent: '#F52735',
  border: '#374151',
  card: '#111C3E',
  error: '#EF4444',
  success: '#059669',
  statusBar: 'light',
  // Estados de publicación
  statusCompleted: '#00B4D8',    // Celeste
  statusOngoing: '#34D399',      // Verde suave
  statusCancelled: '#EF4444',    // Rojo brillante
  statusHiatus: '#8D95A7',       // Gris azulado
};

export const greenTheme = {
  name: 'green',
  background: '#111C3E',
  text: '#ffffff',
  primary: '#00BF8F',
  secondary: '#9EA6BB',
  accent: '#19D9A6',
  border: '#DDD6FE',
  card: '#1A1A2E',
  error: '#EF4444',
  success: '#10B981',
  statusBar: 'light',
  // Estados de publicación
  statusCompleted: '#00B4D8',    // Celeste
  statusOngoing: '#F59E0B',      // Naranja
  statusCancelled: '#EF4444',    // Rojo
  statusHiatus: '#9EA6BB',       // Gris claro
};

export const blueTheme = {
  name: 'blue',
  background: '#EFF6FF',
  text: '#1E3A8A',
  primary: '#2563EB',
  secondary: '#cdcdd3',
  accent: '#3B82F6',
  border: '#BFDBFE',
  card: '#DBEAFE',
  error: '#F87171',
  success: '#34D399',
  statusBar: 'dark',
  // Estados de publicación
  statusCompleted: '#00B4D8',    // Celeste
  statusOngoing: '#34D399',      // Verde claro
  statusCancelled: '#F87171',    // Rojo claro
  statusHiatus: '#64748B',       // Gris azulado
};

// Colección de todos los temas disponibles
export const availableThemes = [defaultTheme, redTheme, greenTheme, blueTheme];

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

// Clave para almacenar el tema en AsyncStorage
const THEME_STORAGE_KEY = '@manga_app_theme';

// Proveedor del tema
type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const colorScheme = useColorScheme();
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    colorScheme === 'dark' ? defaultTheme : availableThemes[0]
  );
  const [isLoading, setIsLoading] = useState(true);

  // Cargar el tema guardado al iniciar
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedThemeName = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedThemeName) {
          const foundTheme = availableThemes.find(theme => theme.name === savedThemeName);
          if (foundTheme) {
            setCurrentTheme(foundTheme);
          }
        }
      } catch (error: unknown) {
        console.error('Error al cargar el tema guardado:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedTheme();
  }, []);

  const isDark = currentTheme.name === 'dark';
  
  const toggleTheme = () => {
    setCurrentTheme((prev) => {
      const newTheme = prev.name === 'dark' ? availableThemes[0] : defaultTheme;
      // Guardar la preferencia
      AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme.name).catch((error: unknown) => 
        console.error('Error al guardar el tema:', error)
      );
      return newTheme;
    });
  };

  const setTheme = (themeName: string) => {
    const newTheme =
      availableThemes.find((theme) => theme.name === themeName) || availableThemes[0];
    setCurrentTheme(newTheme);
    
    // Guardar la preferencia del usuario
    AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme.name).catch((error: unknown) => 
      console.error('Error al guardar el tema:', error)
    );
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

  if (isLoading) {
    return null;
  }

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
