import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '~/utils/themes';
import { useLocalSearchParams } from 'expo-router';
import { getMangaChapters } from '~/api/ChaptersServices';
import { ScrollView } from 'react-native-gesture-handler';
import { getMangaInfo } from '~/api/MangaService';
import { LinearGradient } from 'expo-linear-gradient';
import ChaptersCards from '~/components/ChaptersCards';
import BannerInfo from '~/components/BannerInfo';
import Button from '~/components/Button';

type ChapterVersion = {
  id: string;
  title: string | null;
  scanlationGroup: {
    id: string;
    name: string;
  } | null;
  translatedLanguage: string;
};

type Chapter = {
  chapter: string;
  volume: string;
  versions: ChapterVersion[];
};

type MangaInfo = {
  title: string;
  coverUrl: string;
  description: string;
  year: string;
  demographic: string;
  status: string;
  author: string;
  tags: string[];
};

export default function ChapterPage() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { title } = useLocalSearchParams<{ title: string }>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [mangaInfo, setMangaInfo] = useState<MangaInfo | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [textHeight, setTextHeight] = useState(0);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const [chapterReaded, setChapterReaded] = useState<string | null>(null);
  const [chapterSaved, setChapterSaved] = useState<string | null>(null);

  useEffect(() => {
    console.log('ID del manga:', id);
    const fetchChapters = async () => {
      try {
        const [chapters, mangaInfo] = await Promise.all([getMangaChapters(id), getMangaInfo(id)]);
        setMangaInfo(mangaInfo);
        setChapters(chapters);
        if (mangaInfo.coverUrl) {
          setCoverImage(mangaInfo.coverUrl);
        }
      } catch (error) {
        console.error('Error al cargar los capítulos:', error);
      }
    };
    fetchChapters();
  }, [id]);

  const handleTextLayout = (event: any) => {
    const { height, width } = event.nativeEvent.layout;
    setTextHeight(height);

    // Calculamos si el texto está truncado
    const text = mangaInfo?.description ?? '';
    const textLength = text.length;
    const averageCharWidth = 8; // Ancho aproximado de un carácter
    const charsPerLine = Math.floor(width / averageCharWidth);
    const estimatedLines = Math.ceil(textLength / charsPerLine);

    // Si el texto tiene más de 3 líneas estimadas, mostramos el botón
    setShowExpandButton(estimatedLines > 3);
  };

  const handleDescriptionPress = () => {
    setExpandedDescription(!expandedDescription);
  };

  const chooseBackgroungBanner = () => {
    switch (mangaInfo?.status) {
      case 'completed':
        return theme.statusCompleted;
      case 'ongoing':
        return theme.statusOngoing;
      case 'cancelled':
        return theme.statusCancelled;
      case 'hiatus':
        return theme.statusHiatus;
      default:
        return theme.error;
    }
  };

  const chooseIconBanner = () => {
    switch (mangaInfo?.status) {
      case 'completed':
        return 'checkmark-circle-outline';
      case 'ongoing':
        return 'time-outline';
      case 'cancelled':
        return 'close-circle-outline';
      case 'hiatus':
        return 'pause-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <StatusBar barStyle="light-content" />
      {coverImage && (
        <View className="absolute left-0 top-0 h-2/6 w-full">
          <Image source={{ uri: coverImage }} className="h-full w-full" />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', theme.background]}
            style={{ height: '100%', left: 0, right: 0, top: 0, position: 'absolute' }}
          />
        </View>
      )}
      <View className="p-4">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}>
          <SafeAreaView className="flex-1">
            <View className="mt-5">
              {coverImage && (
                <View className="flex-row items-center">
                  <View className="w-40" style={{ aspectRatio: 3 / 5 }}>
                    <Image source={{ uri: coverImage }} className="h-full w-full rounded-2xl" />
                  </View>
                  <View className="ml-4 flex-1">
                    <BannerInfo
                      title={mangaInfo?.status ?? ''}
                      colorText={'white'}
                      backgroundColor={chooseBackgroungBanner()}
                      icon={chooseIconBanner()}
                      shape="rounded-lg"
                    />
                    <View className="mt-2">
                      <Button
                        text={chapterReaded ? 'Continuar' : '¡Empezar!'}
                        onPress={() => {}}
                        backgroundColor={theme.primary}
                        fontSize="text-lg"
                        borderRadius={10}
                        fullWidth={false}
                        paddingItems={8}
                        icon="book"
                      />
                    </View>
                    <View className="mt-2">
                      <Button
                        text={chapterSaved ? 'Guardado' : 'Guardar'}
                        onPress={() => {}}
                        backgroundColor={'#fc96cb'}
                        fontSize="text-lg"
                        borderRadius={10}
                        fullWidth={false}
                        paddingItems={8}
                        icon="heart-outline"
                      />
                    </View>
                  </View>
                </View>
              )}
              <Text
                className="mt-4 text-xl font-bold"
                style={{
                  color: theme.text,
                  textShadowColor: theme.statusBar == 'light' ? '#ffffff' : 'transparent',
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 2,
                }}>
                {title}
              </Text>
              <View className="mt-1 flex-row">
                <Text style={{ color: theme.text }}>
                  {mangaInfo?.author} • {mangaInfo?.year}
                </Text>
              </View>
              <View className="mt-1 flex-row"></View>
            </View>
          </SafeAreaView>
          <View className="mb-4">
            <Text className="text-lg font-bold" style={{ color: theme.text }}>
              Descripción
            </Text>
            <Text
              style={{ color: theme.text }}
              numberOfLines={expandedDescription ? undefined : 3}
              ellipsizeMode={expandedDescription ? 'clip' : 'tail'}
              onLayout={handleTextLayout}>
              {mangaInfo?.description}
            </Text>
            {showExpandButton && (
              <TouchableOpacity onPress={handleDescriptionPress} className="mt-2">
                <Text style={{ color: theme.primary }}>
                  {expandedDescription ? 'Ver menos' : 'Ver más'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {mangaInfo && mangaInfo.tags.length > 0 ? (
            <ScrollView className="mb-5 flex-row" horizontal showsHorizontalScrollIndicator={false}>
              {mangaInfo.tags.map((tag) => (
                <View key={tag} className="mr-2">
                  <BannerInfo
                    title={tag}
                    colorText={theme.text}
                    backgroundColor={theme.secondary}
                    shape="rounded-lg"
                  />
                </View>
              ))}
            </ScrollView>
          ) : null}
          {chapters.length > 0 ? (
            <ChaptersCards chapters={chapters} />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="mt-10 text-lg" style={{ color: theme.text }}>
                No hay capítulos
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
