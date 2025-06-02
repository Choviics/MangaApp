import { router } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { MangaInfo } from '~/api/interfaces';
import { useTheme } from '~/utils/themes';

export default function MangaColumns({ mangas }: Readonly<{ mangas: MangaInfo[] }>) {
  const { theme } = useTheme();
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

  const screenWidth = Dimensions.get('window').width;

  // Calcular el ancho de cada item (considerando padding y margen)
  const itemWidth = 160;
  const padding = 32;
  const itemMargin = 8;

  // Calcular cuántas columnas caben
  const numColumns = Math.floor((screenWidth - padding) / (itemWidth + itemMargin));

  // Calcular el ancho real del item para centrar mejor
  const actualItemWidth = (screenWidth - padding - itemMargin * (numColumns - 1)) / numColumns;

  const handleImageLoad = (mangaId: string) => {
    setLoadingImages((prev) => ({ ...prev, [mangaId]: false }));
  };

  const handleImageLoadStart = (mangaId: string) => {
    setLoadingImages((prev) => ({ ...prev, [mangaId]: true }));
  };

  const handleMangaPress = (mangaId: string, title: string) => {
    router.push({
      pathname: '/MangaPage',
      params: { id: mangaId, title: title, language: 'es' },
    });
  };

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}>
      <View className="flex-row flex-wrap justify-between px-4 py-2">
        {mangas.map((manga) => (
          <Pressable
            key={manga.mangaId}
            className="mb-4"
            style={{
              width: actualItemWidth,
              maxWidth: itemWidth,
            }}
            onPress={() => handleMangaPress(manga.mangaId, manga.title)}>
            {({ pressed }) => (
              <>
                <View className="relative rounded-lg" style={{ height: 256, width: '100%' }}>
                  <Image
                    source={{ uri: manga.coverUrl ?? '' }}
                    className={`rounded-lg shadow-md ${pressed ? 'opacity-50' : ''}`}
                    style={{ height: 256, width: '100%' }}
                    resizeMode="cover"
                    onLoadStart={() => handleImageLoadStart(manga.mangaId)}
                    onLoad={() => handleImageLoad(manga.mangaId)}
                  />
                  {loadingImages[manga.mangaId] && (
                    <View className="absolute inset-0 items-center justify-center rounded-lg">
                      <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                  )}
                </View>
                <Text
                  className="mt-1 text-base font-semibold"
                  style={{ color: theme.text }}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {manga.title}
                </Text>
              </>
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
