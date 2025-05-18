import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { useTheme } from '~/utils/themes';
import { StatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const { theme } = useTheme();

  const insets = initialWindowMetrics?.insets.bottom ?? 0;

  return (
    <>
      {/* Configuración de la barra de estado */}
      <StatusBar style={theme.statusBar as 'auto' | 'inverted' | 'light' | 'dark'} />
      
      <Tabs
        screenOptions={{
          tabBarStyle: {
            paddingBottom: Math.max(insets, 8),
            borderTopWidth: 1,
            borderTopColor: theme.border,
            backgroundColor: theme.background,
            paddingTop: 8,
          },
          headerShown: false,
          tabBarActiveTintColor: theme.text,
          tabBarInactiveTintColor: '#6B7280',
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} color={theme.accent} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Buscar',
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'search' : 'search-outline'}
                color={theme.accent}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: 'Guardados',
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'bookmark' : 'bookmark-outline'}
                color={theme.accent}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                color={theme.accent}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
