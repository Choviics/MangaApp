import { View, Image, Pressable, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '~/utils/themes';
import { useState } from 'react';

type MangaRowProps = {
    readonly mangas: any[]; 
}

export default function MangaRow({ mangas }: Readonly<MangaRowProps>) {
  const { theme } = useTheme();
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (mangaId: string) => {
    setLoadingImages((prev) => ({ ...prev, [mangaId]: false }));
  };

  const handleImageLoadStart = (mangaId: string) => {
    setLoadingImages((prev) => ({ ...prev, [mangaId]: true }));
  };

  return (
    <View className="flex-row overflow-x-auto">
      {mangas.map((manga) => (
        <Pressable key={manga.mangaId} className="mr-2">
          {({ pressed }) => (
            <>
              <View className="relative h-64 w-40">
                <Image
                  source={{ uri: manga.coverUrl }}
                  className={`h-64 w-40 rounded-lg shadow-md ${pressed ? 'opacity-50' : ''}`}
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
                className="mt-1 w-40 text-base font-semibold"
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
  );
}