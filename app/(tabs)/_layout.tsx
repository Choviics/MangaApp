import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '~/utils/themes';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export default function TabLayout() {
  const { theme } = useTheme();

  const insets = useSafeAreaInsets().bottom;

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBackgroundColorAsync('rgba(0,0,0,0)');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  return (
    <>
      {/* Configuración de la barra de estado */}
      <StatusBar style={theme.statusBar as 'light' | 'dark'} />

      <Tabs
        screenOptions={{
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: theme.border,
            backgroundColor: theme.background,
            paddingTop: 8,
            height: insets + 60,
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
                name={focused ? 'settings' : 'settings-outline'}
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
