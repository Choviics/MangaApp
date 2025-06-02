import { View, Text, Pressable, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shareChapterMsg } from '~/utils/messages';

type MangaBackBarProps = {
  id: string;
  title?: string;
  chapter?: string;
};

export default function MangaBackBar({ id, title, chapter }: Readonly<MangaBackBarProps>) {
  const topInsets = useSafeAreaInsets().top;
  const BAR_HEIGHT = 64;

  const chapterLabel =
    title && title.trim() !== '' && title !== 'Sin título' ? `${title}` : `capítulo ${chapter}`;

  const toggleShareIcon = async () => {
    try {
      await Share.share({
        message: shareChapterMsg(chapterLabel, id),
      });
    } catch (error) {
      console.error('Error al compartir el manga:', error);
    }
  };

  return (
    <View
      className={`absolute inset-x-0 top-0 z-50 flex-row items-center justify-between border-b px-4`}
      style={{
        height: topInsets + BAR_HEIGHT,
        paddingTop: topInsets,
        elevation: 50,
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
      <View className="w-80  flex-row">
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <Text
          className="ml-10 text-2xl font-bold color-white"
          ellipsizeMode={'tail'}
          numberOfLines={1}>
          {chapterLabel}
        </Text>
      </View>

      <Pressable hitSlop={8} onPress={toggleShareIcon}>
        <Ionicons name="share-outline" size={24} color="white" />
      </Pressable>
    </View>
  );
}
