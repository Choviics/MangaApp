import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getLastUpdatedMangas, getPopularMangas, getRecentCreatedMangas } from '~/api/MangaService';
import { useEffect, useState } from 'react';
import { useTheme } from '~/utils/themes';
import MangaRow from '~/components/MangaRow';

export default function Home() {
  const { theme } = useTheme();
  const [latestMangas, setLatestMangas] = useState<any[]>([]);
  const [trendMangas, setTrendMangas] = useState<any[]>([]);
  const [recentCreatedMangas, setRecentCreatedMangas] = useState<any[]>([]);

  useEffect(() => {
    const fetchMangas = async () => {
      try {
        const [latestMangas, trendMangas, recentCreatedMangas] = await Promise.all([
          getLastUpdatedMangas(),
          getPopularMangas(),
          getRecentCreatedMangas()
        ]);
        
        setLatestMangas(latestMangas);
        setTrendMangas(trendMangas);
        setRecentCreatedMangas(recentCreatedMangas);
      } catch (error) {
        console.error("Error al cargar los mangas:", error);
      }
    };
    
    fetchMangas();
  }, []);

  return (
    <SafeAreaView edges={['top']} className="flex-1" style={{ backgroundColor: theme.background }}>
      <StatusBar style={theme.statusBar as 'auto' | 'inverted' | 'light' | 'dark'} />
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="mb-4 text-2xl font-bold" style={{ color: theme.text }}>
            Bienvenido a Tabimanga
          </Text>

          {/* Sección de últimas actualizaciones */}
          <View className="mb-4">
            <Text className="mb-2 text-xl font-bold" style={{ color: theme.text }}>
              Últimas Actualizaciones
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <MangaRow mangas={latestMangas} />
            </ScrollView>
          </View>

          {/* Sección de mangas populares */}
          <View className="mb-4">
            <Text className="mb-2 text-xl font-bold" style={{ color: theme.text }}>
              Mangas Populares
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <MangaRow mangas={trendMangas} />
            </ScrollView>
          </View>

          {/* Sección de recomendados */}
          <View className="mb-4">
            <Text className="mb-2 text-xl font-bold" style={{ color: theme.text }}>
              Recien Añadidos
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <MangaRow mangas={recentCreatedMangas} />
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
