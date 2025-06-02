import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useTheme } from '~/utils/themes';

const BAR_HEIGHT = 64;

type BackBarProps = {
  scrollY: SharedValue<number>;
  topInset: number;
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPressIcon?: () => void;
};

export default function BackBar({
  scrollY,
  topInset,
  title,
  icon,
  onPressIcon,
}: Readonly<BackBarProps>) {
  const { theme } = useTheme();
  const THRESHOLD = 300 + topInset; 

  const rBackground = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollY.value,
      [0, THRESHOLD],
      ['rgba(0,0,0,0)', theme.background]
    ),
    borderColor: interpolateColor(scrollY.value, [0, THRESHOLD], ['rgba(0,0,0,0)', theme.border]),
  }));

  const rText = useAnimatedStyle(() => ({
    color: interpolateColor(scrollY.value, [0, THRESHOLD], ['rgba(0,0,0,0)', theme.text]),
  }));

  return (
    <Animated.View
      className="absolute inset-x-0 top-0 z-50 flex-row items-center justify-between border-b px-4"
      style={[
        rBackground,
        {
          height: topInset + BAR_HEIGHT,
          paddingTop: topInset,
          elevation: 50,
        },
      ]}>
      <View className="w-80  flex-row">
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>

        <Animated.Text
          className="ml-10 text-2xl font-bold"
          style={rText}
          ellipsizeMode={'tail'}
          numberOfLines={1}>
          {title}
        </Animated.Text>
      </View>

      <Pressable hitSlop={8} onPress={onPressIcon}>
        <Ionicons name={icon} size={24} color={theme.text} />
      </Pressable>
    </Animated.View>
  );
}
