import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useCallback } from 'react';
import MangaColumns from '~/components/MangaColumns';
import { useTheme } from '~/utils/themes';
import BannerPage from '~/components/BannerPage';
import { useSavedMangas } from '../../api/mangaStore';
import { useFocusEffect } from '@react-navigation/native';

export default function SavedScreen() {
  const { savedMangas, refreshSavedMangas } = useSavedMangas();
  const { theme } = useTheme();

  // Refresca los mangas guardados cuando la pantalla recibe el foco
  useFocusEffect(
    useCallback(() => {
      refreshSavedMangas();
    }, [refreshSavedMangas])
  );

  // También refresca al montar el componente
  useEffect(() => {
    refreshSavedMangas();
  }, [refreshSavedMangas]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.background }}>
      <BannerPage title="Mangas Guardados" icon="heart" />
      <View className="flex-1 p-4">
        {savedMangas.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="mb-2 text-center text-gray-500">No tienes mangas guardados</Text>
            <Text className="text-center text-gray-500">
              Explora la biblioteca y guarda tus mangas favoritos
            </Text>
          </View>
        ) : (
          <MangaColumns mangas={savedMangas} />
        )}
      </View>
    </SafeAreaView>
  );
}
