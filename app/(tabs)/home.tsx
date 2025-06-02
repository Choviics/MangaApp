import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getLastUpdatedMangas, getPopularMangas, getRecentCreatedMangas } from '~/api/MangaService';
import { useEffect, useState, useCallback } from 'react';
import { useTheme } from '~/utils/themes';
import MangaRow from '~/components/MangaRow';
import ChargePage from '../ChargePage';
import BannerPage from '~/components/BannerPage';

export default function Home() {
  const { theme } = useTheme();
  const [latestMangas, setLatestMangas] = useState<any[]>([]);
  const [trendMangas, setTrendMangas] = useState<any[]>([]);
  const [recentCreatedMangas, setRecentCreatedMangas] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [ready, setReady] = useState(false);

  const fetchMangas = useCallback(async () => {
    try {
      const [latestMangas, trendMangas, recentCreatedMangas] = await Promise.all([
        getLastUpdatedMangas(),
        getPopularMangas(),
        getRecentCreatedMangas(),
      ]);

      setLatestMangas(latestMangas);
      setTrendMangas(trendMangas);
      setRecentCreatedMangas(recentCreatedMangas);
      setReady(true);
    } catch (error) {
      console.error('Error al cargar los mangas:', error);
      setReady(true);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchMangas(), new Promise((resolve) => setTimeout(resolve, 1000))]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMangas();
  }, [fetchMangas]);

  if (!ready) {
    return <ChargePage />;
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1" style={{ backgroundColor: theme.background }}>
      <StatusBar style={theme.statusBar as 'auto' | 'inverted' | 'light' | 'dark'} />

      <BannerPage title="TabiManga" icon="home" />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.accent]} // Android
            tintColor={theme.accent} // iOS
          />
        }>
        <View className="p-4">
          {/* Sección de últimas actualizaciones */}
          <MangaSection title="Últimas Actualizaciones" mangas={latestMangas} theme={theme} />

          {/* Sección de mangas populares */}
          <MangaSection title="Mangas Populares" mangas={trendMangas} theme={theme} />

          {/* Sección de recomendados */}
          <MangaSection title="Recien Añadidos" mangas={recentCreatedMangas} theme={theme} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface MangaSectionProps {
  title: string;
  mangas: any[];
  theme: {
    text: string;
  };
}

const MangaSection = ({ title, mangas, theme }: MangaSectionProps) => {
  if (!mangas || mangas.length === 0) {
    return null;
  }

  return (
    <View className="mb-6">
      <Text className="mb-3 text-xl font-bold" style={{ color: theme.text }}>
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={200}
        snapToAlignment="start"
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingRight: 16 }}>
        <MangaRow mangas={mangas} />
      </ScrollView>
    </View>
  );
};
