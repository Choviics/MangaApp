import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
  RefreshControl,
} from 'react-native';
import { useTheme } from '~/utils/themes';
import { router, useLocalSearchParams } from 'expo-router';
import { getMangaChapters } from '~/api/ChaptersServices';
import { ScrollView } from 'react-native-gesture-handler';
import { getMangaInfo } from '~/api/MangaService';
import { LinearGradient } from 'expo-linear-gradient';
import ChaptersCards from '~/components/ChaptersCards';
import BannerInfo from '~/components/BannerInfo';
import Button from '~/components/Button';
import BackBar from '~/components/BackBar';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import ChargePage from './ChargePage';
import { MangaInfo } from '~/api/interfaces';
import { useSavedMangas } from '../api/mangaStore';
import { Ionicons } from '@expo/vector-icons';
import { shareMangaMsg } from '~/utils/messages';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

type MangaInfoPage = {
  title: string;
  coverUrl: string;
  description: string;
  year: string;
  demographic: string;
  status: string;
  author: string;
  tags: string[];
};

interface TextLayoutEvent {
  nativeEvent: {
    lines: Array<{
      width: number;
      height: number;
      text: string;
      x: number;
      y: number;
    }>;
  };
}

export default function ChapterPage() {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { title } = useLocalSearchParams<{ title: string }>();
  const { language } = useLocalSearchParams<{ language: string }>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [mangaInfo, setMangaInfo] = useState<MangaInfoPage | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [expandedDescription, setExpandedDescription] = useState(true);
  const [showExpandButton, setShowExpandButton] = useState(false);
  const [mangaReaded, setMangaReaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const firstText = useRef(true);
  const totalLines = useRef(0);
  const [orderBy, setOrderBy] = useState<'Asc' | 'Desc'>('Asc');
  const childFn = useRef<
    ((versionId: string, chapterNumber: string, title: string) => void) | null
  >(null);

  const scrollY = useSharedValue(0);
  const topInsets = useSafeAreaInsets().top;

  // Usar el contexto de mangas guardados
  const { addManga, removeManga, isMangaSaved } = useSavedMangas();
  const mangaSaved = isMangaSaved(id);

  const fetchChapters = async () => {
    try {
      const [chapters, mangaInfo] = await Promise.all([getMangaChapters(id), getMangaInfo(id)]);
      setMangaInfo(mangaInfo);
      setChapters(chapters);
      if (mangaInfo.coverUrl) {
        setCoverImage(mangaInfo.coverUrl);
      }
      setReady(true);
    } catch (error) {
      console.error('Error al cargar los capítulos:', error);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [id]);

  const handleTextLayout = useCallback((e: TextLayoutEvent): void => {
    const totalLinesCharge = e.nativeEvent.lines.length;
    if (firstText.current) {
      firstText.current = false;
      totalLines.current = totalLinesCharge;
      setExpandedDescription(false);
    }
    setShowExpandButton(totalLines.current > 3);
  }, []);

  const handleDescriptionPress = () => {
    setExpandedDescription(!expandedDescription);
  };

  const handleMangaPress = async () => {
    try {
      if (mangaSaved) {
        await removeManga(id);
      } else {
        const newState: MangaInfo = {
          mangaId: id,
          title: title,
          coverUrl: coverImage,
          language: language,
        };
        await addManga(newState);
      }
    } catch (error) {
      console.error('Error al manejar el guardado del manga:', error);
    }
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

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

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

  const handleSharePress = async () => {
    try {
      await Share.share({
        message: shareMangaMsg(mangaInfo?.title ?? '', id, mangaInfo?.description ?? ''),
      });
    } catch (error) {
      console.error('Error al compartir el manga:', error);
    }
  };

  if (!ready) {
    return <ChargePage />;
  }

  const toggleOrderBy = () => {
    setOrderBy((prev) => (prev === 'Asc' ? 'Desc' : 'Asc'));
    const reversedChapters = [...chapters].reverse();
    setChapters(reversedChapters);
  };

  const handleReadedButton = () => {
    const STORAGE_KEY = `@manga_read_chapters_${id}`;

    const loadReadChapters = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          const maxNumber = Math.max(...Object.keys(parsedData).map(Number));

          const id = parsedData[`${maxNumber}`][0].versionId;
          const chapterTitle = parsedData[`${maxNumber}`][0].title;

          router.push({
            pathname: '/ReadMangaPage',
            params: { id: id, title: chapterTitle, chapter: maxNumber.toString() },
          });
        } else if (chapters.length > 0) {
          childFn.current?.(
            chapters[0].versions[0].id,
            chapters[0].chapter,
            chapters[0].versions[0].title ?? ''
          );
        } else {
          console.warn('No hay capítulos disponibles para leer.');
        }
      } catch (error) {
        console.error('Error al cargar capítulos leídos:', error);
      }
    };

    loadReadChapters();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchChapters(), new Promise((resolve) => setTimeout(resolve, 1000))]);
    setRefreshing(false);
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
      <BackBar
        scrollY={scrollY}
        topInset={topInsets}
        title={mangaInfo?.title ?? ''}
        icon="share-outline"
        onPressIcon={handleSharePress}
      />
      <SafeAreaView className="px-4">
        <Animated.ScrollView
          contentContainerStyle={{ paddingBottom: 100, paddingTop: topInsets + 50 }}
          showsVerticalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.accent]} // Android
              tintColor={theme.accent} // iOS
            />
          }>
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
                      text={mangaReaded ? 'Continuar' : '¡Empezar!'}
                      onPress={handleReadedButton}
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
                      text={mangaSaved ? 'Guardado' : 'Guardar'}
                      onPress={handleMangaPress}
                      backgroundColor={'#fc96cb'}
                      fontSize="text-lg"
                      borderRadius={10}
                      fullWidth={false}
                      paddingItems={8}
                      icon={mangaSaved ? 'heart' : 'heart-outline'}
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
          <View className="mb-4">
            <Text className="text-lg font-bold" style={{ color: theme.text }}>
              Descripción
            </Text>
            <Text
              style={{ color: theme.text }}
              numberOfLines={expandedDescription ? undefined : 3}
              ellipsizeMode={expandedDescription ? 'clip' : 'tail'}
              onTextLayout={handleTextLayout}>
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
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-lg font-bold" style={{ color: theme.text }}>
              {`${chapters.length} Capítulos`}
            </Text>
            <TouchableOpacity onPress={toggleOrderBy} className="flex-row">
              <Text style={{ color: theme.primary }}>{orderBy}</Text>
              <Ionicons
                name={orderBy === 'Asc' ? 'arrow-up-outline' : 'arrow-down-outline'}
                size={18}
                color={theme.primary}
                className="ml-1"
              />
            </TouchableOpacity>
          </View>
          {chapters.length > 0 ? (
            <ChaptersCards
              chapters={chapters}
              mangaId={id}
              setMangaReaded={setMangaReaded}
              setCustomFunction={(fn) => (childFn.current = fn)}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="mt-10 text-lg" style={{ color: theme.text }}>
                No hay capítulos
              </Text>
            </View>
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}
